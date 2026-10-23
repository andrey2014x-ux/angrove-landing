import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface CaseStudy {
  id: string;
  num: string;
  clientBadge: string;
  category: string;
  title: string;
  problem: string;
  solution: string;
  metrics: Array<{
    value: string;
    label: string;
    sub: string;
  }>;
  pipeline: string[];
  quote: {
    text: string;
    author: string;
  };
}

const CASES_DATA: CaseStudy[] = [
  {
    id: 'parser',
    num: '01',
    clientBadge: 'Оптовый поставщик строительного крепежа · Санкт-Петербург',
    category: 'ПАРСИНГ & ВАЛИДАЦИЯ БАЗ',
    title: 'Автоматический сбор B2B-каталогов и мониторинг цен конкурентов',
    problem: '2 менеджера ежедневно тратили по 3.5 часа на монотонный обход 14 каталогов и сайтов, вручную копируя контакты и цены в Excel. База содержала до 40% битых телефонов.',
    solution: 'Развернут автономный кластер парсинга на Python и Playwright. Робот в 06:00 обходит закрытые и динамические сайты, извлекает артикулы и цены, проверяет доступность телефонов по HLR-валидации и выгружает готовый чистый реестр в amoCRM.',
    metrics: [
      {
        value: '65x',
        label: 'Ускорение сбора базы',
        sub: 'с 4 часов до 3 мин 12 сек',
      },
      {
        value: '99.2%',
        label: 'Чистая база ЛПР',
        sub: 'HLR-валидация без мусора',
      },
      {
        value: '60 ч/мес',
        label: 'Экономия времени',
        sub: 'перенаправлено в прямые продажи',
      },
    ],
    pipeline: ['Каталоги & 2ГИС', 'Playwright Engine', 'HLR Валидация', 'PostgreSQL', 'amoCRM Сделка'],
    quote: {
      text: 'Раньше сбор базы был постоянным мучением. Теперь каждое утро у менеджеров на столе свежий проверенный реестр со всеми прямыми номерами. Конверсия в звонок выросла на четверть.',
      author: 'Михаил Т., коммерческий директор',
    },
  },
  {
    id: 'assistant',
    num: '02',
    clientBadge: 'Производственно-монтажная компания (остекление) · Москва',
    category: 'AI-АГЕНТЫ 24/7 & RAG',
    title: 'Мгновенная квалификация лидов и расчет предварительных смет в Telegram',
    problem: 'До 30% входящих обращений с рекламы поступали вечером и в выходные. Менеджеры отвечали только утром — потенциальные клиенты успевали уйти к более быстрым конкурентам.',
    solution: 'Интегрирован конверсионный AI-ассистент с RAG по актуальному прайс-листу и регламентам компании. Бот за секунды квалифицирует объект, рассчитывает точную вилку сметы и передает готовый бриф в CRM с назначением замера.',
    metrics: [
      {
        value: '5.8 сек',
        label: 'Время ответа клиенту',
        sub: 'круглосуточно без выходных',
      },
      {
        value: '+23.4%',
        label: 'Рост ночной конверсии',
        sub: 'в подтвержденный замер',
      },
      {
        value: '0',
        label: 'Потерянных лидов',
        sub: '100% обращений фиксируются в CRM',
      },
    ],
    pipeline: ['Входящий лид', 'Telegram API', 'FastAPI / Redis', 'Claude 3.5 RAG', 'amoCRM Лид'],
    quote: {
      text: 'Бот окупился уже на второй неделе, когда квалифицировал крупного заказчика загородного коттеджа в субботу в 23:40, пока вся команда отдыхала.',
      author: 'Артем В., основатель компании',
    },
  },
  {
    id: 'digest',
    num: '03',
    clientBadge: 'Сеть сервисных центров и розничных магазинов запчастей',
    category: 'СКВОЗНЫЕ ИНТЕГРАЦИИ & n8n',
    title: 'Синхронизация CRM, склада и автоматическая утренняя сводка владельцу',
    problem: 'Заявки терялись между почтой, мессенджерами и кассой. Собственник каждое утро тратил по 45 минут на ручное сведение таблиц из трех несовместимых программ.',
    solution: 'Собрана шина обмена данными на базе n8n и вебхуков: автоматическое сопоставление платежей, списание остатков на складе и ежедневный пуш-дайджест ровно в 08:30:00 с ключевыми финансовыми показателями.',
    metrics: [
      {
        value: '100%',
        label: 'Сходимость финучета',
        sub: 'ноль неучтенных транзакций',
      },
      {
        value: '0 мин',
        label: 'Ручной рутины владельца',
        sub: 'полная автоматизация отчетов',
      },
      {
        value: '< 1 сек',
        label: 'Синхронизация остатков',
        sub: 'между складом и кассами',
      },
    ],
    pipeline: ['Оплата на кассе', 'Webhook шина', 'МойСклад API', 'CRM Синхронизация', 'Push владельцу'],
    quote: {
      text: 'Впервые за 4 года бизнеса я вижу реальные остатки и чистую прибыль на экране телефона в один клик, без ожидания вечерних отчетов от бухгалтера.',
      author: 'Сергей Д., управляющий партнер',
    },
  },
];

