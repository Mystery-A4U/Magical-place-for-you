import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface LiquidIntroProps {
  /** Called once the screen is fully covered in rose-pink liquid. */
  onComplete: () => void;
}

interface Droplet {
  id: number;
  xPercent: number;
  delay: number;
  size: number;
  fallDuration: number;
  landY: number; // percent of viewport height where the droplet splats
}

const DROPLET_COUNT = 9;

// Randomized once per mount so every visit feels slightly alive, not scripted.
function makeDroplets(): Droplet[] {
  return Array.from({ length: DROPLET_COUNT }).map((_, i) => ({
    id: i,
    xPercent: 8 + Math.random() * 84,
    delay: i * 0.16 + Math.random() * 0.15,
    size: 20 + Math.random() * 18,
    fallDuration: 0.55 + Math.random() * 0.25,
    landY: 40 + Math.random() * 42,
  }));
}

/**
 * SCENE 1 — Liquid rose-pink intro.
 *
 * Signature element: droplets fall through an SVG "goo" filter (blur +
 * alpha-contrast) so that as they land and their radii grow, they visually
 * pool and merge like real liquid instead of looking like separate cartoon
 * blobs. A soft solid backstop fades in underneath the last beat so the
 * final coverage is perfectly even, no matter how the randomized drops land.
 */
export default function LiquidIntro({ onComplete }: LiquidIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const droplets = useMemo(() => makeDroplets(), []);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const totalMs = prefersReducedMotion ? 650 : 3500;
    const timer = setTimeout(onComplete, totalMs);
    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    // Respect prefers-reduced-motion: a plain, quick cross-fade instead of
    // the full falling / merging choreography.
    return (
      <motion.div
        className="stage bg-rose-liquid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="stage bg-blush-pale" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          {/* Classic "goo" filter: blur then sharpen the alpha channel so
              overlapping shapes visually fuse instead of just overlapping. */}
          <filter id="liquid-goo" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          <radialGradient id="rose-fill" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#FFD9DE" />
            <stop offset="45%" stopColor="#E1476A" />
            <stop offset="100%" stopColor="#B22F4E" />
          </radialGradient>
        </defs>

        <g filter="url(#liquid-goo)">
          {droplets.map((d) => (
            <motion.ellipse
              key={d.id}
              cx={`${d.xPercent}%`}
              fill="url(#rose-fill)"
              initial={{ cy: '-15%', rx: d.size * 0.4, ry: d.size * 0.65 }}
              animate={{
                cy: ['-15%', `${d.landY}%`, `${d.landY}%`],
                rx: [d.size * 0.4, d.size * 0.55, d.size * 2.4],
                ry: [d.size * 0.65, d.size * 1.35, d.size * 0.85],
              }}
              transition={{
                delay: d.delay,
                duration: d.fallDuration + 0.5,
                times: [0, 0.58, 1],
                ease: ['easeIn', 'easeOut', 'easeOut'],
              }}
            />
          ))}

          {/* The flood: a central puddle rises and swallows the frame. */}
          <motion.circle
            cx="50%"
            cy="58%"
            fill="url(#rose-fill)"
            initial={{ r: '0%' }}
            animate={{ r: ['0%', '0%', '145%'] }}
            transition={{
              delay: 1.85,
              duration: 1.3,
              times: [0, 0.12, 1],
              ease: 'easeInOut',
            }}
          />
        </g>
      </svg>

      {/* Solid backstop guarantees perfectly even final coverage. */}
      <motion.div
        className="absolute inset-0 bg-rose-liquid"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ delay: 2.55, duration: 0.75, times: [0, 0.25, 1] }}
      />

      {/* Glossy sheen so the liquid reads as premium fluid, not flat cartoon fill. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 28% 18%, rgba(255,255,255,0.38), transparent 46%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 72% 82%, rgba(178,47,78,0.35), transparent 40%)',
        }}
      />
    </div>
  );
}
