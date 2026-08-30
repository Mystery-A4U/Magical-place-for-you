# A rose, a code, a question 🌹

A single-screen, cinematic, mobile-first proposal experience: liquid rose-pink
intro → birthday-code entry → a black cinematic hold → an autoplaying rose
bloom video → a slow-reveal proposal message.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (on your phone, use `npm run dev -- --host`
and open the printed network address on the same Wi-Fi).

## The one thing you must add

Drop your generated rose-bloom clip here, using exactly this name:

```
public/videos/rose-bloom.mp4
```

It autoplays muted, fills the screen, and the last frame stays on screen once
it ends — that's intentional, see `src/components/RoseVideoScene.tsx`.

## Things you'll want to customize

| What | Where |
|---|---|
| The unlock code (default `3101` = 31 Jan) | `BIRTHDAY_CODE` in `src/App.tsx` |
| The three lines of proposal text at the end | top of `src/components/FinalMessage.tsx` |
| Colors (the rose palette, the cinematic black) | `tailwind.config.js` → `theme.extend.colors` |
| Fonts | `index.html` (Google Fonts link) + `tailwind.config.js` → `fontFamily` |

## How the experience is wired

The whole app is one state machine in `src/App.tsx`, no routing, no scrolling:

```
INTRO → PASSWORD → TRANSITION → ROSE_VIDEO (video, then the final message fades in on top of its last frame)
```

- **`LiquidIntro.tsx`** — droplets fall through an SVG "goo" filter (blur +
  alpha-contrast) so they visually pool and merge like real liquid, then a
  solid color fades in underneath to guarantee even full-screen coverage.
- **`PasswordScene.tsx`** — glass birthday-code entry. A wrong code gives a
  gentle shake and a soft glow flash, never a browser alert. The correct code
  locks the input, glows, pauses, then the whole scene dissolves while its
  own background animates from rose to black.
- **`CinematicTransition.tsx`** — a very short held black frame, purely so
  the handoff into the video never flashes.
- **`RoseVideoScene.tsx`** — plays the video, holds on its final frame, then
  mounts **`FinalMessage.tsx`** on top of it.

## Accessibility & mobile notes already handled

- `prefers-reduced-motion` shortens or removes the choreographed animations
  in every scene.
- The birthday input has a proper `<label>` (visually hidden, still read by
  screen readers) and `inputMode="numeric"` for the native numeric keyboard.
- Layout uses `100dvh`/`100svh` fallbacks and locks scrolling, so it behaves
  on mobile browser chrome that resizes on scroll.
- Text stays high-contrast (warm white on deep rose or near-black).

## Design tokens

- **Color** — `#FDF1F0` pale blush start, `#E1476A` liquid rose, `#B22F4E`
  rose shadow, `#FFD9DE` glossy highlight, `#0B0708` warm cinematic black
  (never pure `#000`), `#FBEAE7` warm white for type on black.
- **Type** — Cormorant Garamond (italic) for every emotional line, Jost for
  labels, hints, and UI chrome — a deliberate serif/sans split between
  "feeling" and "interface."
- **Signature** — the goo-filter liquid merge in the intro is the one
  intentionally showy moment; everything after it (glass password card,
  video, closing type) stays quiet and gets out of the way.
