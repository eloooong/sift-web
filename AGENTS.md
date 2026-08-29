<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:impeccable-design -->

# Impeccable design skill

[Impeccable](https://impeccable.style) is set up here as a Kilo Code skill plus a CI design linter.

- **Agent commands:** the `/impeccable` skill lives at `.kilo/skills/impeccable/` (pinned commands: `/impeccable init`, `/polish`, `/audit`, `/critique`, `/distill`, `/document`, etc.). Use it for UI/UX work. It reads `PRODUCT.md` (strategy) and `DESIGN.md` (visual system) before editing; never overwrite those files without asking.
- **Design lint gate:** `npm run lint:design` runs `impeccable detect src/` (61 deterministic anti-pattern rules, no API key). It runs in CI and must stay green. Re-run it after any UI change.
- **Project constraints the skill must respect:** the design system is the shadcn token set in `src/app/globals.css` (neutral slate palette, Geist Sans/Mono, 6.25px base radius, flat-by-default — no box-shadows). Bilingual copy lives in `src/lib/i18n/dictionary.ts`; preserve i18n keys. No purple gradients, glassmorphism, or "AI magic" aesthetics.
- **No design hook in Kilo:** Impeccable's auto-run detector hook is not wired (Kilo uses a plugin system, not Impeccable's hook manifests). Detection is manual/CI only.
- **Skill patching:** Impeccable has no official Kilo provider; the bundle was copied from the upstream `.agents` build into `.kilo/skills/impeccable/` and its hardcoded `.agents/skills/impeccable` script paths were re-pointed to `.kilo/skills/impeccable`. Re-apply that path rewrite if you ever refresh the bundle.

<!-- END:impeccable-design -->

