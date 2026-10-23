---
name: Sift
description: Clinical, trust-building UI for AI-assisted scam risk assessment — pale slate neutrals, Geist type, rounded cards, functional red/amber/green risk colors.
colors:
  background: "#f8fafc"
  foreground: "#0f172a"
  card: "#ffffff"
  primary: "#0f172a"
  secondary: "#f1f5f9"
  muted: "#f1f5f9"
  muted-foreground: "#64748b"
  border: "#e2e8f0"
  input: "#cbd5e1"
  ring: "#94a3b8"
  danger: "#dc2626"
  success: "#16a34a"
  warning: "#f59e0b"
  risk-meter: "#f97316"
  chart-1: "#4f46e5"
  chart-2: "#f59e0b"
  chart-3: "#0ea5e9"
  chart-4: "#8b5cf6"
  chart-5: "#dc2626"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "54.4px"
    fontWeight: 700
    lineHeight: 1.1
  h1:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.25
  h2:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  caption-sm:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
  micro:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.6
  nano:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.5
  chart-label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "8px"
    fontWeight: 400
    lineHeight: 1.4
  logo-wordmark:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.2
  button:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "12.8px"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    lineHeight: 1.6
  mono-sm:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "10px"
    lineHeight: 1.6
  mono-xs:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "9px"
    lineHeight: 1.5
rounded:
  sm: "3.906px"
  md: "5px"
  lg: "6.25px"
  xl: "8.75px"
  2xl: "11.25px"
  3xl: "13.75px"
  4xl: "16.25px"
  pill: "9999px"
  badge: "9999px"
spacing:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
---

# Design System: Sift

## Overview

**Creative North Star: "The Clinical Watchtower"**

A restrained, function-first system built for trust. Sift looks like a tool — not a toy — because trust is the product. Every visual choice prioritises clarity, scannability, and calm authority. The palette is almost entirely neutral, with colour reserved exclusively for semantic risk signals (danger/amber/success) and data visualisation. There are no decorative gradients, no glassmorphism, no purple "AI magic" aesthetics. The system earns credibility through plainness: pale slate surfaces, crisp borders, generous whitespace, and Geist's modern, engineered letterforms.

