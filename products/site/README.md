# agentic-moment / site — the Pages surface

The publishing half of the agentic-moment pen: the **report** (field narrative)
+ the **compare lab** (trio-compare showcase) co-published to GitHub Pages.

Repo: `toxicwind/agentic-moment-2026` → https://toxicwind.github.io/agentic-moment-2026/

## Layout

```
site/
├── report/                  # field narrative
│   ├── index.html           # current entry (october)
│   ├── october.html         # october entry
│   ├── july.md              # july source
│   ├── frozen-july.html     # re-annotated july
│   └── lost-entries.html    # missing-month accounting
└── compare/                 # compare lab
    ├── compare.html         # the interactive compare page
    ├── compare-engine.js    # trio compare engine (inlined/vendored)
    └── fixtures/
        ├── remy-compare.json        # raemon/chat-route variants
        └── android-mcp-compare.json # Android TV MCP candidates (2026-10-31)
```

## Rules

- **Fixtures are pinned real runs.** Regenerate via the trio compare engine
  (`compare` in `/home/toxic/pens/geode/products/trio`); never hand-write.
- **Report + lab publish together** — they are one Pages unit. Do not split
  them into separate repos; the layout above is intentional.
- Every fixture gets a one-line entry + link from `index.html` (see doctrine
  "Adding an analysis fixture").