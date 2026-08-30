import { motion, useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────
// ✏️ EDIT ME — everything shown after the rose finishes blooming lives here.
// ─────────────────────────────────────────────────────────────────────────
const LINE_ONE = 'Some things are worth waiting for…';
const LINE_TWO = 'And you are one of them. 🌹';
const PROPOSAL_MESSAGE = 'I have something special to tell you…';
// ─────────────────────────────────────────────────────────────────────────

export default function FinalMessage() {
  const prefersReducedMotion = useReducedMotion();
  const step = prefersReducedMotion ? 0.9 : 1.9;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-8 text-center">
      <motion.p
        className="font-display text-2xl italic text-warmwhite drop-shadow-[0_0_18px_rgba(225,71,106,0.35)] sm:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 1.4, ease: 'easeOut' }}
      >
        {LINE_ONE}
      </motion.p>

      <motion.p
        className="font-display text-2xl italic text-warmwhite drop-shadow-[0_0_18px_rgba(225,71,106,0.35)] sm:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: step, duration: 1.4, ease: 'easeOut' }}
      >
        {LINE_TWO}
      </motion.p>

      <motion.p
        className="mt-4 max-w-xs font-body text-sm tracking-wide text-warmwhite/85 sm:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: step * 2, duration: 1.6, ease: 'easeOut' }}
      >
        {PROPOSAL_MESSAGE}
      </motion.p>
    </div>
  );
}
