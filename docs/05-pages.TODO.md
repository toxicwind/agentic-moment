# Phase 5 — Pages deploy

Publish the `site` product to GitHub Pages:
`https://toxicwind.github.io/agentic-moment-2026/`.

## Prerequisite

`products/site` maps to the `toxicwind/agentic-moment-2026` repo (already a
Pages-enabled repo, audited 2026-10-30 as one of the 2 opt-in Pages repos).
The report + lab must live together in that repo.

## Tasks

- [ ] Confirm `products/site/report` + `products/site/compare` are committed in
      the `agentic-moment-2026` repo
- [ ] Verify the Pages workflow/build step (repo settings → Pages → branch main)
- [ ] Deploy a build with BOTH report and the android-mcp compare fixture live
- [ ] Confirm `toxicwind.github.io/agentic-moment-2026/compare` renders offline
      (static, no live fetch needed)

## Acceptance

- [ ] `/` = latest report entry
- [ ] `/compare` = the lab with android-mcp fixture loaded
- [ ] `/report/october.html`, `/report/frozen-july.html`, `/report/lost-entries.html`
      all reachable

## Doctrine

Pages is opt-in for `site` ONLY. Do not enable Pages on `audit` or any other
product/pen without explicit request.