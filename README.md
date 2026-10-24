# Sift

Sift helps people in the Philippines assess suspicious messages, links, and screenshots. It explains the warning signs and suggests safe next steps.

## Run locally

Requirements: Node.js 22.18 or newer and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs without external services using its built-in scam examples and in-memory storage. In-memory data is cleared when the server restarts.

## Configuration

Set these in `.env.local` as needed:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL persistence for accounts, sessions, scan history, reports, and rate limits. Run `npm run db:migrate` after configuring it. |
| `AI_API_KEY` | Enables optional AI-assisted message analysis. `AI_BASE_URL` and `AI_MODEL` can select a compatible API and model. |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Enables optional URL reputation checks. |
| `MODERATION_TOKEN` | Private token required to access `/reports/moderation`. Moderation remains locked when this is unset. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata and sitemap generation. |

`.env.local` is ignored by Git. Do not commit credentials.

## Useful commands

```bash
npm run lint
npm run lint:design
npm run build
npm run db:migrate
```

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, PostgreSQL, and Tesseract.js OCR. The interface supports English and Filipino; user-facing translations live in `src/lib/i18n/dictionary.ts`.
