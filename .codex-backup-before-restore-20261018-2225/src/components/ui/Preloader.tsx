import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check session storage or prefers-reduced-motion
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPreloaded = sessionStorage.getItem('angrove_preloaded_v2');

    // Skip preloader on mobile or if already visited
    const isMobile = window.innerWidth < 768;

    if (hasPreloaded || isReduced || isMobile) {
      setVisible(false);
      onComplete();
      return;
    }

    // Fast 400ms editorial reveal on first desktop visit
    sessionStorage.setItem('angrove_preloaded_v2', 'true');

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.to('#preloader-line', {
      scaleX: 1,
      duration: 0.35,
      ease: 'power2.inOut',
    }).to('#preloader-curtain', {
      opacity: 0,
      duration: 0.25,
      ease: 'power1.out',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      id="preloader-curtain"
      className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="font-display text-2xl font-black text-white tracking-tight">
          _angrove_
        </div>
        <div className="w-32 h-[2px] bg-white/20 overflow-hidden relative">
          <div
            id="preloader-line"
            className="w-full h-full bg-blue origin-left scale-x-0"
          />
        </div>
      </div>
    </div>
  );
};
