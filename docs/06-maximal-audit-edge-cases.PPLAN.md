# PPLAN — maximal-audit edge cases, emergent moments, and the skopos-keeper real-world test

**Date:** 2026-11-01
**Owner:** tau
**Status:** live — every listed edge case is either test-pinned (28 tests, 94.63% line coverage) or scheduled for real-world verification via the skopos keeper.

## 0. Scope and contract

This PPLAN covers the audit engine (`pens/agentic-moment/products/audit`), the
emergent-moments index it publishes (`moments/index.jsonl` + `moments/*.md`),
and the real-world execution surface used to prove both: the skopos browser
keeper (`pens/olympus/products/skopos`, CDP `127.0.0.1:25233`, headed Chromium
on DISPLAY `:99`).

Ground rules carried from the audit engine:
- Tests pin **real behavior** of the current implementation — never an
  invented "should" contract.
- Conjecture is labelled `[CONJECTURE]`; verified fact is labelled
  `[VERIFIED]`.
- The compare lab sites must pin real committed fixture data, never
  live-invented numbers (agentic-moment AGENTS.md rule 1).

## 1. Audit-engine edge-case inventory [VERIFIED — test-pinned]

Source modules: `src/index.ts`, `src/local-audit.ts`,
`src/modules/{parser,precheck,git-scanner,secrets-scanner,dataframe,autofix,parquet,completions,constants,types}.ts`.

| # | Edge case | Contract (real behavior) | Test |
|---|-----------|--------------------------|------|
| 1 | `parseProjectsEnvSync` with no `projects.env` | Falls back to `[PROJECTS_DIR, ESTATE_DIR, ...expandDir(RANCH_DIR)]` and warns | `parser` suite |
| 2 | `parseProjectsEnvSync` with `KEY=value` lines | Splits on `=`, takes `value.split(":")[0]`, skips blank/comment lines | `reads projects.env if it exists` |
| 3 | `expandDir` on unreadable dir | Returns `[dir]` (the dir itself) — the 230-repo ranch expands 1 level, hidden entries filtered | covered by fallback tests |
| 4 | `scanDirSync` on a real `.git` dir | Emits a git record with `remoteUrl:"no remote"`, `branch:"detached"`, symlink scan | `scans a directory with a git repo` |
| 5 | `scanDirSync` on a `.git` **file** (worktree/submodule) | `statSync().isDirectory()` false → treated as non-git, `status:"no-git"` | `treats .git file (worktree-style) as non-git` |
| 6 | `scanDirSync` on a non-existent path | Emits a **record** (`status:"no-git"`) — not `[]` | `handles non-existent directory` |
| 7 | `scanDirSync` on a non-directory file | Emits a record (`status:"no-git"`) — the readdir catch is not reached | `skips non-directory entries` |
| 8 | `scanSymlinksSync` broken vs valid links | `readlinkSync` + `accessSync`; broken ⇒ `{broken:true, exists:false}` | `classifies broken vs valid symlinks` |
| 9 | `scanSymlinksSync` unreadable dir | Returns `[]` (outer catch) | `returns empty symlink list for unreadable dir` |
| 10 | `scanSecrets` on real key/value file | `exists`, `size`, `credentials` = array of **key strings** (`key.trim()`), comment/blank lines excluded | `scans secrets file for credentials` |
| 11 | `scanSecrets` with missing file | `exists:false`, `credentials:[]`, backups still probed | `returns empty when file missing` |
| 12 | `scanSecrets` with backups present | `backups[]` entries `{path,exists,size}` for each backup path | `detects secret backups` |
| 13 | `getSecretsRecord` | Fixed record: name `.secrets`, `status:"protected"`, `message:"First-class credential store"`, `commit:"N/A"` | `creates locks and data for getSecretsRecord` |
| 14 | `autoFix` with broken symlink that fails to unlink | Returns `Failed to remove <path>: <error>` and does not throw | `removes broken symlinks` |
| 15 | `autoFix` with healthy symlinks | Returns `[]` | `skips non-broken symlinks` |
| 16 | `toDataFrame` nullish remote/branch | Coerces `undefined` → `""` per column | `handles null remote/branch gracefully` |
| 17 | `toDataFrame` empty result | Returns parallel arrays of length 0 | `handles empty result` |
| 18 | `exportParquet` round-trip | Writes a real parquet file, binary length > 0, schema UTF8/BOOLEAN | `parquet` suite |
| 19 | `analyzeWithCompletions` server down | Rejects (`Completions API error: <status>`), never hangs | `throws on unreachable server` |
| 20 | Dead code | `runGitAsync` (Promise executor + git subprocess) was **never invoked** — deleted | removed in `79102e0` |
| 21 | `preCheck` with estate ghost absent | `✗ ESTATE_DIR not found` branch — the estate lease must stay enforced | `reports checks for existing and missing paths` |
| 22 | `preCheck`/`localAudit` on missing scan roots | Records flagged `status:"missing"`; `localAudit` never throws | via `src/local-audit.ts` path |

Coverage clock: 94.63% lines, 100% funcs, 28 pass / 0 fail
(commit `79102e0`, before the PPLAN docs landed).

## 2. Emergent moments edge-case inventory [VERIFIED — source]

