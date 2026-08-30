import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LiquidIntro from './components/LiquidIntro';
import PasswordScene from './components/PasswordScene';
import CinematicTransition from './components/CinematicTransition';
import RoseVideoScene from './components/RoseVideoScene';

// ✏️ EDIT ME — the birthday code that unlocks the experience (DDMM).
const BIRTHDAY_CODE = '3101';

type Stage = 'INTRO' | 'PASSWORD' | 'TRANSITION' | 'ROSE_VIDEO';

export default function App() {
  const [stage, setStage] = useState<Stage>('INTRO');

  const goToPassword = useCallback(() => setStage('PASSWORD'), []);
  const goToTransition = useCallback(() => setStage('TRANSITION'), []);
  const goToVideo = useCallback(() => setStage('ROSE_VIDEO'), []);

  return (
    <div className="stage">
      <AnimatePresence mode="wait">
        {stage === 'INTRO' && <LiquidIntro key="intro" onComplete={goToPassword} />}

        {stage === 'PASSWORD' && (
          <PasswordScene key="password" code={BIRTHDAY_CODE} onUnlocked={goToTransition} />
        )}

        {stage === 'TRANSITION' && (
          <CinematicTransition key="transition" onDone={goToVideo} />
        )}

        {stage === 'ROSE_VIDEO' && <RoseVideoScene key="video" />}
      </AnimatePresence>
    </div>
  );
}
