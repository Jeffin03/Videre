# AGENTS.md

## What this repo actually is

A client-only Vite + React 19 + Tailwind v4 SPA: an interactive security-literacy curriculum ("Videre").
Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`. No backend, no auth, no router.

**The README's Stack / Getting Started / Contributing sections are aspirational, not current.**
They describe Next.js, MDX lessons in `/content`, Supabase, and Vercel. None of that exists.
The real stack is the one in `package.json` + `vite.config.ts`; trust those over the README.

## Commands

- Install: `bun install` (repo lockfile is `bun.lock`; do not create/commit a `package-lock.json`).
  Plain `npm install` **fails** with ERESOLVE (root `esbuild@^0.25` conflicts with vite 8's
  peerOptional `esbuild@^0.27||^0.28`). If you must use npm: `npm install --legacy-peer-deps`.
- Dev server: `bun run dev` — Vite on port 3000, binds `0.0.0.0`.
- Type check: `bun run lint` — this is just `tsc --noEmit`. No ESLint, Prettier, or unit-test
  suite exists. It currently passes — keep it that way. (If `bun` isn't on PATH:
  `node_modules/.bin/tsc --noEmit`.)
- Content check: `npm run validate` (runs `tsx scripts/validate.ts`) — validates the whole
  curriculum: unique ids, required lesson fields, `discoveryComponent` values that actually
  exist in `LessonViewer`'s switch, DevTools lessons having a `simulatedTarget`, supported
  `explanationMarkdown` syntax only, path/track wiring, and challenge solutions that don't
  accept empty/garbage answers. Run it after ANY content or widget edit.
- Build: `bun run build`.

## Architecture facts that are not obvious

- **The app is organized into 4 learning paths** (`LearningPath` in `src/types/index.ts`,
  data in `src/data/paths.ts`): Foundations (tracks 1–4), GRC (track 5), SOC (track 6),
  Bug Bounty (track 7). `VIDERE_PATHS` + `ALL_TRACKS` there drive the navbar path switcher
  and the path-grouped sidebar; `getPathForTrack` / `getPathTracks` / `getPathLessons`
  helpers live in the same file.
- **Lesson content lives in four data files**: `src/data/tracks.ts` (Foundations,
  `VIDERE_TRACKS`), `src/data/trackGrc.ts` (`GRC_TRACKS`), `src/data/trackSoc.ts`
  (`SOC_TRACKS`), `src/data/trackBugBounty.ts` (`BUGBOUNTY_TRACKS`) — 43 lessons total.
  There are no MDX files. Wiki copy is in `src/data/wiki.ts`.
- **`explanationMarkdown` is a misleading name.** It is rendered via `dangerouslySetInnerHTML`
  by `renderExplanationMarkdown()` in **`src/utils/markdown.ts`** (shared by `LessonViewer`
  and the AskVidere AI panel).
  Supported syntaxes: `###`, `####`, `**bold**`, `*italic*`, `` `code` ``,
  `>` blockquotes at line start, `-`/`*` bullet lists, `1.` numbered lists, and ```
  fenced code blocks. Links, tables, headings deeper than `####`, and raw HTML render as
  raw literal text. `npm run validate` enforces this.
- **Adding an interactive widget takes 3 coordinated edits:**
  1. Create the component in `src/components/InteractiveWidgets/` accepting an
     `onComplete?: () => void` prop (calling it awards points + confetti).
  2. Add a `case` for its name in `renderDiscoveryWidget()`'s switch in `LessonViewer.tsx`.
     Unmatched `discoveryComponent` strings silently render `null` — no error, just a blank
     widget (the validator catches this).
  3. Set `discoveryComponent` on the lesson in its data file to that exact string.
  There are now 16 widget cases (10 original + `AlertTriageDemo`, `LogHuntDemo`,
  `ScopeCheckDemo`, `RaceConditionLab`, `RiskRegisterDemo`, `ControlGapAuditDemo`).
