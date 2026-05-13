// NARA Scout v0.3 - FRUS compiler research tool
// Searches the National Archives Catalog API v2 via a CORS-friendly proxy.
//
// Scope: Bush 41 + Clinton presidential records. The Catalog v2 API only
// accepts ONE value for `ancestorNaId`, so we fan out one request per
// collection and merge results client-side.
//
// Features in v0.3:
//   - Topic Packs (curated FRUS-style queries; see topics.js)
//   - Quick scopes (NSC-only, econ-only, NSC regional offices, nonprolif)
//   - Per-collection limit, per-page display, sort, level filter
//   - Stop button + AbortController + sessionStorage cache
//   - Save / star + Notes; CSV + Markdown citation export
//   - Permalink (URL hash carries full search state)
//   - Search history (last 20 in localStorage)
//   - Smarter classify(): MDR/FOIA/PRA flags, digital-object count, level-of-description chip
//   - Sibling-finder ("Show siblings in series") per result
//   - Refresh collection-lists utility

// =====================================================================
// CONFIG (hard-coded; this site is intended to be shared with colleagues)
// =====================================================================
const PROXY_URL = 'https://nara-proxy.mzqmpgyvdv.workers.dev';
const API_KEY   = 'C6O0DyEcap6taVb24zymF5AOMQvwTXsa7q0ZH8cN';
const NARA_PATH = '/records/search';

const WITHDRAWAL_RE = /withdraw(al)?\s*(sheet|notice|card)|NA\s*Form\s*1402[13]/i;
const MAX_PARALLEL  = 8;
const MAX_COLLECTIONS_PER_SCOPE = 200;   // raised from 75 in v0.2
const HISTORY_KEY = 'nara-scout.history';
const SAVED_KEY   = 'nara-scout.saved';
const LISTS_KEY   = 'nara-scout.lists';

// Featured sub-collections used by quick-scopes (subset of NSC children).
// NAIDs discovered empirically via /records/parent-search and catalog queries.
const QUICK_NSC_REAGAN  = ['1188','40359468','12011340','12024929','12024797','12024920','67603959','60693877','12011341','364672879','364776614','12011342','7451593','12024979','12024916','12024796']; // Reagan NSC umbrella (1188) + 15 directorates
const QUICK_NSC_BUSH    = ['2163580'];   // Bush NSC umbrella
const QUICK_NSC_CLINTON = ['7386739','7388773','7386505','7385959','7388748','7388753','7388760','7388763','7388766','7388768','7388775','7388800','7388802','7388805','7388808','7388835','7388836','7388837','7388838','7388840','7388841','7388842','7388843','7388844'];
const QUICK_ECON        = ['6120375','7821173','2133275','2525022','612954']; // Reagan DPC + Reagan EPC + Bush Cabinet + Clinton NEC + Clinton DPC
const QUICK_NONPROLIF   = ['12011342','7388773'];          // Reagan NSC Defense Programs & Arms Control + Clinton NSC Nonprolif
const QUICK_EUROPE      = ['7451593','7386505'];           // Reagan NSC European & Soviet Affairs + Clinton NSC European Affairs
const QUICK_ASIA        = ['12024916','7385963','7385964']; // Reagan NSC Asian Affairs + Clinton NSC Asian Affairs
const QUICK_LATAM       = ['12024796','7385962','7386504']; // Reagan NSC Latin American Affairs + Clinton NSC Inter-American Affairs
const QUICK_AFRICA      = ['40359468','7385959'];          // Reagan NSC African Affairs + Clinton NSC African Affairs
const QUICK_ME          = ['12024979','7385957','7385958']; // Reagan NSC Near East & South Asia + Clinton NSC NESA

// Bootstrapped collection lists. These can be overridden at runtime
// from localStorage when the user clicks "Refresh collection lists".
const DEFAULT_REAGAN_COLLECTIONS = '7585086,12007122,2594004,5730649,7821173,5730648,2635476,5701098,472449781,7551433,24331301,2601055,6004170,5720683,7821289,2601096,7882368,60693877,6004015,12011341,2600887,7741393,7890432,5701104,40359468,57355553,2635529,12024929,12024797,5701112,7868625,6004166,6911567,364672879,12011340,6120375,46746357,2618827,6816362,6909317,44161439,2600947,7481889,12014583,2601061,518071940,5686574,7451593,2601090,567682,5730543,12024979,2601117,7890429,7023807,499916571,6119492,2612072,7594725,12024920,7284020,6120374,518071935,2596197,67603959,2635474,6004082,5730362,5701106,7829228,364776614,7027904,12011342,2600944,2618938,12024916,7829230,2600746,12024796,7789240,6120376,2600967,6120363,1188'.split(',');

const DEFAULT_BUSH41_COLLECTIONS = '138924378,595138,2163559,567670,472456042,2163595,2163571,488763126,2163588,720635,2163589,650839,284825749,2163563,2163599,488763107,2163594,2163570,2163558,2103233,488763114,2163600,2579957,2163569,2575518,2163581,2163580,2133275,2163582,2163565,2163587,2163575,2163562,2163576,2163584,2575614,2163593,488763132,2163556,2577734,578954,2163572,2163566,2163561,2163573,2578586,2163596,2163590,580456,2163574,490670241,2163567,573356,2163578,2575552,2579595,2163585,2163568,2163597,2163579,2579969,2163592,572260,922149,891537,650835,2579439,2578935,2579607,2575558'.split(',');

