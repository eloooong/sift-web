# Security Notes — ScamShield PH

This document summarizes the security posture of ScamShield PH and the
specific measures taken in each area. It is aimed at reviewers and future
maintainers.

## Threat model in one line

ScamShield PH accepts **fully untrusted input from anonymous users**
(scam messages, screenshots, URLs, community reports) and shows that input
back to other users, so every trust boundary is treated as hostile.

## Authentication

- Hand-rolled credential auth (no third-party dependency):
  - Passwords hashed with **scrypt** (64-byte derived key, per-user random
    salt) and compared with `timingSafeEqual`
    (`src/lib/auth/passwords.ts`).
  - Session tokens are 32 random bytes (CSPRNG); the database stores only a
    SHA-256 hash of the token, so a store leak cannot be replayed as a login.
  - Session cookie: `httpOnly`, `SameSite=Lax`, `Secure` in production,
    30-day expiry (`src/lib/auth/session.ts`).
- Sign-in returns one generic `invalid_credentials` error for unknown email
  and wrong password alike (no account enumeration on sign-in).
- Password change requires the current password, **revokes every existing
  session**, then issues a fresh cookie for the current device only.
- Known trade-off: sign-up returns `409 email_taken`, which does reveal that
  an account exists. This is deliberate — the sign-in page uses it to route
  people to "sign in instead" instead of failing silently.

## Authorization

- Every read/write of user data derives the user id **only** from the
  verified session cookie; clients never send identifiers that the server
  trusts.
- Scan history ownership is enforced inside the data layer
  (`getUserHistoryEntry`, `deleteUserHistoryEntry`,
  `deleteAllUserHistory`) and again at each API/page boundary. Another
  user's entry and a nonexistent entry return the identical `404`, so ids
  cannot be probed.
- Protected pages (`/history`, `/settings`) guard server-side via RSC
  redirects — never by hiding UI on the client.
- The moderation queue is gated by a shared `MODERATION_TOKEN`; production
  deployments must set a strong value (the default is dev-only).

## CSRF / origin protection

- All state-changing API routes (`POST`/`PATCH`/`DELETE`) validate the
  `Origin` header against the `Host` header
  (`requestSameOrigin` in `src/lib/http/guards.ts`) in addition to
  `SameSite=Lax` cookies.
- Requests without an `Origin` header (curl, server-to-server) are allowed;
  browsers always send `Origin` on cross-site writes, which is the only
  case CSRF applies to.
- Moderation actions run through Next.js Server Actions, which perform
  their own origin verification.

## API routes

- **Input validation** everywhere: emails, password length, display names,
  message length (5,000 chars), URL length + protocol allowlist
  (`http`/`https` only), report fields, dates (bounded to the past 3 years).
- **Request size limits**: all JSON bodies are read through
  `readJsonBody(request, maxBytes)` which enforces a declared
  `Content-Length` precheck *and* a hard cap on the buffered body
  (`src/lib/http/guards.ts`). Multipart upload routes reject oversized
  requests *before* parsing the body into memory.
- **Rate limiting** (in-memory sliding window, keyed by hashed IP+UA or
  token — never persisted):

  | Endpoint | Limit |
  | --- | --- |
  | Text scan | 8 / minute / client |
  | Screenshot scan | 5 / minute / client |
  | URL scan | 15 / minute / client |
  | Report submit | 3 / 15 minutes / client (+ honeypot field) |
  | Confirmations | 20 / minute / anon token |
  | Sign-up | 5 / 15 minutes / IP |
  | Sign-in | 10 / 10 minutes / IP+email |
  | Password change | 5 / 10 minutes / IP |

- **Error handling**: handlers catch broadly, log details server-side with a
  route prefix, and return generic, user-friendly JSON errors. Stack traces
  and internal messages never reach the client. Rate-limited responses
  include `Retry-After`.

## File uploads

Two upload paths exist: screenshot OCR scanning and optional report
screenshots. Both apply layered validation, never trusting the client:

1. **Size** — enforced before buffering where possible (5 MB OCR /
   2 MB reports), plus a whole-request `Content-Length` precheck.
2. **Declared MIME type** — rejected if not in the allowlist (PNG/JPEG/WebP).
   A mismatch between the declared type and the actual bytes is rejected.
