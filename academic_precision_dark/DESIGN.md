---
name: Academic Precision Dark
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c1c7d3'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8b919d'
  outline-variant: '#414751'
  surface-tint: '#a4c9ff'
  primary: '#a4c9ff'
  on-primary: '#00315d'
  primary-container: '#60a5fa'
  on-primary-container: '#003a6b'
  inverse-primary: '#0060ac'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#fabd34'
  on-tertiary: '#412d00'
  tertiary-container: '#d19900'
  on-tertiary-container: '#4b3500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#fabd34'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
This design system translates the rigorous clarity of academic environments into a premium, high-focus dark mode. The personality is intellectual, reliable, and deeply focused, catering to researchers, engineers, and data-driven professionals who require long-duration interface engagement without eye strain.

The design style is **Corporate Modern** with a lean toward **Minimalism**. It prioritizes information density and structural logic over decorative elements. By utilizing a deep navy-charcoal foundation, the UI creates a "void-like" canvas where data and primary actions are surfaced through subtle tonal shifts rather than aggressive lighting or shadows.

## Colors
The palette is anchored in a deep charcoal-navy (`#0f1117`) to provide a stable, low-fatigue background. The primary accent is a refined blue (`#60a5fa`), shifted from the original palette to a lighter tint to ensure a high contrast ratio (7:1+) against dark backgrounds while maintaining its professional character.

- **Primary:** Optimized blue for readability and focus.
- **Surface Scale:** Layers move from the base (`#0f1117`) to elevated containers (`#1e293b`) to interactive states (`#334155`).
- **Typography:** Uses high-contrast Off-White for primary content and Muted Slate for meta-data and decorative elements.

## Typography
The system relies exclusively on **Inter** to maintain a neutral, systematic, and utilitarian feel. The hierarchy is strictly enforced through weight and color rather than excessive size variations.

- **Headlines:** Semi-bold with slight negative letter-spacing to create a "locked-in" professional appearance.
- **Body:** Standardized for maximum legibility in long-form technical reading.
- **Labels:** Uppercase or medium weights used for UI controls and secondary metadata.
- **Contrast:** Ensure all text-on-surface combinations meet WCAG AA standards.

## Layout & Spacing
The layout follows a strict **4px baseline grid** and a **12-column fluid grid** system for desktop.

- **Desktop:** 12 columns, 24px gutters, 40px side margins.
- **Tablet:** 8 columns, 16px gutters, 24px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.

Information density is medium-high. Use padding to group related items logically, favoring "contained" groups (using borders or slight tonal shifts) over whitespace-only separation to maintain the structured academic feel.

## Elevation & Depth
In this dark system, elevation is conveyed through **Tonal Layering** rather than traditional drop shadows. As an element "rises" closer to the user, its surface color becomes lighter.

- **Level 0 (Base):** `#0f1117` - The main canvas.
- **Level 1 (Cards/Sidebar):** `#1e293b` - Standard containers.
- **Level 2 (Modals/Popovers):** `#334155` - Floating elements.

Shadows should be used sparingly. When required, use a large blur radius with very low opacity (`rgba(0, 0, 0, 0.4)`) to create a soft "ambient occlusion" effect rather than a distinct shadow line. Inner borders (1px) of a slightly lighter hex should be used to define edges of elevated elements.

## Shapes
The shape language is defined by the **Round Eight** philosophy. This provides a balance between the rigid "sharp" academic look and a modern, approachable software feel.

- **Standard (8px):** Used for buttons, input fields, and standard cards.
- **Large (16px):** Used for primary layout containers or modal windows.
- **Extra Large (24px):** Used for decorative elements or distinct sectioning.

## Components
- **Buttons:** Primary buttons use the `#60a5fa` background with `#0f172a` text. Secondary buttons use a transparent background with a 1px border of `#334155`.
- **Input Fields:** Background should be one step darker than the parent surface. Use `#334155` for the border, changing to `#60a5fa` on focus with a subtle outer glow.
- **Chips:** Small, 8px rounded elements with a background of `#334155` and `label-md` typography.
- **Lists:** Items separated by 1px dividers of `#1e293b`. Hover states should use a subtle `#1e293b` background with 8px corner radius.
- **Cards:** Defined by a 1px border (`#334155`) or a tonal shift to `#1e293b`. No heavy shadows.
- **Checkboxes/Radios:** Square-ish with 2px rounding. Primary blue fill when active.