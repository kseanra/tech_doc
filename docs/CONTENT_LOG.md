# Content Log

Tracks every tool or guide added or considered by the scheduled "Add One New
Tool or Guide" task. Newest entries first. Never re-implement anything listed
as `SHIPPED`; when starting a run, prefer the highest-priority `PLANNED` item
over searching for a brand-new idea.

## 2026-09-09 — Regex Tester (tool)
**Status:** SHIPPED

`/tools/regex-tester/` existed only as a "coming soon" placeholder — it was
already registered as `popular:true` in `window.SITE_INDEX`, already in
`sitemap.xml`, and already had a disabled "soon" card in `tools/index.html`.
Implemented the real tool: a pattern field with toggleable flags (`g` `i` `m`
`s` `u`), a live-updating highlighted view of the test string, and a match
list showing each match's index, text, numbered capture groups and named
groups. Includes a "Copy matches (JSON)" action.

Matching runs inside a Web Worker (source built from
`Function.prototype.toString()` so the matching logic isn't duplicated) with
a 1.5s timeout that terminates the worker and shows an error if a pattern is
still running — the standard defense against catastrophic backtracking
(e.g. `(a+)+$`), since a synchronous regex call can't otherwise be
interrupted from the same thread. Falls back to synchronous evaluation if
`Worker` is unavailable. A global search is also capped at 2000 matches so a
pattern like `a*` against a huge string can't balloon the DOM or hang the tab.

Flipped the card in `tools/index.html` from `soon`/`disabled` to `live`,
added it to the homepage's Popular tools grid, and broadened its
`site-search.js` keywords. No `sitemap.xml` change was needed — the URL was
already listed from when the placeholder page was created.

Files touched: `tools/regex-tester/index.html` (rewritten), new
`assets/js/tools/regex-tester.js`, `tools/index.html`, `index.html`,
`assets/js/site-search.js`, `assets/css/main.css`.

## Backlog — PLANNED

These already have a placeholder "coming soon" page and a `SITE_INDEX` /
`sitemap.xml` entry from earlier work. Pick the highest-priority one next
rather than searching for a brand-new idea:

- **Regex Escape** (`/tools/regex-escape/`) — escape special characters so a
  literal string is safe to drop inside a regex.
- **HTML Encoder** (`/tools/html-encoder/`) — encode/decode HTML entities.
- **SQL Formatter** (`/tools/sql-formatter/`) — pretty-print a SQL query.
- **XML Formatter** (`/tools/xml-formatter/`) — format and validate XML
  documents.
- **Unix Timestamp** (`/tools/unix-timestamp/`) — a quick "current
  timestamp" lookup, distinct from the existing bidirectional Timestamp
  Converter.
