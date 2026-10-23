import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { Check, ArrowUpRight, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  num: string;
  title: string;
  description: string;
  hoursMonthly: number;
  tag: string;
}

export const PainChecklist: React.FC = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    'data-transfer': true,
    'delayed-response': true,
  });
  const sectionRef = useRef<HTMLElement>(null);

  const items: ChecklistItem[] = [
    {
      id: 'data-transfer',
      num: '01',
      title: 'Ручной перенос данных',
      description: 'Менеджеры вручную копируют контакты, заказы и чеки между CRM, мессенджерами и Google Таблицами.',
      hoursMonthly: 24,
      tag: 'Потери: ~24 ч/мес',
    },
    {
      id: 'delayed-response',
      num: '02',
      title: 'Медленный ответ клиентам',
      description: 'Заявки вечером и в выходные висят без ответа по несколько часов — клиенты успевают уйти к конкурентам.',
      hoursMonthly: 18,
      tag: 'Потери: до 28% лидов',
    },
    {
      id: 'repetitive-dialogs',
      num: '03',
      title: 'Однотипные вопросы и прайсы',
      description: 'Сотрудники тратят до трети рабочего дня на отправку одинаковых PDF, расчет типовых смет и переписку.',
      hoursMonthly: 20,
      tag: 'Потери: ~20 ч/мес',
    },
    {
      id: 'manual-scraping',
      num: '04',
      title: 'Ручной сбор контактов и цен',
      description: 'Поиск контрагентов, мониторинг конкурентов и выгрузка баз делаются вручную по справочникам и картам.',
      hoursMonthly: 26,
      tag: 'Потери: ~26 ч/мес',
    },
    {
      id: 'lost-leads',
      num: '05',
      title: 'Забытые сделки без напоминаний',
      description: 'Заявки теряются в личных чатах, никто не поставил задачу перезвонить, воронка не контролируется сквозным учетом.',
      hoursMonthly: 16,
      tag: 'Потери: ~15% выручки',
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

  const selectedItems = items.filter((item) => selected[item.id]);
  const countChecked = selectedItems.length;
  const totalHoursLost = selectedItems.reduce((acc, curr) => acc + curr.hoursMonthly, 0);

  const handleResolveClick = () => {
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll('.pain-matrix-row');
      if (rows && rows.length) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
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
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
      id="problems"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-line-dark/25">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue font-bold">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Диагностика бизнес-процессов</span>
            </div>
            <h2 className="text-[clamp(1.9rem,3.8vw,3.25rem)] font-display font-black tracking-tight leading-[1.1] text-ink">
              Где в компании{' '}
              <span className="font-serif italic font-normal text-blue whitespace-nowrap">
                утекает ресурс?
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-ink/75 max-w-lg font-sans leading-relaxed">
            Отметьте операции, которые сейчас выполняются вручную. Калькулятор мгновенно рассчитает примерный объём скрытых потерь рабочего времени.
          </p>
        </div>

        {/* 2-Column Diagnostic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-10 items-start">
          
          {/* Left Column: Interactive 5 Rows (7 cols) */}
          <div className="lg:col-span-7 space-y-3" role="group" aria-label="Диагностическая матрица рутины">
            {items.map((item) => {
              const isChecked = !!selected[item.id];
              return (
                <div
                  key={item.id}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`pain-matrix-row p-4 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer select-none flex items-start gap-4 ${
                    isChecked
                      ? 'bg-white border-blue shadow-md'
                      : 'bg-white/40 border-line-dark/15 hover:bg-white/70 hover:border-line-dark/30'
                  }`}
                >
                  {/* Custom Pill Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-150 ${
                      isChecked
                        ? 'bg-blue border-blue text-white'
                        : 'border-ink/25 bg-white/60'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                  </div>

                  {/* Text & Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink/40 font-bold">{item.num}</span>
                        <h3 className="font-sans font-bold text-base sm:text-lg text-ink tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        isChecked 
                          ? 'bg-blue/10 text-blue border border-blue/20' 
                          : 'bg-black/5 text-ink/50'
                      }`}>
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Real-time Telemetry & Economic Effect (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="p-6 sm:p-8 rounded-3xl bg-ink text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-light" />
                  <span className="font-mono text-xs text-zinc-300 uppercase tracking-wider font-semibold">
                    Оценка потерь ресурса
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Live расчет
                </span>
              </div>

              {/* Grand Live Hours Numeral */}
              <div className="mb-6">
                <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1">
                  Скрытые операционные потери:
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight tabular-nums">
                    {totalHoursLost > 0 ? `~${totalHoursLost}` : '0'}
                  </span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-blue-light">
                    часов / месяц
                  </span>
                </div>
                <div className="text-xs font-sans text-zinc-400 mt-1">
                  {countChecked === 0
                    ? 'Выберите процессы слева для диагностики'
                    : `Выявлено ${countChecked} из 5 узких мест в текущих процессах`}
                </div>
              </div>

              {/* Diagnostic Interpretation */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {countChecked === 0 ? (
                  <p>Отметьте хотя бы один пункт, чтобы увидеть стратегию автоматизации и оценку сроков запуска.</p>
                ) : countChecked <= 2 ? (
                  <p>
                    <strong className="text-white block mb-1">Точечная автоматизация:</strong>
                    Эти задачи можно полностью передать Telegram-боту или парсеру за 3–5 рабочих дней. Команда перестанет отвлекаться на монотонный ввод данных.
                  </p>
                ) : (
                  <p>
                    <strong className="text-emerald-400 block mb-1">Высокая нагрузка рутиной:</strong>
                    Связка CRM, шины n8n и умного ассистента высвободит время целого сотрудника и полностью исключит человеческие ошибки при обработке заявок.
                  </p>
                )}
              </div>

              {/* Action Button */}
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleResolveClick}
                className="w-full py-4 px-6 rounded-xl bg-blue hover:bg-blue-dark text-white font-mono text-xs uppercase tracking-wider font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-lg"
              >
                <span>Разобрать процессы в Telegram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="text-[11px] font-mono text-zinc-500 text-center mt-3">
                Бесплатный разбор одного процесса · Ответ до 15 минут
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
