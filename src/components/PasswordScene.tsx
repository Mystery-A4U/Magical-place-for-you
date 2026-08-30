import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface PasswordSceneProps {
  /** The 4-digit code that unlocks the experience, e.g. "3101" for 31 Jan. */
  code: string;
  /** Called once the screen has fully dissolved to black. */
  onUnlocked: () => void;
}

type Status = 'entering' | 'wrong' | 'correct' | 'unlocking';

const DIGIT_COUNT = 4;

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 3 + Math.random() * 5,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 6,
    drift: -20 + Math.random() * 40,
  }));
}

export default function PasswordScene({ code, onUnlocked }: PasswordSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('entering');
  const inputRef = useRef<HTMLInputElement>(null);
  const particles = useMemo(() => makeParticles(prefersReducedMotion ? 0 : 14), [prefersReducedMotion]);

  useEffect(() => {
    // Autofocus so the mobile numeric keyboard appears immediately.
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (value.length < DIGIT_COUNT || status !== 'entering') return;

    if (value === code) {
      setStatus('correct');
      const successPause = setTimeout(() => setStatus('unlocking'), 800);
      return () => clearTimeout(successPause);
    }

    setStatus('wrong');
    const resetShake = setTimeout(() => {
      setValue('');
      setStatus('entering');
      inputRef.current?.focus();
    }, 620);
    return () => clearTimeout(resetShake);
  }, [value, code, status]);

  useEffect(() => {
    if (status !== 'unlocking') return;
    const unlockDuration = prefersReducedMotion ? 350 : 1250;
    const t = setTimeout(onUnlocked, unlockDuration);
    return () => clearTimeout(t);
  }, [status, onUnlocked, prefersReducedMotion]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (status !== 'entering') return;
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, DIGIT_COUNT);
    setValue(digitsOnly);
  }

  const slots = Array.from({ length: DIGIT_COUNT });
  const isLocked = status === 'correct' || status === 'unlocking';

  return (
    <motion.div
      className="stage flex items-center justify-center overflow-hidden"
      initial={{ backgroundColor: '#E1476A' }}
      animate={{ backgroundColor: status === 'unlocking' ? '#0B0708' : '#E1476A' }}
      transition={{ duration: prefersReducedMotion ? 0.35 : 1.25, ease: 'easeInOut' }}
    >
      {/* Ambient floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle bg-warmwhite/70"
          style={
            {
              left: `${p.left}%`,
              bottom: '-5%',
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}

      <AnimatePresence>
        {status !== 'unlocking' && (
          <motion.div
            className="relative z-10 flex w-[88%] max-w-sm flex-col items-center gap-8 rounded-[28px] border border-white/25 bg-white/10 px-7 py-10 text-center shadow-[0_8px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(14px)', scale: 0.96 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center gap-3">
              <p className="font-body text-[11px] uppercase tracking-[0.35em] text-warmwhite/80">
                Before you enter my world&hellip;
              </p>
              <h1 className="font-display text-3xl italic text-white drop-shadow-sm">
                Enter your birthday
              </h1>
              <span className="text-2xl" aria-hidden="true">
                🌹
              </span>
            </div>

            <div className="relative flex flex-col items-center gap-4">
              <label htmlFor="birthday-code" className="sr-only">
                Enter the four digit day and month of your birthday
              </label>
              <input
                ref={inputRef}
                id="birthday-code"
                className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                maxLength={DIGIT_COUNT}
                value={value}
                disabled={isLocked}
                onChange={handleChange}
                aria-describedby="birthday-code-hint"
              />

              <motion.div
                className="flex gap-3"
                animate={
                  status === 'wrong' && !prefersReducedMotion
                    ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              >
                {slots.map((_, i) => {
                  const digit = value[i];
                  const filled = Boolean(digit);
                  const glow =
                    status === 'wrong'
                      ? 'border-rose-highlight/90 shadow-[0_0_16px_rgba(255,120,140,0.65)]'
                      : status === 'correct' || status === 'unlocking'
                        ? 'border-warmwhite shadow-[0_0_20px_rgba(255,255,255,0.55)]'
                        : filled
                          ? 'border-white/80'
                          : 'border-white/35';
                  return (
                    <div
                      key={i}
                      className={`flex h-14 w-11 items-center justify-center rounded-xl border bg-white/10 font-display text-2xl text-white transition-colors duration-300 ${glow}`}
                    >
                      {digit ?? ''}
                    </div>
                  );
                })}
              </motion.div>

              <p id="birthday-code-hint" className="font-body text-[11px] tracking-widest text-warmwhite/70">
                DD&nbsp;&nbsp;MM
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
