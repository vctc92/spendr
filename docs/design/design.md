---
name: Calm Monastic Precision
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#464555'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#97000c'
  on-tertiary: '#ffffff'
  tertiary-container: '#c20b17'
  on-tertiary-container: '#ffd1cc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.03em
  data-metric:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers an intentional, austere, and deeply reassuring atmosphere for mobile financial management. It avoids decorative noise, gratuitous depth, and emotional manipulation, treating monetary telemetry with architectural discipline and mathematical clarity.

### Personality & Tone
- **Composed & Impartial:** Finances are reflected honestly without artificial gamification or anxiety-inducing alert styles.
- **Architectural Minimalism:** Layouts honor structural whitespace, precise 1-pixel hairlines, and strict vertical baselines.
- **Utilitarian Tactility:** Surfaces feel deliberate and grounded, optimized for rapid, confident scanning and muscle-memory thumb interaction.

### Visual Architecture
The aesthetic draws on modernist Swiss typography and disciplined editorial ledger design:
- Strict flat plane presentation with zero drop shadows on primary cards.
- Layering established strictly via tonal surface shifts and 1px muted hairlines.
- Monospaced numeric alignment (tabular numbers) integrated across all data points to ensure visual symmetry across ledger columns.

## Colors

The palette is anchored by a high-restraint neutral scale, reserving high-saturation hues exclusively for semantic categorization and financial directionality.

### Core Surface & Text Semantics
- **Background:** Light `#FAFAFA` | Dark `#0E0E10` (Primary application canvas)
- **Card / Surface:** Light `#FFFFFF` | Dark `#18181B` (Container layer)
- **Foreground:** Light `#18181B` | Dark `#F4F4F5` (High-contrast typography and icons)
- **Muted Foreground:** Light `#71717A` | Dark `#A1A1AA` (Supporting labels, secondary metrics)
- **Border / Hairline:** Light `#E4E4E7` | Dark `#27272A` (Single-pixel boundaries and dividers)
- **Muted Fill:** Light `#F4F4F5` | Dark `#232326` (Segmented tracks, pill badges, input grounds)
- **Primary Accent:** Light `#4F46E5` | Dark `#818CF8` (Action focus, selections, system states)

### Financial & Categorical Semantics
Financial vectors and budgeting tiers must use dedicated functional mappings:
- **Credit / Inflow:** Light `#16A34A` | Dark `#4ADE80`
- **Debit / Outflow:** Light `#DC2626` | Dark `#F87171`
- **Warning / Pending:** Light `#D97706` | Dark `#FBBF24`
- **Need Category — Must:** Light `#0F766E` | Dark `#2DD4BF` (Fixed non-negotiable living expenses)
- **Need Category — Necessary:** Light `#2563EB` | Dark `#60A5FA` (Important recurring utilities/needs)
- **Need Category — Nice:** Light `#A16207` | Dark `#FACC15` (Discretionary lifestyle & leisure)
- **Need Category — Avoidable:** Light `#BE185D` | Dark `#F472B6` (Impulse or redundant expenses)

## Typography

Typography is set exclusively in **Inter**, selected for its systematic clarity, neutral voice, and robust OpenType font features.

### Numeric & Currency Rules
- All numeric displays, financial sums, ledger row balances, and timestamps must render with **tabular numbers enabled** (`font-feature-settings: "tnum" 1, "cv05" 1`). This prevents horizontal jitter as values change and enforces strict columnar scanning.
- Currency symbols precede the balance and inherit the font weight and color of the numeric string. Fractional decimals match the baseline of the integer.

### Hierarchy & Rhythm
- **Data Display:** Reserved for high-level aggregate account totals on account views.
- **Headlines:** Set with negative letter-spacing for structural tightness without sacrificing readability.
- **Labels:** Uppercase styling is reserved strictly for tiny meta badges (`label-sm`), styled with letter spacing (+0.04em) to ensure legibility on mobile screens.

## Layout & Spacing

Layout geometry follows an uncompromising **4-point grid** tailored to mobile screen viewports.

### Screen Structure & Canvas Bounds
- **Margin:** 16px (`1rem`) lateral screen margin ensures content avoids display edges on standard devices (375px–430px widths).
- **Gutter:** 16px (`1rem`) between card grids and split data panels.
- **Touch Target Integrity:** Every tappable node maintains a strict minimum bounding box of 44×44px, even when its visible container is more compact (e.g., small badge filters or inline icon buttons).

