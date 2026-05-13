// NARA Scout - FRUS compiler research tool
// Searches the National Archives Catalog API v2 via a CORS-friendly proxy.
// Three workflows: (A) declassified docs, (B) withdrawal sheets, (C) unprocessed series
//
// Scope: searches are restricted to Bush 41 and Clinton presidential
// collections. The NARA Catalog v2 API only supports a single value for
// `ancestorNaId`, so we fan out one request per selected collection and
// merge results client-side. The collection NAID lists below were
// discovered by querying `levelOfDescription=collection` for each
// administration; counts as of May 2026: 70 Bush 41 collections, 132 Clinton
// administration collections.

const PROXY_URL = 'https://nara-proxy.mzqmpgyvdv.workers.dev';
const API_KEY = 'C6O0DyEcap6taVb24zymF5AOMQvwTXsa7q0ZH8cN';
const NARA_PATH = '/records/search';

// Hand-curated featured sub-collections (each is a child of one of the
// administration umbrellas below; surfaced in the UI for finer scoping).
const FEATURED = {
  BUSH_NSC:    { naid: '2163580', label: 'Bush NSC Files' },
  BUSH_VP:     { naid: '2579957', label: 'Bush Office of the Vice President' },
  BUSH_CABINET:{ naid: '2133275', label: 'Bush Cabinet Affairs' },
  BUSH_NSPACE: { naid: '488763126', label: 'Bush National Space Council' },
  CLINTON_NSC_EXEC: { naid: '7386739', label: 'Clinton NSC Executive Secretary' },
  CLINTON_NSC_NONPROLIF: { naid: '7388773', label: 'Clinton NSC Nonproliferation & Export Controls' },
  CLINTON_NEC: { naid: '2525022', label: 'Clinton National Economic Council' },
  CLINTON_DPC: { naid: '612954', label: 'Clinton Domestic Policy Council' },
};

// Full collection lists — every record returned for a query under one of
// these NAIDs is, by definition, from that administration.
const BUSH41_COLLECTIONS = ('138924378,595138,2163559,567670,472456042,2163595,2163571,488763126,2163588,720635,2163589,650839,284825749,2163563,2163599,488763107,2163594,2163570,2163558,2103233,488763114,2163600,2579957,2163569,2575518,2163581,2163580,2133275,2163582,2163565,2163587,2163575,2163562,2163576,2163584,2575614,2163593,488763132,2163556,2577734,578954,2163572,2163566,2163561,2163573,2578586,2163596,2163590,580456,2163574,490670241,2163567,573356,2163578,2575552,2579595,2163585,2163568,2163597,2163579,2579969,2163592,572260,922149,891537,650835,2579439,2578935,2579607,2575558').split(',');

const CLINTON_COLLECTIONS = ('1224781,2525029,2524453,2524447,101784492,119564603,2524459,2525018,2534568,2525017,7386739,2534574,2524458,2534575,2524450,7385959,342802399,2525059,612954,2534565,7386505,2524451,2525022,2524466,5957395,594648,2524452,2534573,2534569,7388773,2534571,1766805,594546,2525058,2534580,6005960,2525024,2525016,7388844,630636,2525025,2524457,2524467,2524455,2525015,2524463,2524449,7388838,7385958,7388802,7385965,2525028,2534570,2534584,7349214,7388808,7388760,594462,6107047,6107005,2534582,2521316,2525026,2534572,2525032,2525014,2534567,2524460,2525057,2525021,7388748,6120199,7385961,7410105,2525031,7388836,2524456,7388842,7385963,7385962,2525056,2524462,71404562,627797,7388775,7388763,7388751,2534586,7385957,7388766,6005967,2524461,7387422,7385960,20015396,7388800,7388843,7386837,7387463,7386504,7385723,2524454,7385964,613035,6012491,7388805,6120204,1040718,2525020,6106992,7388841,2525027,7387655,7387424,7388837,6005964,7388840,7385966,7388835,6106851,7388753,7387376,7388768,6012502,6107001,5957378,6005962,6106972,6107050,18515054,6120129,6014648').split(',');

const WITHDRAWAL_RE = /withdraw(al)?\s*(sheet|notice|card)|NA\s*Form\s*1402[13]/i;

// Cap the number of parallel collection-level requests. Each click can fan
// out across hundreds of collections — we throttle to be polite to NARA and
// to keep latency reasonable.
const MAX_PARALLEL = 8;
const PER_COLLECTION_LIMIT = 25;
const MAX_COLLECTIONS_PER_SCOPE = 75;

const $ = id => document.getElementById(id);

$('clear').addEventListener('click', () => {
  $('q').value = ''; $('from').value = ''; $('to').value = '';
  $('results').innerHTML = ''; $('pager').innerHTML = '';
  $('summary').textContent = '';
  $('resultsPanel').style.display = 'none'; $('status').textContent = '';
});

$('go').addEventListener('click', runSearch);
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

function classify(rec) {
  const title = (rec.title || '').toString().toLowerCase();
  const desc = (rec.scopeAndContentNote || '').toString();
  const online = Array.isArray(rec.digitalObjects) && rec.digitalObjects.length > 0;

  if (WITHDRAWAL_RE.test(title) || WITHDRAWAL_RE.test(desc)) return 'withdrawal';
  if (online) return 'declassified';
  if (!desc.trim() || desc.trim().length < 20) return 'unprocessed';
  return 'other';
}

