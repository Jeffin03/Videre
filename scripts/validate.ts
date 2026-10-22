/**
 * Curriculum integrity validator for Videre.
 *
 * Catches the failure modes that compile cleanly but break at runtime:
 *  - lessons whose discoveryComponent has no case in LessonViewer's switch
 *    (they render as a silent blank widget)
 *  - malformed/duplicate ids, missing challenge data, empty pedagogy fields
 *  - DevTools-driven lessons without a simulatedTarget (nothing to inspect)
 *  - explanationMarkdown using syntax the hand-rolled renderer can't render
 *  - tracks not assigned to any learning path (invisible in the sidebar)
 *
 * Run: npm run validate   (or: node_modules/.bin/tsx scripts/validate.ts)
 */
import fs from 'node:fs';
import path from 'node:path';
import { ALL_TRACKS, VIDERE_PATHS, getPathLessons } from '../src/data/paths';

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

const EXPECTED_LESSON_COUNT: Record<string, number> = {
  'track-5': 10,
  'track-6': 10,
  'track-7': 10
};

const DIFFICULTIES = new Set(['Beginner', 'Intermediate', 'Advanced']);
const CHALLENGE_TYPES = new Set(['decode', 'tamper', 'inspect', 'idor', 'injection', 'triage']);
const DEVTOOLS_COMPONENTS = new Set(['DevToolsInspection', 'NetworkInspectorDemo', 'SourcesInspectorDemo']);

const nonEmpty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;

/* ── 1. Known discovery components (parsed from the real renderer) ─────── */
const lessonViewerSrc = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/Tracks/LessonViewer.tsx'),
  'utf8'
);
const switchComponents = [...lessonViewerSrc.matchAll(/case '([A-Za-z0-9_]+)':/g)].map(m => m[1]);
const knownComponents = new Set([...switchComponents, ...DEVTOOLS_COMPONENTS]);

