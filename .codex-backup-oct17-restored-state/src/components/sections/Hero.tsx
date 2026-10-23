import React, { useEffect, useRef, useState, Suspense } from 'react';
import { PillButton } from '../ui/PillButton';
import { DuotonePhoto } from '../ui/DuotonePhoto';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { BellRing, Sparkles, Send, Terminal } from 'lucide-react';

// Lazy load OGL WebGL in separate chunk to keep initial bundle < 180 KB gzip
const NeonLinesWebGL = React.lazy(() =>
  import('../ui/NeonLinesWebGL').then((m) => ({ default: m.NeonLinesWebGL }))
);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  const [logText, setLogText] = useState('2GIS: старт сбора...');
  const [loadWebGL, setLoadWebGL] = useState(false);

  // Lazy load WebGL during idle time on desktop
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isFinePointer && !isReduced) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => setLoadWebGL(true));
      } else {
        setTimeout(() => setLoadWebGL(true), 1200);
      }
    }
  }, []);

  // Live typing effect in parser terminal card
  useEffect(() => {
    const logs = [
      '2GIS: старт сбора...',
      'Найдено: 480 компаний',
      'Отсечено: 140 дублей',
      'Телефоны валидны: 100%',
      'Выгрузка в CRM: готово ✓',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % logs.length;
      setLogText(logs[idx]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animations (Split text, scroll parallax, and hero exit)
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Split headline reveal
      const words = headlineRef.current?.querySelectorAll('.hero-word');
      if (words && words.length) {
        gsap.fromTo(
          words,
          { y: 40, opacity: 0, rotateZ: 3 },
          {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }

      // Parallax on scroll (Desktop only)
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        // Photo parallax
        if (photoWrapperRef.current) {
          gsap.to(photoWrapperRef.current, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // Floating card 1: faster parallax
        if (card1Ref.current) {
          gsap.to(card1Ref.current, {
            yPercent: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // Floating card 2: slower parallax
        if (card2Ref.current) {
          gsap.to(card2Ref.current, {
            yPercent: -16,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // Hero exit scale & dimming
        gsap.to(heroRef.current, {
          scale: 0.96,
          opacity: 0.45,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'center top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt on Photo following cursor (Desktop only)
  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const rotateX = (y / (rect.height / 2)) * -8;
    const rotateY = (x / (rect.width / 2)) * 8;

    gsap.to(e.currentTarget, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handlePhotoMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const chips = [
    'AI-агенты',
    'AI-обзвон',
    'Парсеры',
    'Автоматизации',
    'AI-агенты',
    'AI-обзвон',
    'Парсеры',
    'Автоматизации',
  ];

  return (
    <section
      ref={heroRef}
      className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 bg-ink overflow-hidden will-change-transform"
      id="hero"
    >
      {/* 1. Aurora CSS ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[380px] rounded-full pointer-events-none opacity-25 filter blur-[130px] animate-pulse"
        style={{ background: 'radial-gradient(circle, #3D5CFF 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* 2. Optional Lazy OGL WebGL Neon Beams */}
      {loadWebGL && (
        <Suspense fallback={null}>
          <NeonLinesWebGL />
        </Suspense>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Category Rubric */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line mb-5">
              <span className="w-2 h-2 rounded-full bg-accent-bright animate-ping" />
              <span className="font-mono text-xs sm:text-[13px] font-bold text-accent-bright tracking-[0.16em] uppercase">
                АВТОМАТИЗАЦИЯ · AI-АГЕНТЫ · ПАРСЕРЫ
              </span>
            </div>

            {/* H1 with Split Words and Living Leopard Text on «кодом» */}
            <h1
              ref={headlineRef}
              className="font-display font-black text-[32px] sm:text-5xl lg:text-7xl tracking-tight leading-[1.1] sm:leading-[1.05] text-white mb-6"
            >
              <span className="hero-word inline-block">Заменяю</span>{' '}
              <span className="hero-word inline-block">ручной</span>{' '}
              <span className="hero-word inline-block">труд</span>{' '}
              <span className="hero-word inline-block">
                <span
                  className="relative inline-block text-transparent bg-clip-text font-black drop-shadow-[0_0_20px_rgba(97,125,255,0.4)]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #617DFF 0%, #BFD4FF 30%, #3D5CFF 60%, #617DFF 100%)`,
                    backgroundSize: '200% auto',
                    animation: 'gradientFlow 6s ease infinite',
                  }}
                >
                  кодом
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              Собираю системы, которые берут на себя рутину: от парсеров до AI-агентов в Telegram. Без теории, только рабочие решения.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-4">
              <PillButton
                href="#guide"
                variant="primary"
                size="lg"
                onClick={() => trackGoal('click_guide')}
              >
                <Sparkles size={18} className="text-ice" />
                <span>Получить бесплатный гид</span>
              </PillButton>

              <PillButton
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                onClick={() => trackGoal('click_telegram')}
              >
                <Send size={16} className="text-accent-bright" />
                <span>Обсудить задачу</span>
              </PillButton>
            </div>

            {/* Microtext */}
            <p className="font-mono text-xs text-slate-400 pl-1 flex items-center gap-1.5">
              <span className="text-accent-bright">✓</span> Гид «3 инструмента автоматизации» бесплатно.
            </p>
          </div>

          {/* Right Column: Duotone Photo + 3D Tilt + Floating Interactive Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div
              ref={photoWrapperRef}
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={handlePhotoMouseLeave}
              className="relative w-full max-w-[290px] sm:max-w-[380px] duotone-container cursor-pointer will-change-transform"
              data-cursor="photo"
            >
              {/* Photo in Duotone */}
              <DuotonePhoto
                src="/andrey.jpg"
                alt="Андрей (_angrove_) — автоматизация бизнеса"
                className="w-full"
              />

              {/* Floating Card 1: Live Parser Terminal (Top-Left) */}
              <div
                ref={card1Ref}
                className="absolute -top-4 sm:-top-8 -left-2 sm:-left-10 bg-surface/95 backdrop-blur-md border border-line rounded-card p-3 sm:p-4 shadow-card-soft max-w-[210px] sm:max-w-[240px] z-20 pointer-events-none"
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-line/60">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-accent/20 flex items-center justify-center text-accent-bright">
                    <Terminal size={13} />
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white tracking-wide uppercase">
                    Парсер · Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent-bright">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  <span className="truncate">{logText}</span>
                </div>
              </div>

              {/* Floating Card 2: Уведомление «Новая заявка» (Bottom-Right) */}
              <div
                ref={card2Ref}
                className="absolute -bottom-4 sm:-bottom-8 -right-2 sm:-right-10 bg-surface/95 backdrop-blur-md border border-line rounded-card p-3 sm:p-4 shadow-card-soft max-w-[210px] sm:max-w-[250px] z-20 pointer-events-none"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center text-success flex-shrink-0 mt-0.5">
                    <BellRing size={14} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white leading-tight">
                        Новая заявка #104
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
                    </div>
                    <span className="text-[11px] text-slate-300 leading-tight mt-0.5">
                      Квалифицирован AI · 0 сек
                    </span>
                    <span className="font-mono text-[10px] font-bold text-accent-bright mt-1">
                      +120 000 ₽ в CRM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Бегущая строка чипов под героем */}
      <div className="w-full mt-16 sm:mt-24 py-3.5 bg-surface/80 border-y border-line overflow-hidden select-none">
        <div className="flex gap-6 sm:gap-10 animate-marquee whitespace-nowrap">
          {chips.concat(chips).map((chip, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-300 uppercase"
            >
              <span className="text-accent-bright">⚡</span>
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
