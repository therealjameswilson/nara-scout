# NARA Scout — Cloudflare Worker proxy

The NARA Catalog API v2 does not return CORS headers, so a static site (GitHub
Pages) cannot call it directly from the browser. Symptom: every search fails
with `Network error: Load failed` (Safari) or `TypeError: Failed to fetch`
(Chrome/Firefox).

This Worker fixes that by sitting between the browser and `catalog.archives.gov`
and adding `Access-Control-Allow-Origin: *`. The browser forwards the
`x-api-key` header through the Worker unchanged — the Worker holds no secrets.

It restricts the upstream to a small allowlist of safe NARA read endpoints and
caches responses for 60 seconds at the Cloudflare edge to be polite to NARA.

## Deploy (3 minutes, free tier — ~100k requests/day)

1. Create a free Cloudflare account: <https://dash.cloudflare.com/sign-up>.
2. **Workers & Pages → Create → Create Worker**. Name it `nara-proxy`. Deploy
   the placeholder.
3. Click **Edit code**, replace everything with the contents of
   [`nara-proxy.js`](./nara-proxy.js), click **Deploy**.
4. Cloudflare gives you a URL like `https://nara-proxy.<your-handle>.workers.dev`.
   Copy it.
5. Open `app.js` in the repo root, replace the `PROXY_URL` constant near the top
   with your URL, commit, and push. GitHub Pages picks up the change in a
   minute or two.

That's the whole setup. No secrets, no env vars, no per-colleague config —
anyone who opens the page can search.

## Health check

Visit `https://nara-proxy.<your-handle>.workers.dev/` in a browser — you should
see a small JSON status payload.

## Cost

The Cloudflare Workers free plan includes 100,000 requests/day. NARA Scout
issues one request per search, so the free tier is effectively unlimited for
this use case.

## Locking it down later (optional)

If you ever want to restrict the Worker to only your GitHub Pages site, change
`'Access-Control-Allow-Origin': '*'` in `nara-proxy.js` to your origin, e.g.
`'https://therealjameswilson.github.io'`.
