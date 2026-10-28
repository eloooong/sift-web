# Architecture

Sift is a Next.js App Router application. Pages render on the server by default; forms and interactive controls use client components. The API and persistence layers run on Node.js.

## Message and screenshot analysis

1. The client submits text or an image to a scan route.
2. The route checks origin, request limits, and input validity.
3. Screenshot requests validate the image before Tesseract extracts text.
4. The text pipeline runs deterministic scam signals and classification.
5. If configured, AI analysis contributes a validated explanation. Failures fall back to rule-based analysis.
6. A signed-in user's completed result is recorded under their server-derived identity.
7. The client renders the result and the evidence behind it.

The OCR provider is created on demand. The worker starts only when extraction is requested and is then reused by that server process. Merely resolving a provider or running validation tests does not download language data or start a worker.

The browser shows an indeterminate pending state. It does not claim individual server stages have completed without receiving that information.

## URL analysis

The URL analyzer parses the submitted address and derives structural signals. It does not fetch the target, resolve its DNS, or follow its redirects. Optional reputation checks send the address to the configured provider; internal-host addresses are excluded from those outbound lookups.

## Identity and storage

Passwords use salted scrypt hashes. Session cookies hold opaque tokens; storage uses token hashes. Pages and routes resolve the current account from that cookie. The history store scopes every list, read, and deletion by that user id.

With `DATABASE_URL`, stores use PostgreSQL and parameterized queries. Without it, they use process-local memory for development. That fallback does not provide durable accounts or shared rate limits across instances.

Migrations are applied explicitly with `npm run db:migrate`; application startup does not alter the schema.

## Reports and insights

Community submissions are separate from private scan history. Reports are moderated before they appear in the public feed. Moderator access requires the configured private token.

Reading the feed never inserts sample submissions. New stores start empty. Existing rows from earlier versions are not removed automatically.

The insights page presents research aggregates and labeled example rows. Its data must not be described as a visitor's activity or live national incident counts.

## Interface state

Language and theme are local browser preferences. Theme initialization runs before page content paints, then client subscriptions synchronize preference changes. Account state remains server-authoritative even though the header reflects it client-side.

Illustrative examples on the homepage are demonstrations, not live scans. Their transitions and risk bars do not represent network progress.

## Verification boundaries

The default test command exercises deterministic scanners, validation, authentication and ownership behavior in isolated memory stores. It never connects to a developer's database or calls optional AI/reputation services. Live PostgreSQL migrations, real OCR recognition, and external provider behavior need separate environment-specific verification.
