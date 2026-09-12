# Content Log

Tracks every tool or guide added or considered by the scheduled "Add One New
Tool or Guide" task. Newest entries first. Never re-implement anything listed
as `SHIPPED`; when starting a run, prefer the highest-priority `PLANNED` item
over searching for a brand-new idea.

## 2026-09-12 — Node.js, Python, Nginx error pages
**Status:** SHIPPED

Continued growing the errors section (top priority per the AdSense readiness
audit — "real error strings people search for verbatim," prioritised over
new tools) with three more full pages at Git/Docker depth, in three brand
new categories:

- `/errors/node/eaddrinuse-port-already-in-use/` — EADDRINUSE, covering
  orphaned dev-server processes, finding/killing whatever holds the port on
  both Unix and Windows, and the case where a spawned child survives its
  parent being killed.
- `/errors/python/modulenotfounderror/` — ModuleNotFoundError, covering the
  "wrong Python/pip pair" cause (the actual root cause most of the time),
  venv activation, and import-name-vs-package-name mismatches.
- `/errors/nginx/502-bad-gateway/` — 502 Bad Gateway, covering reading the
  nginx error log first, common upstream/socket-permission causes, and the
  502-vs-504 distinction (a `proxy_read_timeout` bump fixes one, not the
  other).

Added three new category cards to `errors/index.html` (Node.js, Python,
Nginx), `sitemap.xml` entries, and `SITE_INDEX` entries in `site-search.js`.
Errors section is now 8 pages, up from 2 at the start of this remediation
— still short of the 20–30 target, more categories to follow.

Files touched: new `errors/node/eaddrinuse-port-already-in-use/index.html`,
`errors/python/modulenotfounderror/index.html`,
`errors/nginx/502-bad-gateway/index.html`; edited `errors/index.html`,
`sitemap.xml`, `assets/js/site-search.js`.

## 2026-09-12 — Deepened Markdown, Docker, and CSS guides; fixed CLI truncation bug
**Status:** SHIPPED

Markdown and Docker guide categories had exactly one card each — an
effectively empty page to a crawler. Expanded both to 4 cards:

- Markdown: kept the syntax table, added `gfm-extras.md` (task lists,
  strikethrough, footnotes — and where they don't render), `common-mistakes.md`
  (the three reasons Markdown "doesn't render right": missing blank lines,
  under-indented nesting, single-newline line breaks), and
  `links-and-references.md` (reference-style links).
- Docker: kept `docker-basics.sh`, added `docker-volumes.sh` (bind mounts vs
  named volumes, why data disappears without one), `docker-compose-basics.yml`
  (service-name networking — the same mechanism that fixes the Redis
  ECONNREFUSED error page), and `docker-cleanup.sh` (prune/disk space, and
  what `-a --volumes` actually removes).

CSS went from 3 to 5 cards (added `clamp-responsive.css` and
`container-queries.css`) and all three original card descriptions were
expanded from one sentence to real "when/why" explanations. JavaScript and
Python descriptions were similarly deepened (no new cards).

Also fixed a real bug in `guides/cli/index.html`: two card descriptions were
cut off mid-sentence with a literal `[...]` and an unclosed `<code>` tag —
rewrote both to complete sentences.

Updated the `<span class="count">` sidebar figures across all 7 guide pages,
the category cards on `guides/index.html`, and the homepage guides preview to
match the new per-category card counts (css 5, markdown 4, docker 4;
javascript/python/api/cli unchanged in count). Homepage's "Fix an error"
preview also gained the new MySQL error page as a third example.

Files touched: `guides/css/index.html`, `guides/markdown/index.html`,
`guides/docker/index.html`, `guides/javascript/index.html`,
`guides/python/index.html`, `guides/cli/index.html`, `guides/api/index.html`
(sidebar counts only), `guides/index.html`, `index.html`.

## 2026-09-12 — MySQL, .NET, Redis error pages
**Status:** SHIPPED

The `/errors/` grid had three disabled "soon" cards (MySQL, .NET, Redis) whose
`href` looped back to `/errors/` itself — a dead end that was also flagged in
the AdSense readiness audit as unfinished/under-construction content. Wrote
three full error pages at the same depth as the existing Git and Docker
pages (the error, why it happens, how to fix it, plus one deeper "related"
section each):

- `/errors/mysql/access-denied-for-user/` — ERROR 1045, including the
  `user`@`host` account model and the `localhost` (socket) vs `127.0.0.1`
  (TCP) auth trap.
- `/errors/dotnet/could-not-load-file-or-assembly/` — FileNotFoundException,
  covering restore/output-folder causes, binding redirects, and reading the
  Fusion log instead of guessing.
- `/errors/redis/connection-refused/` — ECONNREFUSED, including the Docker
  networking trap (`127.0.0.1` inside vs outside a container).

Flipped all three cards in `errors/index.html` from `soon`/disabled to
`live`, added `sitemap.xml` entries, and added `SITE_INDEX` entries in
`site-search.js`. Also removed the redundant `/errors/` link on the category
breadcrumb segment (`git`, `docker`, and the three new categories) — it
duplicated the `errors` crumb one step to its left and pointed nowhere new.

Files touched: new `errors/mysql/access-denied-for-user/index.html`,
`errors/dotnet/could-not-load-file-or-assembly/index.html`,
`errors/redis/connection-refused/index.html`; edited `errors/index.html`,
`errors/git/fatal-not-a-git-repository/index.html`,
`errors/docker/container-name-in-use/index.html`, `sitemap.xml`,
`assets/js/site-search.js`, `about/index.html` (named S&K Services Ltd as
operator, matching Privacy/Terms/Contact).

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
