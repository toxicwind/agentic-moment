# agentic-moment — pen

The Agentic Moment is now a **pen** (open namespace), not a single product. It
holds the documentation-and-analysis stack around autonomous AI structures.

## Why a pen

The old `toxicwind/agentic-moment-2026` repo fused three things that move at
different cadences and belong to different layers:

| layer | concern | cadence |
|-------|---------|---------|
| **report** | the source-verified field narrative | monthly (july, october…) |
| **compare lab** | trio-compare engine showcase + fixtures | per-analysis |
| **audit engine** | harvest + analyze the data that feeds the report | continuous |

Splitting them lets the producing engine (audit) and the publishing surface
(report + lab) live independently while co-publishing to one Pages site.

## Structure (submoduleless)

```
pens/agentic-moment/
├── AGENTS.md
├── README.md
└── products/
    ├── site/      # the Pages surface: report + compare lab (co-publish)
    └── audit/     # the producing engine (harvest + analyze)
```

Products are peer standalone checkouts under the pen — referenced-not-owned,
never submodules. Each product keeps its own `AGENTS.md` refining this file.

## Repo mapping

| pen path | upstream repo |
|----------|---------------|
| `products/site` | `toxicwind/agentic-moment-2026` (Pages) |
| `products/audit` | (new) harvesting/analysis engine — consolidates the old
  `maximal-estate-agentic-audit` copies from estate+partition branches |

## GitHub Pages

Pages stays opt-in for this pen only (`site` publishes to
`toxicwind.github.io/agentic-moment-2026/`). Do not enable Pages on new
products unless deliberately asked.