import React, { useState } from 'react';
import { trackGoal } from '../../lib/analytics';
import { config } from '../../config';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface SolutionItem {
  id: string;
  num: string;
  title: string;
  targetAudience: string;
  description: string;
  architecture: string[];
  deliverable: string;
  timelineFrom: string;
  priceFrom: string;
}

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const solutions: SolutionItem[] = [
    {
      id: 'personal-tool',
      num: '01',
      title: 'Персональный AI-инструмент',
      targetAudience: 'Для авторов, экспертов и исследователей',
      description:
        'Инструмент с базой знаний ваших статей, курсов или закрытых методологий. Отвечает вашей аудитории вашим тоном, ищет фрагменты в терабайтах заметок и готовит черновики материалов.',
      architecture: [
        'База знаний на векторной базе данных (RAG)',
        'Индивидуальный бот в Telegram / веб-интерфейс',
        'Синхронизация с Notion или Obsidian',
      ],
      deliverable: 'Работающий инструмент в вашем личном Telegram под ключ + видеоинструкция.',
      timelineFrom: 'от 3 дней',
      priceFrom: 'от 35 000 ₽',
    },
    {
      id: 'communications',
      num: '02',
      title: 'Ассистент коммуникаций и контента',
      targetAudience: 'Для продюсеров, инфлюенсеров и медиа-команд',
      description:
        'Автоматическая фильтрация и маршрутизация входящего потока. Отсеивает спам, отвечает на типовые запросы 24/7, а коммерческие предложения с высоким чеком направляет лично вам.',
      architecture: [
        'Мультиканальный шлюз (Telegram, Direct, Почта)',
        'Интеллектуальная квалификация намерений',
        'Мгновенная передача горячих лидов с контекстом',
      ],
      deliverable: 'Чистый входящий поток без рутинных переписок и потери важных запросов.',
      timelineFrom: 'от 4 дней',
      priceFrom: 'от 45 000 ₽',
    },
    {
      id: 'data-sync',
      num: '03',
      title: 'Автоматизация данных и связка сервисов',
      targetAudience: 'Для растущих команд и стартапов',
      description:
        'Бесшовные интеграции между разрозненными платформами: платежные шлюзы, CRM, базы данных, Google Таблицы. Исключает ручной перенос контактов, чеков и человеческие ошибки копирования.',
      architecture: [
        'Двусторонняя отказоустойчивая синхронизация',
        'Автоматическая дедупликация и валидация',
        'Алерты в технический чат при сбоях сторонних API',
      ],
      deliverable: 'Единая экосистема сервисов, работающая без участия человека.',
      timelineFrom: 'от 3 дней',
      priceFrom: 'от 30 000 ₽',
    },
    {
      id: 'enterprise-system',
      num: '04',
      title: 'Сквозная цифровая система процессов',
      targetAudience: 'Для компаний и внутренних отделов',
      description:
        'Комплексный конвейер: регулярный парсинг открытых источников, обогащение данных, автоматическая генерация документов и утренняя управленческая сводка в Telegram.',
      architecture: [
        'Self-hosted серверный контур (n8n / Docker / VPS)',
        'Генератор Excel, PDF и счетов',
        'Ежедневный дайджест ключевых метрик руководителю',
      ],
      deliverable: 'Автономная инфраструктура на ваших серверах с пожизненной документацией.',
      timelineFrom: 'от 1 недели',
      priceFrom: 'от 65 000 ₽',
    },
  ];

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    trackGoal('service_selected');
  };

  const handleCtaClick = () => {
    trackGoal('services_cta_click');
    trackGoal('telegram_outbound');
  };

  const current = solutions[activeTab];

  return (
    <section
      id="solutions"
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
      aria-label="Диапазон решений"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-xs sm:text-sm font-mono uppercase tracking-widest text-ink/75">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Масштаб возможностей</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase text-ink">
              Диапазон решений:{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                от инструмента до системы
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/70 max-w-md font-sans leading-relaxed">
            Под любые повторяющиеся процессы с данными, коммуникациями и сервисами. Без шаблонов и лишней бюрократии.
          </p>
        </div>

        {/* Desktop 4-Tab Architectural Navigation Rail */}
        <div className="hidden lg:grid grid-cols-4 gap-4 my-8">
          {solutions.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(idx)}
                className={`text-left p-5 border transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[140px] ${
                  isActive
                    ? 'bg-ink text-paper border-ink shadow-lg -translate-y-1'
                    : 'bg-paper text-ink border-line-dark/30 hover:border-line-dark hover:bg-ink/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="font-bold opacity-60">{item.num}</span>
                  {isActive && <span className="text-blue-light font-bold">● Активно</span>}
                </div>
                <div>
                  <div className="font-display font-black text-lg uppercase tracking-tight mb-1">
                    {item.title}
                  </div>
                  <div className={`text-xs font-sans ${isActive ? 'text-paper/70' : 'text-ink/60'}`}>
                    {item.targetAudience}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Accordion Style Tabs */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 my-6 no-scrollbar">
          {solutions.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(idx)}
                className={`shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  isActive
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink border-line-dark/30'
                }`}
              >
                {item.num}. {item.title}
              </button>
            );
          })}
        </div>

        {/* Selected Solution Editorial Stage Card */}
        <div className="bg-[#0A0C16] text-white p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Radial Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue/15 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-blue-light font-mono text-xs uppercase tracking-wider mb-4 border border-white/10">
                <Sparkles size={13} />
                <span>{current.targetAudience}</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white mb-4 leading-tight">
                {current.title}
              </h3>

              <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                {current.description}
              </p>

              {/* Architectural Highlights */}
              <div className="space-y-2 mb-8 border-t border-white/10 pt-4">
                <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">
                  Архитектура решения:
                </div>
                {current.architecture.map((arch, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-2.5 font-sans text-xs sm:text-sm text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                    <span>{arch}</span>
                  </div>
                ))}
              </div>

              {/* Deliverable result badge */}
              <div className="p-3.5 rounded bg-white/[0.04] border border-white/10 font-sans text-xs sm:text-sm text-blue-light flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase font-bold text-white shrink-0">Результат:</span>
                <span className="text-white/80">{current.deliverable}</span>
              </div>
            </div>

            {/* Right Summary & Action Column */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10">
              
              <div className="space-y-6 mb-8">
                <div>
                  <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-1">
                    Срок запуска:
                  </div>
                  <div className="font-display font-black text-xl sm:text-2xl text-white">
                    {current.timelineFrom}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-1">
                    Ориентир стоимости:
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-blue-light">
                    {current.priceFrom}
                  </div>
                  <div className="font-sans text-[11px] text-white/50 mt-1">
                    Точную смету фиксируем в договоре до начала разработки
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-blue hover:bg-blue-light text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-colors duration-150 shadow-[0_0_20px_rgba(61,92,255,0.4)]"
                >
                  <span>Обсудить задачу</span>
                  <ArrowUpRight size={16} />
                </a>
                <p className="text-[11px] font-sans text-white/40 text-center mt-2.5">
                  Опишите процесс в двух предложениях — отвечу лично
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