- **DevTools-driven lessons intentionally have no widget.** Lessons with
  `discoveryComponent` of `DevToolsInspection`, `NetworkInspectorDemo`, or `SourcesInspectorDemo`
  fall through the switch to `null` by design; they are solved through the SimulatedDevTools
  panel, which renders `lesson.simulatedTarget` (fake HTML source, storage items, network log).
  Their challenge is completed by typing the answer into the Phase-3 text form (string or
  function `solution` in data — no other wiring needed). The `onStorageChange` / `onDomTamper`
  handlers in `src/App.tsx` are an *additional* interactive completion path that exists only
  for `chal-1-3` and `chal-1-4`; copy that pattern only if a new DevTools challenge should
  also be solvable by editing the fake DOM/storage itself.
- **Challenge answer checking** (in `LessonViewer.tsx`): string `solution` is compared
  case-insensitively after trimming; a function `solution` receives the raw input string
  (never an object). The validator asserts solutions reject empty/whitespace/garbage input.
- **Keyboard shortcuts** (wired in `App.tsx`): F12 toggles the simulated DevTools panel;
  Escape closes the topmost overlay (Ask Videre → Toolkit → Reports → Wiki → DevTools).
- **PWA**: `public/manifest.webmanifest` + `public/icons/*.svg` (standard & maskable) are
  copied to `dist/` verbatim; `public/sw.js` is a network-first offline shell (bump its
  `CACHE` constant to force-refresh clients). It is registered **only in production** by
  `src/main.tsx` (`import.meta.env.PROD`) so it never fights Vite HMR in dev.
- **AI mentor ("Ask Videre")**: `src/components/AI/AskVidere.tsx` + `src/utils/groq.ts`
  (raw fetch to Groq's chat-completions API — no SDK, single-turn, `max_tokens` capped).
  Key resolution: localStorage `videre_groq_config` (set via the panel) else the
  `VITE_GROQ_API_KEY` / `VITE_GROQ_MODEL` env vars (must be `VITE_`-prefixed or Vite
  hides them). The system prompt grounds answers in the current lesson and is built by
  `buildSystemPrompt()` — it intentionally excludes challenge solutions.

## State & persistence

- All progress lives in `localStorage` under `videre_progress` and `videre_reports`,
  managed by `src/context/ProgressContext.tsx` (React context; `useProgress()` hook).
  Submitted reports are displayed in `src/components/Reports/ReportsModal.tsx`
  (navbar "Reports" button + footer "My Reports").
- `.env.example` (`GEMINI_API_KEY`, `APP_URL`) and `metadata.json`
  (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) indicate this targets Google AI Studio hosting
  with a server-side Gemini integration that is **not built yet**. `express`, `dotenv`, and
  `esbuild` are declared dependencies but currently unused, and `npm run clean` deletes a
  `server.js` that doesn't exist. Don't wire up a server unless the task explicitly asks.

## Misc gotchas

- `vite.config.ts` disables HMR/file-watching when `DISABLE_HMR=true` (AI Studio agent edits).
  Leave that block alone.
- Path alias `@` maps to the repo root (see `vite.config.ts` + `tsconfig.json` `paths`).
- Tailwind v4 via `@tailwindcss/vite`: there is no `tailwind.config.*`. The whole color
  scheme is centralized in the `@theme` block of `src/index.css`, which overrides the standard
  slate/cyan/emerald/amber/rose/purple ramps with the site's tame palette (including gap
  fillers like `amber-600`/`emerald-700`/`rose-600`, plus non-default `slate-850` /
  `emerald-850` shades that components reference — those would otherwise fall back to the
  bright default Tailwind colors or render nothing). Restyle the site there, not
  per-component; components use plain Tailwind color names (no dynamic/interpolated classes).
- **Theme-derived font utilities must be declared in `@theme`, not `:root`**: `--font-display`
  lives in `@theme` so Tailwind generates `.font-display`. A `--font-*` var declared only in
  `:root` exists as a CSS variable but its utility class is never generated.
- The `animate-in fade-in` classes used by modals/drawers are defined locally in
  `src/index.css` (tw-animate-css is **not** a dependency).
- Fonts load from Google Fonts in `index.html` (Fira Code, Plus Jakarta Sans, Space Grotesk).
