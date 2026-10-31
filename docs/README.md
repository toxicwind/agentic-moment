# agentic-moment — pen build plan

> Working plan for standing up the `agentic-moment` pen as a first-class
> namespace. This is a *plan* — each `docs/*.TODO.md` is a tracked sub-plan that
> becomes the task list for its own work phase. Nothing here is done until its
> checklist item is checked off with a commit hash.

## Status

| Phase | File | Status |
|-------|------|--------|
| 1 · Pen scaffold | `docs/01-scaffold.TODO.md` | ✅ init committed (`2544ff4`) |
| 2 · Site product | `docs/02-site.TODO.md` | 🚧 in progress |
| 3 · Audit product | `docs/03-audit.TODO.md` | ⏳ pending |
| 4 · Compare lab | `docs/04-compare-lab.TODO.md` | 🚧 fixture staged |
| 5 · Pages deploy | `docs/05-pages.TODO.md` | ⏳ pending |

## Sub-plans

Each phase owns a file in this directory. They are the source of truth for
that phase's tasks; tick items only when the work is committed and verified.

- `01-scaffold.TODO.md` — pen coordinator structure (done)
- `02-site.TODO.md` — surface product: report + compare lab layout
- `03-audit.TODO.md` — producing engine: harvest + analyze (consolidates the
  duplicated `maximal-estate-agentic-audit` copies)
- `04-compare-lab.TODO.md` — trio-compare fixtures + engine wiring
- `05-pages.TODO.md` — GitHub Pages publish for the site product

## Doctrine reminders

- Submoduleless: products are peer standalone checkouts, never submodules.
- Fixtures pinned real runs (trio compare), never hand-edited.
- Pages opt-in for `site` only.
- Producer → surface: `audit` produces, `site` publishes.