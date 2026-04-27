---
version: premium
name: SKR Premium (SKanban)
description: A luxury-grade interface following the SKR design system (as seen in Skill). This design combines Apple's precision with a premium "App Store Today" aesthetic. It features high-fidelity materials (glassmorphism), Montserrat-driven typography, and a refined color palette of SKR Blue and signature grays. The interface feels alive with subtle micro-animations, GPU-accelerated background blobs, and smooth view transitions.

colors:
  /* SKR Premium Palette */
  primary: "#0071e3"           /* SKR Blue - Apple-inspired exact blue */
  black: "#1d1d1f"             /* SKR Black - Apple's signature near-black */
  white: "#fbfbfd"             /* SKR White - Warm premium white */
  canvas: "#ffffff"            /* Canvas background */
  
  /* System Materials */
  gray-light: "#ffffff"        /* Background surfaces */
  gray: "#86868b"              /* Secondary text */
  gray-dark: "#1d1d1f"         /* Primary text */
  gray-muted: "#e8e8ed"        /* Subtle borders and dividers */
  
  /* Semantic Tokens */
  background: "{colors.gray-light}"
  foreground: "{colors.gray-dark}"
  card: "{colors.white}"
  border: "rgba(0, 0, 0, 0.06)"
  accent: "{colors.primary}"
  on-primary: "#ffffff"

typography:
  display-hero:
    fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.07
    letterSpacing: -0.03em
  display-lg:
    fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  display-md:
    fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  body-luxury:
    fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.022em
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.022em
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.01em
  button:
    fontFamily: "Montserrat, sans-serif"
    fontSize: 14px
    fontWeight: 700
    letterSpacing: -0.01em

rounded:
  none: 0px
  xs: 6px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 22px
  pill: 980px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  /* HIG Materials */
  material-thin:
    backgroundColor: "rgba(255, 255, 255, 0.72)"
    backdropBlur: "40px"
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)"
  
  material-thick:
    backgroundColor: "rgba(255, 255, 255, 0.88)"
    backdropBlur: "40px"
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)"

  hig-glass:
    backgroundColor: "rgba(255, 255, 255, 0.85)"
    backdropBlur: "30px"
    border: "1px solid rgba(255, 255, 255, 0.5)"
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04), 0 12px 48px rgba(0, 0, 0, 0.03)"

  /* Premium Buttons */
  hig-button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    boxShadow: "0 4px 16px rgba(0, 113, 227, 0.1)"

  hig-button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.6)"
    backdropBlur: "20px"
    border: "0.5px solid rgba(0, 0, 0, 0.08)"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"

  /* App Store Components */
  appstore-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.03)"
    transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)"

  appstore-hero:
    rounded: "{rounded.xl}"
    minHeight: "380px"
    overlay: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)"

  appstore-pill:
    backgroundColor: "rgba(0, 0, 0, 0.04)"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    typography: "{typography.button}"
    fontSize: "13px"

  appstore-icon:
    rounded: "22.5%" /* iOS App Icon Radius */
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"

  /* Input System */
  hig-input:
    backgroundColor: "rgba(0, 0, 0, 0.03)"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
    typography: "{typography.body}"
    fontSize: "14px"
---

## Overview

SKanban adopts the **SKR Premium** design language, a refined fusion of Apple's Human Interface Guidelines (HIG) and the editorial elegance of the App Store. This system prioritizes **luxury materials**, **dynamic depth**, and **precision typography**. Unlike a standard functional tool, SKanban is designed to feel like a premium experience where every interaction is fluid and every surface has physical weight.

The core of the experience is built on "Materials"—semi-transparent, blurred surfaces that layer over a dynamic background of animated gradients (Blobs). This creates a sense of depth and place, as if the UI is floating in a curated atmosphere.

**Key Characteristics:**
- **Luxury Materials**: Extensive use of backdrop-blur (glassmorphism) to create hierarchy without heavy shadows.
- **Dynamic Backgrounds**: GPU-accelerated animated blobs (`blob-cyan`, `blob-amber`, `blob-accent`) provide a living canvas.
- **App Store Editorial**: Cards and sections follow the "Today" tab aesthetic—large radii, bold typography, and generous breathing room.
- **Montserrat Typography**: Used for headings and luxury labels to provide a distinct brand voice alongside system fonts.
- **Premium Interactivity**: Smooth transitions, scale-based active states, and focus rings that feel part of the design.

