import React, { useRef, useEffect } from 'react';
import { PillButton } from '../ui/PillButton';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { Send, Instagram } from 'lucide-react';

export const FinalCta: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  // Scroll velocity reactive marquee
  useEffect(() => {
    let marqueeTween: gsap.core.Tween | null = null;
    if (marqueeRef.current) {
      marqueeTween = gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: 'none',
      });

      // Speed up when scrolling fast
      ScrollTrigger.create({
        onUpdate: (self) => {
          if (!marqueeTween) return;
          const velocity = Math.abs(self.getVelocity() / 300);
          const newTimeScale = Math.min(4, Math.max(1, 1 + velocity));
          gsap.to(marqueeTween, { timeScale: newTimeScale, duration: 0.2 });
          gsap.to(marqueeTween, { timeScale: 1, duration: 0.8, delay: 0.2 });
        },
      });
    }

    return () => {
      marqueeTween?.kill();
    };
  }, []);

  const marqueeText = 'ЕСТЬ ЗАДАЧА? · АВТОМАТИЗАЦИЯ · КОД ВМЕСТО РУТИНЫ · AI-АГЕНТЫ · ';

  return (
    <section className="bg-ink text-white py-24 sm:py-36 relative overflow-hidden" id="final-cta">
      {/* Huge Background Scroll Velocity Reactive Ticker */}
      <div className="absolute top-8 left-0 w-full overflow-hidden pointer-events-none select-none opacity-5">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          <span className="font-display font-black text-7xl sm:text-9xl text-white tracking-tighter">
            {marqueeText.repeat(4)}
          </span>
        </div>
      </div>

      {/* Ambient background electric glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] rounded-full pointer-events-none opacity-20 filter blur-[140px]"
        style={{ background: 'radial-gradient(circle, #3D5CFF 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Rubric */}
        <span className="font-mono text-xs font-bold text-accent-bright tracking-[0.2em] uppercase mb-4 inline-block">
          НАЧАТЬ РАБОТУ
        </span>

        {/* H2 */}
        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6">
          Есть задача, которая <span className="text-accent-bright">съедает время</span>?
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Напишите в двух словах — скажу, можно ли автоматизировать и сколько это займёт.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-md mx-auto">
          <PillButton
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleTelegramClick}
          >
            <Send size={18} className="text-white" />
            <span>Обсудить в Telegram</span>
          </PillButton>

          <PillButton
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleInstagramClick}
          >
            <Instagram size={18} className="text-accent-bright" />
            <span>Написать в Instagram Direct</span>
          </PillButton>
        </div>
      </div>
    </section>
  );
};
