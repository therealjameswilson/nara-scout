# NARA Scout

A browser-based research-planning instrument for **FRUS compilers** working in the National Archives Catalog. NARA Scout helps you do three things at once when scouting the George H.W. Bush and William J. Clinton presidential records:

1. **Find previously declassified documents** that can be considered for inclusion in FRUS volumes (Bush GHW subseries: https://history.state.gov/historicaldocuments/bush-ghw ; Clinton subseries: https://history.state.gov/historicaldocuments/clinton ).
2. **Surface withdrawal sheets** (NA Forms 14021 / 14023 and equivalents) so you can identify what classified material has been pulled from a folder and therefore what still needs to be requested via MDR or FOIA.
3. **Map unprocessed collections** (series and folders with no descriptive note) so you can build a research plan around finding aids and on-site visits to the Bush and Clinton libraries.

The site is static (GitHub Pages). No backend, no data leaves your machine except your direct calls to NARA's public Catalog API.

## Live site

Enable GitHub Pages (Settings -> Pages -> Source: `main` branch / root) and the tool will be available at:

https://therealjameswilson.github.io/nara-scout/

## How FRUS compilers use this tool

### Workflow A - Harvest declassified documents
Filter by **Declassified / available online**. Hits are item-level records with digitized PDFs you can open, cite, and (where appropriate) propose for inclusion. Each result links to its catalog page and digitized object.

### Workflow B - Inventory withdrawal sheets
Filter by **Withdrawal sheets**. NARA Scout flags records whose titles or scope notes match `withdrawal sheet`, `withdrawal notice`, `NA Form 14021`, or `NA Form 14023`. Reviewing these tells you which documents have been removed from a folder for classification or PRA reasons, with enough metadata (date, subject, originator, classification, exemption code) to draft an MDR request to the Bush or Clinton Library.

### Workflow C - Plan research on unprocessed material
Filter by **Unprocessed / no description**. NARA Scout surfaces series and collection records that lack a scope-and-content note. These are the holdings you can't search by keyword - they require an on-site visit or a remote finding-aid request. Use this view to draft a research plan: which boxes, which series, which staff archivist to contact at the GHWB or WJC Library.

## Collections covered

| Collection | NAID | Catalog link |
|---|---|---|
| Bush Presidential Records - NSC Files | 6879843 | https://catalog.archives.gov/id/6879843 |
| Clinton Presidential Records - NSC Files | 6166381 | https://catalog.archives.gov/id/6166381 |
| Scowcroft Files | 4522156 | https://catalog.archives.gov/id/4522156 |
| Bush Presidential Daily Files | 595141 | https://catalog.archives.gov/id/595141 |
| All Bush Presidential Records (optional) | 2756545 | https://catalog.archives.gov/id/2756545 |
| All Clinton Presidential Records (optional) | 2787346 | https://catalog.archives.gov/id/2787346 |

Note: The Scowcroft Files and the Bush Presidential Daily Files are not technically NSC files but are essential adjacent collections for FRUS work and are included as first-class scopes.

NAIDs marked above are starting values; if a search returns zero hits the NAID can be edited in `app.js` to point to the correct parent series in the NARA Catalog.

## Using the tool

1. Get a free NARA Catalog API key (api.data.gov): https://www.archives.gov/developer
2. Open the live site and paste your key into the **API key** field. The key lives only in your browser's `localStorage` and is never committed to this repo.
3. Enter search terms, pick which collections to scope to, and choose one or more **record-type filters**: Declassified, Withdrawal sheets, or Unprocessed.
4. Click **Search the Archives**. Each result is tagged with the workflow it belongs to (DECLASSIFIED ONLINE / WITHDRAWAL SHEET / UNPROCESSED).

## Why bring-your-own-key?

This is a public, static site. Hardcoding a NARA API key would expose it and let strangers exhaust the rate-limit quota tied to that key. Asking each user to paste their own keeps everyone within their own quota.

## API used

- Endpoint: `https://catalog.archives.gov/api/v2/records/search`
- Auth: `x-api-key` HTTP header
- Docs: https://github.com/usnationalarchives/Catalog-API

Searches use `ancestor.naId` to scope within each selected parent collection, combined via comma (OR).

## Project files

- `index.html` - search UI (FRUS red-buckram aesthetic)
- `app.js` - Catalog API client, workflow classifier, results renderer
- `style.css` - typography and layout
- `README.md` - this file

## License

Code: MIT. Records retrieved are U.S. Government records (public domain).

## Credits

Built for FRUS compilers at the Office of the Historian, U.S. Department of State. Data courtesy of the National Archives and Records Administration.
