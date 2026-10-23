import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/motion';

interface ProcessStep {
  num: string;
  tag: string;
  title: string;
  description: string;
  deliverable: string;
}

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const steps: ProcessStep[] = [
    {
      num: '01',
      tag: 'Разбор процесса',
      title: 'Аудит задачи или идеи',
      description: 'Вы описываете текущий процесс в двух предложениях: откуда приходят данные, что с ними делают вручную и какой результат нужен.',
      deliverable: 'Понимание архитектуры и 2–3 сценария решения до начала любых оплат.',
    },
    {
      num: '02',
      tag: 'Архитектура и смета',
      title: 'Схема и фиксированный договор',
      description: 'Проектирую архитектуру связки сервисов, фиксирую перечень интеграций и закрепляю стоимость в официальном договоре.',
      deliverable: 'Понятный план и зафиксированная смета — никаких скрытых доплат по ходу разработки.',
    },
    {
      num: '03',
      tag: 'Сборка и валидация',
      title: 'Код на ваших боевых данных',
      description: 'Пишу логику, подключаю API мессенджеров, CRM, баз и AI-моделей. Проверяем работу на реальных сценариях и пограничных случаях.',
      deliverable: 'Работающий прототип на ваших данных уже через 3–5 рабочих дней.',
    },
    {
      num: '04',
      tag: 'Боевой запуск',
      title: 'Запуск, документация и гарантия',
      description: 'Развертываю систему на ваших серверах или в ваших аккаунтах, передаю доступы, видеоинструкцию и остаюсь на связи.',
      deliverable: 'Боевая система в вашей собственности без vendor-lock + 30 дней гарантии.',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
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
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Процесс работы</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              От идеи к{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                запуску
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Понятный и прозрачный цикл разработки без бесконечных совещаний и лишней бюрократии.
          </p>
        </div>

        {/* Process Steps Rows */}
        <div className="relative">
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-line-dark/20" />
          
          <div
            ref={progressBarRef}
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px] bg-blue origin-top will-change-transform shadow-[0_0_8px_#3D5CFF]"
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
                    <span className="block mt-1 font-mono text-xs tracking-wider uppercase text-blue font-bold">
                      {step.tag}
                    </span>
                  </div>

                  {/* Step Title */}
                  <div className="md:col-span-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-ink group-hover:text-blue transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Description & Deliverable */}
                  <div className="md:col-span-6 space-y-2.5">
                    <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans max-w-xl">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue/10 border border-blue/20 text-xs font-sans text-ink">
                      <span className="font-mono text-blue font-bold uppercase text-[10px]">
                        Результат:
                      </span>
                      <span className="font-medium text-ink/90">
                        {step.deliverable}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-xs text-ink/60">
          Сроки и стоимость называю после предварительного разбора задачи.
        </p>
      </div>
    </section>
  );
};
