# Phase 5 — Fleet/OSS consolidation into agentic-moment

> Scope per architect (2026-10-31): agentic-moment is the new home for the
> swarm / NIM / micro-agent family. Everything below is registry-and-checkout
> ground truth from the estate sweep (indexed in argos `sweep-digest`).

## Family inventory (theme → products)

From `.meta-themes.yaml` (corral-orchestration + nim themes):

| theme | products (repos) | status |
|---|---|---|
| corral-orchestration | corral, emergent, doorbell, bridge, cron-trust, mission-control, fanout, stream-broker, session-bus-refresh, oracle | fanout has a local checkout (`ranch/fanout`); rest are GitHub-first-party |
| nim | nvidia-alive, nvidia-kernel-guard, nvidia-nim-model-probe | registry-only; no local checkouts |
| models/herd | rig herd (`rig agent list` = 60 agents), NIM router (:25193) | live substrate; rig daemon is `[daemons.rig]` |

## Move plan (pairs-first, referenced-not-owned)

1. Register rename pairs (pairs machinery is MISSING — `geode/products/pairs`
   is an empty dir; re-create it or use argo's deterministic sweep script).
2. Clone each GitHub-first-party repo into `agentic-moment/products/<name>`;
   symlink entrypoints into `~/.local/bin`; regenerate manifest (pens.yaml +
   products.registry.json) — `manifest-gen.py` / `bin-verify.sh` gate.
3. Cut pitchfork refs: ranch/fanout → agentic-moment home; NIM probes move
   with the nim theme.
4. Verify `git check-ignore -q` per product (kitchen-sink doctrine) and
   `bin-verify.sh` 0 FAIL.
5. Update this pen's README member table + `docs/02-fleet.TODO.md` checkboxes
   with commit hashes.

## Open items

- [ ] pairs machinery: recreate `geode/products/pairs` (sources/, maps/, bin/pairs-apply.py)
- [ ] fanout checkout move + symlink + manifest regen
- [ ] nim trio: clone nvidia-alive / nvidia-kernel-guard / nvidia-nim-model-probe
- [ ] corral/oracle-family clones (10 repos)
- [ ] rig herd: document hephaistos-summoned micro-agents (naming: argos-family)
- [ ] argos skill + registry manifests updated for the rename (in progress)