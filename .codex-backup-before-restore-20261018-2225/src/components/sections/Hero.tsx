import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const blueLineRef = useRef<HTMLDivElement>(null);

  const handlePrimaryClick = () => {
    trackGoal('hero_cta_click');
    trackGoal('telegram_outbound');
  };

  const handleSecondaryClick = () => {
    trackGoal('case_cta_click');
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Blue datum line expands across top
      if (blueLineRef.current) {
        gsap.fromTo(
          blueLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }
        );
      }

      // 2. Headline mask reveal
      const lines = headlineRef.current?.querySelectorAll('.hero-mask-line');
      if (lines && lines.length) {
        gsap.fromTo(
          lines,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }

      // 3. Subtle portrait integration
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.25 }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="bg-paper text-ink pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-line-dark relative overflow-hidden select-none"
      aria-label="Главный экран"
    >
      {/* Top Coordinate Datum Line */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mb-6 sm:mb-10">
        <div className="relative h-[1px] w-full bg-line-dark/20 overflow-hidden">
          <div
            ref={blueLineRef}
            className="absolute inset-0 bg-blue origin-left"
          />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Editorial Grid: Asymmetrical layout with integrated portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Column: Typography & Action */}
          <div ref={headlineRef} className="lg:col-span-8 flex flex-col items-start z-10">
            
            {/* Eyebrow with blue indicator */}
            <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-6 text-xs sm:text-sm font-mono uppercase tracking-widest text-ink/80">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>AI-инструменты · Автоматизация · Интеграции</span>
            </div>

            {/* H1 Main Meaningful Headline with Typographic Mask */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.98] tracking-tight uppercase text-ink mb-4 sm:mb-6">
              <div className="overflow-hidden">
                <span className="hero-mask-line inline-block">Проектирую</span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-mask-line inline-block">цифровые системы</span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-mask-line inline-block font-serif italic font-normal text-blue lowercase tracking-normal">
                  под ваши процессы
                </span>
              </div>
            </h1>

            {/* Signature Brand Statement */}
            <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-ink mb-6 sm:mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Заменяю ручной труд</span>
              <span className="text-leopard-flow tracking-wider drop-shadow-[0_0_12px_rgba(61,92,255,0.4)]">
                КОДОМ
              </span>
            </div>

            {/* Subtitle & Value Promise */}
            <p className="font-sans text-base sm:text-lg md:text-xl text-ink/90 font-normal leading-relaxed max-w-2xl mb-3">
              Создаю AI-ассистентов, персональные инструменты, ботов, парсеры и интеграции для авторов, экспертов, команд и компаний.
            </p>
            <p className="font-mono text-xs sm:text-sm text-ink/60 mb-8 sm:mb-10 max-w-xl">
              От идеи и схемы процесса — до работающей системы в ваших сервисах и аккаунтах.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePrimaryClick}
                className="group inline-flex items-center justify-center gap-2.5 bg-ink text-paper hover:bg-blue hover:text-white px-8 py-4 sm:py-4.5 text-sm sm:text-base font-black uppercase tracking-wider transition-all duration-150 border border-ink shadow-md active:scale-[0.99] min-h-[48px]"
              >
                <span>Обсудить задачу</span>
                <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>

              <a
                href="#cases"
                onClick={handleSecondaryClick}
                className="group inline-flex items-center justify-center gap-2 border border-line-dark text-ink hover:border-blue hover:text-blue hover:bg-blue/5 px-7 py-4 sm:py-4.5 text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-150 min-h-[48px]"
              >
                <span>Посмотреть проекты</span>
                <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>

            {/* Reassuring Subtext */}
            <p className="text-xs sm:text-sm text-ink/65 font-sans mt-3.5">
              Опишите процесс или идею в двух предложениях — отвечу лично и предложу варианты архитектуры.
            </p>
          </div>

          {/* Integrated Portrait Column (Architectural Framing) */}
          <div
            ref={photoRef}
            className="lg:col-span-4 flex flex-col items-center lg:items-end w-full relative mt-4 lg:mt-0"
          >
            <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] relative">
              
              {/* Backing structural blue graphic */}
              <div 
                className="absolute -top-3 -right-3 bottom-3 left-3 border border-blue/30 -z-10 pointer-events-none hidden sm:block" 
                aria-hidden="true"
              />

              {/* Photo Frame: Architectural crop without bloated rounded borders */}
              <div className="relative border border-ink/25 shadow-2xl bg-neutral-900 aspect-[4/5] overflow-hidden">
                <img
                  src="/andrey.jpg"
                  alt="Андрей — Архитектор цифровых систем"
                  className="w-full h-full object-cover object-top select-none filter contrast-[1.03]"
                  loading="eager"
                  width={400}
                  height={500}
                />

                {/* Subtle gradient vignette at photo base */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />

                {/* Technical Coordinates Badge inside the photo crop */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 font-mono text-[11px] tracking-tight">
                  <span className="bg-ink/80 px-2 py-0.5 backdrop-blur-sm border border-white/10">
                    Андрей · Архитектор систем
                  </span>
                  <span className="text-blue-light font-bold">
                    _angrove_
                  </span>
                </div>
              </div>

              {/* Meta caption under photo */}
              <div className="w-full flex items-center justify-between font-mono text-[11px] text-ink/60 mt-2 px-1">
                <span>IT-инженерия · AI-агенты</span>
                <span>Self-hosted</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
