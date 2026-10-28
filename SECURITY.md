# Security

Sift processes untrusted messages, links, images, and reports. This document describes the implemented boundaries and their limits; it is not a claim that the application has received an independent security audit.

## Reporting a vulnerability

Contact the repository owner privately through an existing trusted channel. If GitHub private vulnerability reporting is enabled, use the repository's Security tab. Do not put credentials, session tokens, or personal scam evidence in a public issue.

## Accounts and sessions

Passwords use scrypt with a random 16-byte salt and a 64-byte derived key. Verification rejects malformed encodings and compares valid keys with `timingSafeEqual`. Session tokens use 32 random bytes; storage contains their SHA-256 hashes.

The session cookie is HTTP-only, SameSite=Lax, and Secure in production, with a 30-day lifetime. Changing a password revokes existing sessions and creates a new session for the current device. Sign-out only updates the client account state after the server confirms success.

Sign-in uses a generic credential error. Sign-up returns a distinct conflict for an existing email address; it therefore reveals account existence.

## Ownership and moderation

Private history is scoped by the server-derived account id in the data layer. Another user's entry and a missing entry return the same not-found result. History and settings pages also check the session on the server.

Community reports are separate from private history. Public queries return approved reports, and submissions are reviewed through a token-protected moderation queue. The queue remains locked when `MODERATION_TOKEN` is absent. The current shared moderator credential does not provide per-user administrator roles or an audit trail.

## Requests and abuse controls

Write routes validate the browser Origin host against the request Host, including its port. Requests without Origin are accepted for non-browser clients. Next.js applies its own origin protection to Server Actions.

JSON body limits check actual UTF-8 byte size in addition to declared length. Rate limits cover sign-in, registration, scans, report submission, and confirmations. Rate-limit keys hash identifying request information.

Configure the reverse proxy to overwrite trusted forwarding headers. The application uses the first `x-forwarded-for` value for rate-limit identity; an untrusted forwarding chain weakens that protection.

## Images and text

Upload routes enforce size limits, accepted MIME types, extensions, and image signatures. SVG and HTML uploads are rejected. OCR inputs and AI responses are treated as data.

React escapes report descriptions, scan evidence, AI summaries, and OCR text. The only raw HTML insertion in the root layout is a static, developer-authored theme-initialization script; it does not interpolate submitted content.

OCR images are processed temporarily. When a signed-in scan is saved, extracted text and its result are retained in that account's history. Community-report screenshots are a separate upload path and can be retained with the report.

## External services

The URL analyzer does not fetch the submitted address, resolve its DNS, or follow redirects. If reputation checks are enabled, the address is sent to the configured provider. Internal-host addresses are excluded from those lookups.

AI analysis is optional. Submitted message content is untrusted input to the configured service, and returned output must pass schema validation. Requests time out and fall back to deterministic rules. These controls reduce risk; they do not make prompt injection or incorrect model output impossible.

OCR uses local Tesseract workers on the server. Language data is downloaded on first extraction and cached; resolving the provider does not start the worker.

## Storage and deployment

With `DATABASE_URL`, accounts, sessions, history, community reports, and rate-limit buckets use PostgreSQL. Queries use parameters, and migrations are run explicitly. Use a database identity with only the runtime permissions it needs.

Remote PostgreSQL connections default to certificate-verified TLS. Explicit connection-string SSL settings are handled by the PostgreSQL driver; configure them intentionally and supply the provider's CA when necessary. Local loopback connections can use the driver's local defaults.

Without `DATABASE_URL`, stores fall back to process-local memory. That state disappears on restart and is not shared between application instances. Configure PostgreSQL before relying on durable accounts, saved history, or shared rate limits in deployment.

Serve the application over HTTPS. The configuration sets content-type sniffing protection, frame restrictions, a referrer policy, a permissions policy, and a limited Content Security Policy. It is not a strict script-src CSP.

Secrets belong in server environment variables. `NEXT_PUBLIC_SITE_URL` is intentionally public; never put a credential in a `NEXT_PUBLIC_*` variable. Local environment files are ignored by Git.

## Verification

`npm test` covers malformed password hashes, password matching, session revocation, cross-user history isolation, request limits, origin checks, rate limits, TLS defaults, and risk thresholds, along with scanner and validation regression suites. Tests use isolated memory stores and mocked OCR contracts.

Run `npm audit` for the installed dependency set. CI rejects high or critical reported advisories. Live database behavior, real OCR recognition, deployment proxy configuration, and external provider security require environment-specific verification.
