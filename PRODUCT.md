# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Filipino adults (en_PH / fil_PH) who receive suspicious SMS, emails, chat messages, or links — often while commuting, on a break, or in a moment of urgency — and need a fast, explainable risk assessment before clicking, replying, or sharing.

Secondary: Consumer-protection advocates and community moderators who curate scam reports and share verified examples.

## Product Purpose

ScamShield PH is an AI-assisted scam risk assessment tool. Users paste text, a URL, or upload a screenshot; the app scores the risk (Low / Medium / High), highlights the specific red flags found, explains why each flag matters, and tells the user what to do next (report, block, verify via official channel). Success means the user avoids the scam, reports it, and returns when another suspicious message arrives.

## Positioning

Unlike generic phishing checkers that only scan URLs, ScamShield PH evaluates the *message content* (SMS/email/chat text) using a blended rule-based + LLM pipeline tuned for Philippine scam patterns (fake promos, fake job offers, bank impersonation, parcel-delivery lures, GCash/PayMaya phishing). The explainable red-flag breakdown is the differentiator — users learn the pattern, not just the verdict.

## Operating Context

- Mobile-first web app (Next.js 16, React 19, Tailwind v4).
- Bilingual UI: English (en_PH) default, Filipino (fil_PH) via i18n dictionary.
- Dark-mode supported; reduced-motion respected.
- Persisted scan history (PostgreSQL, local auth with hashed passwords).
- Public landing page (Persuade mode) → Scanner (Operate mode) → Dashboard/History (Operate mode) → Reports board (Read mode).
- Real PH scam corpus baked in (`src/lib/dataset/ph-scam-messages.ts`) for demo/fallback.

## Capabilities and Constraints

- Text scanner: rule-based signals (brand impersonation, urgency, money asks, suspicious links, KYC requests) + optional LLM scoring.
- URL scanner: heuristic signals + optional Google Safe Browsing reputation check.
- Screenshot scanner: OCR via Tesseract.js (WebAssembly worker) → text pipeline.
- Risk meter: 0–100 score mapped to Low/Medium/High with color-coded badge.
- Reports: authenticated users can submit scam reports with evidence; public read-only board.
- Dashboard: regional/network/category visualizations (Recharts, category donut, risk bars, trend chart, recent scans table).
- i18n: all user-facing copy in `src/lib/i18n/dictionary.ts`; keys must be preserved.
- Design tokens: CSS custom properties in `src/app/globals.css` (slate neutral palette, indigo chart accent, 0.625rem base radius, Geist Sans/Mono).
- Component library: shadcn-style Radix UI primitives (Button, Card, Input, Badge, etc.) in `src/components/ui/`.
- No native mobile wrapper; pure PWA-capable web.
- Accessibility: WCAG AA target; skip link, semantic headings, ARIA labels on icon-only controls.

## Brand Commitments

- Name: **ScamShield PH** (or **ScamShield** when PH context is implicit).
- Tagline: "AI-assisted scam risk assessment for Filipinos".
- Voice: calm, clinical, no hype. Anti-references: purple gradients, glassmorphism, "boost your productivity", marketing fluff.
- Visual identity: no custom logo yet; Geist Sans wordmark.
- Color commitments: danger `#dc2626` (red-600) for high-risk, success `#16a34a` (green-600) for safe actions, warning `#f59e0b` (amber-500) for medium.
- Neutral palette: slate `#f8fafc` / `#0f172a` light/dark backgrounds (already in globals.css).

## Evidence on Hand

- Real PH scam message corpus: `src/lib/dataset/ph-scam-messages.ts` (categories: fake promo, fake job, bank phishing, parcel scam, investment scam, e-wallet phishing).
- Scanner UI components: `src/components/scanner/` (input, mode tabs, progress, report view, risk meter).
- Landing sections: Hero, ScanTypes, HowItWorks, PHExamples, Privacy, CTA (`src/components/landing/`).
- Dashboard widgets: StatCards, RiskBars, CategoryDonut, TrendChart, RegionalIncidentsCard, NetworkBreakdownCard, CorpusInsightsCard, CommunityIntelCard, RecentScansTable.
- Reports board & form: `src/components/reports/`.
- Auth forms: `src/components/auth/`.
- OCR provider: `src/lib/ocr/tesseract-provider.ts` (lazy worker init).

## Product Principles

1. **Explain, don't just judge.** Every risk score comes with a human-readable breakdown of *why*.
2. **Preserve the user's language.** Bilingual (en_PH/fil_PH) is not optional; it's the product.
3. **Clinical over flashy.** No purple gradients, no glassmorphism, no "AI magic" aesthetics. The UI earns trust by looking like a tool, not a toy.
4. **Offline-first mindset.** OCR runs locally (WASM); text rules run client-side; network calls are opt-in (Safe Browsing, LLM).
5. **Actionable next steps.** "Report to NTC", "Block sender", "Verify on official app" — never just "Be careful".

## Accessibility & Inclusion

- WCAG AA minimum (contrast, focus states, touch targets ≥44px).
- Tagalog/English copy parity — no English-only fallbacks.
- Reduced-motion disables non-essential animation (loading spinners preserved).
- Color is never the only signal (icons + text labels on badges, risk meter has text + color).