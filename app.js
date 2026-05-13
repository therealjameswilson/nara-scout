// NARA Scout - FRUS compiler research tool
// Searches the National Archives Catalog API v2 via a CORS-friendly proxy.
// Three workflows: (A) declassified docs, (B) withdrawal sheets, (C) unprocessed series
//
// The NARA Catalog API does not return CORS headers, so a static site cannot
// call it from the browser. NARA Scout routes requests through a tiny
// Cloudflare Worker (see ./worker/). The Worker only forwards requests and
// adds CORS headers; the API key is shipped in this file so colleagues can
// just open the page and search.

// === REPLACE THIS with the *.workers.dev URL Cloudflare gives you ===========
// See worker/README.md for the 3-minute setup.
const PROXY_URL = 'https://nara-proxy.REPLACE-ME.workers.dev';

// Shared NARA Catalog API key (api.data.gov). Exposed in public JS by design,
// per the project owner. Rate limit is per-key, so a busy day across many
// colleagues could hit the cap; rotate at https://api.data.gov/signup/ if so.
const API_KEY = 'C6O0DyEcap6taVb24zymF5AOMQvwTXsa7q0ZH8cN';

const NARA_PATH = '/records/search';

const NAIDS = {
  // Bush 41 collections
  'BUSH_NSC':    { naid: '2163580',   label: 'Bush NSC Files' },
  '4522156':     { naid: '4522156',   label: 'Scowcroft Files' },
  '595141':      { naid: '595141',    label: 'Bush Presidential Daily Files' },
  '284825748':   { naid: '284825748', label: 'Cheney Collection' },
  '564645':      { naid: '564645',    label: 'Bush WHORM Subject File' },
  'BUSH_ALL':    { naid: '2756545',   label: 'All Bush Presidential Records' },
  // Clinton collections
  'CLINTON_NSC': { naid: '6166381',   label: 'Clinton NSC Files' },
  '2525022':     { naid: '2525022',   label: 'Clinton NEC Files' },
  '594462':      { naid: '594462',    label: 'Clinton WHORM' },
  'CLINTON_ALL': { naid: '2787346',   label: 'All Clinton Presidential Records' }
};

const WITHDRAWAL_RE = /withdraw(al)?\s*(sheet|notice|card)|NA\s*Form\s*1402[13]/i;

const $ = id => document.getElementById(id);

$('clear').addEventListener('click', () => {
  $('q').value = ''; $('from').value = ''; $('to').value = '';
  $('results').innerHTML = ''; $('pager').innerHTML = '';
  $('summary').textContent = '';
  $('resultsPanel').style.display = 'none'; $('status').textContent = '';
});

let currentPage = 0;

$('go').addEventListener('click', () => { currentPage = 0; runSearch(); });
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') { currentPage = 0; runSearch(); } });

function classify(src) {
  const title = (src.title || '').toString().toLowerCase();
  const desc = (src.scopeAndContentNote || src.description || '').toString();
  const online = !!src.availableOnline;

  if (WITHDRAWAL_RE.test(title) || WITHDRAWAL_RE.test(desc)) return 'withdrawal';
  if (online) return 'declassified';
  if (!desc.trim() || desc.trim().length < 20) return 'unprocessed';
  return 'other';
}

async function runSearch() {
  if (PROXY_URL.includes('REPLACE-ME')) {
    setStatus('Proxy not configured. Edit PROXY_URL in app.js; see worker/README.md.');
    return;
  }

  const q = $('q').value.trim();
  const from = $('from').value.trim();
  const to = $('to').value.trim();
  const limit = parseInt($('limit').value, 10) || 25;

  const selected = [...document.querySelectorAll('.checks input[data-naid]:checked')]
    .map(cb => NAIDS[cb.dataset.naid]).filter(Boolean);
  if (!selected.length) { setStatus('Select at least one collection.'); return; }

  const params = new URLSearchParams();
  if (q) params.append('q', q);
  params.append('ancestor.naId', selected.map(s => s.naid).join(','));
  if (from) params.append('startDate', from);
  if (to) params.append('endDate', to);
  params.append('limit', String(limit));
  params.append('offset', String(currentPage * limit));

  setStatus('Searching the National Archives...');
  $('resultsPanel').style.display = 'block';
  $('results').innerHTML = ''; $('pager').innerHTML = ''; $('summary').textContent = '';

  try {
    const r = await fetch(PROXY_URL.replace(/\/+$/, '') + NARA_PATH + '?' + params.toString(), {
      headers: { 'x-api-key': API_KEY, 'Accept': 'application/json' }
    });
    if (!r.ok) {
      const text = (await r.text()).slice(0, 300);
      setStatus('Error ' + r.status + ': ' + text);
      return;
    }
    render(await r.json(), limit);
  } catch (err) {
    setStatus('Network error: ' + err.message);
  }
}

