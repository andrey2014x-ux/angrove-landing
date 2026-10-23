import React, { useState, useEffect, useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { PillButton } from '../ui/PillButton';
import { LeopardDivider } from '../ui/LeopardDivider';
import { gsap, ScrollTrigger } from '../../lib/motion';
import { Play, Check, Globe, ShieldCheck, Database, MessageSquare } from 'lucide-react';

export const PipelineDemo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState<number>(-1);
  const [timerVal, setTimerVal] = useState<string>('0.0');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const steps = [
    {
      id: 0,
      title: 'Заявка с сайта',
      sub: 'Входящий webhook',
      icon: <Globe size={20} />,
    },
    {
      id: 1,
      title: 'Проверка данных (0.5 с)',
      sub: 'Валидация телефона и e-mail',
      icon: <ShieldCheck size={20} />,
    },
    {
      id: 2,
      title: 'Запись в таблицу',
      sub: 'Google Sheets / CRM',
      icon: <Database size={20} />,
    },
    {
      id: 3,
      title: 'Сообщение вам в Telegram',
      sub: 'Мгновенное уведомление',
      icon: <MessageSquare size={20} />,
    },
  ];

  // Manual Trigger Animation
  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);
    setTimerVal('0.1');

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
      },
    });

    tl.to({}, { duration: 0.4, onComplete: () => { setActiveStep(1); setTimerVal('0.2'); } })
      .to({}, { duration: 0.4, onComplete: () => { setActiveStep(2); setTimerVal('0.4'); } })
      .to({}, { duration: 0.4, onComplete: () => { setActiveStep(3); setTimerVal('0.5'); } });
  };

  // Scroll-tied scrub animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 0.6,
        onUpdate: (self) => {
          if (isRunning) return; // Don't override if manual simulation is playing
          const p = self.progress;
          if (p < 0.25) {
            setActiveStep(0);
            setTimerVal((p * 2).toFixed(1));
          } else if (p < 0.5) {
            setActiveStep(1);
            setTimerVal((p * 1.5).toFixed(1));
          } else if (p < 0.75) {
            setActiveStep(2);
            setTimerVal((p * 0.8).toFixed(1));
          } else {
            setActiveStep(3);
            setTimerVal('0.5');
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isRunning]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-light text-text-dark py-20 sm:py-28 overflow-hidden"
      id="how-it-works"
    >
      {/* Top Leopard divider strip */}
      <div className="absolute top-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading
          category="ПРАКТИКА"
          titlePart1="Как это выглядит"
          titlePart2="на деле"
          subtitle="Нажмите «Запустить» или просто прокручивайте страницу, чтобы посмотреть движение данных в реальном времени."
          align="center"
          isLight={true}
          className="mb-10 sm:mb-14"
        />

        {/* 4-Node Pipeline Flow Container */}
        <div
          ref={containerRef}
          className="bg-white rounded-card-lg p-6 sm:p-10 border border-slate-200/90 shadow-card-light mb-8 relative"
        >
          {/* Realtime Time Counter Badge */}
          <div className="absolute top-4 right-6 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full font-mono text-xs text-text-dark flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-ping" />
            <span>Время обработки: </span>
            <span className="font-bold text-accent">{timerVal} с</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-3 items-center relative mt-6">
            {steps.map((step, idx) => {
              const isCurrent = activeStep === step.id;
              const isPassed = activeStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-accent/10 border-accent shadow-md scale-105'
                      : isPassed
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  {/* Step Number Tag */}
                  <span className="font-mono text-[10px] font-bold text-slate-400 mb-2 uppercase">
                    Шаг 0{idx + 1}
                  </span>

                  {/* Step Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-accent text-white shadow-glow-accent scale-110'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? <Check size={20} strokeWidth={3} /> : step.icon}
                  </div>

                  {/* Step Title */}
                  <h4 className="font-bold text-sm sm:text-base text-text-dark mb-1 leading-snug">
                    {step.title}
                  </h4>

                  {/* Step Sub */}
                  <p className="text-xs text-text-dark-muted font-mono">{step.sub}</p>

                  {/* Connecting Arrow for Desktop */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                      <span className="font-bold text-base">→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Manual Run Action */}
          <div className="mt-8 flex justify-center">
            <PillButton
              variant="dark"
              size="md"
              disabled={isRunning}
              onClick={runSimulation}
              className="min-w-[170px]"
            >
              <Play size={16} className={isRunning ? 'animate-spin' : ''} />
              <span>{isRunning ? 'Выполняется...' : 'Запустить'}</span>
            </PillButton>
          </div>
        </div>

        {/* Mandatory Caption */}
        <p className="font-mono text-xs text-text-dark-muted">
          Иллюстрация типового сценария
        </p>
      </div>

      {/* Bottom Leopard divider strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>
    </section>
  );
};