| # | Edge case | Contract |
|---|-----------|----------|
| 1 | `index.jsonl` duplicate entries | Entries are append-only rows; consumers must tolerate duplicates but the index is curated chronologically (rewritten once on corruption, see 2026-11-01 nuvio moment incident where the edit tool duplicated rows) |
| 2 | `index.jsonl` malformed JSON line | Row is skipped by parsers; file must not be rewritten destructively by an editor |
| 3 | Moment file missing on disk but indexed | Index references a file that was moved/deleted — a defect to surface, not silently ignore |
| 4 | Moment file present but not indexed | A moment that never landed in `index.jsonl` — the site is generated from the index, so this is a publish gap |
| 5 | Tag shape drift | Tags are free-form strings; site filters by tag — do not assume a fixed tag enum |
| 6 | Timestamp ordering | Newest-first convention; reruns on the same day use time-suffixed filenames (`20261101-<slug>.md`) |

Planned tests (land with the index-validation task):
- `index.jsonl` parses: every line is valid JSON with `ts`, `file`, `title`, `tags`.
- Every `indexed.file` exists on disk (`{moments,retrospectives}/`).
- Every `*.md` in `moments/` is referenced by the index (unless README/license).

## 3. webOS localStorage quota / double-stringify [VERIFIED in source, live device]

Ground truth from `pens/ranch/products/nuvio-default/webos-app/js/`:

- `core/storage/localStore.js`: two real backends proven on device —
  `localStorage` (~5 MB) and `IndexedDB` (~48 MB, separate quota pool).
  The module comment explicitly calls out that "*the doubling pushed
  uxTracker's queue to ~2x*" — the historic double-stringify defect
  (Anomaly 5 in the nuvio session archaeology).
- `core/ux/uxTracker.js`: the telemetry queue is now **memory-only**
  (`MAX_QUEUE = 400`, in-memory byte budget, `purgeLegacyLocalStorage()`)
  and flushed through the companion's `uxLog` lane — telemetry never
  touches localStorage. This is the fix that kills the 
  QuotaExceededError-on-every-write failure mode (Anomaly 6).

Edge cases still open on the live device (labelled, not fixed here):
- `localStorage.setItem` throwing mid `LocalStore` write — callers must
  never deadlock UI (state freeze risk).
- IndexedDB persist failure with the browser in private/cleared mode —
  the `~48MB` pool is per-origin and cleared with site data.
- 5 MB wall on a single large key (32 KB+ row) — spill policy is a
  design decision, documented in the nuvio session archaeology moment
  (L4 eMMC / L5 PC NVMe bridge remains `[CONJECTURE]` — no service
  handler ships yet).

## 4. skopos-keeper real-world test plan [schedule]

Target: `pens/olympus/products/skopos` — headed Chromium keeper on DISPLAY
`:99`, CDP `127.0.0.1:25233`, ready `:25236`, supervisor in
`src/keeper/{browser,status,supervisor}.ts`, thin entry `bin/keeper.ts`.
`bin/skopos.ts` exposes `status|open|watch|daemon|failover`; `watch` is the
hot-reload path.

Execution matrix (each row = a real-world pass, output + exit code captured):

| # | Step | Prove | Pass criteria |
|---|------|-------|---------------|
| 1 | `bun bin/skopos.ts status` (or `daemon`) | Keeper up; CDP alive | `state:"up"`, `cdp: http://127.0.0.1:25233` |
| 2 | Run `bun run src/index.ts --all --precheck --parquet` in audit repo | maximal-audit real run | exit 0; parquet written; `Found N projects` in output |
| 3 | Open the compare lab (`products/site/compare/index.html`) in the keeper | Browser renders the site | CDP `Page.navigate` → `document.title` and DOM contains the nuvio moment link |
| 4 | `skopos watch` hot-reload: touch `moments/*.md` | Watcher rebuilds | Rebuild log entry; CDP reload; new moment visible without manual navigation |
| 5 | Screenshot via keeper CDP | Visual proof | PNG captured to a committed proof path |
| 6 | Kill + relaunch keeper | Supervisor | New chromium pid, CDP back up, no port steal (`state:"waiting"` if another owns it) |

Tooling: `cd` into `pens/olympus/products/skopos`; use `bun run ...` or the
`bin/*.ts` entries. No `find`/`head` in the pipeline — full outputs land in
files under `out/`.

## 5. Sequencing (already in motion)

1. ✅ Coverage suite: 28 tests, 94.63% lines (commit `79102e0`).
2. ✅ Moments index + nuvio archaeology moment: `3273f89`.
3. ⏳ Index-validation tests (`index.jsonl` shape, file-exists, reverse
   lookup) — land with this PPLAN commit.
4. ⏳ Real-world keeper runs (section 4 matrix) — output and proofs to
   `out/` and the compare fixtures.
5. ⏳ Fixture pin: published compare numbers must reproduce from committed
   fixtures — regenerate, never hand-edit (agentic-moment rule 3).

## 6. Open decisions (recorded, not resolved here)

- L4/L5 storage bridge for LocalStore (`[CONJECTURE]`) — no service handler
  is shipped; requires explicit architecture sign-off before any
  `luna://space.nuvio.webos.service/kv` code lands.
- Whether `index.jsonl` should be regenerated from `moments/` on build or
  remain manually curated — current behaviour is manual-append, and the
  2026-11-01 corruption incident argues for an idempotent generator.