import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight, ShieldCheck, Terminal, Compass } from 'lucide-react';

export const AboutMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-line-dark/25 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue font-bold">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Об авторе · Инженерная практика</span>
            </div>
            <h2 className="text-[clamp(1.9rem,3.8vw,3.25rem)] font-display font-black tracking-tight leading-[1.1] text-ink">
              Инженерный подход{' '}
              <span className="font-serif italic font-normal text-blue whitespace-nowrap">
                вместо теории
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/75 max-w-lg font-sans leading-relaxed">
            Создаю кастомные системы автоматизации и AI-агентов, которые заменяют ручной труд надежным кодом и экономят сотни часов команды.
          </p>
        </div>

        {/* 2-Column Persona Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Natural Photo Lockup with Hairline Framing (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div
              ref={photoRef}
              className="w-full max-w-md bg-white border border-line-dark/30 p-3 sm:p-4 shadow-xl rounded-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/5 border border-line-dark/10">
                <img
                  src="/andrey-about.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/andrey.jpg')) {
                      target.src = '/andrey.jpg';
                    }
                  }}
                  alt="Андрей (_angrove_) — архитектор систем автоматизации"
                  className="w-full h-full object-cover object-top select-none"
                  loading="lazy"
                  width={400}
                  height={500}
                />
              </div>

              {/* Architectural Metadata Datum Bar */}
              <div className="flex items-center justify-between pt-3 px-1 font-mono text-xs text-ink/70">
                <span className="font-semibold text-ink">Андрей</span>
                <span className="text-blue font-bold">@_angrove_</span>
                <span className="text-ink/40">СПб · Удалённо</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Principles & Proofs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Lead Editorial Quote */}
            <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-ink font-normal leading-snug pb-6 border-b border-line-dark/20">
              «Код должен окупаться в первые же недели после запуска, иначе в автоматизации нет практического смысла.»
            </blockquote>

            {/* 3 Principles / Rules of Engagement */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-white border border-line-dark/20 shadow-xs flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0 mt-0.5 text-blue">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-ink mb-1">
                    Личная ответственность за архитектуру
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                    Я лично проектирую шины данных, пишу код и подключаю API. Никакой передачи задач младшим стажёрам или менеджерам-посредникам.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-line-dark/20 shadow-xs flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0 mt-0.5 text-blue">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-ink mb-1">
                    Фиксация сметы и сроков до старта
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                    Стоимость и график запусков утверждаются до начала разработки. Никаких «почасовых сюрпризов» или скрытых доплат в процессе.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-line-dark/20 shadow-xs flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0 mt-0.5 text-blue">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-ink mb-1">
                    Чистая передача прав и документация
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                    Все исходные коды разворачиваются на вашем сервере, а права на ботов и базы передаются вам. Записываю видеоинструкции для команды.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Hard Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-white/70 border border-line-dark/20 shadow-xs">
                <div className="font-display font-black text-2xl sm:text-3xl text-ink tabular-nums">
                  5+ лет
                </div>
                <div className="text-[11px] font-sans text-ink/65 mt-1">
                  в системной разработке и проектировании баз данных
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-line-dark/20 shadow-xs">
                <div className="font-display font-black text-2xl sm:text-3xl text-blue tabular-nums">
                  70+
                </div>
                <div className="text-[11px] font-sans text-ink/65 mt-1">
                  запущенных ботов, парсеров и сквозных шин
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-line-dark/20 shadow-xs">
                <div className="font-display font-black text-2xl sm:text-3xl text-ink tabular-nums">
                  15 мин
                </div>
                <div className="text-[11px] font-sans text-ink/65 mt-1">
                  среднее время ответа на входящие задачи в Telegram
                </div>
              </div>
            </div>

            {/* Direct Social Proof / Instagram Blog */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink hover:bg-blue text-white text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-all duration-150 active:scale-[0.98] shadow-sm"
              >
                <span>Написать Андрею напрямую</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-black/5 text-ink text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold border border-line-dark/20 transition-all duration-150 active:scale-[0.98]"
              >
                <span>Блог в Instagram*</span>
                <ArrowUpRight className="w-4 h-4 text-ink/40" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