3. **File extension** — validated against an allowlist when present, and
   cross-checked against the detected format (a real PNG named `.txt` → 415).
4. **Magic bytes** — the authoritative check: content is sniffed with
   `detectImageType`. SVG is not accepted anywhere.
5. Screenshots are re-emitted only as `data:image/png|jpeg|webp` base64 URLs
   generated server-side from the sniffed format, so no attacker-controlled
   MIME/HTML can end up in an `<img src>`.

## AI endpoints (prompt injection & abuse)

The analyzed message is **untrusted data**, never instructions:

- Message text is fenced inside triple-quote delimiters and capped
  (5,000 chars input, ~5,000 chars prompt clip).
- The system prompt (`src/lib/ai/prompt.ts`) explicitly instructs the model:
  ignore embedded instructions ("ignore previous instructions",
  role changes, output-format overrides), never reveal the system prompt,
  never execute or follow links/code found in the message — and to treat
  manipulation attempts themselves as scam red flags.
- Output is constrained to a single JSON object
  (`response_format: json_object`, strict schema parse, capped at
  `max_tokens: 900`), so model output can only ever become report text that
  React escapes — it is never rendered as HTML or executed.
- Cost controls: short timeout with abort (20s), deterministic fallback to
  the rules engine when the AI is unavailable, plus the rate limits above.

## URL scanning (SSRF)

The scanner **never talks to the target**: no fetch, DNS resolution,
redirect following, or socket to the analyzed host. See the security note in
`src/app/api/analyze/url/route.ts` and `analyzeUrl` in
`src/lib/url-analyzer/index.ts`.

- Protocol allowlist (`http`/`https`) rejects `javascript:`, `data:`,
  `file:` etc. before parsing.
- Internal hosts (`localhost`, `127.0.0.0/8`, RFC1918, CGNAT, link-local
  incl. cloud-metadata `169.254.169.254`, IPv6 loopback/ULA/link-local,
  `.local`/`.internal`/`.home.arpa`) are recognized by
  `src/lib/url-analyzer/internal-hosts.ts`.
- URLs pointing at internal hosts are **never sent to the reputation
  provider** — the external lookup is skipped so internal hostnames/IPs
  never leave the server (`isInternalHostname` gate in `analyzeUrl`).
- The single outbound call goes to a fixed Google Safe Browsing endpoint
  with the URL strictly as request-body data.

## Data storage ("database")

There is currently **no database**; users, sessions, history, and reports
live in in-memory stores on `globalThis` (single-process demo scope).

When persistence is added:

- Use parameterized/prepared statements exclusively (or an ORM/query
  builder that does); string-concatenated SQL must fail review.
- Keep authorization checks in the data layer (as done today) so queries
  are scoped by user id at the source.
- Connect with a least-privilege account (no DDL rights at runtime).

## Secrets

- All secrets live in environment variables read **only** in server modules
  (`AI_API_KEY`, `GOOGLE_SAFE_BROWSING_API_KEY`, `OCR_*`, `MODERATION_TOKEN`);
  secret-bearing modules import `server-only` so bundling them into client
  code fails the build.
- No `NEXT_PUBLIC_*` variables exist, so nothing sensitive is exposed to the
  browser bundle.
- `.env*` files are git-ignored; `.env.example` contains placeholders only.
  A repo-wide secret-pattern scan (`gsk_…`, `sk-…`, AWS `AKIA…`) comes back
  clean for tracked files.
- Rate-limit keys hash IP+UA before storage; session tokens are stored
  hashed; raw credentials/tokens are never logged.

## Transport & headers

Production must serve over HTTPS (cookies are already flagged `Secure`).
The app sets these headers globally (`next.config.ts`):

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`
  (clickjacking defense)
- CSP `base-uri 'self'; form-action 'self'; object-src 'none'`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

All rendered user content flows through React's JSX escaping (no
`dangerouslySetInnerHTML` anywhere), which neutralizes stored XSS from
scam descriptions, sender handles, AI summaries, and OCR text.

## Residual limitations (by design, demo scope)

- In-memory stores mean restart wipes accounts/history and limits do not
  scale horizontally; multi-instance deployments need shared storage.
- `x-forwarded-for` is trusted for rate limiting; behind a proxy, configure
  the platform to overwrite (not append to) this header.
- The moderation token is a shared secret; per-user admin accounts would be
  the next step.