const DEFAULT_CLINTON_COLLECTIONS = '1224781,2525029,2524453,2524447,101784492,119564603,2524459,2525018,2534568,2525017,7386739,2534574,2524458,2534575,2524450,7385959,342802399,2525059,612954,2534565,7386505,2524451,2525022,2524466,5957395,594648,2524452,2534573,2534569,7388773,2534571,1766805,594546,2525058,2534580,6005960,2525024,2525016,7388844,630636,2525025,2524457,2524467,2524455,2525015,2524463,2524449,7388838,7385958,7388802,7385965,2525028,2534570,2534584,7349214,7388808,7388760,594462,6107047,6107005,2534582,2521316,2525026,2534572,2525032,2525014,2534567,2524460,2525057,2525021,7388748,6120199,7385961,7410105,2525031,7388836,2524456,7388842,7385963,7385962,2525056,2524462,71404562,627797,7388775,7388763,7388751,2534586,7385957,7388766,6005967,2524461,7387422,7385960,20015396,7388800,7388843,7386837,7387463,7386504,7385723,2524454,7385964,613035,6012491,7388805,6120204,1040718,2525020,6106992,7388841,2525027,7387655,7387424,7388837,6005964,7388840,7385966,7388835,6106851,7388753,7387376,7388768,6012502,6107001,5957378,6005962,6106972,6107050,18515054,6120129,6014648'.split(',');

let REAGAN_COLLECTIONS  = loadList('reagan',  DEFAULT_REAGAN_COLLECTIONS);
let BUSH41_COLLECTIONS  = loadList('bush41',  DEFAULT_BUSH41_COLLECTIONS);
let CLINTON_COLLECTIONS = loadList('clinton', DEFAULT_CLINTON_COLLECTIONS);

function loadList(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(LISTS_KEY) || '{}');
    if (Array.isArray(stored[key]) && stored[key].length) return stored[key];
  } catch (e) {}
  return fallback;
}
function saveList(key, arr) {
  try {
    const stored = JSON.parse(localStorage.getItem(LISTS_KEY) || '{}');
    stored[key] = arr;
    localStorage.setItem(LISTS_KEY, JSON.stringify(stored));
  } catch (e) {}
}

const $ = id => document.getElementById(id);
const escAttr = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc = escAttr;

// =====================================================================
// TOPIC PACKS - render and wire up
// =====================================================================
function renderTopicPacks() {
  const host = $('topicPacks');
  if (!host || !window.TOPIC_PACKS) return;
  host.innerHTML = '';
  for (const pack of window.TOPIC_PACKS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'topic-pack';
    btn.dataset.id = pack.id;
    btn.innerHTML =
      '<div class="tp-title">' + esc(pack.name) + '</div>' +
      '<div class="tp-meta">' + pack.from + '\u2013' + pack.to + '</div>' +
      '<div class="tp-note">' + esc(pack.note) + '</div>';
    btn.addEventListener('click', () => applyTopicPack(pack));
    host.appendChild(btn);
  }
}

function applyTopicPack(pack) {
  $('q').value = pack.q || '';
  $('from').value = pack.from || '';
  $('to').value = pack.to || '';
  // Reset all scope checkboxes
  document.querySelectorAll('.featured input[type=checkbox]').forEach(cb => cb.checked = false);
  $('scope_reagan').checked = pack.scope.includes('reagan');
  $('scope_bush41').checked = pack.scope.includes('bush41');
  $('scope_clinton').checked = pack.scope.includes('clinton');
  for (const naid of pack.scope) {
    if (naid === 'reagan' || naid === 'bush41' || naid === 'clinton') continue;
    const cb = document.querySelector('.featured input[data-naid="' + naid + '"]');
    if (cb) cb.checked = true;
  }
  // Reset quick scopes
  document.querySelectorAll('.quick-scopes input[type=checkbox]').forEach(cb => cb.checked = false);
  // Highlight selected
  document.querySelectorAll('.topic-pack').forEach(el => el.classList.remove('active'));
  const sel = document.querySelector('.topic-pack[data-id="' + pack.id + '"]');
  if (sel) sel.classList.add('active');
  setStatus('Topic pack loaded: ' + pack.name + ' \u2014 click Search to run.');
}

// =====================================================================
// SCOPE RESOLUTION
// =====================================================================
function selectedNaids() {
  const set = new Set();
  const want = id => $(id) && $(id).checked;

  // Quick scopes override admin umbrellas when checked.
  const anyQuick = document.querySelectorAll('.quick-scopes input:checked').length > 0;

  if (anyQuick) {
    if (want('qs_nsc_only'))         { QUICK_NSC_REAGAN.forEach(n=>set.add(n)); QUICK_NSC_BUSH.forEach(n=>set.add(n)); QUICK_NSC_CLINTON.forEach(n=>set.add(n)); }
    if (want('qs_econ_only'))        QUICK_ECON.forEach(n=>set.add(n));
    if (want('qs_nonprolif'))        QUICK_NONPROLIF.forEach(n=>set.add(n));
    if (want('qs_regional_europe'))  QUICK_EUROPE.forEach(n=>set.add(n));
    if (want('qs_regional_asia'))    QUICK_ASIA.forEach(n=>set.add(n));
    if (want('qs_regional_lat'))     QUICK_LATAM.forEach(n=>set.add(n));
    if (want('qs_regional_africa'))  QUICK_AFRICA.forEach(n=>set.add(n));
    if (want('qs_regional_me'))      QUICK_ME.forEach(n=>set.add(n));
  } else {
    if (want('scope_reagan'))  REAGAN_COLLECTIONS.forEach(n => set.add(n));
    if (want('scope_bush41'))  BUSH41_COLLECTIONS.forEach(n => set.add(n));
    if (want('scope_clinton')) CLINTON_COLLECTIONS.forEach(n => set.add(n));
  }

  document.querySelectorAll('.featured input[type=checkbox]:checked').forEach(cb => {
    if (cb.dataset.naid) set.add(cb.dataset.naid);
  });

  return [...set];
}

