import React, { useEffect, useState } from 'react';
import { LeopardDivider } from './LeopardDivider';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check session storage or prefers-reduced-motion
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPreloaded = sessionStorage.getItem('angrove_preloaded_v1');

    // Skip preloader on mobile to ensure instant load from Instagram/Telegram
    const isMobile = window.innerWidth < 768;

    if (hasPreloaded || isReduced || isMobile) {
      setVisible(false);
      onComplete();
      return;
    }

    // Run crisp 0.6s counter on desktop
    const duration = 0.6;
    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('angrove_preloaded_v1', 'true');
        // Curtain wipe up
        gsap.to('#preloader-curtain', {
          yPercent: -100,
          duration: 0.35,
          ease: 'power3.inOut',
          onComplete: () => {
            setVisible(false);
            onComplete();
          },
        });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: duration,
      ease: 'power1.inOut',
      onUpdate: () => {
        setProgress(Math.floor(obj.val));
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      id="preloader-curtain"
      className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center select-none"
      aria-label="Загрузка страницы"
    >
      <div className="w-full max-w-[320px] sm:max-w-[420px] px-6 flex flex-col items-center">
        {/* Brand Monogram */}
        <div className="font-mono text-2xl font-black text-white tracking-widest mb-6">
          <span className="text-blue">_</span>angrove<span className="text-blue">_</span>
        </div>

        {/* Leopard Progress Bar Container */}
        <div className="w-full h-4 bg-surface rounded-full border border-line overflow-hidden relative shadow-card-soft mb-4">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-bright transition-all duration-75 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Animated Leopard Texture inside the progress fill */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <LeopardDivider height={16} />
            </div>
          </div>
        </div>

        {/* Counter and status */}
        <div className="w-full flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="uppercase tracking-wider text-accent-bright">Загрузка систем</span>
          <span className="font-bold text-white tracking-widest">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