### Layout Flow
- **Single-Column Stacking:** Vertical stacking dominates ledger listings to preserve continuous natural thumb scrolling.
- **Section Rhythm:** Group related ledger blocks with 24px (`space-xl`) margins; internal card paddings adhere strictly to 12px (`space-md`) or 16px (`space-lg`).

## Elevation & Depth

This system intentionally rejects drop shadows and skeuomorphic blur stacks. Spatial separation is achieved exclusively through **planar contrast and crisp 1px hairlines**.

### Surface Hierarchy
1. **Level 0 (Canvas):** Background `#FAFAFA` (Light) / `#0E0E10` (Dark). The base viewport on which scrollable feeds reside.
2. **Level 1 (Structural Card):** Card `#FFFFFF` (Light) / `#18181B` (Dark). Framed with a 1px solid border `#E4E4E7` (Light) / `#27272A` (Dark). Completely flat elevation. No drop shadow.
3. **Level 2 (Recessed / Embedded Areas):** Muted Fill `#F4F4F5` (Light) / `#232326` (Dark). Used inside Level 1 cards for data tables, budget progression tracks, and input controls.
4. **Level 3 (Floating Sheets / Modals):** Foreground `#18181B` or Card surface elevated with an overlay hairline divider and a backdrop scrim (`rgba(0, 0, 0, 0.4)` light / `rgba(0, 0, 0, 0.7)` dark).

### Dividers & Lines
All line separators are rendered as 1px hairline rules without feathering or drop-off, maintaining crisp geometry across Retina displays.

## Shapes

The interface balances crisp mechanical lines with ergonomic rounded corners to establish a restrained, modern posture.

### Corner Radii
- **Level 2 Standard (`roundedness: 2`):** Primary cards, list cells, and interactive modals utilize an 8px (`0.5rem`) corner radius.
- **Nested Elements:** Inner elements (such as secondary chips and inner muted tracks) inherit a 4px to 6px radius to preserve concentric visual balance.
- **Pills / Status Dots:** Category indicators, transaction badges, and segment selectors use a fully rounded capsule (`9999px`) to create clear differentiation from rectangular card containers.

## Components

### Buttons
- **Touch Targets:** Minimum physical touch area of 44×44px.
- **Primary:** Background `#4F46E5` (`#818CF8` in dark mode), Foreground `#FFFFFF` (`#0E0E10` in dark mode). 8px radius. Height: 44px. Font: `label-lg`. Zero elevation shadow.
- **Secondary / Subdued:** Background `Card`, 1px Border `#E4E4E7` / `#27272A`, Foreground `#18181B` / `#F4F4F5`.
- **Destructive:** Foreground `#DC2626` / `#F87171` with Muted Fill or hairline border.

### Cards
- **Construction:** Solid surface with zero elevation shadow, enclosed in a 1px solid hairline (`#E4E4E7` / `#27272A`).
- **Padding:** 16px internal padding.
- **Sub-Grouping:** Subsections within cards are demarcated by 1px horizontal hairline dividers or inset `Muted` container boxes.

### Transaction Rows (List Items)
- **Geometry:** Height 56px to 64px, ensuring immediate touch compliance.
- **Layout:** Leading semantic category badge (capsule or monochrome glyph) -> Center title (`body-md`) and subtitle (`body-sm`, `Muted Foreground`) -> Trailing numerical ledger value (`data-metric`, tabular numbers).
- **Amount Colors:** Credits prefix with `+` in Credit Green; Debits display `-` or plain value in Foreground. Avoid harsh red unless explicitly flagged as over-budget or negative balance.

### Need Category Badges (Chips)
- **Geometry:** Height 24px, 12px pill radius, 8px horizontal padding.
- **Styling:** Muted tinted background with 15% opacity of the semantic color, foreground set to the full semantic hex (`Must`, `Necessary`, `Nice`, `Avoidable`).

### Input Fields
- **Geometry:** Height 44px minimum, 8px border-radius.
- **Default State:** Background `Card`, 1px solid `#E4E4E7` / `#27272A`, placeholder in `Muted Foreground`.
- **Focus State:** 1px border switches to Primary (`#4F46E5` / `#818CF8`) without fuzzy outer focus rings.

### Checkboxes & Toggle Controls
- **Size:** 20×20px active box within a centered 44×44px hit-box target.
- **Active State:** Solid Primary background with a crisp white 1.5px checkmark icon.
- **Inactive State:** 1px border hairline with empty transparent center.