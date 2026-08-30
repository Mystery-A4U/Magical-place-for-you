import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CinematicTransitionProps {
  onDone: () => void;
}

/**
 * A brief, held black frame between the password dissolve and the rose
 * video. PasswordScene already animates its own background to black, so
 * this component's only job is to guarantee at least one fully-settled
 * black frame — belt and suspenders against any timing flash — before the
 * video scene mounts.
 */
export default function CinematicTransition({ onDone }: CinematicTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, prefersReducedMotion ? 100 : 260);
    return () => clearTimeout(t);
  }, [onDone, prefersReducedMotion]);

  return (
    <motion.div
      className="stage bg-ink-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      aria-hidden="true"
    />
  );
}
