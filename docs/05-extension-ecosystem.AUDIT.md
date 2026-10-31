# Extension Ecosystem Audit — tau × kappa (2026-10-31)

> Trigger: architect — "i dont love our extension ecosystem." Audited live:
> loaders, configs, every installed extension/plugin, contract drift.

## 1 · The two ecosystems, as they actually are

### tau — FOUR loading lanes, three naming schemes

| Lane | Mechanism | Count | Examples |
|---|---|---|---|
| **A. config `extensions[]`** | absolute-path `.ts` shim → directory module (per `tau-extension-config-rules`) | 1 registered | `hephaistos-commands.ts` |
| **B. discovery roots** | `~/.tau/extensions/` auto-scan (dirs + top-level shims) via `discovery/tau-extension-roots.ts` + `extensibility/extensions/loader.ts` | 9 modules | airspeak, nemotron, nvidia-nim, strict-bash-guard, tau-hodossync, thresher, vansrouter + shims |
| **C. npm plugins** | `~/.tau/plugins/package.json` + lockfile; **config `disabledExtensions` does NOT apply** (lockfile-only enable/disable) | 9 packages | @damian87/omp, omp-hyper-provider, pi-context-lean, … |
| **D. config `plugins[]`** | product-source plugins (bornite, rhodochrosite, gatehouse, router, barn-browser, barn-gemini) with `privileged` + `merged` provenance | 6+ entries | estate products wired as agent plugins |

Plus **extension settings dirs** (`~/.tau/agent/extensions/<name>/settings.json`) — a THIRD location scheme. Plus `extensibility/` carries FOUR `legacy-*-shim.ts` files (pi→tau era) — the rename debt living in the loader itself.

### kappa — TWO lanes, one shadow lane

| Lane | Mechanism | Count |
|---|---|---|
| **A. config `plugin[]`** | path specs resolved relative to declaring config file (`packages/cli/src/config/plugin.ts`); npm specs normalize via `normalizeLegacyKiloSpec` | 3 registered (lambda-bridge, hephaistos-commands, azurite-mcp) |
| **B. legacy discovery** | `{plugin,plugins}/*.{ts,js}` glob + `LEGACY_DISCOVERY_GLOBS` in the project dir | 0 currently |
| **shadow** | in-tree `extensions/` (kappa-compact, kappa-context, lambda-bridge, hephaistos-commands) — NOT auto-loaded; kappa-compact/kappa-context are referenced nowhere in config | 2 orphaned |

Contract: `Plugin = (input: PluginInput, options?) => Promise<Hooks>` + `PluginModule { id, server, tui? }` — async factory, SDK-typed, `tool()` registrations, `{title, output, metadata}` results.

### Shared substrate (the good news)

- **MCP doctrine is clean on both**: thresher-only gateway (:25127), enforced by comments + `mcp.json.lock`. The 77-upstream federation is the real extension surface.
- **Skills shared**: azurite tree on both (`customDirectories`).

## 2 · The inconsistencies (ranked by pain)

1. **Two incompatible plugin contracts for sibling TUIs.** tau: event-subscription + `pi.registerTool` + TUI renderers (rich). kappa: async factory + `Hooks` + `{title, output, metadata}` (poor). A plugin must be **written twice with different shapes** — proven live today (hephaistos-commands exists in both).
2. **tau's 4 lanes with 3 precedence rules** (config replace vs discovery scan vs lockfile ignore vs product merge). `disabledExtensions` doesn't govern lane C — a trap documented only in a skill.
3. **Naming drift**: tau lanes mix `extensions/`, `plugins/`, `plugins[]`, `extensionHandlers`; kappa mixes `plugin[]`, `extensions/` dir (shadows the config key name!), legacy `plugins/` glob.
4. **Orphaned extensions**: kappa-compact + kappa-context live in-tree, load via NO lane (not in `plugin[]`, not in discovery glob path) — dead weight or broken.
5. **Legacy shims in the loader**: `legacy-pi-config.ts`, `legacy-tau-ai-shim.ts` etc. — pi→tau debt embedded in the extension pipeline itself (AGENTS.md violation: will-use-then-stop / no deprecated leftovers).
6. **No cross-TUI plugin SDK**: nothing lets one package target both (the "half a change is a defect" rule is unenforceable for extensions).

## 3 · Cutover proposal (minimal, boring, no rewrites)

1. **Single convention, both TUIs**: one directory per plugin containing BOTH adapters: `plugin.ts` (kappa contract) + `extension.ts` (tau contract) + `shared.ts` (logic + tool catalog). Config entries point at the dir's adapter shim. Today's hephaistos-commands already split this way — promote the shape to doctrine.
2. **Kill tau lane C's special casing**: fold npm plugins into lane B (discovery roots) or remove them; `disabledExtensions` must govern everything (one switch).
3. **kappa: decide the in-tree extensions/**: either add `extensions/*` auto-discovery (mirror tau lane B) or move kappa-compact/kappa-context into `plugin[]` — no orphans.
4. **Retire the legacy shims** after a 0-caller audit (ffs grep per symbol; LSP on the tau repo checkout) — pi→tau completion, loader edition.
5. **Naming contract** (write into both AGENTS.md): tau = `extensions:` (config) → `~/.tau/extensions/<name>/` (code) → `~/.tau/agent/extensions/<name>/` (settings); kappa = `plugin:` (config) → `extensions/<name>/` (code). One glossary row in CONCEPTS.md each.

## 4 · Immediate actions taken this session

- `hephaistos-commands` shipped as the reference dual-adapter plugin (tau: streaming `_onUpdate` + `registerMessageRenderer`; kappa: lambda-bridge contract) — the shape proposal §3.1 is already real code.
- Audit doc committed; kappa plugin landed at d9fca5e.

## 5 · Verification grade

- Loader behavior: **verified live** (config reads, discovery globs, lockfile behavior from source).
- Inventory: **verified live** (disk + config + lockfile).
- §3 proposals: **specified** (not implemented — owner-call on scope).
