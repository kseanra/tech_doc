# Content Log

Tracks every tool or guide added or considered by the scheduled "Add One New
Tool or Guide" task. Newest entries first. Never re-implement anything listed
as `SHIPPED`; when starting a run, prefer the highest-priority `PLANNED` item
over searching for a brand-new idea.

## 2026-09-12 — Deepened all remaining thin tool pages; 6 more error categories (24 total in /errors/)
**Status:** SHIPPED

Two pieces of work in this entry:

**Tool content depth.** The 8 tool pages that predated this remediation
(JSON Formatter, both Base64 tools, both URL tools, JWT Decoder, UUID
Generator, Timestamp Converter) each had only a short one- or two-sentence
prose section. All 8 now carry the same 400+ word treatment as the 5 tools
built out earlier this week — real explanations of the underlying format,
common failure modes, and worked examples, not just a description of the
buttons. Regex Tester already had adequate prose from when it shipped and
was left as-is. No JS or markup outside each `.prose` block changed.

**Errors section**, continuing to prioritise this over new tools per the
audit: 6 more full pages, all new categories:

- `/errors/kubernetes/crashloopbackoff/` — a status, not a cause; finding
  the real error via `kubectl logs --previous` and `describe pod`.
- `/errors/aws/s3-access-denied/` — the four overlapping permission layers
  (IAM, bucket policy, Block Public Access, ACLs) that can each
  independently deny a request, and the cross-account double-consent trap.
- `/errors/mongodb/econnrefused/` — local mongod-not-running vs. the
  Docker service-name networking case (same underlying mechanism as the
  Redis page).
- `/errors/go/imported-and-not-used/` — why Go makes this a hard compile
  error by design, `goimports`, and the blank-identifier side-effect-import
  pattern.
- `/errors/react/too-many-re-renders/` — the classic
  `onClick={setState(x)}` mistake vs. the correct `onClick={() => setState(x)}`,
  plus the subtler unconditional-setter-in-body version.
- `/errors/webpack/module-not-found/` — four causes (typo, case-sensitivity
  on CI, missing extension config, alias defined on only one side).

Errors section is now 24 pages (18 error-solution pages across 15
categories + 2 category indexes + this errors/index.html itself not
counted separately), comfortably inside the 20–30 target range from the
original audit, up from 18 at the start of this entry.

Files touched: new `errors/kubernetes/crashloopbackoff/index.html`,
`errors/aws/s3-access-denied/index.html`,
`errors/mongodb/econnrefused/index.html`,
`errors/go/imported-and-not-used/index.html`,
`errors/react/too-many-re-renders/index.html`,
`errors/webpack/module-not-found/index.html`; edited `errors/index.html`,
`sitemap.xml`, `assets/js/site-search.js`, and the `.prose` section of
`tools/json-formatter/index.html`, `tools/base64-encoder/index.html`,
`tools/base64-decoder/index.html`, `tools/url-encoder/index.html`,
`tools/url-decoder/index.html`, `tools/jwt-decoder/index.html`,
`tools/uuid-generator/index.html`, `tools/timestamp-converter/index.html`.

## 2026-09-12 — 8 more error pages, 2 new category index pages (18 total in /errors/)
**Status:** SHIPPED

Continued growing the errors section (top priority per the AdSense readiness
audit, prioritised over new tools) with 8 new full pages at Git/Docker depth:

- `/errors/git/merge-conflict/` — reading conflict markers, resolving and
  committing, or aborting with `git merge --abort`.
- `/errors/git/detached-head/` — what detached HEAD means, why commits made
  there can become unreachable, recovering via `git reflog` if you already
  switched away.
- `/errors/docker/cannot-connect-to-daemon/` — the three real causes (daemon
  not running, socket permissions, stray `DOCKER_HOST`), covered per OS.
- `/errors/npm/eresolve-dependency-conflict/` (new category) — peer
  dependency conflicts since npm 7, the real fix vs. `--legacy-peer-deps`
  vs. why `--force` is the wrong shortcut here.
- `/errors/postgresql/password-authentication-failed/` (new category) —
  the `pg_hba.conf` peer-vs-password auth trap, plus the Docker
  first-startup-only password variant.
- `/errors/powershell/running-scripts-disabled/` (new category) —
  execution policy levels, `Unblock-File`, and the one-shot `-ExecutionPolicy
  Bypass` alternative to changing the system default.
- `/errors/java/could-not-find-or-load-main-class/` (new category) —
  classpath vs. package-declaration-vs-folder mismatches, not a missing file.
- `/errors/typescript/cannot-find-module-type-declarations/` (new category)
  — TS7016 (missing `@types`) vs. TS2307 (bad path/alias), and why a
  bundler alias needs its own separate config from `tsconfig.json`'s `paths`.