function setStatus(msg) { $('status').textContent = msg; }

function render(data, limit) {
  const body = data.body || data;
  const hits = (body.hits && body.hits.hits) || body.results || [];
  const total = (body.hits && body.hits.total && (body.hits.total.value ?? body.hits.total)) || body.totalResults || hits.length;

  const classified = hits.map(h => {
    const src = h._source || h.record || h;
    return { src, hit: h, cat: classify(src) };
  });

  const showD = $('f_declassified').checked;
  const showW = $('f_withdrawal').checked;
  const showU = $('f_unprocessed').checked;
  const showO = $('f_other').checked;
  const visible = classified.filter(c =>
    (c.cat === 'declassified' && showD) ||
    (c.cat === 'withdrawal' && showW) ||
    (c.cat === 'unprocessed' && showU) ||
    (c.cat === 'other' && showO)
  );

  const cD = classified.filter(c => c.cat === 'declassified').length;
  const cW = classified.filter(c => c.cat === 'withdrawal').length;
  const cU = classified.filter(c => c.cat === 'unprocessed').length;
  const cO = classified.filter(c => c.cat === 'other').length;
  $('summary').textContent = total.toLocaleString() + ' total | this page: ' + cD + ' declassified, ' + cW + ' withdrawal, ' + cU + ' unprocessed, ' + cO + ' other | showing ' + visible.length;

  setStatus(total ? ('Found ' + total.toLocaleString() + ' record(s). Page ' + (currentPage + 1) + '.') : 'No records found.');

  const ol = $('results');
  ol.innerHTML = '';
  for (const { src, cat } of visible) {
    const naid = src.naId || src.naid || '';
    const title = (src.title || src.recordTitle || 'Untitled').toString();
    const desc = (src.scopeAndContentNote || src.description || '').toString();
    const dates = (src.productionDate && (src.productionDate.logicalDate || src.productionDate)) || src.coverageDates || '';
    const ancestors = (src.ancestors || []).map(a => a.title || a.collectionTitle).filter(Boolean).slice(0, 2);

    const badge = cat === 'declassified' ? '<span class="badge badge-declass">DECLASSIFIED ONLINE</span>'
                : cat === 'withdrawal'   ? '<span class="badge badge-withdraw">WITHDRAWAL SHEET</span>'
                : cat === 'unprocessed'  ? '<span class="badge badge-unproc">UNPROCESSED</span>'
                : '<span class="badge badge-other">OTHER</span>';

    const li = document.createElement('li');
    li.innerHTML =
      badge +
      '<h4><a href="https://catalog.archives.gov/id/' + naid + '" target="_blank" rel="noopener">' + esc(title) + '</a></h4>' +
      '<div class="meta">NAID ' + naid + (dates ? ' &middot; ' + esc(String(dates)) : '') + '</div>' +
      (desc ? '<div class="snippet">' + esc(desc.slice(0, 400)) + (desc.length > 400 ? '...' : '') + '</div>' : '<div class="snippet" style="color:var(--gold-dark);font-style:italic">No scope/content note. Plan on-site research.</div>') +
      (ancestors.length ? '<div class="tags">' + ancestors.map(a => '<span>' + esc(a) + '</span>').join('') + '</div>' : '');
    ol.appendChild(li);
  }

  const pg = $('pager'); pg.innerHTML = '';
  if (total > limit) {
    const pages = Math.min(Math.ceil(total / limit), 200);
    const prev = document.createElement('button');
    prev.className = 'ghost'; prev.textContent = 'Prev'; prev.disabled = currentPage === 0;
    prev.onclick = () => { if (currentPage > 0) { currentPage--; runSearch(); } };
    const next = document.createElement('button');
    next.className = 'ghost'; next.textContent = 'Next'; next.disabled = currentPage + 1 >= pages;
    next.onclick = () => { currentPage++; runSearch(); };
    const info = document.createElement('span');
    info.textContent = 'Page ' + (currentPage + 1) + ' of ' + pages;
    pg.append(prev, info, next);
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
