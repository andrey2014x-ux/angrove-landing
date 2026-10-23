import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface SystemDossier {
  id: string;
  code: string;
  title: string;
  role: string;
  problem: string;
  solution: string;
  flowSteps: Array<{ label: string; sub: string }>;
  specs: {
    timeline: string;
    investment: string;
    stack: string;
    effect: string;
  };
  ctaLabel: string;
}

const SYSTEMS: SystemDossier[] = [
  {
    id: 'agents',
    code: 'SYS-01 // AI_AGENTS',
    title: 'AI-агенты и боты первого контакта',
    role: 'Квалификация лидов и клиентский сервис 24/7',
    problem: 'Клиенты не хотят ждать ответа по прайсу 2 часа, а менеджеры тратят рабочее время на ответы на одни и те же типовые вопросы.',
    solution: 'Автономный агент, обученный на базе знаний и регламентах компании. Понимает опечатки и голосовые сообщения, рассчитывает предварительную стоимость и заносит квалифицированного лида в CRM.',
    flowSteps: [
      { label: 'Обращение в Telegram', sub: 'текст или голос' },
      { label: 'FastAPI / Webhook', sub: 'маршрутизация' },
      { label: 'Claude 3.5 + RAG', sub: 'база знаний прайса' },
      { label: 'amoCRM / Bitrix24', sub: 'создание сделки' },
      { label: 'Уведомление менеджеру', sub: 'готовый бриф' },
    ],
    specs: {
      timeline: '3–5 рабочих дней',
      investment: 'от 30 000 ₽',
      stack: 'Python · FastAPI · LangChain · Telegram API · amoCRM',
      effect: '+30% к конверсии первого контакта, мгновенный ответ даже ночью',
    },
    ctaLabel: 'Обсудить AI-агента',
  },
  {
    id: 'voice',
    code: 'SYS-02 // VOICE_TELEPHONY',
    title: 'Голосовые AI-роботы и телефония',
    role: 'Холодный обзвон и прием звонков без выгорания операторов',
    problem: 'Живые операторы быстро выгорают при монотонном прозвоне баз, часто ошибаются и стоят дорого при низкой конверсии холодных звонков.',
    solution: 'Синтез живого голоса с естественными интонациями и задержкой ответа < 500 мс. Робот ведет диалог по сценарию, обрабатывает возражения и переводит заинтересованного клиента на старшего менеджера.',
    flowSteps: [
      { label: 'Входящий звонок / База', sub: 'реестр номеров' },
      { label: 'SIP / Asterisk', sub: 'телефония' },
      { label: 'Whisper STT', sub: 'распознавание речи' },
      { label: 'LLM Reasoning', sub: 'логика диалога' },
      { label: 'Cartesia TTS', sub: 'живой синтез речи' },
      { label: 'Перевод на оператора', sub: 'горячий лид' },
    ],
    specs: {
      timeline: '5–8 рабочих дней',
      investment: 'от 40 000 ₽',
      stack: 'SIP Trunk · Whisper STT · Cartesia / ElevenLabs · FastAPI',
      effect: 'До 1 000 звонков в час по цене от 2 ₽/мин, 0 пропущенных обращений',
    },
    ctaLabel: 'Обсудить голосового бота',
  },
  {
    id: 'parsers',
    code: 'SYS-03 // PARSERS_DATA',
    title: 'Парсеры и регулярный сбор B2B-данных',
    role: 'Мониторинг цен, сбор каталогов и валидация контактов ЛПР',
    problem: 'Поиск контрагентов и отслеживание прайсов конкурентов вручную отнимает недели работы и дает устаревшие данные с мусорными номерами.',
    solution: 'Автономный парсер на базе браузерной автоматизации. Собирает данные с закрытых каталогов, справочников и маркетплейсов по расписанию, отсекает дубли и проверяет доступность телефонов.',
    flowSteps: [
      { label: 'Источники данных', sub: 'карты, каталоги, сайты' },
      { label: 'Playwright Cluster', sub: 'обход блокировок' },
      { label: 'HLR Lookup API', sub: 'проверка доступности' },
      { label: 'PostgreSQL Store', sub: 'структурирование' },
      { label: 'amoCRM / Sheets', sub: 'автоматический экспорт' },
    ],
    specs: {
      timeline: '2–4 рабочих дня',
      investment: 'от 25 000 ₽',
      stack: 'Python · Playwright · Anti-Captcha · PostgreSQL · Google API',
      effect: '60x ускорение сбора базы, 99% валидность телефонных номеров',
    },
    ctaLabel: 'Обсудить парсер данных',
  },
  {
    id: 'integrations',
    code: 'SYS-04 // PIPELINE_MESH',
    title: 'Сквозные интеграции сервисов & n8n',
    role: 'Бесшовная связка CRM, склада, банков и мессенджеров',
    problem: 'Информация разрознена: оплата прошла в банке, склад остался без списания, менеджер забыл поставить задачу, а владелец не видит реальной картины.',
    solution: 'Единая шина обмена данными. Каждое событие в одном сервисе мгновенно запускает цепочку обновлений во всех остальных с автоматической генерацией документов и отчетов.',
    flowSteps: [
      { label: 'Событие на сайте', sub: 'заказ или оплата' },
      { label: 'Банковский Webhook', sub: 'фиксация транзакции' },
      { label: 'n8n Engine Core', sub: 'бизнес-логика связки' },
      { label: 'МойСклад / 1C', sub: 'списание номенклатуры' },
      { label: 'Telegram Push', sub: 'сводка владельцу' },
    ],
    specs: {
      timeline: '4–7 рабочих дней',
      investment: 'от 35 000 ₽',
      stack: 'n8n Enterprise · REST Webhooks · 1C / МойСклад · Telegram API',
      effect: '100% сходимость учета, исключение ручного переноса документов',
    },
    ctaLabel: 'Обсудить интеграцию систем',
  },
];

