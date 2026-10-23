import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight } from 'lucide-react';

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
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      const sub = heroRef.current?.querySelector('.hero-subtitle');
      if (sub) {
        gsap.fromTo(
          sub,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'power3.out' }
        );
      }

      const actions = heroRef.current?.querySelector('.hero-actions');
      if (actions) {
        gsap.fromTo(
          actions,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: 'power3.out' }
        );
      }

      const stats = heroRef.current?.querySelectorAll('.hero-stat');
      if (stats && stats.length) {
        gsap.fromTo(
          stats,
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.55, stagger: 0.1, ease: 'power3.out' }
        );
      }

      if (photoBlockRef.current) {
        gsap.fromTo(
          photoBlockRef.current,
          { opacity: 0, scale: 0.94, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            delay: 0.2,
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
      className="relative bg-transparent text-ink pt-10 sm:pt-16 pb-16 sm:pb-24"
      id="hero"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
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
            <p className="hero-subtitle font-sans text-base sm:text-lg lg:text-xl text-ink/75 font-normal leading-relaxed max-w-xl mb-8">
              Создаю AI-агентов, парсеры и сквозные интеграции под ваши бизнес-процессы. От идеи и схемы — до работающей системы в ваших сервисах.
            </p>

            {/* Actions: Modern Buttons */}
            <div className="hero-actions flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
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
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums">70+</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">проектов в проде</div>
              </div>
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-blue tabular-nums">от 3 дней</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">запуск решения</div>
              </div>
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums">100%</div>
                <div className="text-xs text-ink/60 font-sans mt-0.5">в срок по смете</div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Premium Photo Frame framed by Global 3D */}
          <div
            ref={photoBlockRef}
            className="lg:col-span-5 flex flex-col items-center justify-center w-full relative min-h-[440px] sm:min-h-[500px]"
          >
            {/* Clean, Premium Photo of Andrey */}
            <div className="w-full max-w-[340px] sm:max-w-[390px] relative z-10">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-black/10 shadow-[0_25px_60px_rgba(0,0,0,0.12)] aspect-[4/5]">
                <img
                  src="/andrey.jpg"
                  alt="Андрей — Архитектор систем"
                  className="w-full h-full object-cover object-top select-none"
                  loading="eager"
                  width={390}
                  height={488}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
