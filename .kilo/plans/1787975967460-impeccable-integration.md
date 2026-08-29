# Adopt Impeccable (design skill + slop detector) for ScamShield PH

## Goal

Make Impeccable (impeccable.style) usable in this project so the Kilo agent can steer UI work with the `/impeccable` vocabulary and CI can gate AI-slop detectors.

## Verified constraints (research findings)

- Impeccable does **not** officially support Kilo Code. Its installer (`npx impeccable install`) knows providers: claude, cursor, gemini, agents, opencode, kiro, pi, grok, codex, github, etc. — no `.kilo`. There is **zero** "kilo" reference in the upstream repo.
- Kilo Code is Agent-Skills-compatible: project skills load from `.kilo/skills/<name>/SKILL.md` (canonical; legacy `.kilocode/skills/` also read). Frontmatter must have `name` matching the folder and a `description`.
- The Impeccable **design hook** (auto-run detector after edits) will NOT work in Kilo — Kilo uses a plugin system (`tool.execute.after`), not Impeccable's JSON hook manifests. **Accept as out of scope.** Do not attempt `.claude/settings.local.json`-style hooks.
- The standalone detector `impeccable detect <path>` (61 deterministic rules) works independently. npm `impeccable@3.6.0` ships the CLI + jsdom; no API key.
- Node requirement: CLI needs **Node >= 22.18** (project must already run Next.js 16, verify with `node --version` first — if < 22.18, update Node before npm install).
- Project already has a real design system (shadcn token variables + Tailwind v4 in `src/app/globals.css`, Geist fonts, dark mode, i18n). `/impeccable init`/`document` must **preserve** these tokens, not invent new ones.
- `impeccable` will be a devDependency; the `/impeccable` skill bundle will be committed under `.kilo/skills/`.

## Decisions

- Scope: Skill (`/impeccable` commands in Kilo) + CLI detector wired as `lint:design` + GitHub Actions CI step.
- Skill location: **project** `.kilo/skills/impeccable/`, committed to the repo (`.kilo/` is not gitignored today; only `.kilo/plans/` exists).
- Detector wiring: `impeccable@^3.6.0` as devDependency; script `lint:design`: `impeccable detect src/`.
- Baseline pass: yes — run detector over existing UI, fix findings until `lint:design` is green.
- No design-hook emulation in Kilo.

## Steps

1. **Preflight**
   - `node --version` must print `v22.18.x` or newer. If lower, install/update Node first (e.g. via winget/nvm-windows) — `npm install` will silently succeed otherwise and `impeccable` will fail at runtime.
   - `git status` clean; branch `main`.

