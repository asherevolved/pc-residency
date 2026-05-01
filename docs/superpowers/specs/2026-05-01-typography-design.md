# Typography Redesign — Hotel PC Residency
**Date:** 2026-05-01
**Status:** Approved

## Goal
Replace Cormorant Garamond + Inter with Libre Caslon (Display + Text) + Lato for a classic hotel elegance feel. Full typography pass: font families, type scale, weights, tracking, leading.

---

## 1. Font Families

| Token | Old | New |
|---|---|---|
| `--font-display` | Cormorant Garamond | Libre Caslon Display |
| `--font-serif` | Cormorant Garamond | Libre Caslon Text |
| `--font-sans` | Inter | Lato |

**Google Fonts import:**
```
Libre Caslon Display (400 only — display weight)
Libre Caslon Text (400, 400i, 700)
Lato (300, 400, 500, 700)
```

---

## 2. Type Scale & Treatment

### Display Headings (Hero title)
- Font: `font-display` (Libre Caslon Display), weight 400 — this family only ships 400; remove `font-light` class
- Tracking: `tracking-[-0.01em]` (was `tracking-tight`)
- Leading: `leading-[1.05]` (was `leading-[1.02]`)
- Italic accent spans: keep as-is — Caslon italic is a signature strength

### Section Headings (Rooms, About, Services, Reviews, Contact)
- Font: `font-serif` (Libre Caslon Text), weight 400
- Size: `text-4xl md:text-5xl lg:text-6xl` (standardized)
- Tracking: `tracking-normal`
- Leading: `leading-tight`

### Eyebrow Labels (`.eyebrow` utility + inline instances)
- Font: `font-sans` (Lato), weight 500
- Size: `11px` (standardized — was mixed 9px/10px/11px)
- Tracking: `tracking-[0.28em]` (was 0.2–0.3em)
- Transform: `uppercase`
- Color: `var(--color-warm-gray)` (unchanged)

### Body Copy
- Font: `font-sans` (Lato), weight 400
- Size: `text-base` (16px)
- Leading: `leading-[1.7]` (was implicit ~1.5)
- Long paragraphs: `max-w-[65ch]`

### UI / Buttons / Form Labels
- Font: Lato 500
- Tracking on uppercase buttons: `tracking-[0.18em]` (was `tracking-[0.2em]`)

### Numerals / Prices / Ratings
- Font: `font-serif` (Libre Caslon Text), weight 300 (`font-light`)

---

## 3. File-Level Changes

### `src/app/globals.css`
- Replace Google Fonts `@import` with Libre Caslon Display, Libre Caslon Text, Lato
- Update `--font-display`, `--font-serif`, `--font-sans` tokens
- Update `body` to add `line-height: 1.7`
- Update `.eyebrow` utility: Lato 500, 11px, `letter-spacing: 0.28em`

### `src/components/Hero.tsx`
- Display heading: remove `font-light`, set `tracking-[-0.01em]`, `leading-[1.05]`
- All eyebrow instances: standardize to 11px, `tracking-[0.28em]`
- Rating numeral: add `font-serif font-light`
- Button tracking: `tracking-[0.18em]`

### `src/components/Navbar.tsx`
- Logo text: `font-serif`
- Nav links: Lato 500, adjust tracking if needed

### `src/components/Rooms.tsx`
- Section heading: standardize to `font-serif text-4xl md:text-5xl lg:text-6xl tracking-normal`
- Price numerals: `font-serif font-light`
- Eyebrow: standardize

### `src/components/About.tsx`
- Section heading: `font-serif tracking-normal`
- Body paragraphs: `leading-[1.7] max-w-[65ch]`

### `src/components/Services.tsx`
- Section heading: `font-serif tracking-normal`
- Card titles: `font-serif` weight 400

### `src/components/Reviews.tsx`
- Section heading: `font-serif tracking-normal`
- Quote body: `font-serif italic` (Caslon italic)
- Reviewer names: `font-sans font-medium`

### `src/components/Contact.tsx`
- Section heading: `font-serif tracking-normal`
- Form labels/eyebrows: standardize to `.eyebrow` utility

### `src/components/Footer.tsx`
- Logo: `font-serif`
- Body/link text: `font-sans` (inherits from body)
- Small text: Lato 400

---

## 4. What Is NOT Changing
- Colors, spacing, layout, component structure
- Lenis smooth scroll
- Any non-typography classes

---

## 5. Success Criteria
- No Cormorant Garamond or Inter references remain anywhere
- All eyebrows render at exactly 11px / 0.28em tracking
- Display heading on Hero uses Libre Caslon Display
- Body text reads at 1.7 line-height
- Site visually reads as classic, timeless hotel — not modern tech or minimal
