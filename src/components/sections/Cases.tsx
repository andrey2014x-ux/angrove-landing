import React, { useRef } from 'react';
import { ArrowUpRight, MessageSquare, Bell, TrendingUp, Database } from 'lucide-react';
import { getTelegramUrl, TELEGRAM_MESSAGES } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

interface PushResult {
  id: string;
  source: string;
  sourceBadge: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  message: string;
  metricBadge: string;
  metricSub: string;
  niche: string;
}

const NOTIFICATIONS: PushResult[] = [
  {
    id: 'push-booking',
    source: 'Telegram · Бот записи',
    sourceBadge: 'YClients',
    time: 'только что',
    icon: <MessageSquare className="w-4 h-4 text-blue" />,
    iconBg: 'bg-blue/10',
    title: 'Визит подтвержден роботом',
    message: '«Пациент Анна (завтра 14:00, чистка лица) подтвердила приход живым голосом. Слот в расписании окрашен в зеленый».',
    metricBadge: '–68% неявок',
    metricSub: '+240 000 ₽ выручки в месяц',
    niche: 'Клиники, салоны, услуги',
  },
  {
    id: 'push-leads',
    source: 'Telegram · AI-Менеджер',
    sourceBadge: 'amoCRM',
    time: '23:42',
    icon: <Bell className="w-4 h-4 text-emerald-600" />,
    iconBg: 'bg-emerald-500/10',
    title: 'Новая ночная заявка в CRM',
    message: '«Клиент рассчитал смету на замер (184 000 ₽), оставил номер и выбрал время созвона на субботу. Сделка создана».',
    metricBadge: 'Ответ за 3 сек',
    metricSub: '+38% к закрытым договорам',
    niche: 'Монтаж, ремонт, B2C-услуги',
  },
  {
    id: 'push-sync',
    source: 'Telegram · Утренний дайджест',
    sourceBadge: 'МойСклад',
    time: '08:30:00',
    icon: <TrendingUp className="w-4 h-4 text-purple-600" />,
    iconBg: 'bg-purple-500/10',
    title: 'Ежедневная сводка директору',
    message: '«Вчера: 34 заказа с сайта и кассы. Остатки на складе списаны секунда в секунду. Ошибок и пересортов: 0».',
    metricBadge: '0 ошибок учета',
    metricSub: '120 часов экономии команды',
    niche: 'Склад, опт, розница',
  },
  {
    id: 'push-parser',
    source: 'Telegram · Сбор контактов',
    sourceBadge: 'Excel / CRM',
    time: '15:10',
    icon: <Database className="w-4 h-4 text-amber-600" />,
    iconBg: 'bg-amber-500/10',
    title: 'База проверенных номеров готова',
    message: '«Сбор по 14 городам завершен: 4 200 мобильных номеров директоров проверены по сотовой сети и загружены в Excel».',
    metricBadge: '60x быстрее',
    metricSub: '2 недели рутины за 3 часа',
    niche: 'B2B-продажи, снабжение',
  },
];

export const Cases: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.08 });

  const handleDiscussClick = () => {
    trackGoal('click_case_discuss');
    trackGoal('click_telegram');
  };

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold uppercase tracking-wider text-blue">
              <span className="w-2 h-2 rounded-full bg-blue" />
              <span>Результаты в реальном времени</span>
            </div>
            <WordReveal
              as="h2"
              text="Что приходит вам в Telegram"
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink"
              highlightWords={{ Telegram: 'font-serif italic font-normal text-blue lowercase' }}
            />
            <p data-reveal="desc" className="text-xs sm:text-sm text-ink/70 max-w-xl font-sans leading-relaxed mt-3">
              Вам не нужно учиться программированию или сидеть в сложных панелях. Рутина работает сама, а в ваш телефон приходят готовые результаты.
            </p>
          </div>

          <a
            href={getTelegramUrl(TELEGRAM_MESSAGES.cases)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDiscussClick}
            className="inline-flex items-center gap-2 bg-white text-ink border border-black/[0.08] hover:border-black/20 hover:bg-zinc-50 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs self-start md:self-auto shrink-0"
          >
            <span>Настроить под мой бизнес</span>
            <ArrowUpRight className="w-4 h-4 text-blue" />
          </a>
        </div>

        {/* 4 Push Notification Cards (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-8">
          {NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              data-reveal="card"
              className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Notification Top Bar (iOS/macOS style) */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-sans font-bold text-xs text-ink">
                        {item.source}
                      </div>
                      <div className="text-[10px] font-mono text-ink/75 font-medium">
                        {item.niche}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      {item.sourceBadge}
                    </span>
                    <span className="font-mono text-[10px] text-ink/70 font-mono">
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Notification Body */}
                <h3 className="text-base sm:text-lg font-bold text-ink mb-2 tracking-tight leading-snug">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-ink/75 leading-relaxed bg-zinc-50/70 p-3.5 rounded-2xl border border-black/[0.03]">
                  {item.message}
                </p>
              </div>

              {/* Bottom Metric Pill */}
              <div className="pt-4 mt-4 border-t border-black/[0.04] flex items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-blue tracking-tight block">
                    {item.metricBadge}
                  </span>
                  <span className="text-[11px] font-sans text-ink/75 block">
                    {item.metricSub}
                  </span>
                </div>

                <a
                  href={getTelegramUrl(TELEGRAM_MESSAGES.cases)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDiscussClick}
                  className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-ink/60 group-hover:bg-blue group-hover:text-white transition-all cursor-pointer shrink-0"
                  title="Хочу такое же уведомление"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
