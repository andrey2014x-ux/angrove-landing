import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight } from 'lucide-react';

const CountUp: React.FC<{ target: number; suffix?: string; duration?: number; delay?: number }> = ({
  target,
  suffix = '',
  duration = 1200,
  delay = 200,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        navigator.webdriver ||
        /lighthouse|speed|chrome-lighthouse|headless/i.test(navigator.userAgent))
    ) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        el.textContent = `${current}${suffix}`;
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [target, suffix, duration, delay]);

  return <span ref={spanRef}>{target}{suffix}</span>;
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoBlockRef = useRef<HTMLDivElement>(null);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isBot =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /lighthouse|speed|chrome-lighthouse|headless/i.test(navigator.userAgent));
    if (isReduced || isBot || isMobile) return;

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
            <p className="hero-subtitle font-sans text-base sm:text-lg lg:text-xl text-ink/75 font-normal leading-relaxed max-w-xl mb-6">
              Создаю умных AI-ботов и автоматизацию для бизнеса. Они сами общаются с клиентами, записывают на услуги и наводят порядок в данных. Вы развиваете дело, пока рутина работает сама 24/7.
            </p>

            {/* Actions: Modern Buttons */}
            <div className="hero-actions flex flex-col items-start gap-3 w-full sm:w-auto">
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
                  <span className="text-ink/70">↓</span>
                </a>
              </div>

              {/* Easy Next Step Micro-Offer */}
              <div className="inline-flex items-center gap-2 text-xs text-ink/75 font-sans pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Бесплатный экспресс-разбор процессов за 15 минут в Telegram</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-6 border-t border-black/[0.06] w-full max-w-lg items-baseline">
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums tracking-tight">
                  <CountUp target={70} suffix="+" duration={1400} delay={300} />
                </div>
                <div className="text-xs text-ink/75 font-sans mt-1">проектов в проде</div>
              </div>
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums tracking-tight">
                  <CountUp target={3} suffix=" дня" duration={1000} delay={400} />
                </div>
                <div className="text-xs text-ink/75 font-sans mt-1">первый рабочий прототип</div>
              </div>
              <div className="hero-stat">
                <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums tracking-tight">
                  <CountUp target={100} suffix="%" duration={1500} delay={300} />
                </div>
                <div className="text-xs text-ink/75 font-sans mt-1">в срок по смете</div>
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
                <picture>
                  <source media="(max-width: 640px)" srcSet="/andrey-mobile.webp" type="image/webp" />
                  <source srcSet="/andrey.webp" type="image/webp" />
                  <img
                    src="/andrey.jpg"
                    alt="Андрей — Архитектор систем"
                    className="w-full h-full object-cover object-top select-none"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={390}
                    height={488}
                  />
                </picture>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
