# Phase 4 — Compare lab

The algorithmic variant-comparison showcase (trio compare engine) in the site
product. This is where fork-select decisions get their receipts.

## Current state

- `android-mcp-compare.json` — staged at scaffold (compares us-all /
  martingeidobler / dockndevai; token Jaccard 0.01–0.03 = independent engines)
- `compare.html` + `compare-engine.js` — the interactive lab (must be the
  canonical vendored source, not a stale copy)

## Tasks

- [ ] Regenerate `android-mcp-compare.json` from source (verify reproducible)
- [ ] Confirm `compare-engine.js` is the exact trio engine (hash-match against
      geode trio build if applicable)
- [ ] Wire `compare.html` to load fixtures by name (Android MCP + remy)
- [ ] Add a "fork decision" note for android-mcp to the lab (why us-all won)

## Acceptance

- [ ] Every fixture reproduces byte-for-byte from its source via `trio compare`
- [ ] The lab renders both fixtures without JS errors

## Doctrine

Fixtures are pinned real runs — never hand-edit a compare output. When a fork
is selected as canonical, vendor the repo wholesale (engines are independent),
rename identity, never partially merge.