## Colors

The SKR palette is curated for luxury, moving away from "standard" web colors to specific, harmonious tones.

### Brand & Accent
- **SKR Blue** (`{colors.primary}` — #0071e3): The primary interactive color. A deeper, more saturated blue that signals "Premium Action."
- **SKR Black** (`{colors.black}` — #1d1d1f): Used for primary text and high-contrast surfaces.
- **SKR White** (`{colors.white}` — #fbfbfd): A slightly warm white that prevents the interface from feeling "cold" or "clinical."

### System Materials
- **Gray Light** (#ffffff): Used for the main background canvas.
- **Gray Muted** (#e8e8ed): Used for subtle separators and borders that define space without creating visual noise.
- **Gray** (#86868b): Used for secondary/de-emphasized text.

## Typography

The system uses a dual-font strategy to balance brand personality with system-level readability.

- **Montserrat**: The "Luxury" voice. Used for all `h1-h6` headings and premium UI labels. It features bold weights and tight tracking.
- **SF Pro / System**: The "Precision" voice. Used for body copy, technical data, and micro-labels where clarity is paramount.

### Principles
- **Tracking**: Headlines use `-0.03em` tracking to achieve the "Apple tight" look.
- **Legibility**: Text rendering is set to `optimizeLegibility` with `-webkit-font-smoothing: antialiased`.
- **Scale**: Body text remains at 17px to maintain an editorial, readable pace.

## Materials & Depth

Hierarchy is defined by "Materials" rather than just color changes.

| Material | Description | Use Case |
|---|---|---|
| `material-thin` | 72% opacity, 40px blur | Navbars, floating headers |
| `material-thick` | 88% opacity, 40px blur | Overlays, sidebars |
| `hig-glass` | 85% opacity, 30px blur | Modals, premium cards |

**Background Blobs**: The interface sits atop a base layer of animated blobs. These are not static gradients but moving elements that create a "living" surface.
- `.blob-cyan`: 25s drift cycle.
- `.blob-amber`: 35s drift cycle.
- `.blob-accent`: 30s drift cycle.

## Components

### Buttons
- **`hig-button-primary`**: Full pill shape, SKR Blue background, white text. Includes a subtle shadow and scale-on-hover interaction.
- **`hig-button-secondary`**: Glass-based button with backdrop blur. Used for secondary actions that shouldn't compete with the primary blue.
- **`appstore-get-button`**: A compact, high-contrast pill used for "Get" or "Action" items within lists.

### Cards
- **`appstore-card`**: Large 22px radius, subtle border, and deep soft shadow. Scales slightly on hover to invite interaction.
- **`appstore-hero`**: Full-bleed or large-format editorial card with a gradient overlay to ensure text legibility over photography.
- **`hig-card`**: A more standard utility card for data, using 20px radius and a whisper-soft border.

### Inputs
- **`hig-input`**: Subtle gray-wash background, rounded corners, and a blue focus ring that expands smoothly.

## Do's and Don'ts

### Do
- **Use Glassmorphism**: Favor `backdrop-filter` over solid colors for floating UI elements.
- **Use Montserrat for Headings**: Keep the luxury brand voice consistent.
- **Use Full-Pill Buttons**: The capsule shape is a core brand signal for primary actions.
- **Enable Animations**: Use the blob animations and view transitions to make the app feel alive.
- **Respect the 17px Body**: Keep paragraph text at the editorial standard.

### Don't
- **Don't use "Web Red/Blue/Green"**: Stick strictly to the SKR palette.
- **Don't use Sharp Corners**: Everything should have at least an 8px radius; cards should be 20px+.
- **Don't Over-shadow**: Use shadows sparingly; let materials (blur/opacity) do the heavy lifting for depth.
- **Don't use Gradients as Dividers**: Use `gray-muted` or whitespace.
- **Don't Crowd Content**: Follow the App Store principle of "One Idea per View" where possible.

## Responsive Strategy

- **Fluid Rem/Em**: Use relative units for spacing and sizing to ensure the premium look holds across all screen sizes.
- **Breakpoint Transitions**: Use View Transitions API for layout shifts to maintain spatial awareness.
- **Mobile Comfort**: Ensure all touch targets are at least 44px and utilize the full-pill shape for easy tapping.
