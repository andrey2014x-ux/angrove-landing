import React, { useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { LeopardDivider } from '../ui/LeopardDivider';
import { gsap } from '../../lib/motion';

interface ProcessStep {
  num: string;
  title: string;
  description: string;
}

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  const steps: ProcessStep[] = [
    {
      num: '1',
      title: 'Разбор задачи',
      description: 'вы описываете рутину по схеме «когда происходит А → нужно сделать Б → прислать мне В».',
    },
    {
      num: '2',
      title: 'Схема',
      description: 'рисую, как это будет работать.',
    },
    {
      num: '3',
      title: 'Прототип',
      description: 'собираю рабочую версию.',
    },
    {
      num: '4',
      title: 'Запуск',
      description: 'подключаю к вашим сервисам.',
    },
    {
      num: '5',
      title: 'Поддержка',
      description: 'слежу за работой и дорабатываю.',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current || !lineProgressRef.current) return;

    const ctx = gsap.context(() => {
      // Line drawing scrub
      gsap.fromTo(
        lineProgressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );

      // Steps stagger animation
      const stepElements = sectionRef.current?.querySelectorAll('.process-step-item');
      if (stepElements) {
        stepElements.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0.45, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                end: 'bottom 60%',
                scrub: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-light text-text-dark py-20 sm:py-28 overflow-hidden"
      id="process"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          category="ПРОЦЕСС"
          titlePart1="От задачи до"
          titlePart2="запуска"
          subtitle="Прозрачные и понятные этапы сотрудничества без лишней бюрократии."
          align="center"
          isLight={true}
          className="mb-14 sm:mb-20"
        />

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10">
          {/* Timeline background track */}
          <div
            className="absolute left-[27px] sm:left-[35px] top-6 bottom-6 w-1 bg-slate-200 rounded-full"
            aria-hidden="true"
          />

          {/* Timeline animated active line */}
          <div
            ref={lineProgressRef}
            className="absolute left-[27px] sm:left-[35px] top-6 bottom-6 w-1 bg-accent rounded-full origin-top will-change-transform shadow-[0_0_8px_rgba(61,92,255,0.6)]"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-6 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="process-step-item flex items-start gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-card border border-slate-200/90 shadow-card-light transition-all duration-300 relative z-10"
              >
                {/* Step Number Circle */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent text-white font-mono font-bold text-base sm:text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {step.num}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 sm:pt-1.5">
                  <h3 className="font-display font-black text-lg sm:text-xl text-text-dark mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-dark-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Caption */}
        <p className="mt-12 text-center font-mono text-xs text-text-dark-muted">
          Сроки и стоимость называю после разбора задачи.
        </p>
      </div>

      {/* Bottom Leopard divider strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>
    </section>
  );
};
