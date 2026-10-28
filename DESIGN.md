---
name: Sift
description: A public safety advisory interface with oversized Geist typography, cool slate surfaces, and evidence-led risk assessment.
colors:
  background: "#f8fafc"
  foreground: "#0f172a"
  card: "#ffffff"
  primary: "#0f172a"
  primary-foreground: "#f8fafc"
  secondary: "#f1f5f9"
  muted: "#f1f5f9"
  muted-foreground: "#526176"
  border: "#dce3eb"
  input: "#cbd5e1"
  ring: "#475569"
  danger: "#dc2626"
  danger-foreground: "#991b1b"
  success: "#16a34a"
  success-foreground: "#166534"
  warning: "#f59e0b"
  risk-meter: "#f97316"
  warning-foreground: "#854d0e"
  chart-1: "#4f46e5"
  chart-2: "#f59e0b"
  chart-3: "#0ea5e9"
  chart-4: "#8b5cf6"
  chart-5: "#dc2626"
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.205 0 0)"
  dark-primary: "oklch(0.922 0 0)"
  dark-secondary: "oklch(0.269 0 0)"
  dark-muted-foreground: "oklch(0.708 0 0)"
  dark-border: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-ring: "oklch(0.556 0 0)"
  dark-danger-foreground: "#fca5a5"
  dark-warning-foreground: "#fcd34d"
  dark-success-foreground: "#86efac"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "88px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-tablet:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  page-title-mobile:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  section-title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.25
  section-title-mobile:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
  subsection:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "18px"
    lineHeight: 1.625
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
  button:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  badge:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "13px"
  dense-caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "11px"
  dense-metadata:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "10px"
  chart-micro:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "9px"
  chart-label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "8px"
  evidence:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "14px"
    lineHeight: 1.625
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  3xl: "1.375rem"
  4xl: "1.625rem"
  pill: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "28px"
  8: "32px"
  10: "40px"
  12: "48px"
  14: "56px"
  16: "64px"
  20: "80px"
  24: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  input:
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Sift

## Overview

**Creative North Star: "The Public Safety Advisory"**

Clear evidence and practical next steps carry the identity. Sift retains its approved Scout owl, Geist typography, cool slate palette, and functional risk colors, with a stronger typographic hierarchy and more generous task surfaces. The interface should feel calm, direct, and readable in the moments when a suspicious message creates pressure.

The redesign favors grouped content, open lists, and purposeful dividers over repeated decorative panels. Product truth and bilingual copy remain authoritative in PRODUCT.md and the dictionary. Page-specific composition is not a requirement for every future screen.

**Key Characteristics:**
- Cool slate backgrounds, white working surfaces, and near-black actions.
- Large sentence-case headings with readable explanations and form labels.
- Flat borders and tonal separation, without decorative shadows or glass.
- Semantic risk colors paired with text and an indicator.
- Visible content on arrival; interaction states carry the motion.

## Colors

A neutral field keeps message evidence and risk signals legible.

### Primary

Near-black ink supplies primary actions, headings, and the approved owl. Slate-white supplies their light foreground and the page ground.

### Neutral

Card white, secondary slate, and crisp borders distinguish surfaces. The muted foreground is a darker slate than the previous system so supporting copy remains readable. Focus uses the ring token rather than a decorative halo.

### Semantic

Danger, warning, and success remain the functional red, amber, and green signals. Their separate foreground tokens supply readable text on tinted surfaces; the dark theme provides lighter semantic foregrounds. Critical badges retain white text on solid danger. Charts retain their established palette, including chart-only indigo and violet.

**The Colour Reserve Rule.** Use non-neutral colors for risk, error, success, evidence, or data; never as unrelated decoration.

**The Semantic Foreground Rule.** Tinted risk labels and highlighted evidence use the corresponding foreground token, not the brighter indicator color as small text. Pair the signal with a written label.

## Typography

**Display and body:** Geist with system sans-serif fallbacks. **Evidence and numeric data:** Geist Mono with monospace fallbacks. Fonts are loaded through next/font in the root layout.

### Hierarchy

The large display moves from the mobile step to the tablet step at the small breakpoint, then to the desktop step at the large breakpoint. Shared page and section headings use their smaller step on phones and larger step from the small breakpoint. Display tracking is slightly tighter than ordinary headings; body copy remains untracked.

Body explanations and inputs use the body step. Supporting copy and form labels use the small step; status badges may use the badge step. Dense tables, chart axes, and numeric metadata retain the caption and chart steps in existing analytical components. Those dense roles are not a precedent for tiny form labels or essential instructions.

**The Reading Priority Rule.** Explanations and task guidance use the readable body or small steps. Reserve reduced sizes for actual dense data and metadata.

**The Data Mono Rule.** Monospace identifies evidence or measurements. Ordinary navigation, page headings, buttons, and form labels use Geist Sans.

## Layout

The shared site container has a maximum width of 80rem, with horizontal gutters of 20px on phones, 32px from the small breakpoint, and 48px from the large breakpoint. Working pages may use narrower containers: the scanner uses a 56rem maximum and account forms a 64rem maximum. The main navigation has an 80px minimum height.

Sections generally use 64px vertical spacing on phones and 96px on wider landing layouts. Related controls use 8-16px gaps; larger content groups use 24-48px gaps. Phone layouts stack in reading order, then adopt columns when the content fits.