// Resolve which collection NAIDs to search based on the checkbox state.
function selectedNaids() {
  const set = new Set();
  const want = id => $(id) && $(id).checked;

  if (want('scope_bush41')) BUSH41_COLLECTIONS.forEach(n => set.add(n));
  if (want('scope_clinton')) CLINTON_COLLECTIONS.forEach(n => set.add(n));

  document.querySelectorAll('.featured input[type=checkbox]:checked').forEach(cb => {
    if (cb.dataset.naid) set.add(cb.dataset.naid);
  });

  return [...set];
}

async function runSearch() {
  const q = $('q').value.trim();
  const from = $('from').value.trim();
  const to = $('to').value.trim();

  let naids = selectedNaids();
  if (!naids.length) { setStatus('Select at least one scope (Bush 41, Clinton, or a featured collection).'); return; }

  // Soft-cap: warn and trim if user has selected huge scope plus a tight
  // PER_COLLECTION_LIMIT could otherwise mean hundreds of HTTP requests.
  let truncated = false;
  if (naids.length > MAX_COLLECTIONS_PER_SCOPE) {
    naids = naids.slice(0, MAX_COLLECTIONS_PER_SCOPE);
    truncated = true;
  }

  setStatus('Searching ' + naids.length + ' collection' + (naids.length === 1 ? '' : 's') + '...');
  $('resultsPanel').style.display = 'block';
  $('results').innerHTML = ''; $('pager').innerHTML = ''; $('summary').textContent = '';

  // Fan out one request per collection, throttled.
  const merged = new Map(); // naId -> record
  let totalAcrossCollections = 0;
  let completed = 0;

  async function fetchOne(naid) {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    params.append('ancestorNaId', naid);
    if (from) params.append('startDate', from);
    if (to) params.append('endDate', to);
    params.append('limit', String(PER_COLLECTION_LIMIT));

    try {
      const r = await fetch(PROXY_URL.replace(/\/+$/, '') + NARA_PATH + '?' + params.toString(), {
        headers: { 'x-api-key': API_KEY, 'Accept': 'application/json' }
      });
      if (!r.ok) return { naid, hits: [], total: 0, error: 'HTTP ' + r.status };
      const json = await r.json();
      const body = json.body || json;
      const hits = (body.hits && body.hits.hits) || [];
      const totalRaw = body.hits && body.hits.total;
      const total = (totalRaw && (totalRaw.value ?? totalRaw)) || 0;
      return { naid, hits, total };
    } catch (err) {
      return { naid, hits: [], total: 0, error: err.message };
    } finally {
      completed++;
      setStatus('Searching ' + naids.length + ' collection' + (naids.length === 1 ? '' : 's') + '... (' + completed + ' done)');
    }
  }

  // Simple concurrency limiter
  const queue = [...naids];
  const workers = Array(Math.min(MAX_PARALLEL, queue.length)).fill(0).map(async () => {
    while (queue.length) {
      const naid = queue.shift();
      const res = await fetchOne(naid);
      totalAcrossCollections += res.total;
      for (const h of res.hits) {
        const rec = (h._source && (h._source.record || h._source)) || h;
        const id = rec.naId;
        if (id && !merged.has(id)) merged.set(id, rec);
      }
    }
  });

  await Promise.all(workers);

  const records = [...merged.values()];
  render(records, totalAcrossCollections, truncated);
}

function setStatus(msg) { $('status').textContent = msg; }

function render(records, totalAcrossCollections, truncated) {
  const classified = records.map(rec => ({ rec, cat: classify(rec) }));

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

  let summary = totalAcrossCollections.toLocaleString() + ' total matching record(s) across scoped collections \u00b7 ' +
                'showing ' + records.length + ' unique on this page (' +
                cD + ' declassified, ' + cW + ' withdrawal, ' + cU + ' unprocessed, ' + cO + ' other) \u00b7 ' +
                'visible after filters: ' + visible.length;
  if (truncated) summary += ' \u00b7 NOTE: scope was very large \u2014 first ' + MAX_COLLECTIONS_PER_SCOPE + ' collections searched.';
  $('summary').textContent = summary;

  setStatus(records.length
    ? 'Found ' + totalAcrossCollections.toLocaleString() + ' total record(s); displaying ' + visible.length + '.'
    : 'No records found in the selected scope.');

  const ol = $('results');
  ol.innerHTML = '';
  for (const { rec, cat } of visible) {
    const naid = rec.naId || '';
    const title = (rec.title || 'Untitled').toString();
    const desc = (rec.scopeAndContentNote || '').toString();
    const startY = rec.coverageStartDate && rec.coverageStartDate.year;
    const endY = rec.coverageEndDate && rec.coverageEndDate.year;
    const dates = startY && endY ? (startY === endY ? String(startY) : startY + '\u2013' + endY) : (startY || endY || '');
    const ancestors = (rec.ancestors || []).map(a => a.title || a.collectionTitle).filter(Boolean).slice(0, 2);

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
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