// =====================================================================
// CLASSIFY — smarter detection of declassified / withdrawal / unprocessed
// =====================================================================
function classify(rec) {
  const title = (rec.title || '').toString();
  const desc  = (rec.scopeAndContentNote || '').toString();
  const online = Array.isArray(rec.digitalObjects) && rec.digitalObjects.length > 0;
  const restrictions = (rec.accessRestriction && rec.accessRestriction.specificAccessRestrictions) || [];
  const restrictionTypes = restrictions.map(r => (r.restriction || '').toString().toUpperCase());

  const hasFoia = restrictionTypes.some(r => /FOIA/.test(r));
  const hasPra  = restrictionTypes.some(r => /PRA|PRESIDENTIAL.RECORDS/.test(r));
  const looksWithdrawal = WITHDRAWAL_RE.test(title) || WITHDRAWAL_RE.test(desc);

  let cat;
  if (looksWithdrawal)        cat = 'withdrawal';
  else if (hasFoia || hasPra) cat = 'withdrawal';   // MDR candidate
  else if (online)            cat = 'declassified';
  else if (!desc.trim() || desc.trim().length < 20) cat = 'unprocessed';
  else                        cat = 'other';

  return {
    cat,
    online,
    objectCount: Array.isArray(rec.digitalObjects) ? rec.digitalObjects.length : 0,
    foia: hasFoia,
    pra:  hasPra,
    restrictionTypes,
    level: rec.levelOfDescription || '',
  };
}

// =====================================================================
// FETCH ENGINE — fan-out with AbortController + sessionStorage cache
// =====================================================================
let activeAbort = null;

function cacheKey(naid, q, from, to, level, perColl) {
  return ['nsc', naid, q || '', from || '', to || '', level || '', perColl].join('|');
}

async function fetchOne(naid, q, from, to, level, perColl, signal) {
  const k = cacheKey(naid, q, from, to, level, perColl);
  try {
    const cached = sessionStorage.getItem(k);
    if (cached) return { naid, ...JSON.parse(cached), cached: true };
  } catch (e) {}

  const params = new URLSearchParams();
  if (q) params.append('q', q);
  params.append('ancestorNaId', naid);
  if (from)  params.append('startDate', from);
  if (to)    params.append('endDate', to);
  if (level) params.append('levelOfDescription', level);
  params.append('limit', String(perColl));

  try {
    const r = await fetch(PROXY_URL.replace(/\/+$/, '') + NARA_PATH + '?' + params.toString(), {
      headers: { 'x-api-key': API_KEY, 'Accept': 'application/json' },
      signal,
    });
    if (!r.ok) return { naid, hits: [], total: 0, error: 'HTTP ' + r.status };
    const json = await r.json();
    const body = json.body || json;
    const hits = (body.hits && body.hits.hits) || [];
    const totalRaw = body.hits && body.hits.total;
    const total = (totalRaw && (totalRaw.value ?? totalRaw)) || 0;
    const payload = { hits, total };
    try { sessionStorage.setItem(k, JSON.stringify(payload)); } catch (e) {}
    return { naid, ...payload };
  } catch (err) {
    if (err.name === 'AbortError') return { naid, hits: [], total: 0, aborted: true };
    return { naid, hits: [], total: 0, error: err.message };
  }
}

