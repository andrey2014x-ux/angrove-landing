import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoBlockRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);

  const handleGuideClick = () => {
    trackGoal('click_guide');
  };

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Reveal headline lines with staggered mask clip
      const lines = headlineRef.current?.querySelectorAll('.hero-line');
      if (lines && lines.length) {
        gsap.fromTo(
          lines,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      // 2. Fade in photo block
      if (photoBlockRef.current) {
        gsap.fromTo(
          photoBlockRef.current,
          { opacity: 0, scale: 0.97, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            delay: 0.15,
            ease: 'power2.out',
          }
        );
      }

      // 3. Subtle continuous parallax on photo image during scroll
      if (photoImgRef.current) {
        gsap.to(photoImgRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative bg-paper text-ink pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-line-dark overflow-hidden"
      id="hero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Left Column: Editorial Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left pt-2">
            
            {/* Category Rubric - Clean, 14-16px, regular case without neon glow */}
            <div className="flex items-center gap-2.5 mb-6 sm:mb-8 text-sm sm:text-base font-medium text-ink/80">
              <span className="w-2 h-2 rounded-full bg-blue flex-shrink-0" aria-hidden="true" />
              <span>AI-инструменты · Автоматизация · Интеграции</span>
            </div>

            {/* H1 with Editorial Typography */}
            <h1
              ref={headlineRef}
              className="font-display font-black tracking-tight leading-[0.93] text-ink select-none"
            >
              <span className="hero-line block text-5xl sm:text-7xl lg:text-[95px] xl:text-[115px] font-black">
                Заменяю
              </span>
              <span className="hero-line block font-serif italic font-normal text-5xl sm:text-7xl lg:text-[95px] xl:text-[115px] tracking-tight my-1 sm:my-2">
                ручной труд
              </span>
              <span className="hero-line block text-6xl sm:text-8xl lg:text-[120px] xl:text-[145px] uppercase font-black tracking-tighter">
                <span className="text-leopard-flow inline-block">
                  КОДОМ
                </span>
              </span>
            </h1>

            {/* Subtitle with Clear Business Offer */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-ink/85 font-normal leading-relaxed max-w-xl mt-6 sm:mt-8 mb-8 sm:mb-10">
              Создаю AI-ассистентов, персональные инструменты, ботов, парсеры и интеграции для авторов, экспертов, команд и компаний. От идеи и схемы процесса — до работающей системы в ваших сервисах и аккаунтах.
            </p>

            {/* Actions: Primary Solid Black (Обсудить задачу) + Secondary Outline (Гид) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="group inline-flex items-center justify-center gap-2.5 bg-ink text-paper hover:bg-blue hover:text-white px-7 py-4 text-sm sm:text-base font-bold transition-all duration-150 select-none cursor-pointer w-full sm:w-auto active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
              >
                <span>Обсудить задачу</span>
                <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href="#guide"
                onClick={handleGuideClick}
                className="group inline-flex items-center justify-center gap-2 border border-ink/30 text-ink hover:border-blue hover:text-blue hover:bg-blue/[0.03] px-7 py-4 text-sm sm:text-base font-bold transition-all duration-150 select-none cursor-pointer w-full sm:w-auto active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
              >
                <span>Получить бесплатный гид</span>
                <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>

            {/* Factual Trust Indicators */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs sm:text-sm text-ink/70 font-medium mt-8 pt-6 border-t border-line-dark/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
                <span>Запуск первых решений от 3 дней</span>
              </div>
              <span className="text-ink/30 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
                <span>Фиксированная смета до старта</span>
              </div>
              <span className="text-ink/30 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
                <span>Договор и закрывающие документы</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Architectural Photo Lockup */}
          <div
            ref={photoBlockRef}
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center w-full relative"
          >
            <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] relative">
              {/* Photo Frame: Clean rectangle with subtle hairline border */}
              <div className="relative overflow-hidden border border-ink/25 bg-slate-100 aspect-[4/5] shadow-sm">
                <img
                  ref={photoImgRef}
                  src="/andrey.jpg"
                  alt="Андрей — Архитектор систем автоматизации"
                  className="w-full h-[112%] -mt-[6%] object-cover object-top select-none will-change-transform"
                  loading="eager"
                  width={440}
                  height={550}
                />
              </div>

              {/* Architectural Datum Badge under photo */}
              <div className="flex items-center justify-between text-xs font-mono text-ink/70 mt-3 pt-2 border-t border-line-dark/20">
                <span>Андрей · Архитектор систем</span>
                <span className="text-blue font-bold">_angrove_</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
