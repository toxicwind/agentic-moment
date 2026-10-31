# Phase 2 — Site product (surface)

The Pages-publishing surface: **report** (field narrative) + **compare lab**
(trio-compare showcase) co-publish to `toxicwind.github.io/agentic-moment-2026/`.

## Goal

Wire the real report/lab content into `products/site/` as the canonical source,
with fixtures pinned from live trio-compare runs.

## Tasks

- [ ] Vendor the `agentic-oct` report content (index/october/frozen-july/
      lost-entries) into `products/site/report/`
- [ ] Confirm `products/site/compare/compare.html` + `compare-engine.js` are the
      live lab (canonical source)
- [ ] Commit `android-mcp-compare.json` fixture (staged — done at scaffold)
- [ ] Add a one-line entry + link to each fixture from `report/index.html`
- [ ] Verify `compare.html` renders the new android-mcp fixture

## Acceptance

- [ ] `site/report/` mirrors the published narrative
- [ ] `site/compare/fixtures/*.json` all reproduce from their source via trio
- [ ] A fresh `trio compare` run on the android-mcp candidates regenerates the
      committed fixture byte-for-byte

## Ownership

`site` is the publisher only — it never harvests/analyzes (`audit` does).