async function runSearch() {
  if (activeAbort) activeAbort.abort();
  activeAbort = new AbortController();
  const signal = activeAbort.signal;

  const q = $('q').value.trim();
  const from = $('from').value.trim();
  const to = $('to').value.trim();
  const sortBy = $('sort').value;
  const level  = $('level').value;
  const perColl = parseInt($('perColl').value, 10) || 25;
  const perPage = parseInt($('perPage').value, 10) || 50;

  let naids = selectedNaids();
  if (!naids.length) { setStatus('Select at least one scope.'); return; }

  let truncated = false;
  if (naids.length > MAX_COLLECTIONS_PER_SCOPE) {
    naids = naids.slice(0, MAX_COLLECTIONS_PER_SCOPE);
    truncated = true;
  }

  $('go').disabled = true;
  $('stopBtn').disabled = false;
  setStatus('Searching ' + naids.length + ' collection' + (naids.length === 1 ? '' : 's') + '...');
  $('resultsPanel').style.display = 'block';
  $('results').innerHTML = ''; $('pager').innerHTML = ''; $('summary').textContent = '';

  // Push to history
  pushHistory({ q, from, to, sortBy, level, perColl, perPage, naids: naids.slice(0, 12), naidCount: naids.length, at: Date.now() });

  const merged = new Map();
  let totalAcrossCollections = 0;
  let completed = 0;
  let aborted = false;

  const queue = [...naids];
  const workers = Array(Math.min(MAX_PARALLEL, queue.length)).fill(0).map(async () => {
    while (queue.length && !signal.aborted) {
      const naid = queue.shift();
      const res = await fetchOne(naid, q, from, to, level, perColl, signal);
      if (res.aborted) { aborted = true; continue; }
      totalAcrossCollections += res.total;
      for (const h of (res.hits || [])) {
        const rec = (h._source && (h._source.record || h._source)) || h;
        const id = rec.naId;
        if (id && !merged.has(id)) merged.set(id, rec);
      }
      completed++;
      setStatus('Searching ' + naids.length + ' collections... (' + completed + ' done, ' + merged.size + ' unique)');
    }
  });

  await Promise.all(workers);

  $('go').disabled = false;
  $('stopBtn').disabled = true;

  const records = [...merged.values()];
  // Push current state into URL hash so the search is shareable
  updatePermalink({ q, from, to, sortBy, level, perColl, perPage });

  state.records = records;
  state.totalAcross = totalAcrossCollections;
  state.truncated = truncated;
  state.aborted = aborted;
  state.page = 1;
  state.perPage = perPage;
  state.sortBy = sortBy;

  render();
}

// =====================================================================
// RENDER (paginated + sorted)
// =====================================================================
const state = { records: [], totalAcross: 0, truncated: false, page: 1, perPage: 50, sortBy: 'relevance' };

function sortRecords(records, sortBy) {
  const yr = r => (r.coverageStartDate && r.coverageStartDate.year) || (r.coverageEndDate && r.coverageEndDate.year) || 0;
  const ttl = r => (r.title || '').toString().toLowerCase();
  const copy = records.slice();
  if (sortBy === 'date-asc')  copy.sort((a,b) => (yr(a) - yr(b)) || ttl(a).localeCompare(ttl(b)));
  else if (sortBy === 'date-desc') copy.sort((a,b) => (yr(b) - yr(a)) || ttl(a).localeCompare(ttl(b)));
  else if (sortBy === 'title')     copy.sort((a,b) => ttl(a).localeCompare(ttl(b)));
  // relevance == as returned
  return copy;
}

function render() {
  const records = sortRecords(state.records, state.sortBy);
  const classified = records.map(rec => ({ rec, info: classify(rec) }));

  const showD = $('f_declassified').checked;
  const showW = $('f_withdrawal').checked;
  const showU = $('f_unprocessed').checked;
  const showO = $('f_other').checked;
  const visible = classified.filter(c =>
    (c.info.cat === 'declassified' && showD) ||
    (c.info.cat === 'withdrawal'   && showW) ||
    (c.info.cat === 'unprocessed'  && showU) ||
    (c.info.cat === 'other'        && showO)
  );

  const cD = classified.filter(c => c.info.cat === 'declassified').length;
  const cW = classified.filter(c => c.info.cat === 'withdrawal').length;
  const cU = classified.filter(c => c.info.cat === 'unprocessed').length;
  const cO = classified.filter(c => c.info.cat === 'other').length;

  let summary = state.totalAcross.toLocaleString() + ' total matching record(s) across scoped collections \u00b7 ' +
                records.length + ' unique merged (' +
                cD + ' declassified, ' + cW + ' withdrawal/MDR, ' + cU + ' unprocessed, ' + cO + ' other) \u00b7 ' +
                'visible after filters: ' + visible.length;
  if (state.truncated) summary += ' \u00b7 NOTE: first ' + MAX_COLLECTIONS_PER_SCOPE + ' collections only.';
  if (state.aborted)   summary += ' \u00b7 STOPPED before all collections finished.';
  $('summary').textContent = summary;

  setStatus(records.length
    ? 'Found ' + state.totalAcross.toLocaleString() + ' total \u00b7 ' + visible.length + ' visible after filters.'
    : 'No records found.');

  // Pagination
  const totalPages = Math.max(1, Math.ceil(visible.length / state.perPage));
  if (state.page > totalPages) state.page = totalPages;
  const start = (state.page - 1) * state.perPage;
  const slice = visible.slice(start, start + state.perPage);

  const ol = $('results');
  ol.innerHTML = '';
  for (const { rec, info } of slice) {
    ol.appendChild(renderRecord(rec, info));
  }

  // Pager
  const pager = $('pager');
  pager.innerHTML = '';
  if (totalPages > 1) {
    const prev = document.createElement('button'); prev.className = 'ghost'; prev.textContent = '\u2190 Prev';
    prev.disabled = state.page <= 1;
    prev.addEventListener('click', () => { state.page--; render(); window.scrollTo({top:$('resultsPanel').offsetTop, behavior:'smooth'}); });
    const span = document.createElement('span'); span.textContent = 'Page ' + state.page + ' of ' + totalPages;
    const next = document.createElement('button'); next.className = 'ghost'; next.textContent = 'Next \u2192';
    next.disabled = state.page >= totalPages;
    next.addEventListener('click', () => { state.page++; render(); window.scrollTo({top:$('resultsPanel').offsetTop, behavior:'smooth'}); });
    pager.appendChild(prev); pager.appendChild(span); pager.appendChild(next);
  }
}

