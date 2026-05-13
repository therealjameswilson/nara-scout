// NARA Scout - Cloudflare Worker CORS proxy for the National Archives Catalog API v2.
//
// Why this exists:
//   catalog.archives.gov/api/v2/* does not return CORS headers, so browsers
//   block direct calls from a static site such as github.io. This Worker sits
//   between the browser and NARA, forwards the request unchanged, and adds
//   permissive CORS headers so the browser is happy.
//
// The browser sends the `x-api-key` header through this proxy. The key is
// shared among colleagues (hardcoded in app.js), which is fine for this
// internal-research use case.
//
// Deploy (one-time, ~3 min, free tier covers ~100k requests/day):
//   1. Sign in at https://dash.cloudflare.com  (free account)
//   2. Workers & Pages -> Create -> Create Worker -> name it "nara-proxy"
//   3. Click "Edit code", paste this entire file, click Deploy
//   4. Copy the *.workers.dev URL Cloudflare gives you
//   5. Paste it into PROXY_URL at the top of app.js, commit, push
//
// That is the entire setup. No secrets, no env vars.

const NARA_BASE = 'https://catalog.archives.gov/api/v2';
const ALLOWED_PATHS = [
  '/records/search',
  '/records/parent-search',
  '/records',
];

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, x-api-key',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return json({ error: 'Only GET is supported' }, 405, corsHeaders);
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/' || url.pathname === '/health') {
      return json(
        { ok: true, service: 'nara-proxy', upstream: NARA_BASE, allowed_paths: ALLOWED_PATHS },
        200,
        corsHeaders
      );
    }

    // Only forward to safe NARA read endpoints
    if (!ALLOWED_PATHS.some(p => url.pathname === p || url.pathname.startsWith(p + '/'))) {
      return json(
        { error: 'Path not allowed', path: url.pathname, allowed: ALLOWED_PATHS },
        403,
        corsHeaders
      );
    }

    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return json({ error: 'Missing x-api-key header' }, 400, corsHeaders);
    }

    const upstream = NARA_BASE + url.pathname + url.search;

    let resp;
    try {
      resp = await fetch(upstream, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Accept': 'application/json',
          'User-Agent': 'nara-scout-proxy/1.0 (+https://github.com/therealjameswilson/nara-scout)',
        },
        // Cache successful responses at the edge for 60s to be nice to NARA
        cf: { cacheTtl: 60, cacheEverything: true },
      });
    } catch (err) {
      return json({ error: 'Upstream fetch failed', detail: String(err) }, 502, corsHeaders);
    }

    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', resp.headers.get('Content-Type') || 'application/json');
    const cc = resp.headers.get('Cache-Control');
    if (cc) headers.set('Cache-Control', cc);

    return new Response(resp.body, { status: resp.status, headers });
  },
};

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
