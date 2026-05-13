# NARA Scout

A lightweight, browser-based search tool for FRUS compilers to query the **National Archives Catalog API** for records most relevant to U.S. foreign-policy research on the George H.W. Bush and William J. Clinton administrations.

The site runs entirely in your browser as a static page on GitHub Pages. No backend, no server, no data leaves your machine except calls you make directly to NARA's public Catalog API.

## Live site

Once GitHub Pages is enabled for this repo (Settings -> Pages -> Source: `main` branch / root), the tool will be available at:

https://therealjameswilson.github.io/nara-scout/

## Collections covered

NARA Scout pre-scopes your queries to the collections most useful for FRUS work on the Bush 41 and Clinton administrations. You can toggle any of them on or off for a given search.

| Collection | NAID | Catalog link |
|---|---|---|
| Bush Presidential Records - NSC Files | (lookup at runtime) | https://catalog.archives.gov/ |
| Clinton Presidential Records - NSC Files | (lookup at runtime) | https://catalog.archives.gov/ |
| Scowcroft Files | 4522156 | https://catalog.archives.gov/id/4522156 |
| Bush Presidential Daily Files | 595141 | https://catalog.archives.gov/id/595141 |
| All Bush Presidential Records (optional) | - | - |
| All Clinton Presidential Records (optional) | - | - |

Note: the Scowcroft Files and the Bush Presidential Daily Files are not technically part of the NSC files, but they are essential adjacent collections for FRUS compilers and are therefore included as first-class scopes.

## Using the tool

1. Get a free NARA Catalog API key (via api.data.gov): https://www.archives.gov/developer
2. Open the live site and paste your key into the **API key** field. The key is stored only in your browser's `localStorage` and is never committed to this repository.
3. Enter your search terms, choose which collections to search within, optionally restrict to records available online, and click **Search**.
4. Click any result to open the record in the National Archives Catalog.

## Why bring-your-own-key?

This is a public, static site. Hardcoding a NARA API key into the source would expose it to anyone on the internet, which could exhaust the rate-limit quota tied to that key. Asking each user to supply their own key keeps everyone within their own quota and avoids leaking shared credentials.

## API used

- Endpoint: `https://catalog.archives.gov/api/v2/records/search`
- Auth: `x-api-key` HTTP header
- Docs: https://github.com/usnationalarchives/Catalog-API

Searches use the `ancestor.naId` parameter to scope results within each selected parent collection, combined via `OR`.

## Project files

- `index.html` - search UI
- `app.js` - Catalog API client and rendering logic
- `style.css` - styling
- `README.md` - this file

## License

Public domain (records retrieved are U.S. Government records). Code: MIT.

## Credits

Built for FRUS compilers at the Office of the Historian, U.S. Department of State. Data courtesy of the National Archives and Records Administration.