function renderRecord(rec, info) {
  const naid = rec.naId || '';
  const title = (rec.title || 'Untitled').toString();
  const desc = (rec.scopeAndContentNote || '').toString();
  const startY = rec.coverageStartDate && rec.coverageStartDate.year;
  const endY   = rec.coverageEndDate && rec.coverageEndDate.year;
  const dates = startY && endY ? (startY === endY ? String(startY) : startY + '\u2013' + endY) : (startY || endY || '');
  const ancestors = (rec.ancestors || []).filter(a => a && (a.title || a.collectionTitle));

  // Find the immediate series/file ancestor for sibling-finding
  const seriesAncestor = ancestors.find(a => /series/i.test(a.levelOfDescription || ''));
  const collectionAncestor = ancestors.find(a => /collection/i.test(a.levelOfDescription || ''));
  const topAncestors = ancestors.slice(0, 3);

  const badge = info.cat === 'declassified' ? '<span class="badge badge-declass">DECLASSIFIED ONLINE</span>'
              : info.cat === 'withdrawal'   ? '<span class="badge badge-withdraw">' + (info.foia ? 'FOIA RESTRICTED' : info.pra ? 'PRA RESTRICTED' : 'WITHDRAWAL SHEET') + '</span>'
              : info.cat === 'unprocessed'  ? '<span class="badge badge-unproc">UNPROCESSED</span>'
              : '<span class="badge badge-other">OTHER</span>';

  const chips = [];
  if (info.level) chips.push('<span class="chip">' + esc(info.level) + '</span>');
  if (info.objectCount) chips.push('<span class="chip chip-digital" title="' + info.objectCount + ' digital object(s)">' + info.objectCount + ' \u00d7 digital</span>');
  if (info.foia) chips.push('<span class="chip chip-foia">FOIA</span>');
  if (info.pra)  chips.push('<span class="chip chip-pra">PRA</span>');

  const isSaved = state.savedSet.has(naid);

  const li = document.createElement('li');
  li.dataset.naid = naid;
  li.innerHTML =
    badge +
    '<h4><a href="https://catalog.archives.gov/id/' + esc(naid) + '" target="_blank" rel="noopener">' + esc(title) + '</a></h4>' +
    '<div class="meta">NAID ' + esc(naid) + (dates ? ' \u00b7 ' + esc(String(dates)) : '') + (chips.length ? ' \u00b7 ' + chips.join(' ') : '') + '</div>' +
    (desc ? '<div class="snippet">' + esc(desc.slice(0, 400)) + (desc.length > 400 ? '\u2026' : '') + '</div>'
          : '<div class="snippet" style="color:var(--gold-dark);font-style:italic">No scope/content note. Plan on-site research.</div>') +
    (topAncestors.length
      ? '<div class="tags">' + topAncestors.map(a => {
          const aTitle = a.title || a.collectionTitle || '';
          const aId = a.naId;
          const aLvl = a.levelOfDescription ? a.levelOfDescription.charAt(0).toUpperCase() + a.levelOfDescription.slice(1) : '';
          const aTip = aLvl ? aLvl + ' \u00b7 NAID ' + (aId || '') : (aId ? 'NAID ' + aId : '');
          return aId
            ? '<a class="tag-link" href="https://catalog.archives.gov/id/' + esc(aId) + '" target="_blank" rel="noopener" title="' + esc(aTip) + '">' + esc(aTitle) + '</a>'
            : '<span title="' + esc(aTip) + '">' + esc(aTitle) + '</span>';
        }).join('') + '</div>'
      : '') +
    '<div class="rec-actions">' +
      '<button class="ghost btn-save" data-naid="' + esc(naid) + '">' + (isSaved ? '\u2605 Saved' : '\u2606 Save') + '</button>' +
      (seriesAncestor ? '<button class="ghost btn-siblings" data-naid="' + esc(seriesAncestor.naId) + '" data-title="' + escAttr(seriesAncestor.title) + '">Show siblings in series</button>' : '') +
      '<button class="ghost btn-note" data-naid="' + esc(naid) + '">Add note</button>' +
    '</div>' +
    '<div class="note-area" id="note-' + esc(naid) + '" style="display:none"></div>';

  li.querySelector('.btn-save').addEventListener('click', () => toggleSave(rec, info));
  const sibBtn = li.querySelector('.btn-siblings');
  if (sibBtn) sibBtn.addEventListener('click', () => showSiblings(sibBtn.dataset.naid, sibBtn.dataset.title));
  li.querySelector('.btn-note').addEventListener('click', () => openNoteEditor(naid));

  return li;
}

// =====================================================================
// SIBLINGS — find related records in the same series
// =====================================================================
async function showSiblings(seriesNaid, seriesTitle) {
  if (!seriesNaid) return;
  const q = $('q').value.trim();
  setStatus('Looking up siblings in "' + seriesTitle + '"...');
  const res = await fetchOne(seriesNaid, q, $('from').value.trim(), $('to').value.trim(), '', 50, new AbortController().signal);
  setStatus('Siblings: ' + (res.hits || []).length + ' shown / ' + (res.total || 0) + ' total in series.');
  state.records = (res.hits || []).map(h => (h._source && (h._source.record || h._source)) || h);
  state.totalAcross = res.total || state.records.length;
  state.truncated = false;
  state.page = 1;
  render();
  window.scrollTo({top:$('resultsPanel').offsetTop, behavior:'smooth'});
}