**Key Characteristics:**
- Near-monochrome neutral palette with functional colour reserves
- Geist Sans + Geist Mono pairing (modern, engineered, high legibility)
- Moderate border radius (6.25px base) — neither sharp nor bubbly
- Tonal elevation via border + card contrast, not shadows
- Risk colour system: red (#dc2626) / amber (#f59e0b) / green (#16a34a) — never decorative
- Dark mode uses OKLCH perceptually uniform surfaces, not colour-inverted light mode

## Colors

A deliberately quiet palette; colour carries semantic meaning, never decoration.

### Primary

- **Near-Black** (#0f172a): Foreground text, primary button backgrounds, navigation text. The dominant text colour on light backgrounds.
- **Slate White** (#f8fafc): Page background. A faintly cool white that avoids pure-white glare.

### Neutral

- **Snow** (#ffffff): Card and popover surfaces, elevated above the background by border + subtle tonal shift.
- **Ice** (#f1f5f9): Secondary/muted/accent backgrounds (cards, badges, secondary buttons). A barely-there grey.
- **Silver** (#cbd5e1): Input borders, disabled states.
- **Slate** (#e2e8f0): Default borders and dividers.
- **Nickel** (#64748b): Muted/secondary text (captions, timestamps, placeholder copy).
- **Iron** (#94a3b8): Focus rings.

### Semantic

- **Danger Red** (#dc2626): High-risk badges, error states, scam severity indicators, destructive actions. High contrast against both light (#f8fafc) and dark backgrounds.
- **Safety Green** (#16a34a): Low-risk/safe indicators, success states, verified badges.
- **Caution Amber** (#f59e0b): Medium-risk indicators, pending states, warning callouts.
- **Risk Orange** (#f97316): Used by the risk-meter gradient scale (transitions from green → amber → orange → red along the 0–100 score). A data-viz colour, not a decorative accent.
- **Indigo** (#4f46e5): Primary data-viz colour (chart-1). Used sparingly in charts and the brand logo context.

### Named Rules

**The Colour Reserve Rule.** The semantic triad (red/amber/green) and the chart palette are the only colours that break the neutral field. Never use them for decoration, hover effects, or decorative accents outside data visualisation and risk badges.

## Typography

**Display / Body:** Geist (system-ui, sans-serif)
**Monospace:** Geist Mono (ui-monospace, monospace)

**Character:** Geist is a modern, metrically engineered sans-serif with tall x-height and even stroke width. The pairing communicates precision and technical confidence without feeling cold. Monospace is used for scanned text evidence and code-like elements — always in a contained blockquote, never running body copy.

### Hierarchy

- **Display** (54.4px / 3.4rem, weight 700, line-height 1.1): Hero landing headline only (largest scale step).
- **Heading 1** (36px, weight 600, line-height 1.25): Page titles, landing section leads.
- **Heading 2** (24px, 600, 1.3): Section titles.
- **Heading 3** (18px, 600, 1.3): Card headings, form section labels.
- **Body** (16px, 400, 1.5): Running copy, descriptions, paragraph text.
- **Small** (14px, 400, 1.5): Secondary information, captions.
- **Caption** (13px, 400, 1.5): Card sub-text, helper copy.
- **Caption-sm** (11px, 400, 1.6): Tabular data, stat labels, timestamps, badges.
- **Micro** (10px, 400, 1.6): Dense metadata, table cells, legal fine print.
- **Nano** (9px): Extreme-density labels (rare; charts, incident maps).
- **Chart-label** (8px, mono, 400, 1.4): Axis labels and ticks on data visualisations (Recharts/Charts). Monospace for numeric alignment.
- **Logo-wordmark** (15px, 600, 1.2): Nav/logo wordmark "Sift" only, without a regional badge.
- **Brand mark:** the approved Scout owl uses foreground, background, muted-foreground, and secondary tokens. Keep its reading lens and silhouette; use the simplified drawing below 24px. Header and footer share the same mark and Geist wordmark.
- **Button** (12.8px / 0.8rem, weight 500, 1.4): All button and control labels.
- **Mono** (11px): Scanned text evidence, code-like data.
- **Mono-sm** (10px) / **Mono-xs** (9px): Dense evidence blocks and OCR output.

### Named Rules

**The Mono Block Rule.** Monospace (Geist Mono) is exclusively for scanned/reported text evidence and data that the user must verify. It is never used for UI labels, headings, or running copy.

**The Dense-Step Rule.** Small captions (11px), micro (10px), and nano (9px) sizes are legitimate parts of the scale for data-dense surfaces (tables, charts, incident maps, evidence blocks) — they are not "off-ramp" violations. Use them deliberately, not for body copy.

## Layout

Content-first, single-column on mobile, multi-column on dashboard pages. Max content width is unconstrained on landing; dashboard panels use card-based grid layouts via Radix UI. Sections use consistent vertical rhythm (py-12 to py-16 on landing, gap-4 to gap-6 in dashboard grids). All interactive targets (buttons, inputs, tabs) meet a minimum 44px touch target for mobile accessibility.

## Elevation & Depth

Flat by default. The system uses **tonal layering** (background → card white → border separation) rather than drop shadows. This is deliberate — shadows signal visual manipulation; tonal stacking signals structural honesty. The dark mode inverts this using OKLCH lightness steps, maintaining the same flat-by-default philosophy.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. No box-shadow is used for elevation on any static element. Hover states may use border-colour shifts or subtle tonal shifts (e.g., muted → secondary) to indicate interactivity, never shadow lifts.

## Shapes

Moderate, consistent corner radius derived from the `--radius` base token (0.625rem ≈ 10px base). Cards, inputs, buttons, badges, and popovers all use radius-lg (6.25px) as their default. The radius scale is additive (sm → 4xl), not multiplicative — each step is a fixed increment, not a ratio. Inline badges and pills use radius-pill (9999px, full round). Button corners are radius-md (5px). No pill-shaped buttons in the core system (rounded-full is reserved for inline status badges).

## Components

### Buttons
- **Shape:** radius-md (5px) at default; size variants handled by padding, not radius.
- **Primary:** #0f172a background, #f8fafc text. Bold, high-contrast, authoritative. Used for CTAs and primary actions.
- **Secondary / Ghost / Outline:** transparent or Ice (#f1f5f9) background, Near-Black text. For navigation and supporting actions.
- **Hover / Focus:** focus ring via --ring (#94a3b8) outline; hover is a subtle tonal shift, no colour change.

### Cards
- **Corner Style:** radius-lg (6.25px).
- **Background:** Snow (#ffffff) on light; oklch(0.205) on dark.
- **Border:** Slate (#e2e8f0) 1px on light; 10%-white on dark. Structural, not decorative.
- **Shadow:** None — tonal separation via background contrast.
- **Internal Padding:** p-4 to p-6 depending on context.

### Risk Badges
- **Low Risk:** green-600 background tint, green-600 text, or full green background badge.
- **Medium Risk:** amber-500, amber-600.
- **High Risk:** red-600, red-700.
- Always icon + text; never colour alone.

### Navigation (Navbar)
- **Style:** Near-Black background with white foreground links, or white background with dark links. Sticky top, compact height. Mobile uses Sheet (Radix overlay).
- **Typography:** Geist Sans, weight 500–600 for nav items.

### Inputs / Fields
- **Style:** 1px Slate border, Snow background, radius-lg.
- **Focus:** --ring (#94a3b8) outline.
- **Error:** Danger border + error message text.

## Do's and Don'ts

### Do:
- **Do** use danger/amber/green only to communicate risk level, error, or success — never as decoration.
- **Do** keep card backgrounds Snow (#ffffff) with a Slate (#e2e8f0) border; this is the structural language of elevation.
- **Do** use Geist Mono exclusively for scanned evidence text and data blocks, inside a contained box with bg-muted.
- **Do** use reduced-motion animation (the system already respects `prefers-reduced-motion: reduce`).
- **Do** pair every colour badge with an icon and text label (the Accessible Colour Rule).

### Don't:
- **Don't** use box-shadows on any element (the Flat-By-Default Rule).
- **Don't** use purple gradients, glassmorphism, or "AI magic" aesthetics (anti-reference in PRODUCT.md).
- **Don't** use pure black (#000000) or pure white (#ffffff text on white) — use the Near-Black (#0f172a) / Slate White (#f8fafc) tokens instead.
- **Don't** use colour as the only risk signal — always pair with icon + text.
- **Don't** use monospace for UI labels or headings — it is exclusively for evidence text.
