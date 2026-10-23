import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight, ShieldCheck, Server, FileText, Wrench } from 'lucide-react';

export const AboutMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCtaClick = () => {
    trackGoal('about_cta_click');
    trackGoal('telegram_outbound');
  };

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 16,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Dark Architectural Engineering Principles Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start w-full">
            <div
              ref={cardRef}
              className="bg-[#0A0C16] text-white p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden w-full max-w-lg"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white/70">
                    Стандарты разработки
                  </span>
                </div>
                <span className="font-mono text-[11px] text-blue-light bg-blue/15 px-2 py-0.5 border border-blue/30">
                  Инженерный стек
                </span>
              </div>

              <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-5 uppercase tracking-tight">
                Принципы моей работы
              </h3>

              {/* 4 Engineering Principles */}
              <div className="space-y-3 font-sans">
                <div className="p-3.5 bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 font-display font-bold text-white text-sm sm:text-base">
                    <Wrench size={16} className="text-blue" />
                    <span>Чистая архитектура</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Проверенный стек: TypeScript, Python, PostgreSQL, Docker и self-hosted n8n.
                  </p>
                </div>

                <div className="p-3.5 bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 font-display font-bold text-white text-sm sm:text-base">
                    <Server size={16} className="text-blue" />
                    <span>100% суверенитет данных</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Развертывание на ваших серверах или облачных аккаунтах. Без чужих подписок и без vendor-lock.
                  </p>
                </div>

                <div className="p-3.5 bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 font-display font-bold text-white text-sm sm:text-base">
                    <FileText size={16} className="text-blue" />
                    <span>Понятная документация</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Архитектурная схема процесса и видеоинструкция для каждого участника команды.
                  </p>
                </div>

                <div className="p-3.5 bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-2 font-display font-bold text-white text-sm sm:text-base">
                    <ShieldCheck size={16} className="text-blue" />
                    <span>Гарантия стабильности</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    30 дней бесплатного гарантийного сопровождения, мониторинга и устранения любых сбоев после запуска.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Bio */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Обо мне</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink mb-6">
              Привет, я Андрей
            </h2>

            {/* Editorial Serif Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink font-normal leading-snug mb-8 pb-6 border-b border-line-dark">
              «Без абстрактных теорий — проектирую цифровые инструменты под конкретные задачи авторов, команд и компаний.»
            </blockquote>

            {/* Bio Body */}
            <div className="space-y-4 text-base sm:text-lg text-ink/80 leading-relaxed font-sans max-w-xl">
              <p>
                Проектирую AI-ассистентов, связки сервисов и автоматизированные пайплайны. Заменяю рутинный ручной труд кодом, высвобождая фокус для ключевых решений.
              </p>
              <p>
                Работаю напрямую с заказчиком: от первого аудита и проектирования схемы до боевого запуска на ваших серверах и передачи полной документации.
              </p>
            </div>

            {/* 3 Factoids Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-line-dark py-6 my-8 w-full max-w-2xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-ink font-sans">5+ лет</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  практической backend, интеграционной и AI разработки
                </div>
              </div>
              <div className="sm:border-l sm:border-line-dark/40 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-blue font-sans">50+</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  внедренных ботов, парсеров и сквозных систем
                </div>
              </div>
              <div className="sm:border-l sm:border-line-dark/40 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-ink font-sans">100%</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  суверенитет: код и базы разворачиваются на ваших серверах
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-ink text-paper text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-blue hover:text-white transition-colors duration-150 border border-ink shadow-md"
              >
                <span>Обсудить задачу</span>
                <ArrowUpRight size={16} />
              </a>

              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent text-ink text-xs sm:text-sm font-bold uppercase tracking-wider hover:border-ink hover:bg-ink/5 transition-colors duration-150 border border-line-dark"
              >
                <span>Блог в Instagram*</span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <p className="text-[11px] text-ink/40 mt-3 font-sans">
              *Компания Meta признана экстремистской организацией на территории РФ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