// =====================================================================
// SAVED ITEMS / NOTES / EXPORTS
// =====================================================================
state.saved = loadSaved();
state.savedSet = new Set(state.saved.map(s => s.naId));

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
  catch (e) { return []; }
}
function persistSaved() {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(state.saved)); } catch (e) {}
  state.savedSet = new Set(state.saved.map(s => s.naId));
  renderSavedPanel();
}

function toggleSave(rec, info) {
  const id = rec.naId;
  if (!id) return;
  const idx = state.saved.findIndex(s => s.naId === id);
  if (idx >= 0) {
    state.saved.splice(idx, 1);
  } else {
    state.saved.push({
      naId: id,
      title: rec.title || '',
      desc: rec.scopeAndContentNote || '',
      startYear: rec.coverageStartDate && rec.coverageStartDate.year,
      endYear:   rec.coverageEndDate   && rec.coverageEndDate.year,
      level: rec.levelOfDescription || '',
      ancestors: (rec.ancestors || []).map(a => ({ naId: a.naId, title: a.title || a.collectionTitle, level: a.levelOfDescription })),
      digitalObjects: info.objectCount,
      foia: info.foia, pra: info.pra,
      note: '',
      savedAt: Date.now(),
    });
  }
  persistSaved();
  render(); // refresh result list so star toggles
}

function openNoteEditor(naid) {
  const area = $('note-' + naid);
  if (!area) return;
  if (area.style.display !== 'none') { area.style.display = 'none'; return; }
  const existing = (state.saved.find(s => s.naId === naid) || {}).note || '';
  area.style.display = 'block';
  area.innerHTML =
    '<textarea rows="3" placeholder="Research note for this record">' + esc(existing) + '</textarea>' +
    '<div class="actions"><button class="ghost btn-save-note">Save note</button>' +
    '<span class="hint">Notes are saved locally and exported with citations.</span></div>';
  area.querySelector('.btn-save-note').addEventListener('click', () => {
    const v = area.querySelector('textarea').value;
    let s = state.saved.find(x => x.naId === naid);
    if (!s) {
      // Find record from current results and auto-save it
      const rec = state.records.find(r => r.naId === naid);
      if (rec) {
        toggleSave(rec, classify(rec));
        s = state.saved.find(x => x.naId === naid);
      }
    }
    if (s) { s.note = v; persistSaved(); setStatus('Note saved.'); }
    area.style.display = 'none';
  });
}

function renderSavedPanel() {
  const panel = $('savedPanel');
  const list  = $('savedList');
  const count = $('savedCount');
  count.textContent = state.saved.length ? '(' + state.saved.length + ')' : '';
  if (!state.saved.length) { panel.style.display = 'none'; return; }
  panel.style.display = 'block';
  list.innerHTML = '';
  for (const s of state.saved) {
    const li = document.createElement('li');
    const dates = s.startYear && s.endYear ? (s.startYear === s.endYear ? s.startYear : s.startYear + '\u2013' + s.endYear) : (s.startYear || s.endYear || '');
    li.innerHTML =
      '<a href="https://catalog.archives.gov/id/' + esc(s.naId) + '" target="_blank" rel="noopener"><strong>' + esc(s.title) + '</strong></a>' +
      ' <span class="meta">NAID ' + esc(s.naId) + (dates ? ' \u00b7 ' + esc(String(dates)) : '') + '</span>' +
      (s.note ? '<div class="snippet"><em>Note:</em> ' + esc(s.note) + '</div>' : '') +
      '<div class="actions"><button class="ghost btn-unsave" data-naid="' + esc(s.naId) + '">Remove</button></div>';
    li.querySelector('.btn-unsave').addEventListener('click', () => {
      state.saved = state.saved.filter(x => x.naId !== s.naId);
      persistSaved();
      render();
    });
    list.appendChild(li);
  }
}