The current landing demonstrates a message beside its headline on desktop, then places the task before the sample on mobile. Its three featured examples lead to the full library. The library pairs a category index with native disclosure sections; authentication uses a two-column explanation and form at the large breakpoint. These are implemented page patterns, not mandatory templates for every route.

Standard action controls target at least 44px height; large actions and primary native report selectors use at least 48px. Compact legacy variants and dense analytical surfaces still require individual accessibility review rather than an assumption that the whole site has been audited.

## Elevation & Depth

The system remains flat. Card backgrounds, one-pixel borders, surface tones, and whitespace supply separation. Shared cards and the mobile navigation sheet do not use decorative shadows. Focus rings communicate keyboard state rather than surface elevation.

**The Flat-By-Default Rule.** Do not add drop shadows, glass effects, or gradient washes for decorative elevation. Use border and tonal changes for hover and selection.

## Shapes

The source radius is 0.625rem. The scale is multiplicative: small is 0.6 times the base, medium 0.8, large the base, and extra-large 1.4. At a default 16px root this is a 10px large corner, 8px medium, and 6px small; do not preserve the old document's contradictory 6.25px and additive-scale descriptions.

Shared cards and disclosure containers use the large corner. Buttons, inputs, and action chips use the medium corner. Full pills remain appropriate for compact risk and category badges.

## Components

### Buttons

Primary actions are near-black with a light foreground; outline actions use the page surface and a border, and ghost actions use tonal hover feedback. Default and small standard variants have a 44px minimum height, while the large variant has a 48px minimum. Labels use sentence case. Shared keyboard focus has a two-pixel ring and offset.

### Cards / Containers

Shared cards have one border, a large corner, and no shadow. Default internal spacing is 24px; small cards use 20px. Titles use the body step with semibold weight. Footers may use a muted surface and top divider. Prefer open lists or disclosure structure when repeated cards would obscure hierarchy.

### Inputs / Fields

Shared inputs use medium corners, input borders, body-sized text, and a 48px minimum height. Textareas use generous padding and keep their text readable. Focus shifts the border and applies a ring; invalid and disabled states remain explicit. Report form labels use sentence-case sans-serif and supporting hints use the small step.

### Navigation

The sticky 80px header keeps one scanning action visible. Primary destinations are Scam Library and Community reports, plus My history for signed-in users. The logo returns home. Guests have a quiet Sign in link; account creation is explained on the sign-in page as a way to save history. Signed-in users get an Account disclosure for settings and sign-out. About and Scam insights live in the footer.

Full navigation starts at 1280px so translated labels and account controls fit. Smaller screens show the logo, scan action, and a menu button. The wordmark gives way to the owl below 360px. The mobile sheet contains the same destinations, language selection, and optional sign-in. Following a link closes the sheet. On scanner routes the header scan action uses an outline style, leaving Analyze Message as the primary task action. Controls meet a 44px minimum; current destinations and keyboard focus stay explicit.

Night mode is available through a 44px switch in the desktop header and a labeled switch in the mobile sheet. It follows the device color scheme until the visitor chooses light or dark, then persists that choice in browser storage. A small head script sets the theme before page content paints; the store synchronizes changes between open tabs and falls back to session state when storage is unavailable. CSS color-scheme keeps native controls consistent. Both switch labels and states are localized.

### Risk Badges and Evidence

Each risk badge combines a written risk label and colored dot. Low, medium, and high use their color tint and readable semantic foreground; critical uses solid danger with white text. Evidence highlights add a tint and underline so the distinction survives more than color alone. Reports place recommended actions immediately after the verdict.

The scanner uses an indeterminate status while waiting for the server. It never advances completed steps on a timer.

### Motion

The homepage has a single coordinated arrival: the headline settles over 650ms, the actions follow at 120ms, and the analysis panel arrives over 750ms. Content starts visible; there are no perpetual effects or repeated section entrances. The sample message runs a single 900ms inspection line, traces its warning cue, and fills its risk bar when selected. This is an explicitly illustrative example, not a simulated live request.

Sample and walkthrough panels share grid cells so every option reserves its full size. Switching states uses a 280ms vertical settle and the walkthrough indicator moves over 350ms. The three-step walkthrough advances only on user input; example links move their arrow 4px on hover or keyboard focus. All cues use the existing semantic colors and flat surfaces.

Reduced motion removes homepage entrance, inspection, marker, progress-fill, spatial content, and arrow animations immediately. Selection, content, risk values, and the walkthrough remain available. Scanner motion remains separate. Functional loading spinners are preserved by the global rule.

## Do's and Don'ts

### Do:
- **Do** preserve the approved Scout owl and its reading lens in header and footer.
- **Do** keep essential explanations, labels, and touch controls readable before adding visual detail.
- **Do** use semantic foreground tokens for tinted risk labels in both themes.
- **Do** keep English and Filipino controls in the dictionary and allow labels to wrap when necessary.
- **Do** distinguish illustrative samples, research data, and a user's saved history.
- **Do** preserve visible focus, reduced-motion behavior, and logical mobile reading order.

### Don't:
- **Don't** use purple gradients, glassmorphism, decorative shadows, or AI-magic imagery.
- **Don't** use color as the only indication of risk or selection.
- **Don't** turn small chart typography into the default for form labels or instructions.
- **Don't** add uppercase eyebrow labels above headings or use monospace as a technical costume.
- **Don't** describe every legacy control as accessibility-verified solely because shared primitives meet the new target sizes.
