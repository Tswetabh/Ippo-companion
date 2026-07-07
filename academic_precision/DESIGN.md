---
name: Academic Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#424754'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
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
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  sidebar-width: 260px
  max-width: 1440px
---

## Brand & Style
The design system is engineered to reduce cognitive load for students managing complex academic lives. It adopts a **High-Utility Minimalism** aesthetic, blending the technical precision of developer tools with the approachability of premium consumer software. 

The emotional response should be one of "calm control." By utilizing generous whitespace, subtle depth, and a focus on content over chrome, the UI recedes to let student data and AI insights take center stage. The style is a hybrid of **Modern Corporate** and **Glassmorphism**, specifically using thin, translucent borders and tonal layering to create a sense of organized sophistication.

## Colors
The palette is anchored by **Calm Blue** (Primary) and **Insight Purple** (Secondary). These colors are used sparingly for interactive states, progress indicators, and AI-driven highlights. 

- **Primary (Blue):** Used for main actions, focused states, and essential navigation.
- **Secondary (Purple):** Reserved for AI features, "Magic" actions, and smart summaries.
- **Tonal Neutrals:** A sophisticated range of grays manages the hierarchy. In light mode, we use pure white surfaces with #F9FAFB for secondary containers. In dark mode, we utilize obsidian (#0D0D0D) for the base and charcoal (#1A1A1A) for elevated cards.
- **Semantic Colors:** Green for "On Track," Amber for "Review Needed," and Red for "Overdue."

## Typography
The design system utilizes **Inter** exclusively to achieve a systematic, utilitarian feel that remains highly readable at small sizes. 

- **Headlines:** Use tighter letter-spacing and semi-bold weights to create a strong visual anchor.
- **Body:** Standardized at 14px for density and 16px for long-form reading (like AI summaries).
- **Labels:** Used for metadata, sidebar items, and secondary button text. 
- **Scale:** On mobile devices, large display type should scale down by 25% to maintain readability without excessive scrolling.

## Layout & Spacing
The layout follows a **Hybrid Sidebar-Grid** model inspired by modern browsing interfaces. 

- **Side Navigation:** A fixed-width sidebar (260px) houses the primary navigation. It uses vertical stacking with 4px spacing between items.
- **Main Canvas:** A fluid grid that adjusts based on the sidebar state. For dashboard views, use a **12-column grid** with 24px gutters.
- **Content Density:** Elements use an 8px-based spatial system. Padding within cards should be a consistent 24px for desktop and 16px for mobile.
- **Breakpoints:** 
    - Mobile: < 768px (Single column, bottom navigation or drawer)
    - Tablet: 768px - 1024px (Collapsed sidebar, 2-column grid)
    - Desktop: > 1024px (Full sidebar, multi-column grid)

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Multi-layered Shadows** rather than high-contrast shadows.

- **Level 0 (Base):** Light #FFFFFF / Dark #0D0D0D.
- **Level 1 (Cards/Sidebar):** Light #F9FAFB / Dark #1A1A1A. Features a 1px stroke (Opacity 5% Black in light mode, 10% White in dark mode).
- **Level 2 (Modals/Popovers):** Subtle ambient shadow: `0 8px 30px rgba(0,0,0,0.04)` for light mode and `0 8px 30px rgba(0,0,0,0.4)` for dark mode.
- **Glassmorphism:** Navigation sidebars and header bars should use a 20px backdrop blur with a 70% opacity fill of the surface color to maintain context of the content underneath.

## Shapes
The design system uses a generous **Rounded** language to soften the density of information.

- **Standard Elements:** Buttons, inputs, and small cards use a 12px radius.
- **Large Containers:** Dashboard widgets and main content areas use a 16px or 24px radius (`rounded-xl` or `rounded-2xl`).
- **Interactive States:** On hover, backgrounds should softly transition. Selection indicators (like sidebar active states) use a pill-shaped indicator or a rounded rectangle that matches the element's radius.

## Components

### Side Navigation (Arc-inspired)
- **Container:** Full height, subtle backdrop blur, 1px trailing border.
- **Items:** Hover state uses a subtle gray wash. Active state uses a 2px vertical "calm blue" line or a light tonal background.
- **Organization:** Clear grouping with small-caps labels for "Spaces" (e.g., Semester 1, Side Project).

### Modern Header
- **Search:** A "Command+K" style bar, centered or right-aligned, with a 1px subtle border and "Search..." placeholder.
- **Profile:** Minimalist 32px circular avatar with a status ring.

### AI Agent Cards
- **Status Indicators:** A small pulsing dot (Purple for active processing, Green for idle).
- **Structure:** Title, brief summary of AI insight, and a primary action button (ghost or outline style).

### Data Visualization
- **Widgets:** Clean line charts and circular progress rings for attendance. Use 2px stroke widths for data lines to maintain the "precision" look.
- **Tonal Fills:** Use low-opacity primary/secondary colors for chart areas.

### Focus Timer & Tools
- **Timer:** Large display typography (Display-lg) with a thin circular progress track.
- **Controls:** Minimalist icons (Play/Pause/Reset) with clear tooltips.

### Input Fields
- **Style:** 1px border, 12px radius. On focus, the border transitions to Primary Blue with a 2px outer "glow" (spread) of 4px.