function exportCsv() {
  if (!state.saved.length) { setStatus('No saved items.'); return; }
  const cols = ['NAID','Title','Start','End','Level','Digital Objects','FOIA','PRA','Collection','Series','Note','URL'];
  const rows = state.saved.map(s => {
    const coll = (s.ancestors || []).find(a => /collection/i.test(a.level || '')) || {};
    const ser  = (s.ancestors || []).find(a => /series/i.test(a.level || ''))     || {};
    return [
      s.naId, s.title || '', s.startYear || '', s.endYear || '', s.level || '',
      s.digitalObjects || 0, s.foia ? 'Y' : '', s.pra ? 'Y' : '',
      coll.title || '', ser.title || '', s.note || '',
      'https://catalog.archives.gov/id/' + s.naId,
    ];
  });
  const csv = [cols, ...rows].map(row => row.map(csvEscape).join(',')).join('\n');
  download('nara-scout-saved.csv', csv, 'text/csv;charset=utf-8');
}
function csvEscape(v) {
  const s = String(v == null ? '' : v);
  return /[,"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function exportCitation() {
  if (!state.saved.length) { setStatus('No saved items.'); return; }
  const lines = ['# NARA Scout citation export', '', 'Generated ' + new Date().toISOString().slice(0,10), ''];
  for (const s of state.saved) {
    const coll = (s.ancestors || []).find(a => /collection/i.test(a.level || ''))    || {};
    const ser  = (s.ancestors || []).find(a => /series/i.test(a.level || ''))        || {};
    const fu   = (s.ancestors || []).find(a => /file/i.test(a.level || ''))          || {};
    const dates = s.startYear && s.endYear ? (s.startYear === s.endYear ? s.startYear : s.startYear + '\u2013' + s.endYear) : (s.startYear || s.endYear || 'n.d.');
    // NARA-style citation
    const parts = [];
    parts.push('"' + (s.title || 'Untitled') + '"');
    if (fu.title && fu.naId !== s.naId) parts.push(fu.title);
    if (ser.title) parts.push(ser.title);
    if (coll.title) parts.push(coll.title);
    parts.push('National Archives and Records Administration');
    parts.push('NAID ' + s.naId);
    parts.push(String(dates));
    lines.push('- ' + parts.join(', ') + '. URL: https://catalog.archives.gov/id/' + s.naId);
    if (s.note) lines.push('  - Note: ' + s.note);
    lines.push('');
  }
  download('nara-scout-citations.md', lines.join('\n'), 'text/markdown;charset=utf-8');
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openAllSaved() {
  if (!state.saved.length) return;
  if (!confirm('Open ' + state.saved.length + ' tabs?')) return;
  for (const s of state.saved) {
    window.open('https://catalog.archives.gov/id/' + s.naId, '_blank', 'noopener');
  }
}

// =====================================================================
// HISTORY
// =====================================================================
function pushHistory(entry) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}
  // Dedupe identical queries
  hist = hist.filter(h => !(h.q === entry.q && h.from === entry.from && h.to === entry.to && h.naidCount === entry.naidCount));
  hist.unshift(entry);
  hist = hist.slice(0, 20);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(hist)); } catch (e) {}
  renderHistoryPanel();
}
function renderHistoryPanel() {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}
  const panel = $('historyPanel');
  const host = $('history');
  if (!hist.length) { panel.style.display = 'none'; return; }
  panel.style.display = 'block';
  host.innerHTML = '';
  for (const h of hist) {
    const when = new Date(h.at).toLocaleString();
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = '<button class="ghost btn-history">' + esc(h.q || '(no query)') +
      ' <span class="hint">' + (h.from || '\u2026') + '\u2013' + (h.to || '\u2026') +
      ' \u00b7 ' + h.naidCount + ' coll \u00b7 ' + esc(when) + '</span></button>';
    div.querySelector('button').addEventListener('click', () => {
      $('q').value = h.q || '';
      $('from').value = h.from || '';
      $('to').value = h.to || '';
      if (h.sortBy) $('sort').value = h.sortBy;
      if (h.level) $('level').value = h.level;
      if (h.perColl) $('perColl').value = String(h.perColl);
      if (h.perPage) $('perPage').value = String(h.perPage);
      setStatus('History entry loaded \u2014 click Search to re-run.');
    });
    host.appendChild(div);
  }
}

// =====================================================================
// PERMALINK (URL hash)
// =====================================================================
function updatePermalink(s) {
  const params = new URLSearchParams();
  if (s.q)       params.set('q', s.q);
  if (s.from)    params.set('from', s.from);
  if (s.to)      params.set('to', s.to);
  if (s.sortBy)  params.set('sort', s.sortBy);
  if (s.level)   params.set('level', s.level);
  if (s.perColl) params.set('perColl', s.perColl);
  if (s.perPage) params.set('perPage', s.perPage);
  // scope state
  const scopes = [];
  if ($('scope_reagan').checked) scopes.push('reagan');
  if ($('scope_bush41').checked) scopes.push('bush41');
  if ($('scope_clinton').checked) scopes.push('clinton');
  document.querySelectorAll('.featured input:checked').forEach(cb => scopes.push(cb.dataset.naid));
  if (scopes.length) params.set('scope', scopes.join(','));
  const qs = [];
  document.querySelectorAll('.quick-scopes input:checked').forEach(cb => qs.push(cb.id));
  if (qs.length) params.set('qs', qs.join(','));
  history.replaceState(null, '', '#' + params.toString());
}

function loadFromPermalink() {
  if (!location.hash) return;
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.get('q'))       $('q').value = params.get('q');
  if (params.get('from'))    $('from').value = params.get('from');
  if (params.get('to'))      $('to').value = params.get('to');
  if (params.get('sort'))    $('sort').value = params.get('sort');
  if (params.get('level'))   $('level').value = params.get('level');
  if (params.get('perColl')) $('perColl').value = params.get('perColl');
  if (params.get('perPage')) $('perPage').value = params.get('perPage');

  const scopes = (params.get('scope') || '').split(',').filter(Boolean);
  $('scope_reagan').checked = scopes.includes('reagan');
  $('scope_bush41').checked = scopes.includes('bush41');
  $('scope_clinton').checked = scopes.includes('clinton');
  document.querySelectorAll('.featured input[type=checkbox]').forEach(cb => cb.checked = false);
  for (const s of scopes) {
    if (s === 'reagan' || s === 'bush41' || s === 'clinton') continue;
    const cb = document.querySelector('.featured input[data-naid="' + s + '"]');
    if (cb) cb.checked = true;
  }
  const qs = (params.get('qs') || '').split(',').filter(Boolean);
  document.querySelectorAll('.quick-scopes input[type=checkbox]').forEach(cb => cb.checked = qs.includes(cb.id));

  if (params.toString()) setStatus('Search restored from link \u2014 click Search to run.');
}

