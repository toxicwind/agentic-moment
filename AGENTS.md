# agentic-moment — pen doctrine (authoritative for this namespace)

Thin coordinator pen. Refines, never contradicts, `/home/toxic/AGENTS.md`.

## Core rules

1. **Producer → surface.** `products/audit` harvests/analyzes; `products/site`
   publishes. The audit engine must not import from the site, and the site must
   pin real (committed) fixture data — never live-invented numbers.
2. **Submoduleless.** Products are peer standalone checkouts; never `git submodule
   add`, never gitlinks (mode 160000). Reference-not-owned.
3. **Compare lab fixtures pin REAL runs.** `products/site/compare/fixtures/*.json`
   are outputs of the trio compare engine run against real source. Regenerate,
   don't hand-edit. A fixture that doesn't reproduce from its source is a defect.
4. **Kitchen-sink gitignore.** `*` ignores everything; only the pen's own thin
   metadata + `bin/**` are tracked at pen root. Product checkouts are
   auto-ignored.
5. **Pages opt-in only for `site`.** github.io stays OFF for every other
   product/pen unless explicitly requested (AGENTS.md audit 2026-10-30).

## Adding an analysis fixture

1. Run the trio compare engine across the real candidates:
   `trio compare @fixture.json` (see `products/audit` or trio product docs).
2. Commit the fresh output to `products/site/compare/fixtures/`.
3. Add a short section to `products/site/index.html` linking the comparison.

## Export/rename discipline

When a fork/variant is selected as canonical: vendor the repo wholesale (the
compare lab shows implementations are near-orthogonal — token Jaccard 0.01–0.03
between Android TV MCP candidates), then rename identity, never partially merge
independent engines.