# Sift / approved Scout owl

The user selected the owl and requested the website's colours. The site uses deep
slate #0f172a, pale slate #f8fafc, and muted slate #64748b. The feather collar uses
the existing secondary token in the live component. Colour follows the site's
CSS variables, including its dark theme. The surrounding typography remains
Geist Sans to match the website.

`build.py` regenerates the on-page component and public SVG files from the
approved original owl concept. No external fonts or raster artwork are required
by the symbol. Outputs in `public/brand/` include light, dark, one-ink, reversed,
and small-size drawings. The Next.js `src/app/icon.svg` uses a simplified drawing
and adapts to the browser colour scheme.

Use the full owl from 24px upward. At 16px, use the small drawing: it removes fine
feather detail and eye glints, and increases the reading-lens ring thickness.
Preserve the proportions and clear space provided by the SVG viewBox. Do not
reintroduce the concept's orange or cream, add shadows, or recolour the lens with
risk-state colours. One-ink variants use real negative space.

The header and footer use a shared `BrandMark` with an accessible home-link name;
the SVG itself is decorative to avoid duplicate screen-reader announcements.
The original owl's freehand ear and feather angles are intentional organic forms.
Trademark clearance has not been performed.
