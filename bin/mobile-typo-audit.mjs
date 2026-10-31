#!/usr/bin/env node
// mobile-typo-audit.mjs — classify near-miss MOBILE typos by input mechanism.
//
// Self-vocabulary method (no external dictionary bias):
//   - "known-good" = any token the user types >= VOCAB_MIN times across the
//     corpus. This naturally includes every package/command/domain token they
//     spell correctly every time (const, api, grep, src, linux, kodi...).
//   - "typo" = a RARE token (>= TYPO_MIN, < VOCAB_MIN) that is a single edit
//     away from one of the user's OWN high-frequency words. Only your own
//     common words are spell-check targets, so legit code terms never get
//     misflagged as typos.
// Emits a JSON fixture for the agentic-moment typo-audit page. Reproducible.
import { readFileSync, writeFileSync } from "node:fs";
const [, , inFile = "/tmp/tau-user-messages.txt", outFile = "typo-audit.json"] = process.argv;

const TYPO_MIN = 2;   // a genuine typo appears at least this many times
const VOCAB_MIN = 10; // a known-good word the user confidently types

// count every alphabetic token (len>=3)
const hist = new Map();
for (const line of readFileSync(inFile, "utf8").split("\n")) {
  if (!line.startsWith('- "')) continue;
  const t = line.slice(3, -1).toLowerCase().replace(/[^a-z\s]/g, " ");
  for (const w of t.split(/\s+/)) {
    if (!w || w.length < 3) continue;
    hist.set(w, (hist.get(w) || 0) + 1);
  }
}

// vocabulary = tokens the user types confidently (>= VOCAB_MIN)
const VOCAB = new Set();
const DICT_BY_LEN = new Set();
for (const [w, c] of hist) {
  if (c >= VOCAB_MIN) {
    VOCAB.add(w);
    DICT_BY_LEN.add(w.length);
  }
}

// QWERTY adjacency (mobile fat-finger detection)
const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const neighborMap = {};
function neighbors(c) {
  if (neighborMap[c]) return neighborMap[c];
  const s = new Set();
  for (let r = 0; r < ROWS.length; r++) {
    const i = ROWS[r].indexOf(c);
    if (i >= 0) {
      if (i > 0) s.add(ROWS[r][i - 1]);
      if (i < ROWS[r].length - 1) s.add(ROWS[r][i + 1]);
      if (r > 0) s.add(ROWS[r - 1][i]);
      if (r < ROWS.length - 1) s.add(ROWS[r + 1][i]);
    }
  }
  neighborMap[c] = s;
  return s;
}
const A = "abcdefghijklmnopqrstuvwxyz";

/**
 * Distance-1 correction against the user's own vocabulary, with mechanism.
 * Target must be strictly more common than the rare token (min 2x) so a rare
 * but CORRECT word (unload, cmon, deserve) is never flagged as a typo of a
 * vaguely similar common word (onload, cron, reserve).
 */
function correction(w, wCount) {
  const L = w.length;
  if (!DICT_BY_LEN.has(L - 1) && !DICT_BY_LEN.has(L) && !DICT_BY_LEN.has(L + 1)) return null;
  const dominates = (t) => (hist.get(t) || 0) >= wCount * 2 && hist.get(t) >= VOCAB_MIN;
  // substitution → neighbor-key (mobile adjacent) or plain substitution
  for (let i = 0; i < L; i++) {
    const orig = w[i];
    for (const ch of A) {
      if (ch === orig) continue;
      const v = w.slice(0, i) + ch + w.slice(i + 1);
      if (!VOCAB.has(v) || !dominates(v)) continue;
      return { target: v, mechanism: neighbors(orig).has(ch) ? "neighbor-key" : "substitution" };
    }
  }
  // transposition of adjacent letters
  for (let i = 0; i < L - 1; i++) {
    if (w[i] === w[i + 1]) continue;
    const v = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
    if (VOCAB.has(v) && dominates(v)) return { target: v, mechanism: "transposition" };
  }
  // deletion of one char (typo has an extra letter)
  for (let i = 0; i < L; i++) {
    const v = w.slice(0, i) + w.slice(i + 1);
    if (VOCAB.has(v) && dominates(v)) return { target: v, mechanism: "letter-drop" };
  }
  // insertion (typo missing a letter from the target)
  for (let i = 0; i <= L; i++) {
    for (const ch of A) {
      const v = w.slice(0, i) + ch + w.slice(i);
      if (VOCAB.has(v) && dominates(v)) return { target: v, mechanism: "insertion" };
    }
  }
  return null;
}

const hits = [];
for (const [w, c] of hist) {
  if (VOCAB.has(w) || c < TYPO_MIN || c >= VOCAB_MIN || /^(.)\1{2,}$/.test(w)) continue;
  const fix = correction(w, c);
  if (fix) hits.push({ typo: w, target: fix.target, n: c, mechanism: fix.mechanism });
}

const byMech = {};
for (const h of hits) {
  byMech[h.mechanism] ||= { total: 0, top: [] };
  byMech[h.mechanism].total += h.n;
  byMech[h.mechanism].top.push(h);
}
for (const k of Object.keys(byMech)) {
  byMech[k].top = byMech[k].top.sort((a, b) => b.n - a.n).slice(0, 12);
}
const distribution = Object.entries(byMech)
  .map(([mechanism, { total }]) => ({ mechanism, total }))
  .sort((a, b) => b.total - a.total);

const fixture = {
  report: {
    source: "~/.tau/agent/sessions/*.jsonl",
    files: 642,
    userMessages: 42762,
    generatedAt: new Date().toISOString(),
    method:
      "self-vocabulary: vocab = tokens used >=10x (no external dict bias); " +
      `typo = rare token (${TYPO_MIN}..${VOCAB_MIN - 1}x) single-edit from own vocab; ` +
      "mechanism = substitution/neighbor-key/transposition/letter-drop/insertion",
    vocabSize: VOCAB.size,
    hits: hits.length,
  },
  distribution,
  byMechanism: Object.fromEntries(
    Object.entries(byMech).map(([k, { total, top }]) => [k, { total, top }])
  ),
};
writeFileSync(outFile, JSON.stringify(fixture, null, 2));
console.log(JSON.stringify({ vocabSize: VOCAB.size, hits: hits.length, distribution }, null, 2));