/* ── 2. Markdown support check ─────────────────────────────────────────── */
const markdownIssues = (md: string): string[] => {
  const issues: string[] = [];
  if (/\[[^\]]+\]\([^)]+\)/.test(md)) issues.push('markdown links are not supported by the renderer');
  if (/^#{5,}\s/m.test(md)) issues.push('headings deeper than #### are not supported');
  if (/^\s*\|.+\|\s*$/m.test(md)) issues.push('tables are not supported (render as raw text)');
  const fences = (md.match(/```/g) || []).length;
  if (fences % 2 !== 0) issues.push('unbalanced ``` code fences');
  const prose = md
    .replace(/```[\s\S]*?```/g, '')   // fenced code may contain HTML
    .replace(/`[^`]+`/g, '');          // inline code may contain HTML
  const html = prose.match(/<\/?[a-zA-Z][^>]*>/);
  if (html) issues.push(`raw HTML tag ${html[0]} outside code spans`);
  return issues;
};

/* ── 3. Track / lesson checks ──────────────────────────────────────────── */
const trackIds = new Set<string>();
const lessonIds = new Set<string>();
const challengeIds = new Set<string>();

for (const track of ALL_TRACKS) {
  if (trackIds.has(track.id)) err(`duplicate track id "${track.id}"`);
  trackIds.add(track.id);

  if (!nonEmpty(track.title) || !nonEmpty(track.shortDescription)) {
    err(`track "${track.id}" missing title/shortDescription`);
  }
  if (!track.lessons.length) {
    err(`track "${track.id}" has no lessons`);
    continue;
  }

  const expected = EXPECTED_LESSON_COUNT[track.id];
  if (expected !== undefined) {
    if (track.lessons.length === 1) {
      warn(`track "${track.id}" still contains the placeholder stub (expected ${expected} lessons)`);
      continue; // stub content isn't worth deep-checking
    }
    if (track.lessons.length !== expected) {
      err(`track "${track.id}" has ${track.lessons.length} lessons, expected ${expected}`);
    }
  }

  for (const lesson of track.lessons) {
    const label = `${track.id}/${lesson.id}`;

    if (lessonIds.has(lesson.id)) err(`duplicate lesson id "${lesson.id}"`);
    lessonIds.add(lesson.id);
    if (lesson.trackId !== track.id) err(`${label}: trackId "${lesson.trackId}" doesn't match track`);
    if (!lesson.number.startsWith(`${track.number}.`)) {
      err(`${label}: lesson number "${lesson.number}" should start with "${track.number}."`);
    }

    for (const field of ['title', 'tagline', 'mentalModelConcept', 'discoveryPrompt', 'devTakeaway', 'securityTakeaway'] as const) {
      if (!nonEmpty(lesson[field])) err(`${label}: empty ${field}`);
    }
    if (lesson.estimatedMinutes < 1 || lesson.estimatedMinutes > 60) {
      err(`${label}: estimatedMinutes ${lesson.estimatedMinutes} out of range 1–60`);
    }
    if (!DIFFICULTIES.has(lesson.difficulty)) err(`${label}: invalid difficulty "${lesson.difficulty}"`);
    if (!Array.isArray(lesson.noticeThisMoments) || lesson.noticeThisMoments.length < 2) {
      err(`${label}: needs at least 2 noticeThisMoments`);
    }
    if (lesson.noticeThisMoments?.some(m => !nonEmpty(m))) {
      err(`${label}: empty noticeThisMoments entry`);
    }

    // Discovery widget must exist somewhere, or it silently renders null
    if (!knownComponents.has(lesson.discoveryComponent)) {
      err(
        `${label}: discoveryComponent "${lesson.discoveryComponent}" has no case in LessonViewer ` +
        `and is not a DevTools component — it will render as a blank widget. ` +
        `Known: ${[...knownComponents].join(', ')}`
      );
    }
    if (DEVTOOLS_COMPONENTS.has(lesson.discoveryComponent) && !lesson.simulatedTarget) {
      err(`${label}: DevTools-driven lesson requires a simulatedTarget`);
    }

    // simulatedTarget shape
    if (lesson.simulatedTarget) {
      const t = lesson.simulatedTarget;
      for (const field of ['appName', 'targetUrl', 'description', 'htmlSource'] as const) {
        if (!nonEmpty(t[field])) err(`${label}: simulatedTarget.${field} empty`);
      }
      if (!Array.isArray(t.storageItems)) err(`${label}: simulatedTarget.storageItems must be an array`);
      if (!Array.isArray(t.networkRequests)) err(`${label}: simulatedTarget.networkRequests must be an array`);
      t.storageItems?.forEach((s, i) => {
        if (!nonEmpty(s.key) || !nonEmpty(s.value)) err(`${label}: storageItems[${i}] missing key/value`);
        if (!['localStorage', 'cookie'].includes(s.type)) err(`${label}: storageItems[${i}] bad type "${s.type}"`);
      });
      t.networkRequests?.forEach((r, i) => {
        if (!nonEmpty(r.url) || !nonEmpty(r.method) || typeof r.status !== 'number') {
          err(`${label}: networkRequests[${i}] malformed`);
        }
      });
    }

    // Challenge
    const c = lesson.challenge;
    if (!c) { err(`${label}: missing challenge`); continue; }
    if (challengeIds.has(c.id)) err(`duplicate challenge id "${c.id}"`);
    challengeIds.add(c.id);
    if (!c.id.startsWith('chal-')) err(`${label}: challenge id "${c.id}" should start with "chal-"`);
    if (!CHALLENGE_TYPES.has(c.type)) err(`${label}: invalid challenge type "${c.type}"`);
    for (const field of ['prompt', 'successMessage', 'explanation'] as const) {
      if (!nonEmpty(c[field])) err(`${label}: challenge.${field} empty`);
    }
    if (c.solution === undefined) err(`${label}: challenge has no solution`);
    if (typeof c.solution === 'string' && !nonEmpty(c.solution)) err(`${label}: empty string solution`);
    if (typeof c.solution === 'function') {
      // A function solution runs against whatever the learner types; if it
      // accepts an empty answer, the challenge is a silent auto-pass.
      try {
        if (Boolean(c.solution(''))) err(`${label}: function solution accepts an EMPTY answer`);
        else if (Boolean(c.solution('   '))) err(`${label}: function solution accepts whitespace-only answer`);
        else if (Boolean(c.solution('zzq garbage answer xyzzy'))) {
          err(`${label}: function solution accepts arbitrary garbage`);
        }
      } catch (e) {
        err(`${label}: function solution throws on plain string input — ${e}`);
      }
    }
    if (c.targetHint !== undefined && !nonEmpty(c.targetHint)) warn(`${label}: empty targetHint`);

    // Explanation renderer support
    if (!nonEmpty(lesson.explanationMarkdown)) {
      err(`${label}: empty explanationMarkdown`);
    } else {
      for (const issue of markdownIssues(lesson.explanationMarkdown)) {
        err(`${label}: explanationMarkdown — ${issue}`);
      }
      if (!/^###\s/m.test(lesson.explanationMarkdown)) {
        warn(`${label}: explanationMarkdown has no ### sections`);
      }
    }
  }
}

/* ── 4. Path integrity ─────────────────────────────────────────────────── */
const pathNumbers = new Set<number>();
const assignedTracks = new Map<string, number>();

for (const p of VIDERE_PATHS) {
  const label = `path "${p.id}"`;
  if (pathNumbers.has(p.number)) err(`${label}: duplicate path number ${p.number}`);
  pathNumbers.add(p.number);
  for (const field of ['title', 'shortName', 'tagline', 'colorAccent', 'iconName'] as const) {
    if (!nonEmpty(p[field])) err(`${label}: empty ${field}`);
  }
  if (!p.trackIds.length) err(`${label}: no trackIds`);
  for (const tid of p.trackIds) {
    if (!trackIds.has(tid)) err(`${label}: references unknown track "${tid}"`);
    assignedTracks.set(tid, (assignedTracks.get(tid) || 0) + 1);
  }
  if (!getPathLessons(p).length) err(`${label}: resolves to 0 lessons`);
}

for (const track of ALL_TRACKS) {
  const n = assignedTracks.get(track.id) || 0;
  if (n === 0) err(`track "${track.id}" belongs to no learning path (invisible in sidebar/navbar)`);
  if (n > 1) err(`track "${track.id}" belongs to ${n} paths (must be exactly 1)`);
}

/* ── 5. Report ─────────────────────────────────────────────────────────── */
const totalLessons = ALL_TRACKS.reduce((n, t) => n + t.lessons.length, 0);

for (const w of warnings) console.warn(`  ⚠  ${w}`);
for (const e of errors) console.error(`  ✗  ${e}`);

console.log(
  `\n  paths: ${VIDERE_PATHS.length} | tracks: ${ALL_TRACKS.length} | lessons: ${totalLessons} | ` +
  `components: ${switchComponents.length} switch + ${DEVTOOLS_COMPONENTS.size} devtools`
);

if (errors.length) {
  console.error(`\n  FAILED — ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  process.exit(1);
} else {
  console.log(`  PASSED — 0 errors, ${warnings.length} warning(s)\n`);
}