export const Cases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const current = CASES_DATA[activeTab];

  const handleDiscussClick = () => {
    trackGoal('click_case_discuss');
    trackGoal('click_telegram');
  };

  return (
    <section
      id="cases"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Практика внедрения</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Реализованные кейсы{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                в цифрах
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/75 max-w-md font-sans leading-relaxed">
            Реальные проекты автоматизации: от исходной проблемы и архитектуры кода до измеримой экономической отдачи для бизнеса.
          </p>
        </div>

        {/* Case Selector Tabs (Clean Swiss Numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-6 border-b border-line-dark">
          {CASES_DATA.map((c, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`text-left p-4 sm:p-5 border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-ink bg-ink text-paper shadow-sm'
                    : 'border-line-dark bg-transparent text-ink hover:border-ink/50 hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue-light' : 'text-ink/40'}`}>
                    0{idx + 1} // {c.category}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-blue" />}
                </div>
                <div className="font-bold text-xs sm:text-sm uppercase tracking-tight leading-snug">
                  {c.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Documentary Case Dossier */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="pt-10 sm:pt-14"
          >
            {/* Context Badge */}
            <div className="font-mono text-xs text-ink/60 uppercase tracking-wider pb-4 mb-6 border-b border-line-dark/30">
              ЗАКАЗЧИК: {current.clientBadge}
            </div>

            {/* Title & Core Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Narrative Problem & Solution */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-ink leading-tight mb-8">
                    {current.title}
                  </h3>

                  <div className="space-y-6 text-sm sm:text-base leading-relaxed font-sans">
                    <div className="border-l-2 border-rose-500 pl-4 py-1">
                      <div className="text-xs font-mono text-rose-700 uppercase tracking-wider font-bold mb-1">
                        Исходное узкое место
                      </div>
                      <p className="font-serif italic text-ink/80 text-base sm:text-lg">
                        «{current.problem}»
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-4 py-1">
                      <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold mb-1">
                        Инженерная реализация
                      </div>
                      <p className="text-ink font-medium">
                        {current.solution}
                      </p>
                    </div>
                  </div>

                  {/* Architecture Strip */}
                  <div className="mt-8 p-4 sm:p-5 border border-line-dark bg-paper">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ink/50 font-bold mb-3">
                      Схема потока данных
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {current.pipeline.map((step, i) => (
                        <React.Fragment key={step}>
                          <span className="px-2.5 py-1 bg-black/[0.04] border border-line-dark text-ink font-semibold">
                            {step}
                          </span>
                          {i < current.pipeline.length - 1 && (
                            <span className="text-ink/40 font-bold">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review quote */}
                <div className="mt-8 pt-6 border-t border-line-dark/40">
                  <p className="font-serif italic text-sm sm:text-base text-ink/85 leading-relaxed mb-2">
                    «{current.quote.text}»
                  </p>
                  <div className="text-xs font-mono text-ink/50 uppercase font-semibold">
                    — {current.quote.author}
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Massive Metric Monuments */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="border border-line-dark divide-y divide-line-dark bg-paper">
                  {current.metrics.map((m, idx) => (
                    <div key={idx} className="p-6 sm:p-7 hover:bg-black/[0.015] transition-colors">
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink font-mono tabular-nums mb-1">
                        {m.value}
                      </div>
                      <div className="font-sans font-bold text-sm sm:text-base text-ink uppercase tracking-tight">
                        {m.label}
                      </div>
                      <div className="font-sans text-xs text-ink/60 mt-0.5">
                        {m.sub}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={config.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDiscussClick}
                    className="group w-full inline-flex items-center justify-center gap-2.5 bg-ink text-paper hover:bg-blue hover:text-white px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer active:scale-[0.98]"
                  >
                    <span>Хочу внедрить такое решение</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