Since Git and Docker now have more than one page each, added real category
index pages — `/errors/git/` and `/errors/docker/` — following the same
pattern guide categories already use, and pointed their breadcrumb "git" /
"docker" segments at these new pages instead of leaving them as plain text
(the earlier fix only removed the incorrect `/errors/` link; this replaces
it with a correct one now that a real target exists). Other single-page
categories (MySQL, .NET, Redis, Node.js, Python, Nginx, and the four new
ones) keep plain-text breadcrumb segments, matching the existing convention
for categories with only one page.

Errors section is now 18 pages (8 error solutions + 2 category indexes,
up from 8 total at the start of this entry), still short of the 20–30
target but a large step closer. Updated `errors/index.html`'s grid
(12 category cards now), `sitemap.xml`, and `SITE_INDEX` in
`site-search.js` accordingly.

Files touched: new `errors/git/merge-conflict/index.html`,
`errors/git/detached-head/index.html`,
`errors/docker/cannot-connect-to-daemon/index.html`,
`errors/npm/eresolve-dependency-conflict/index.html`,
`errors/postgresql/password-authentication-failed/index.html`,
`errors/powershell/running-scripts-disabled/index.html`,
`errors/java/could-not-find-or-load-main-class/index.html`,
`errors/typescript/cannot-find-module-type-declarations/index.html`,
`errors/git/index.html`, `errors/docker/index.html`; edited
`errors/index.html`, `errors/git/fatal-not-a-git-repository/index.html`
(breadcrumb), `errors/docker/container-name-in-use/index.html`
(breadcrumb), `sitemap.xml`, `assets/js/site-search.js`.

## 2026-09-12 — Built out all 5 remaining stub tools; fixed a canonical regression
**Status:** SHIPPED

The five tools that had sat as "coming soon" placeholders since before this
remediation started — a dead end the AdSense readiness audit called out by
name, since every one of them linked back to `/tools/` — are now real,
working, client-side tools:

- `/tools/regex-escape/` — escapes the JS regex metacharacter set (plus an
  optional `/` for regex-literal use), with a worked example of why an
  unescaped `(` silently breaks a literal match.
- `/tools/html-encoder/` — encodes the five HTML-unsafe characters (with an
  optional non-ASCII → numeric-entity mode), and decodes using a detached
  `<textarea>` element rather than parsing into live HTML, so a `<script>`
  in the input is never at risk of executing.
- `/tools/sql-formatter/` — heuristic (not a real parser) clause-based
  formatter: breaks a query onto one line per major clause, indents
  `AND`/`OR`, expands long comma-separated column lists. Prose is upfront
  about what a heuristic formatter can't do (quoted keywords, deep subquery
  nesting).
- `/tools/xml-formatter/` — validates well-formedness with the browser's own
  `DOMParser` first (real parser errors, not guesses), then pretty-prints or
  minifies. Explicitly does not resolve DOCTYPEs/external entities (XXE
  surface) and doesn't claim schema validation.
- `/tools/unix-timestamp/` — deliberately scoped narrower than the existing
  Timestamp Converter: a live-updating "right now" clock (seconds / ms /
  ISO, with Freeze), explaining the seconds-vs-milliseconds mixup as the
  actual reason this page exists alongside the full converter, so the two
  tools don't read as near-duplicates.

Each page follows the `json-formatter`/`base64-encoder` house pattern
(`.tool-panel` / `.tool-actions` / `.tool-error` / `.tool-ok`, copy-to-
clipboard with "copied" feedback) and carries 400+ words of real supporting
content — not just a description of the buttons, but why the underlying
problem exists. Flipped all five cards in `tools/index.html` from
`soon`/disabled to `live`; no `sitemap.xml` or `site-search.js` changes were
needed since both already listed these five URLs from when the placeholder
pages were created.

Also found and fixed a regression while working in this area:
`tools/xml-formatter/index.html`'s canonical tag had reverted to the old
`https://devfixtools.com/tools/xml-formatter/` domain — this file was not
part of the original canonical-fix batch, so something touched it between
runs. Fixed back to `https://www.skservices.co.nz/tools/xml-formatter/`.
Given this is the second file (after an earlier `CONTENT_LOG.md` reset)
found reverted outside of an active editing session, it's worth spot-checking
previously-"done" files periodically rather than assuming a fix stays fixed.

Files touched: new `assets/js/tools/regex-escape.js`, `html-encoder.js`,
`sql-formatter.js`, `xml-formatter.js`, `unix-timestamp.js`; rewrote
`tools/regex-escape/index.html`, `tools/html-encoder/index.html`,
`tools/sql-formatter/index.html`, `tools/xml-formatter/index.html` (also
canonical fix), `tools/unix-timestamp/index.html`; edited `tools/index.html`.

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

No placeholder "coming soon" tool or guide pages remain. Next priority per
the AdSense readiness audit is continuing the errors section buildout
(currently 8 pages, target 20–30) over new tools — see the audit doc for the
full remaining task list.
