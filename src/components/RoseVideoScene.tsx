import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FinalMessage from './FinalMessage';

interface RoseVideoSceneProps {
  /** Path to the externally generated rose-bloom clip. Swap the file at
   * /public/videos/rose-bloom.mp4 — no code changes needed. */
  src?: string;
}

/**
 * SCENE 3 + 4 — Cinematic video reveal and final message.
 *
 * The video and the final message live in one component on purpose: the
 * brief calls for the last frame of the bloom to stay on screen, in black,
 * while the proposal text fades in on top of it — so nothing ever unmounts
 * the video or cuts away from it.
 */
export default function RoseVideoScene({ src = '/videos/rose-bloom.mp4' }: RoseVideoSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    // Scene 3: wait ~0.5s on black, then fade the video in and play it.
    const revealTimer = setTimeout(() => {
      setVideoVisible(true);
      videoRef.current?.play().catch(() => {
        /* Autoplay can be blocked before any user gesture on some browsers;
           the poster/black frame remains visible until playback is allowed. */
      });
    }, 500);
    return () => clearTimeout(revealTimer);
  }, []);

  function handleEnded() {
    // Hold on the final bloom frame before the proposal text appears.
    const holdMs = prefersReducedMotion ? 300 : 1500;
    setTimeout(() => setShowFinal(true), holdMs);
  }

  return (
    <div className="stage bg-ink-black">
      <motion.video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleEnded}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoVisible ? 1 : 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        // The video's own final frame stays visible after playback ends —
        // no code needed, that's default <video> behavior.
      />

      {/* Subtle rose-pink glow + vignette so the video reads as cinematic
          rather than a flat clip. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(225,71,106,0.18), transparent 55%), radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {showFinal && <FinalMessage />}
    </div>
  );
}
