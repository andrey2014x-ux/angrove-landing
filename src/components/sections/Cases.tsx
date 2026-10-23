import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface CaseProject {
  id: string;
  num: string;
  client: string;
  statValue: string;
  statLabel: string;
  title: string;
  description: string;
  tags: string[];
}

const PROJECTS: CaseProject[] = [
  {
    id: 'parser',
    num: '01',
    client: 'Поставщик крепежа · СПб',
    statValue: '65x',
    statLabel: 'ускорение сбора базы контактов',
    title: 'Парсинг B2B-каталогов и валидация телефонов',
    description: 'Парсер на Python обходит 14 закрытых каталогов, собирает контакты и проверяет доступность номеров по HLR-валидации.',
    tags: ['Python', 'Playwright', 'amoCRM'],
  },
  {
    id: 'assistant',
    num: '02',
    client: 'Монтаж остекления · Москва',
    statValue: '5.8 сек',
    statLabel: 'время ответа ночью и в выходные',
    title: 'Конверсионный AI-ассистент в Telegram',
    description: 'Бот консультирует по каталогу, рассчитывает вилку сметы и передает квалифицированного лида в CRM с назначением замера.',
    tags: ['Telegram Bot', 'Claude 3.5', 'RAG'],
  },
  {
    id: 'integrations',
    num: '03',
    client: 'Сеть автосервисов · 12 точек',
    statValue: '100%',
    statLabel: 'сходимость складского и финучета',
    title: 'Сквозная связка CRM, склада и Telegram-дайджест',
    description: 'Оплата на кассе мгновенно списывает остатки на складе, а владелец получает персональный дайджест в 08:30:00.',
    tags: ['n8n', 'МойСклад', 'Webhooks'],
  },
];

export const Cases: React.FC = () => {
  const handleDiscussClick = () => {
    trackGoal('click_case_discuss');
    trackGoal('click_telegram');
  };

  return (
    <section
      id="cases"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-3">
              <span>Реализованная практика</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Реальные{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                кейсы
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Отдельные решения, запущенные в реальных компаниях с подтвержденным бизнес-эффектом.
          </p>
        </div>

        {/* 3-Column Modern Dribbble Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div>
                {/* Header: Number & Client Pill */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.06]">
                  <span className="font-mono text-xs font-bold text-ink/40 group-hover:text-blue transition-colors">
                    {proj.num}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono text-zinc-600 font-medium uppercase">
                    {proj.client}
                  </span>
                </div>

                {/* Big Stat Monument */}
                <div className="mb-6">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue font-display tabular-nums">
                    {proj.statValue}
                  </div>
                  <div className="text-xs text-ink/60 font-sans mt-1">
                    {proj.statLabel}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-ink mb-3 leading-snug">
                  {proj.title}
                </h3>

                {/* Project Description */}
                <p className="text-xs sm:text-sm text-ink/70 font-sans leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              {/* Footer: Tags & Action */}
              <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-zinc-100 text-[10px] font-mono font-medium text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDiscussClick}
                  className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-ink group-hover:bg-blue group-hover:text-white transition-all cursor-pointer shrink-0"
                  title="Обсудить похожее решение"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
