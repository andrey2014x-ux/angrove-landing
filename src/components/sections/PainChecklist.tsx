import React, { useRef, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';

interface FrictionPoint {
  id: string;
  num: string;
  category: string;
  asIs: string;
  toBe: string;
  metricValue: string;
  metricLabel: string;
}

export const PainChecklist: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  const points: FrictionPoint[] = [
    {
      id: 'data-sync',
      num: '01',
      category: 'РУТИНА ДАННЫХ',
      asIs: 'Сотрудники вручную копируют контакты, заказы и чеки между CRM, мессенджерами и таблицами. Любая опечатка ломает учет.',
      toBe: 'Автономная шина интеграций: данные мгновенно синхронизируются между сервисами в момент события. Ноль ручного ввода.',
      metricValue: '+25 ч/мес',
      metricLabel: 'чистого времени команды',
    },
    {
      id: 'night-leads',
      num: '02',
      category: 'СКОРОСТЬ РЕАКЦИИ',
      asIs: 'Заявка ночью или в выходной висит без ответа часами. К моменту выхода менеджера клиент уже купил у конкурента.',
      toBe: 'AI-агент первого контакта в Telegram: отвечает за 3 секунды, консультирует по прайсу, квалифицирует лида и готовит сделку.',
      metricValue: '< 5 сек',
      metricLabel: 'ответ в любое время суток',
    },
    {
      id: 'manual-parsing',
      num: '03',
      category: 'СБОР БАЗ & МОНИТОРИНГ',
      asIs: 'Менеджеры днями серфят справочники, карты и сайты поставщиков, вручную перепечатывая телефоны и прайсы в Excel.',
      toBe: 'Автономный парсер на Python: сам собирает номенклатуру по расписанию, фильтрует неликвид и кладет чистую базу в CRM.',
      metricValue: '60x',
      metricLabel: 'ускорение сбора базы контактов',
    },
    {
      id: 'fragmented-tools',
      num: '04',
      category: 'РАЗРЫВ СЕРВИСОВ',
      asIs: 'Оплата в одном банке, склад в другой программе, диалоги в Telegram, а собственник тратит вечер на сведение отчета.',
      toBe: 'Сквозная цепочка n8n & API: автоматическое списание остатков, уведомления и утренний персональный дайджест в 08:30:00.',
      metricValue: '100%',
      metricLabel: 'сходимость данных и учета',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const rows = sectionRef.current?.querySelectorAll('.friction-row');
      if (rows && rows.length) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
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
      id="problems"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header with Editorial Rubric */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Анатомия рутины</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Где на самом деле{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                буксуют процессы
              </span>
              ?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/75 max-w-md font-sans leading-relaxed">
            Пока люди часами выполняют механическую работу, бизнес теряет скорость и фокус. Вот 4 узких горлышка, которые я заменяю кодом.
          </p>
        </div>

        {/* Editorial Friction Ledger (Swiss Grid Rows) */}
        <div className="divide-y divide-line-dark border-b border-line-dark">
          {points.map((pt) => (
            <div
              key={pt.id}
              className="friction-row py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start group hover:bg-black/[0.015] transition-colors duration-150 px-2 sm:px-4"
            >
              {/* Col 1: Index & Category */}
              <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-black text-ink/40 group-hover:text-blue transition-colors">
                  {pt.num}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink/60 font-semibold">
                  {pt.category}
                </span>
              </div>

              {/* Col 2: The Bottleneck (As Is) */}
              <div className="lg:col-span-4">
                <div className="text-xs font-mono text-rose-700 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Как сейчас (ручной труд)</span>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-ink/80 leading-relaxed">
                  «{pt.asIs}»
                </p>
              </div>

              {/* Col 3: The Engineered Fix (To Be) */}
              <div className="lg:col-span-3">
                <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Решение кодом</span>
                </div>
                <p className="font-sans text-sm sm:text-base text-ink font-medium leading-relaxed">
                  {pt.toBe}
                </p>
              </div>

              {/* Col 4: Hard Quantitative Effect */}
              <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-center pt-2 lg:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ink font-mono tabular-nums group-hover:text-blue transition-colors">
                  {pt.metricValue}
                </div>
                <div className="text-xs text-ink/60 font-sans mt-0.5 lg:text-right">
                  {pt.metricLabel}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-paper">
          <div className="text-xs sm:text-sm text-ink/80 font-medium">
            Узнали свой процесс хотя бы в одном пункте? Опишите задачу — разберем архитектуру за 15 минут.
          </div>
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelegramClick}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue hover:text-ink transition-colors cursor-pointer select-none whitespace-nowrap"
          >
            <span>Разобрать в Telegram</span>
            <span className="font-sans font-bold transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
