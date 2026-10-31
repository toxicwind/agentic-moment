# Phase 3 — Audit product (producer) — ✅ consolidated 2026-10-31

The harvesting + analysis engine that feeds the report. **Consolidated from the
duplicated `maximal-estate-agentic-audit` copies** (previously in both
`estate/src/` and `barn/src/`) into one canonical home under this pen.

## Done (2026-10-31)

- [x] Engine moved to this product: `src/` (+ package.json, tsconfig, README
      archived as `engine-README.md`) — commit `0ae4d71`
- [x] Repo created + pushed: `toxicwind/agentic-moment-audit-engine`
      (private, default branch **main**; naming per architect:
      "more specific to what it is, integrated as agentic moment product")
- [x] Duplicates retired: `barn/src` commit `aa61b57`, `estate/src` commit
      `81987213ac`; residue dirs removed
- [x] `maximal-audit.sh` repointed: `MAXIMAL_AUDIT_DIR` default →
      `/home/toxic/pens/agentic-moment/products/audit`
- [x] `moments/` tracked in this repo (provenance for the report)
- [ ] Latest `bun run start --all --precheck --parquet` against the real
      estate from the new home (daemon next run validates automatically)

## Why

The engine audits the estate's ~327 repos (from `projects.env`) — git status,
secrets, broken symlinks — exports dataframes/Parquet, and runs agentic
completions. The report's numbers come from here; three copies meant the
numbers could come from anywhere.