import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { ArrowUpRight, MessageCircle, Send } from 'lucide-react';

export const FinalCta: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handlePrimaryClick = () => {
    trackGoal('final_cta_click');
    trackGoal('telegram_outbound');
  };

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  useEffect(() => {
    let marqueeTween: gsap.core.Tween | null = null;
    if (marqueeRef.current) {
      marqueeTween = gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: 'none',
      });

      ScrollTrigger.create({
        onUpdate: (self) => {
          if (!marqueeTween) return;
          const velocity = Math.abs(self.getVelocity() / 250);
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

  const marqueeText = 'АВТОМАТИЗАЦИЯ · КОД ВМЕСТО РУТИНЫ · AI-АГЕНТЫ · СУВЕРЕНИТЕТ ДАННЫХ · ';

  return (
    <section
      id="contact"
      className="bg-ink text-paper py-24 sm:py-36 border-b border-line-light relative overflow-hidden"
    >
      {/* Scroll Velocity Reactive Ticker */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.06]">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          <span className="font-display font-black text-8xl sm:text-[160px] text-white tracking-tighter uppercase">
            {marqueeText.repeat(5)}
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-4 text-sm sm:text-base font-medium text-paper/70">
          <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
          <span>Начать диалог</span>
        </div>

        {/* H2 Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-paper max-w-4xl mx-auto leading-[1.08] mb-6">
          Есть задача, которая{' '}
          <span className="font-serif italic font-normal text-blue-light lowercase">
            съедает время
          </span>
          ?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-paper/80 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
          Опишите процесс или идею в двух предложениях — отвечу лично и предложу 2–3 варианта автоматизации с оценкой сроков и бюджета.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-2xl mx-auto">
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePrimaryClick}
            className="group inline-flex items-center justify-center gap-3 whitespace-nowrap px-8 py-5 min-w-[280px] w-full sm:w-auto bg-blue text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-white hover:text-ink transition-all duration-150 border border-blue shadow-[0_0_25px_rgba(61,92,255,0.4)] hover:shadow-[0_0_35px_rgba(61,92,255,0.7)]"
          >
            <Send size={16} />
            <span>Обсудить задачу</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInstagramClick}
            className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-7 py-5 min-w-[240px] w-full sm:w-auto bg-transparent text-paper text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-paper/10 transition-colors duration-150 border border-line-light"
          >
            <MessageCircle size={16} />
            <span>Написать в Instagram*</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <p className="text-xs text-paper/50 mt-6 font-mono">
          Опишите процесс или идею в двух предложениях — отвечу лично в течение 2–3 рабочих часов.
        </p>
      </div>
    </section>
  );
};