function copyPermalink() {
  const url = location.origin + location.pathname + location.hash;
  navigator.clipboard.writeText(url).then(
    () => setStatus('Link copied to clipboard.'),
    () => setStatus('Could not copy; URL is in the address bar.')
  );
}

// =====================================================================
// REFRESH COLLECTION LISTS
// =====================================================================
async function refreshCollectionLists() {
  $('refreshStatus').textContent = 'Querying NARA for current collection lists...';
  try {
    const [reagan, bush, clinton] = await Promise.all([
      discoverCollections('Reagan Administration', 'Reagan'),
      discoverCollections('George Bush', 'Bush'),
      discoverCollections('William J. Clinton', 'Clinton'),
    ]);
    if (reagan.length)  { REAGAN_COLLECTIONS  = reagan;  saveList('reagan',  reagan); }
    if (bush.length)    { BUSH41_COLLECTIONS  = bush;    saveList('bush41',  bush); }
    if (clinton.length) { CLINTON_COLLECTIONS = clinton; saveList('clinton', clinton); }
    $('count_reagan').textContent  = REAGAN_COLLECTIONS.length  ? '(' + REAGAN_COLLECTIONS.length + ')'  : '';
    $('count_bush41').textContent  = BUSH41_COLLECTIONS.length  ? '(' + BUSH41_COLLECTIONS.length + ')'  : '';
    $('count_clinton').textContent = CLINTON_COLLECTIONS.length ? '(' + CLINTON_COLLECTIONS.length + ')' : '';
    $('refreshStatus').textContent = 'Refreshed: ' + reagan.length + ' Reagan + ' + bush.length + ' Bush 41 + ' + clinton.length + ' Clinton.';
  } catch (err) {
    $('refreshStatus').textContent = 'Refresh failed: ' + err.message;
  }
}

async function discoverCollections(adminQuery, titleMustContain) {
  const params = new URLSearchParams();
  params.append('q', adminQuery);
  params.append('levelOfDescription', 'collection');
  params.append('limit', '300');
  const r = await fetch(PROXY_URL.replace(/\/+$/, '') + NARA_PATH + '?' + params.toString(), {
    headers: { 'x-api-key': API_KEY, 'Accept': 'application/json' }
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const json = await r.json();
  const body = json.body || json;
  const hits = (body.hits && body.hits.hits) || [];
  return hits.map(h => {
    const rec = (h._source && (h._source.record || h._source)) || h;
    return { naId: String(rec.naId || ''), title: rec.title || '' };
  }).filter(o => o.naId && (!titleMustContain || o.title.includes(titleMustContain)))
    .map(o => o.naId);
}

// =====================================================================
// SETUP
// =====================================================================
function setStatus(msg) { $('status').textContent = msg; }

function attachListeners() {
  $('go').addEventListener('click', runSearch);
  $('q').addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });
  $('stopBtn').addEventListener('click', () => {
    if (activeAbort) activeAbort.abort();
    setStatus('Stopped.');
    $('go').disabled = false;
    $('stopBtn').disabled = true;
  });
  $('clear').addEventListener('click', () => {
    $('q').value = ''; $('from').value = ''; $('to').value = '';
    $('results').innerHTML = ''; $('pager').innerHTML = '';
    $('summary').textContent = '';
    $('resultsPanel').style.display = 'none'; $('status').textContent = '';
    document.querySelectorAll('.topic-pack').forEach(el => el.classList.remove('active'));
    history.replaceState(null, '', location.pathname);
  });
  $('permalink').addEventListener('click', copyPermalink);

  // Sort/filter change triggers re-render of cached records
  $('sort').addEventListener('change', () => { state.sortBy = $('sort').value; if (state.records.length) render(); });
  document.querySelectorAll('#f_declassified, #f_withdrawal, #f_unprocessed, #f_other').forEach(el =>
    el.addEventListener('change', () => { if (state.records.length) render(); }));
  $('perPage').addEventListener('change', () => { state.perPage = parseInt($('perPage').value,10) || 50; state.page = 1; if (state.records.length) render(); });

  $('exportCsv').addEventListener('click', exportCsv);
  $('exportCite').addEventListener('click', exportCitation);
  $('openAll').addEventListener('click', openAllSaved);
  $('clearSaved').addEventListener('click', () => {
    if (!state.saved.length) return;
    if (!confirm('Clear all saved items?')) return;
    state.saved = []; persistSaved(); render();
  });

  $('refreshLists').addEventListener('click', refreshCollectionLists);
}

function init() {
  renderTopicPacks();
  attachListeners();
  $('count_reagan').textContent  = '(' + REAGAN_COLLECTIONS.length + ')';
  $('count_bush41').textContent  = '(' + BUSH41_COLLECTIONS.length + ')';
  $('count_clinton').textContent = '(' + CLINTON_COLLECTIONS.length + ')';
  loadFromPermalink();
  renderSavedPanel();
  renderHistoryPanel();
}

init();
