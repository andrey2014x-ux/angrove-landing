import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoBlockRef = useRef<HTMLDivElement>(null);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll('.hero-line');
      if (lines && lines.length) {
        gsap.fromTo(
          lines,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }

      if (photoBlockRef.current) {
        gsap.fromTo(
          photoBlockRef.current,
          { opacity: 0, scale: 0.96, y: 20 },
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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative bg-paper text-ink pt-8 sm:pt-14 pb-14 sm:pb-20 overflow-hidden"
      id="hero"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-sm mb-6 text-xs sm:text-sm font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Свободен для 1 проекта на этой неделе</span>
              <span className="text-ink/30">|</span>
              <span className="text-blue font-semibold">_angrove_</span>
            </div>

            {/* H1 Headline with Leopard Code Text */}
            <h1
              ref={headlineRef}
              className="font-display font-black tracking-tight leading-[0.95] text-ink select-none mb-6"
            >
              <span className="hero-line block text-5xl sm:text-7xl lg:text-[88px] font-black">
                Заменяю
              </span>
              <span className="hero-line block font-serif italic font-normal text-5xl sm:text-7xl lg:text-[88px] tracking-tight my-1">
                ручной труд
              </span>
              <span className="hero-line block text-6xl sm:text-8xl lg:text-[110px] uppercase font-black tracking-tighter">
                <span className="text-leopard-flow inline-block">
                  КОДОМ
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-ink/75 font-normal leading-relaxed max-w-xl mb-8">
              Создаю AI-агентов, парсеры и сквозные интеграции под ваши бизнес-процессы. От идеи и схемы — до работающей системы в ваших сервисах.
            </p>

            {/* Actions: Dribbble Modern Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="group inline-flex items-center justify-center gap-2.5 bg-blue text-white rounded-full px-8 py-4 text-sm sm:text-base font-bold shadow-[0_10px_25px_rgba(61,92,255,0.35)] hover:shadow-[0_15px_35px_rgba(61,92,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Обсудить задачу</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-white text-ink rounded-full px-8 py-4 text-sm sm:text-base font-bold border border-black/[0.08] shadow-sm hover:border-black/20 hover:bg-zinc-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Смотреть решения</span>
                <span className="text-ink/40">↓</span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-8 border-t border-black/[0.06] w-full max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums">70+</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">проектов в проде</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-display text-blue tabular-nums">от 3 дней</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">запуск решения</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums">100%</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">в срок по смете</div>
              </div>
            </div>
          </div>

          {/* Right Column: Dribbble Modern Photo Card */}
          <div
            ref={photoBlockRef}
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center w-full relative"
          >
            <div className="w-full max-w-[360px] sm:max-w-[420px] relative">
              {/* Photo Box with curved corners, soft gradient shadow */}
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] aspect-[4/5]">
                <img
                  src="/andrey.jpg"
                  alt="Андрей — Архитектор систем"
                  className="w-full h-full object-cover object-top select-none"
                  loading="eager"
                  width={420}
                  height={525}
                />
                
                {/* Overlay Floating Glass Badges */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A0C16]/80 backdrop-blur-md border border-white/10 text-white shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-blue-light font-bold">АНДРЕЙ · АРХИТЕКТОР</div>
                    <div className="text-sm font-bold text-white mt-0.5">Личная разработка под ключ</div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Floating micro-badge */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-ink text-xs font-bold shadow-lg border border-black/[0.06]">
                <Sparkles className="w-3.5 h-3.5 text-blue" />
                <span>Python & n8n Core</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
