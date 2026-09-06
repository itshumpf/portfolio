#!/usr/bin/env node
/**
 * check-facts.mjs — refuse to publish a stale number.
 *
 * Reads src/data/portfolio_facts.json and audits the built site in dist/.
 * Three checks, in increasing order of how embarrassing the failure is:
 *
 *   1. RETIRED   a figure we have explicitly superseded still appears somewhere.
 *   2. MISSING   a canonical figure is absent from a page that must carry it.
 *   3. CONFLICT  two mutually exclusive figures appear on the SAME rendered page.
 *
 * Check 3 is the one that caught the real bug: /work/nacup said "97 match pages"
 * and "99 match pages" twelve lines apart. Nothing that reads one number at a
 * time would ever have found it.
 *
 * Usage:  npm run build && npm run verify
 * Exit:   0 clean, 1 on any failure.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const FACTS = join(ROOT, 'src', 'data', 'portfolio_facts.json');

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Strip tags so a figure split across markup still matches, and collapse
 *  whitespace so a value broken over two source lines is still found. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

/** Raw text too — hrefs and attributes live here, and a dead repo link is an
 *  attribute, not visible text. */
function rawText(html) {
  return html.replace(/\s+/g, ' ');
}

let facts;
try {
  facts = JSON.parse(readFileSync(FACTS, 'utf8'));
} catch (err) {
  console.error(red(`cannot read ${relative(ROOT, FACTS)}: ${err.message}`));
  process.exit(1);
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(red('dist/ not found — run `npm run build` first.'));
  process.exit(1);
}

const pages = files.map((f) => ({
  path: relative(DIST, f).split(sep).join('/'),
  visible: visibleText(readFileSync(f, 'utf8')),
  raw: rawText(readFileSync(f, 'utf8')),
}));

const failures = [];
const notes = [];

// ---- 1. retired figures must not appear anywhere -------------------------
for (const item of facts.retired ?? []) {
  const hits = pages.filter(
    (p) => p.visible.includes(item.pattern) || p.raw.includes(item.pattern),
  );
  const allowed = new Set(item.allowedOn ?? []);
  const bad = hits.filter((p) => !allowed.has(p.path));
  for (const p of bad) {
    failures.push({
      kind: 'RETIRED',
      detail: `"${item.pattern}" still on /${p.path}`,
      why: item.reason,
    });
  }
}

// ---- 2. canonical figures must appear where they are promised ------------
for (const [key, fact] of Object.entries(facts.facts ?? {})) {
  for (const want of fact.mustAppearOn ?? []) {
    const page = pages.find((p) => p.path === want);
    if (!page) {
      failures.push({
        kind: 'MISSING',
        detail: `${key}: page /${want} was not built`,
        why: 'the fact claims to live on a page that does not exist',
      });
      continue;
    }
    // A figure may legitimately be written several ways in prose — 69,510,186
    // in the body, "69.5M" in a stat block. Any accepted form satisfies the
    // check; the point is that the page carries the fact, not the formatting.
    const forms = [fact.value, ...(fact.alsoAccept ?? [])];
    const found = forms.some(
      (form) => page.visible.includes(form) || page.raw.includes(form),
    );
    if (!found) {
      failures.push({
        kind: 'MISSING',
        detail: `${key} = "${fact.value}" absent from /${want}`,
        why: fact.derivation,
      });
    }
  }
}

// ---- 3. no page may contain two figures that contradict each other -------
for (const group of facts.mutuallyExclusive ?? []) {
  for (const page of pages) {
    const present = group.filter(
      (pat) => page.visible.includes(pat) || page.raw.includes(pat),
    );
    if (present.length > 1) {
      failures.push({
        kind: 'CONFLICT',
        detail: `/${page.path} carries ${present.map((s) => `"${s}"`).join(' and ')}`,
        why: 'these cannot both be true on one page',
      });
    }
  }
}

// ---- unverified figures are reported, never enforced ---------------------
for (const [key, item] of Object.entries(facts.unverified ?? {})) {
  if (key.startsWith('_')) continue;
  notes.push(`${key} = ${item.value} — ${item.problem}`);
}

// ---- report --------------------------------------------------------------
console.log(dim(`checked ${pages.length} pages against ${Object.keys(facts.facts ?? {}).length} facts, ${(facts.retired ?? []).length} retired figures\n`));

if (notes.length) {
  console.log(yellow(`${notes.length} unverified figure${notes.length === 1 ? '' : 's'} on the site (not enforced):`));
  for (const n of notes) console.log(yellow(`  ~ ${n}`));
  console.log('');
}

if (failures.length === 0) {
  console.log(green('facts check passed — no retired figures, no missing canonicals, no self-contradicting pages.'));
  process.exit(0);
}

console.log(red(`facts check FAILED — ${failures.length} problem${failures.length === 1 ? '' : 's'}:\n`));
for (const f of failures) {
  console.log(red(`  [${f.kind}] ${f.detail}`));
  console.log(dim(`           ${f.why}`));
}
console.log('');
process.exit(1);