2. **Install the Kilo skill bundle** (no official Kilo provider, so manual install)
   - Preferred: download the universal bundle and extract the `.kiro/` variant (no hook manifests, Agent-Skills-shaped, matches Kilo's supported frontmatter):
     - `npx --yes impeccable skills install --providers=agents --scope=project --no-hooks` as fallback writes `.agents/skills/impeccable/` — copy it to `.kilo/skills/impeccable/`, then delete the `.agents/` artifact.
     - Or fetch `https://impeccable.style/api/download/bundle/universal` (zip) and copy `.kiro/skills/impeccable/*` -> `.kilo/skills/impeccable/`. If that endpoint 404s, grab the repo dist: `npx --yes github:pbakaus/impeccable` is NOT valid — instead download https://github.com/pbakaus/impeccable/archive/refs/heads/main.tar.gz and use `dist/universal/.kiro/skills/impeccable/`.
   - Verify structure: `.kilo/skills/impeccable/SKILL.md` with frontmatter `name: impeccable` (must equal folder name) + a `reference/` (one `.md` per command) and possibly `scripts/`.
   - Inspect `SKILL.md` for embedded `!`shell` commands and rewrite any that won't run on Windows / are Kilo-hostile to plain markdown instructions. Kilo treats project skills as untrusted: embedded shell commands are not auto-approved — note in AGENTS.md that `!` commands inside the skill require per-command approval.
   - If `scripts/` contains only hook/live-mode/node code not needed for the 23 commands, keep it (harmless); do not wire any hooks.

3. **Wire the detector into lint + dependencies**
   - `package.json`:
     - `devDependencies`: add `"impeccable": "^3.6.0"`.
     - `scripts`: add `"lint:design": "impeccable detect src/"`.
     - `engines`: `"node": ">=22.18"` (documentative; npm won't enforce without engine-strict, that's fine).
   - `npm install`.

4. **Generate design context (one-time, agent-driven)**
   - In a Kilo session (implementation agent), run `/impeccable init` answering for this product:
     - Surface: the tool is an **app/product** (scanner + dashboard), plus a public landing/reports/brand surface.
     - Who: Filipinos (en_PH / fil_PH, per `src/app/layout.tsx`) checking suspicious SMS/email/chat messages, links, and screenshots before acting.
     - Positioning: AI-assisted scam risk assessment; explainable red flags; always verify through official channels.
     - Must preserve: existing shadcn token system in `globals.css`, Geist fonts, dark mode, i18n dictionary keys, PH local content (`src/lib/dataset/ph-scam-messages.ts`), existing navbar/scanner/dashboard component structure.
   - This writes `PRODUCT.md` (+ offers `DESIGN.md`) at repo root and `.impeccable/` config artifacts. If the init interview is skipped, hand-write `PRODUCT.md` and `DESIGN.md` from the bullets above; DESIGN.md should faithfully document the tokens already in `globals.css` (neutral slate `#f8fafc`/`#0f172a` palette, indigo `#4f46e5` chart accent, 0.625rem radius base, Geist SANS/MONO).
   - Commit `PRODUCT.md`, `DESIGN.md`, and shared `.impeccable/` artifacts (config.json, design.json, live/config.json). Do NOT commit screenshots/session state (next step).

5. **.gitignore for impeccable ephemera**
   - Append Impeccable's recommended unanchored block to `.gitignore` (ephemeral `.impeccable/` files: `config.local.json`, `hook.*.json`, `*.png`, `live/sessions|previews|annotations|cache/`, `manual-edit-*`, etc.). Keep tracked: `.impeccable/config.json`, `.impeccable/design.json`, `.impeccable/live/config.json`, `.impeccable/critique/*.md`.

6. **Baseline detector pass (fix findings)**
   - Run `npm run lint:design` (a.k.a. `impeccable detect src/`). Capture the full report.
   - Fix the UI findings in the existing pages/components (landing page `src/app/page.tsx` + `src/components/landing/`, scanner, dashboard, auth, reports pages) while **respecting** the committed design system and i18n keys. Expect the detector to flag common tells (e.g. nested cards, over-rounding, gray-on-color, spacing/line-length) — fix by editing, not by blanket-ignoring. Use inline `<!-- impeccable-disable <rule>: reason -->` only for intentional brand choices, ideally with a comment explaining why.
   - If the detector needs project-level tuning (e.g. a brand color flagged), record in `.impeccable/config.json` under `detector.*` (ignoreRules / ignoreValues), not by weakening the check globally.
   - Re-run until `npm run lint:design` exits 0.
   - Run `npm run build` and `npx tsc --noEmit` (project has tsconfig, no typecheck script — use `npx tsc --noEmit`) and `npm run lint` (eslint) to confirm the baseline pass didn't break anything.

7. **CI wiring** (repo has no `.github/workflows/`)
   - Add `.github/workflows/ci.yml`: `checkout`, `actions/setup-node@v4` with `node-version: 22.x`, `npm ci`, then `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run lint:design`.
   - Optional if the user declines CI: skip this step; keep the local `lint:design` script.

8. **Documentation**
   - Add a short section to `AGENTS.md`: `/impeccable <command>` is available on UI work; run `npm run lint:design` before finishing UI changes; note `!`shell` skill commands need approval; note the design hook does not exist in Kilo (detector is manual/CI).

## Out of scope

- Impeccable design hook / live-mode hooks in Kilo (none supported; would require a custom Kilo plugin via `tool.execute.after`).
- Impeccable "subagent" formats (Claude/Cursor/Grok-specific).
- `/impeccable live` browser iteration (needs a running dev server; may be used opportunistically later).
- Auto-update of the skill bundle (run re-copy manually on new releases).

## Risks

- **Node < 22.18** on this machine → detector crash; gate at step 1.
- **Upstream download endpoints change** → fallback to the GitHub main tarball's `dist/universal/.kiro/` (step 2).
- Skill folder name mismatch (`name:` vs folder) → Kilo won't load it; verify frontmatter (step 2).
- Baseline fixes touching `src/app/globals.css` could fight Tailwind v4 `@theme`/`oklch` syntax — detector supports modern CSS; keep token structure intact.
- Large skill payload inflates the repo — acceptable; keep `.impeccable/` ephemera ignored (step 5).

## Validation

- `node --version` >= 22.18.
- `.kilo/skills/impeccable/SKILL.md` exists, frontmatter `name: impeccable`.
- New Kilo session: `/impeccable` appears in the command picker.
- `npm run lint:design` exits 0 on a clean tree; `npm run build`, `npm run lint`, and `npx tsc --noEmit` pass.
- `git status` shows only intended files (skill bundle, package files, PRODUCT.md, DESIGN.md, .impeccable shared config, .gitignore, AGENTS.md, CI workflow, baseline fixes).