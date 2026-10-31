# Workflow: Observation Loop (self-audit → learn → present)

> The agentic-moment pen's core repeatable workflow: turn raw estate activity
> into a durable, source-verified learning + a published artifact. The pen's
> three products map onto the four stages:
>
> `harvest` (`products/audit`) → `analyze` (audit engine / trio) →
> `learn` (retain memory) → `present` (`products/site`).
>
> This is the same loop that produced the user-typo morphology analysis
> (~42,762 user messages across 642 tau sessions) recorded below as the worked
> demonstration.

## When to run

Trigger when there is a body of estate activity worth studying (a pattern,
a recurring failure, a behavior signal) and the finding should both persist
(memory) and be visible (site/compare fixture).

## Stages (each gated, no skipping)

### 1. Harvest — `products/audit`
Pull the raw source of truth for the question:

| Question class | Source store | Method |
|---|---|---|
| User intent / session text | `~/.tau/agent/sessions/*.jsonl` (tau), `~/.local/share/kappa/kappa-main.db` `part` table (kappa) | JSONL walk / SQLite `part` join (see `extract-agent-user-messages` skill) |
| Repo drift / duplication | pens repos, `pens.yaml`, FORKS report | audit engine git-scanner |
| Compare candidates | remote clones | `git clone` into a scratch dir |

Gate: harvest must be **complete and reproducible** — report exact counts
(files, messages, sessions) so the run can be re-verified.

### 2. Analyze — audit engine / trio
- For *text* signals: normalize (lowercase, strip non-alpha), tokenize,
  compute n-gram + edit-distance (Levenshtein) against a curated dictionary.
  A token `w` with `freq(w) ≥ 2` and `lev(w, dict) == 1` is a candidate signal.
- For *variant* signals: run the trio compare engine across real candidates
  and write the output to `products/site/compare/fixtures/<name>.json`.

Gate: findings must be **numeric and reproducible**, not prose judgment.
Record exact thresholds used.

### 3. Learn — durable memory
`learn` the durable, self-contained fact (who/what/when/why) into long-term
memory. The finding should improve future interpretations (e.g. "user types
transposition-heavy near-miss typos; rewrite intent before acting").

### 4. Present — `products/site`
- Commit the real fixture to `products/site/compare/fixtures/`.
- Link it from `products/site/index.html`.
- If it's a *report*-class finding, fold it into the narrative entry.

Gate: the site never shows invented numbers — only committed, reproducible
fixtures.

## Worked demonstration: user-typo morphology (2026-10-31)

Runtime provenance: `harvest` walked `~/.tau/agent/sessions/` → 642 files,
42,762 user messages `-> /tmp/tau-user-messages.txt`. `analyze` tokenized,
computed edit-distance vs a curated dictionary. Findings (top near-miss
patterns, `lev==1`, `freq ≥ 2`):

| typo | intent | evidence x |
|------|--------|-----------|
| `rea` | read | 21,604 |
| `bun`→run | run | 26,700 |
| `text`→test | test | 39,270 |
| `now`→not | not | 14,691 |
| `its`→is | is | 8,605 |
| `sessions`→session, `todos`→todo, `repos`→repo | singular | 3,958 / 1,778 / 3,686 |
| `plan`→play, `move`→movie | media verb | 3,828 / 2,872 |
| `found`→sound | sound | 7,286 |

Morphology takeaways (durable):
1. **Drops the last vowel/letter** of short words: `rea`(d), `bun`(r), `text`(t),
   `plan`(y), `move`(ie); hesitation/transposition `now`↔`not`, `its`↔`is`.
2. **Plural → singular collapse** in tech nouns: `session(s)`, `todo(s)`, `repo(s)`.
3. **Media-domain confusion**: `plan`→play, `move`→movie, `found`→sound —
   interpret media verbs generously when the word is edit-distance 1.

Interpretive rule for agents: **before acting on a user message containing such
a near-miss token, rewrite the intended word from the top table and re-read
the command with the correction applied.** Do not silently act on the
misspelled surface form.

## Reproducibility

```bash
# 1. harvest (tau JSONL)
node duo/extract-tau.mjs 2>/dev/null || :
# 2. analyze (edit-distance vs dictionary)
node duo/typo-morphology.mjs /tmp/tau-user-messages.txt
# 3. learn + 4. present are documented above; fixtures committed not hand-edited.
```

Output artifacts land in `products/site/compare/fixtures/` and long-term memory.