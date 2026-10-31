#!/usr/bin/env node
/**
 * typo-morphology.mjs — codified Analyse stage of the agentic-moment
 * Observation Loop. Reads extracted user-message text (one msg per line,
 * JSON `- "<text>"` lines as written by the harvest walker) and reports
 * near-miss typos: tokens freq>=minFreq with Levenshtein distance exactly 1
 * from a curated common-word dictionary.
 *
 * Usage:
 *   node typo-morphology.mjs <user-messages.txt> [minFreq]
 */
import { readFileSync } from "node:fs";

const [, , file = "/tmp/tau-user-messages.txt", minLine = 2] = process.argv;
const minFreq = Number(minLine) || 2;

const DICT = new Set(
	("the and for you are your what is it to of in on this that with do does did " +
		"not have has was were can could would should about there they them then tune time " +
		"sound play movie fix todo repo session kodi build run test read plan found its " +
		"text bun git now one real dir docs add when fork tests any end own where sessions " +
		"pid repos two chat these runs move cat ghas note ares top here doc wire our too don " +
		"pre than scan got built ran todos isn dots kit net ref hot had way int rest red watch " +
		"check status health port docker ssh adb video audio file files box listener listeners")
		.split(" "),
);

function lev(a, b) {
	const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
	for (let i = 0; i <= a.length; i++) dp[i][0] = i;
	for (let j = 0; j <= b.length; j++) dp[0][j] = j;
	for (let i = 1; i <= a.length; i++)
		for (let j = 1; j <= b.length; j++)
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
	return dp[a.length][b.length];
}

const hist = new Map();
for (const line of readFileSync(file, "utf8").split("\n")) {
	if (!line.startsWith('- "')) continue;
	const text = line.slice(3, -1).toLowerCase().replace(/[^a-z\s]/g, " ");
	for (const w of text.split(/\s+/)) {
		if (!w || w.length < 3) continue;
		hist.set(w, (hist.get(w) || 0) + 1);
	}
}

const dictArr = [...DICT];
const hits = [];
for (const [w, c] of hist) {
	if (DICT.has(w) || /^(.)\1{2,}$/.test(w) || c < minFreq) continue;
	const best = dictArr
		.map((d) => [lev(w, d), d])
		.sort((a, b) => a[0] - b[0])[0];
	if (best && best[0] === 1) hits.push([w, best[1], c]);
}
hits.sort((a, b) => b[2] - a[2]);
for (const [w, d] of hits) console.log(`${w}\t->\t${d}\tx${hist.get(w)}`);