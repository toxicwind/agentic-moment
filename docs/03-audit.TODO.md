# Phase 3 — Audit product (producer)

The harvesting + analysis engine that feeds the report. **Consolidates the
duplicated `maximal-estate-agentic-audit` copies** (currently in both
`estate/src/` and `barn/src/`) into one canonical home under this pen.

## Why

The engine audits the estate's ~327 repos (from `projects.env`) — git status,
secrets, broken symlinks — exports dataframes/Parquet, and runs agentic
completions via `:25100`. The report's numbers are drawn from it. Two copies
existed; the pen gives it one home.

## Tasks

- [ ] Move `maximal-estate-agentic-audit` source into `products/audit/`
- [ ] Remove the duplicate copies (estate/src AND barn/src) after confirming
      zero consumers reference them (TDD: search `lsp references` / ffs callers)
- [ ] Ensure `bun test tests/` green in the new home
- [ ] Wire the `:25100` completions path + `projects.env` source location
- [ ] Commit + push `audit` as its own repo: `toxicwind/agentic-moment-audit`
      (or estate-mesh/audit, per owner call)
- [ ] Document the run contract in `products/audit/README.md`

## Acceptance

- [ ] Exactly one copy of the audit engine exists (this product)
- [ ] No dangling imports in the removed copies
- [ ] A full audit run against the real estate produces output

## Owner call needed

Repo naming for `audit` (agentic-moment-audit vs estate audit namespace) is an
architect decision — ask before creating the remote.