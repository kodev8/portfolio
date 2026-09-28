# Room Light — design system

The reference for how this site looks and moves. Tokens live in
[`src/index.css`](../src/index.css); this file explains what they are for and
when to reach for each one.

The palette is sampled from the 3D room. The room is the most distinctive thing
on the site, so the chrome takes its ground, neutrals and accents from that
scene rather than sitting in unrelated pure black.

---

## Colour

Theme colours are declared in the `@theme` block, so Tailwind generates
`bg-room-*`, `text-room-*` and `border-room-*` utilities for each.

| Token | Value | Use for |
| --- | --- | --- |
| `room-ground` | `#0b0a12` | Page background. A near-black indigo, not `#000`, so the room's violet doesn't look pasted on. |
| `room-surface` | `#131126` | Cards, form fields, the tab group. |
| `room-raised` | `#1b1830` | A surface sitting on another surface. Use sparingly. |
| `room-hi` | `#f2f0ff` | Headings and primary text. |
| `room-mid` | `#a9a4c7` | Body copy, secondary text. |
| `room-low` | `#857fa8` | Metadata, captions, placeholders. Lowest step that still clears 4.5:1 on ground. |
| `room-accent` | `#35e0c8` | Primary actions, active state, the timeline rail. From the cleats ring. |
| `room-on-accent` | `#06120f` | Text on an accent fill. Never use `room-hi` there. |
| `room-featured` | `#ff5ba8` | "Featured" flags and highlights only. From the dumbbell ring. |
| `room-link` | `#4d8dff` | Inline links in prose. |

Hairlines keep their alpha and stay plain custom properties, because Tailwind
would flatten them into opaque utilities:

| Variable | Value | Use for |
| --- | --- | --- |
| `--room-line` | `rgb(199 193 255 / 0.14)` | Default card and divider borders. |
| `--room-line-strong` | `rgb(199 193 255 / 0.28)` | Secondary button borders, anything that needs to read as interactive. |

### Rules

- Two accents, and they do different jobs. `room-accent` is interaction;
  `room-featured` is editorial emphasis. Never use featured for a button.
- Anything that must be told apart differs in lightness, not only hue.
- Every text pairing above clears 4.5:1 on `room-ground`. If you introduce a
  new grey, check it before shipping — `room-low` is already at the floor.

---

## Type

Two families, both already loaded. No new font requests.

- **Mona Sans** — display and body.
- **JetBrains Mono** — labels only: dates, tech tags, section eyebrows, counters.

The mono face is what keeps metadata reading as metadata. It is the reason the
emoji icons can go: dates and locations no longer need a glyph to look distinct.

| Role | Size / line-height | Tracking | Weight |
| --- | --- | --- | --- |
| Display | 72 / 1.02 | -0.03em | 700 |
| H2 | 40 / 1.1 | -0.025em | 700 |
| H3 | 22 / 1.3 | -0.015em | 700 |
| Body large | 18 / 1.6 | — | 400 |
| Body | 16 / 1.6 | — | 400 |
| Small | 14 / 1.5 | — | 400 |
| Label (mono) | 12 / 1.2 | 0.08em, uppercase | 400 |

### Rules

- Body copy is **left aligned, never justified**. `text-justify` at this measure
  stretches word gaps badly and there is no hyphenation to rescue it.
- Cap prose at **65 characters**.
- Display sizes are fluid below `lg`; the table gives the desktop end.

---

## Space and shape

- Base unit **4px**. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Page gutter: `--page-x`, `clamp(20px, 5vw, 80px)`.
- Grid: 12 columns, 24px gutter.
- Navbar height: `--nav-h`. Offset content below the fixed nav with this token
  — never by reading `navBarRef.current.offsetHeight` during render. That ref is
  null on first paint and refs do not trigger the re-render that would fix it.

Radii: `8px` chips · `12px` buttons and inputs · `16px` cards · `999px` pills.

---

## Components

**Buttons** — 44px minimum height, 12px radius.
Primary is an `room-accent` fill with `room-on-accent` text. Secondary is
transparent with a `--room-line-strong` border. Disabled drops to `room-low`
with a `--room-line` border.

**Tech tags** — outlined, not filled. Mono at 11px, 8px radius,
`--room-line` border, `room-mid` text. A featured tag uses an accent-tinted
border and accent text.

**Fields** — 12px radius, `room-surface` fill, `--room-line` border, label above
in mono. Focus swaps the border to `room-accent`. Icon-only controls carry an
`aria-label`.

**Cards** — `room-surface` fill, `--room-line` border, 16px radius. No shadow at
rest; elevation comes from the border and fill, not a drop shadow.

**Logo tiles** — one fixed size for every logo, `object-fit: contain` inside it.
This is what removes the per-card `imgScale` values, which currently render
Noways tiny in a white box while CA Vitry fills its card edge to edge.

**Icons** — stroke icons at 1.6, from `react-icons` or inline SVG. No emoji.

---

## Motion

Motion is a feature here, not decoration to be trimmed. The rules exist so it
stays coherent at that volume, not to make it smaller.

| Variable | Value | Use for |
| --- | --- | --- |
| `--dur-fast` | 160ms | Hover, focus, small state flips. |
| `--dur` | 300ms | Reveals, tab changes, most transitions. |
| `--dur-slow` | 600ms | Section-scale moves, camera transitions. |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Anything entering or responding to input. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Anything that leaves and returns. |

### Rules

- Animate **`transform` and `opacity` only** on anything that runs during
  scroll. Width, height, top and left force layout and will cost the frame rate
  that makes ambitious motion feel good in the first place.
- Scroll-driven motion **scrubs** to scroll position rather than firing once, so
  it tracks the scrollbar instead of playing over it. The Experience rail is the
  reference implementation.
- One curve and one duration scale across the whole site. Variety comes from
  what moves, not from every component inventing its own timing.

### The reduced-motion toggle

`<html data-motion>` carries the visitor's choice, exposed as a control in the
header at every breakpoint.

- Unset — follow the OS. `prefers-reduced-motion: reduce` collapses all three
  durations to `0.01ms`.
- `data-motion="full"` — full motion even if the OS asks to reduce.
- `data-motion="reduced"` — collapse durations and neutralise every
  animation and transition, including third-party ones, via a global override.

Seed the attribute from the OS preference on first visit, then persist the
explicit choice. Because the durations are variables, component code does not
branch on the setting — it just uses `var(--dur)`.

---

## Accessibility

- Text 4.5:1 minimum, 3:1 at 24px and above.
- Touch targets 44px or larger.
- Real `<button>`, `<a href>`, `<input>` and `<label>`. Never `role` or
  `onClick` on a `div` — keyboard users skip it.
- Icon-only controls need an `aria-label`. The carousel's previous-image button
  shipped without one; that is the failure mode to watch for.
- Element ids are unique per page. There is an e2e test that enforces it.
