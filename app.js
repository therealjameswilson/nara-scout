// NARA Scout - searches the National Archives Catalog API v2
// Docs: https://github.com/usnationalarchives/Catalog-API

const API = 'https://catalog.archives.gov/api/v2/records/search';

const NAIDS = {
  'BUSH_NSC':     { naid: '6879843', label: 'Bush NSC Files' },
  'CLINTON_NSC':  { naid: '6166381', label: 'Clinton NSC Files' },
  '4522156':      { naid: '4522156', label: 'Scowcroft Files' },
  '595141':       { naid: '595141',  label: 'Bush Presidential Daily Files' },
  'BUSH_ALL':     { naid: '2756545', label: 'Bush Presidential Records' },
  'CLINTON_ALL':  { naid: '2787346', label: 'Clinton Presidential Records' }
};

const $ = (id) => document.getElementById(id);

const saved = localStorage.getItem('nara_api_key');
if (saved) $('apikey').value = saved;
$('apikey').addEventListener('change', () => {
  localStorage.setItem('nara_api_key', $('apikey').value.trim());
});

$('clear').addEventListener('click', () => {
  $('q').value=''; $('from').value=''; $('to').value='';
  $('results').innerHTML=''; $('pager').innerHTML='';
  $('resultsPanel').style.display='none'; $('status').textContent='';
});

let currentPage = 0;

$('go').addEventListener('click', () => { currentPage = 0; runSearch(); });
$('q').addEventListener('keydown', (e) => { if (e.key==='Enter'){ currentPage=0; runSearch(); }});

async function runSearch(){
  const key = $('apikey').value.trim();
  if(!key){ setStatus('Please enter your NARA API key above.'); return; }
  localStorage.setItem('nara_api_key', key);

  const q = $('q').value.trim();
  const from = $('from').value.trim();
  const to = $('to').value.trim();
  const limit = parseInt($('limit').value,10) || 25;
  const onlineOnly = $('online').checked;

  const selected = [...document.querySelectorAll('.checks input[type=checkbox]:checked')]
    .map(cb => NAIDS[cb.dataset.naid]).filter(Boolean);
  if(selected.length===0){ setStatus('Select at least one collection.'); return; }

  const params = new URLSearchParams();
  if(q) params.append('q', q);
  const ancestorIds = selected.map(s=>s.naid).join(',');
  params.append('ancestor.naId', ancestorIds);
  if(onlineOnly) params.append('availableOnline','true');
  if(from) params.append('startDate', from);
  if(to)   params.append('endDate', to);
  params.append('limit', String(limit));
  params.append('offset', String(currentPage * limit));

  setStatus('Searching the National Archives...');
  $('resultsPanel').style.display='block';
  $('results').innerHTML='';
  $('pager').innerHTML='';

  try {
    const r = await fetch(API + '?' + params.toString(), {
      headers: { 'x-api-key': key, 'Accept': 'application/json' }
    });
    if(!r.ok){
      const text = await r.text();
      setStatus('Error ' + r.status + ': ' + text.slice(0,200));
      return;
    }
    const data = await r.json();
    render(data, limit);
  } catch(err){
    setStatus('Network error: ' + err.message);
  }
}

function setStatus(msg){ $('status').textContent = msg; }

function render(data, limit){
  const body = data.body || data;
  const hits = (body.hits && body.hits.hits) || body.results || [];
  const total = (body.hits && body.hits.total && (body.hits.total.value ?? body.hits.total)) || body.totalResults || hits.length;

  setStatus(total ? ('Found ' + total.toLocaleString() + ' record(s). Page ' + (currentPage+1) + '.') : 'No records found.');

  const ol = $('results');
  ol.innerHTML = '';
  for(const h of hits){
    const src = h._source || h.record || h;
    const naid = src.naId || src.naid || h._id || '';
    const title = (src.title || src.recordTitle || 'Untitled').toString();
    const desc  = (src.scopeAndContentNote || src.description || '').toString();
    const dates = (src.productionDate && (src.productionDate.logicalDate || src.productionDate)) || src.coverageDates || '';
    const online = src.availableOnline ? 'available online' : '';
    const ancestors = (src.ancestors || []).map(a => a.title || a.collectionTitle).filter(Boolean).slice(0,2);

    const li = document.createElement('li');
    li.innerHTML =
      '<h4><a href="https://catalog.archives.gov/id/'+naid+'" target="_blank" rel="noopener">'+escapeHtml(title)+'</a></h4>' +
      '<div class="meta">NAID '+naid+(dates?' &middot; '+escapeHtml(String(dates)):'')+(online?' &middot; '+online:'')+'</div>' +
      (desc ? '<div class="snippet">'+escapeHtml(desc.slice(0,400))+(desc.length>400?'...':'')+'</div>' : '') +
      (ancestors.length ? '<div class="tags">'+ancestors.map(a=>'<span>'+escapeHtml(a)+'</span>').join('')+'</div>' : '');
    ol.appendChild(li);
  }

  const pager = $('pager');
  pager.innerHTML = '';
  if(total > limit){
    const pages = Math.min(Math.ceil(total/limit), 200);
    const prev = document.createElement('button');
    prev.className='ghost'; prev.textContent='Prev'; prev.disabled = currentPage===0;
    prev.onclick = () => { if(currentPage>0){ currentPage--; runSearch(); }};
    const next = document.createElement('button');
    next.className='ghost'; next.textContent='Next'; next.disabled = currentPage+1 >= pages;
    next.onclick = () => { currentPage++; runSearch(); };
    const info = document.createElement('span');
    info.textContent = 'Page ' + (currentPage+1) + ' of ' + pages;
    pager.append(prev, info, next);
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
