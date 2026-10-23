import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../lib/motion';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export const PainChecklist: React.FC = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const items: ChecklistItem[] = [
    {
      id: 'data-transfer',
      title: 'Ручной перенос данных',
      description: 'копируете контакты и заказы из одного приложения в другое.',
    },
    {
      id: 'repetitive-questions',
      title: 'Повторяющиеся вопросы',
      description: 'больше 30 минут в день на одни и те же ответы и прайсы.',
    },
    {
      id: 'delayed-response',
      title: 'Задержки с ответом',
      description: 'клиент написал, а ответ поступил только через 2–3 часа.',
    },
    {
      id: 'manual-search',
      title: 'Ручной поиск',
      description: 'поставщиков и клиентов ищете вручную по картам и каталогам.',
    },
    {
      id: 'forgotten-tasks',
      title: 'Забытые дела',
      description: 'заявки теряются в личных переписках, никто не поставил напоминание.',
    },
  ];

  const toggleItem = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  const countChecked = Object.values(selected).filter(Boolean).length;
  const showBanner = countChecked >= 1;

  const handleResolveClick = () => {
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll('.pain-row');
      if (rows && rows.length) {
        gsap.fromTo(
          rows,
          { opacity: 0.6, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
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
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
      id="problems"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Counter aligned to baseline */}
        <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between pb-8 sm:pb-10 border-b border-line-dark gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink/80">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Диагностика процессов</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
              Где у вас <span className="font-serif italic font-normal text-blue">утекает время?</span>
            </h2>
            <p className="font-sans text-base sm:text-lg text-ink/75 mt-3">
              Отметьте то, с чем регулярно сталкиваетесь в текущей работе.
            </p>
          </div>

          {/* Counter aligned to baseline */}
          <div className="flex items-baseline gap-2 self-start md:self-auto font-mono">
            <span className="font-display font-black text-5xl sm:text-7xl leading-none inline-block text-blue tabular-nums">
              {countChecked}
            </span>
            <span className="font-display font-bold text-xl sm:text-2xl text-ink/40">
              из 5
            </span>
          </div>
        </div>

        {/* 5 Editorial Pain Items */}
        <div className="divide-y divide-line-dark border-b border-line-dark" role="group" aria-label="Чек-лист рутинных процессов">
          {items.map((item, idx) => {
            const isChecked = !!selected[item.id];
            return (
              <div
                key={item.id}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`pain-row py-5 sm:py-6 px-3 sm:px-4 grid grid-cols-[32px_28px_1fr] sm:grid-cols-[40px_28px_1fr_110px] items-center gap-3 sm:gap-6 cursor-pointer select-none transition-colors duration-150 border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                  isChecked 
                    ? 'bg-blue/[0.04] border-blue' 
                    : 'bg-transparent border-transparent hover:bg-black/[0.02]'
                }`}
              >
                {/* Col 1: Number */}
                <span className="font-mono text-sm sm:text-base text-ink/40 font-bold">
                  0{idx + 1}
                </span>
                
                {/* Col 2: Checkbox (28x28 px) */}
                <div
                  className={`w-7 h-7 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                    isChecked 
                      ? 'bg-blue border-blue text-white' 
                      : 'border-ink/30 bg-transparent hover:border-blue'
                  }`}
                >
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>

                {/* Col 3: Text with clean strikethrough */}
                <div className="text-base sm:text-xl lg:text-2xl font-sans leading-snug">
                  <span
                    className={`font-bold transition-colors duration-150 ${
                      isChecked ? 'line-through decoration-blue decoration-[1.5px] text-ink/40' : 'text-ink'
                    }`}
                  >
                    {item.title}:
                  </span>{' '}
                  <span
                    className={`font-normal transition-colors duration-150 ${
                      isChecked ? 'line-through decoration-blue decoration-[1.5px] text-ink/40' : 'text-ink/80'
                    }`}
                  >
                    {item.description}
                  </span>
                </div>

                {/* Col 4: Status */}
                <div className="hidden sm:block text-right text-xs sm:text-sm font-medium transition-colors font-mono">
                  {isChecked ? (
                    <span className="text-blue font-semibold">Выбрано</span>
                  ) : (
                    <span className="text-ink/40 hover:text-ink">Выбрать +</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Result Panel when >= 1 item checked (Refined off-black, no neon glow) */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="mt-8 p-6 sm:p-8 bg-[#0D0F14] text-white border border-white/10 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue" aria-hidden="true" />

              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono font-medium text-blue-light uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-light" aria-hidden="true" />
                  <span>
                    {countChecked <= 2
                      ? `Выявлено ${countChecked} ${countChecked === 1 ? 'узкое место' : 'узких места'}`
                      : `Критическая нагрузка: ${countChecked} из 5 процессов`}
                  </span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-1.5">
                  {countChecked <= 2
                    ? 'Эти задачи можно полностью передать коду'
                    : 'Рутина съедает десятки часов и часть потенциальной выручки'}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-white/75 leading-relaxed">
                  {countChecked <= 2
                    ? `Вы отметили ${countChecked} ${countChecked === 1 ? 'точку потерь' : 'точки потерь'} — автоматизация этих шагов исключит человеческий фактор и сэкономит десятки рабочих часов команды.`
                    : 'Высокая концентрация ручных операций. Внедрение скриптов и AI-агентов окупится уже в первый месяц стабильной работы.'}
                </p>
              </div>

              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleResolveClick}
                className="group relative z-10 inline-flex items-center justify-center gap-2.5 bg-blue text-white px-7 py-4 font-bold text-sm sm:text-base hover:bg-white hover:text-ink transition-colors duration-150 select-none w-full md:w-auto shrink-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Обсудить автоматизацию</span>
                <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