export const Services: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = SYSTEMS[activeIdx];

  const handleCtaClick = () => {
    trackGoal('click_services_cta');
    trackGoal('click_telegram');
  };

  return (
    <section
      id="services"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Инженерные решения</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Четыре типа{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                цифровых систем
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/75 max-w-md font-sans leading-relaxed">
            От точечных Telegram-ботов до распределенных интеграционных контуров. Каждый проект строится под конкретные сервисы и бизнес-задачи.
          </p>
        </div>

        {/* System Category Selector Tabs (Editorial Hairline Tabs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 py-6 border-b border-line-dark">
          {SYSTEMS.map((sys, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`text-left p-3 sm:p-4 border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-ink bg-ink text-paper shadow-sm'
                    : 'border-line-dark bg-transparent text-ink hover:border-ink/50 hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue-light' : 'text-ink/50'}`}>
                    0{idx + 1}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue" />}
                </div>
                <div className="font-bold text-xs sm:text-sm uppercase tracking-tight leading-snug">
                  {sys.title.split(' ')[0]} {sys.title.split(' ')[1] || ''}
                </div>
              </button>
            );
          })}
        </div>

        {/* System Architectural Dossier Sheet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="pt-10 sm:pt-14"
          >
            {/* Dossier Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line-dark/40">
              <div className="font-mono text-xs uppercase tracking-wider text-blue font-bold">
                {current.code}
              </div>
              <div className="text-xs font-mono text-ink/60">
                НАЗНАЧЕНИЕ: {current.role}
              </div>
            </div>

            {/* Dossier Body: 2 Wide Editorial Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 py-8 items-start">
              {/* Left Side: Editorial Problem / Solution Context */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-ink leading-tight mb-6">
                    {current.title}
                  </h3>

                  <div className="space-y-5 text-sm sm:text-base text-ink/80 leading-relaxed font-sans">
                    <div>
                      <div className="text-xs font-mono text-rose-700 uppercase tracking-wider font-bold mb-1.5">
                        Узкое место процесса
                      </div>
                      <p className="font-serif italic text-ink/75">
                        «{current.problem}»
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold mb-1.5">
                        Инженерная реализация
                      </div>
                      <p className="text-ink font-medium">
                        {current.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-line-dark/30">
                  <a
                    href={config.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCtaClick}
                    className="group inline-flex items-center gap-2.5 bg-ink text-paper hover:bg-blue hover:text-white px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer active:scale-[0.98]"
                  >
                    <span>{current.ctaLabel}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {/* Right Side: Architectural Data Pipeline & Specifications */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Pipeline Flow Schema */}
                <div className="border border-line-dark bg-paper p-5 sm:p-6">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-line-dark text-xs font-mono">
                    <span className="font-bold text-ink uppercase tracking-wider">
                      Архитектура контура данных
                    </span>
                    <span className="text-blue font-bold">DATA_FLOW_MAP</span>
                  </div>

                  {/* Flow Nodes (Responsive Horizontal / Staggered Chain) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {current.flowSteps.map((step, i) => (
                      <React.Fragment key={step.label}>
                        <div className="flex-1 bg-black/[0.03] border border-line-dark p-2.5 sm:p-3 text-left">
                          <div className="font-mono text-[10px] text-ink/40 font-bold mb-0.5">
                            0{i + 1}
                          </div>
                          <div className="font-sans font-bold text-xs sm:text-[13px] text-ink leading-snug">
                            {step.label}
                          </div>
                          <div className="font-sans text-[10px] text-ink/60 mt-0.5">
                            {step.sub}
                          </div>
                        </div>

                        {i < current.flowSteps.length - 1 && (
                          <div className="flex items-center justify-center text-ink/30 font-bold text-xs sm:text-sm shrink-0 rotate-90 sm:rotate-0 my-[-2px] sm:my-0">
                            →
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Hard Specifications Ledger (4-Cell Matrix) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-line-dark p-4 bg-paper">
                    <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-1">
                      Срок внедрения
                    </div>
                    <div className="font-sans font-bold text-base sm:text-lg text-ink">
                      {current.specs.timeline}
                    </div>
                  </div>

                  <div className="border border-line-dark p-4 bg-paper">
                    <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-1">
                      Ориентир стоимости
                    </div>
                    <div className="font-sans font-bold text-base sm:text-lg text-ink">
                      {current.specs.investment}
                    </div>
                  </div>

                  <div className="col-span-2 border border-line-dark p-4 bg-paper">
                    <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-1">
                      Стек технологий
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-ink/90 font-medium">
                      {current.specs.stack}
                    </div>
                  </div>

                  <div className="col-span-2 border border-line-dark p-4 bg-paper">
                    <div className="font-mono text-[10px] text-blue uppercase tracking-wider font-bold mb-1">
                      Бизнес-эффект
                    </div>
                    <div className="font-sans font-medium text-xs sm:text-sm text-ink/85">
                      {current.specs.effect}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
