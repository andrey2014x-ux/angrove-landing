import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/motion';

interface ProcessStep {
  num: string;
  title: string;
  description: string;
  tag: string;
}

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const steps: ProcessStep[] = [
    {
      num: '01',
      tag: 'Анализ',
      title: 'Разбор задачи',
      description: 'Вы описываете рутину по схеме «когда происходит А → нужно сделать Б → прислать мне В».',
    },
    {
      num: '02',
      tag: 'Архитектура',
      title: 'Схема решения',
      description: 'Рисую, как это будет работать, какие сервисы соединяются и где хранятся данные.',
    },
    {
      num: '03',
      tag: 'Разработка',
      title: 'Рабочий прототип',
      description: 'Собираю скрипт, подключаю API, тестирую на реальных сценариях и граничных случаях.',
    },
    {
      num: '04',
      tag: 'Деплой',
      title: 'Боевой запуск',
      description: 'Подключаю к вашим рабочим сервисам: CRM, Google Sheets, Telegram, телефонии.',
    },
    {
      num: '05',
      tag: 'Поддержка',
      title: 'Поддержка и надзор',
      description: 'Слежу за стабильностью работы, обновляю токены и оперативно дорабатываю под новые задачи.',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate vertical progress tracker
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 45%',
              scrub: 0.5,
            },
          }
        );
      }

      // Highlight each row on scroll
      const items = sectionRef.current?.querySelectorAll('.process-row');
      if (items) {
        items.forEach((item) => {
          const numSpan = item.querySelector('.process-num');
          ScrollTrigger.create({
            trigger: item,
            start: 'top 65%',
            end: 'bottom 40%',
            onEnter: () => {
              gsap.to(numSpan, { color: '#3D5CFF', x: 4, duration: 0.3 });
            },
            onLeave: () => {
              gsap.to(numSpan, { color: 'rgba(10,12,22,0.25)', x: 0, duration: 0.3 });
            },
            onEnterBack: () => {
              gsap.to(numSpan, { color: '#3D5CFF', x: 4, duration: 0.3 });
            },
            onLeaveBack: () => {
              gsap.to(numSpan, { color: 'rgba(10,12,22,0.25)', x: 0, duration: 0.3 });
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Процесс работы</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              От задачи к{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                запуску
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Понятный и прозрачный цикл разработки без бесконечных совещаний и лишней бюрократии.
          </p>
        </div>

        {/* Process Steps Rows with Vertical Scroll Line */}
        <div className="relative">
          {/* Background vertical track line */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-line-dark/20" />
          
          {/* Animated active vertical line */}
          <div
            ref={progressBarRef}
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-blue origin-top will-change-transform"
          />

          <div className="divide-y divide-line-dark border-b border-line-dark md:pl-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="process-row group py-8 sm:py-12 transition-all duration-300 hover:bg-ink/[0.02] cursor-default"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                  {/* Step Index */}
                  <div className="md:col-span-2">
                    <span className="process-num font-display text-4xl sm:text-6xl font-black text-ink/25 transition-all duration-300 inline-block will-change-transform">
                      {step.num}
                    </span>
                    <span className="block mt-1 font-sans text-xs tracking-normal text-ink/60 font-medium">
                      {step.tag}
                    </span>
                  </div>

                  {/* Step Title */}
                  <div className="md:col-span-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-ink group-hover:text-blue transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <div className="md:col-span-6">
                    <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Caption */}
        <p className="mt-12 text-center font-mono text-xs text-ink/60">
          Сроки и стоимость называю после разбора задачи.
        </p>
      </div>
    </section>
  );
};
