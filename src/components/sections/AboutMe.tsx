import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { ArrowUpRight } from 'lucide-react';

export const AboutMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Natural Photo with Leopard Stripe & Sharp 1px Border */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div
              ref={photoRef}
              className="relative border border-line-dark bg-white p-2 sm:p-3 shadow-xl max-w-sm w-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                <img
                  src="/andrey-about.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/andrey.jpg')) {
                      target.src = '/andrey.jpg';
                    }
                  }}
                  alt="Андрей (_angrove_) — автоматизация бизнеса"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />

                {/* Vertical signature leopard stripe overlay on right edge */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-8 sm:w-10 bg-leopard border-l border-line-dark/40"
                  aria-hidden="true"
                />
              </div>

              {/* Photo Caption Badge */}
              <div className="flex items-center justify-between pt-3 pb-1 px-1 font-sans text-xs text-ink/70 font-medium">
                <span>Андрей</span>
                <span>Архитектор систем автоматизации</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Bio */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Обо мне</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink mb-6">
              Привет, я Андрей
            </h2>

            {/* Editorial Serif Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink font-normal leading-snug mb-8 pb-6 border-b border-line-dark">
              «Без теории, только практичные и рабочие решения для бизнеса.»
            </blockquote>

            {/* Bio Body */}
            <div className="space-y-4 text-base sm:text-lg text-ink/80 leading-relaxed font-sans max-w-xl">
              <p>
                Создаю кастомные системы автоматизации и AI-решения, которые заменяют ручной труд кодом и экономят десятки часов команды.
              </p>
              <p>
                В блоге на реальных примерах показываю, как избавляться от рутины, связывать между собой сервисы и освобождать время предпринимателя для масштабирования.
              </p>
            </div>

            {/* 3 Factoids Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-line-dark py-6 my-8 w-full max-w-2xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-ink font-sans tabular-nums">5+ лет</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  в IT-разработке и архитектуре систем
                </div>
              </div>
              <div className="sm:border-l sm:border-line-dark/40 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-blue font-sans tabular-nums">50+</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  внедренных ботов, парсеров и автоматизаций
                </div>
              </div>
              <div className="sm:border-l sm:border-line-dark/40 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-ink font-sans tabular-nums">100%</div>
                <div className="text-xs text-ink/70 font-sans mt-1 leading-relaxed">
                  практический код под задачи бизнеса без лишней бюрократии
                </div>
              </div>
            </div>

            {/* Sharp Action Link without Instagram camera logo */}
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-ink text-paper text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-blue hover:text-white active:scale-[0.98] transition-all duration-150 border border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <span>Блог в Instagram*</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

