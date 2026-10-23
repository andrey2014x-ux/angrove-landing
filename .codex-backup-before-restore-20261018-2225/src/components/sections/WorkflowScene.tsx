import React, { useState, useEffect, useRef } from 'react';
import { trackGoal } from '../../lib/analytics';
import { RotateCcw, ArrowRight, Check } from 'lucide-react';

interface Scenario {
  id: string;
  tabLabel: string;
  title: string;
  category: string;
  input: {
    badge: string;
    label: string;
    detail: string;
    rawPayload: string;
  };
  processing: {
    steps: Array<{ label: string; sub: string }>;
    duration: string;
  };
  output: {
    badge: string;
    label: string;
    detail: string;
    metric: string;
  };
}

export const WorkflowScene: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [pulseProgress, setPulseProgress] = useState<number>(100);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasAutoRun, setHasAutoRun] = useState<boolean>(false);

  const scenarios: Scenario[] = [
    {
      id: 'leads',
      tabLabel: '01 · Заявки и клиенты',
      category: 'Квалификация & CRM',
      title: 'Сквозной путь входящего лида за 1.2 секунды',
      input: {
        badge: 'Сырой входящий поток',
        label: 'Заявка с сайта / Telegram / Авито',
        detail: 'Неструктурированный текст, контактный номер, время 23:40',
        rawPayload: '{"source": "tg_bot", "text": "Нужен расчет сметы на склад 400м²", "phone": "+7 903 124-**-**"}',
      },
      processing: {
        steps: [
          { label: 'Антиспам & дедупликация', sub: 'Проверка номера по базе контактов' },
          { label: 'AI-анализ намерения', sub: 'Определение категории объекта и бюджета' },
          { label: 'Сделка в CRM & роутинг', sub: 'Назначение ответственного эксперта' },
        ],
        duration: '1.2 сек',
      },
      output: {
        badge: 'Чистый результат',
        label: 'Сделка создана + алерт в Telegram',
        detail: 'Менеджер получает карточку с готовым расчетом и контактом клиента',
        metric: '0 потерянных заявок',
      },
    },
    {
      id: 'content',
      tabLabel: '02 · Контент и медиатека',
      category: 'Для авторов & экспертов',
      title: 'Голосовая заметка → структурированный пост и Notion',
      input: {
        badge: 'Голосовой поток',
        label: 'Аудиозаметка 3:45 в Telegram-боте',
        detail: 'Сбивчивая речь, мысли на ходу, фоновый шум улицы',
        rawPayload: 'audio_file.ogg [1.8 MB] · "Слушай, пришла идея поста про 3 ошибки автоматизации..."',
      },
      processing: {
        steps: [
          { label: 'Whisper транскрипция', sub: 'Превращение речи в чистый русский текст' },
          { label: 'LLM-структурирование', sub: 'Выделение тезисов, хука и выводов' },
          { label: 'Синхронизация Notion & TG', sub: 'Черновик в канал + архив в базу знаний' },
        ],
        duration: '4.8 сек',
      },
      output: {
        badge: 'Готовый артефакт',
        label: 'Сверстанный пост + база знаний',
        detail: 'Готовый текст с форматированием ждет одного клика для публикации',
        metric: '45 мин экономии на пост',
      },
    },
    {
      id: 'sync',
      tabLabel: '03 · Синхронизация данных',
      category: 'Интеграции & Сводки',
      title: 'Прайсы, остатки и утренний дайджест собственнику',
      input: {
        badge: 'Разрозненные базы',
        label: 'Прайс-листы поставщиков + 3 таблицы',
        detail: 'Несовпадающие форматы, 1 400 строк номенклатуры',
        rawPayload: 'suppliers_feed.xml (4.2 MB) + internal_crm_orders.json + payment_gateway',
      },
      processing: {
        steps: [
          { label: 'Парсинг и сопоставление SKU', sub: 'Нормализация артикулов и валют' },
          { label: 'Проверка маржи и алерты', sub: 'Выявление расхождений и скачков цен' },
          { label: 'Генерация утренней сводки', sub: 'Формирование компактного отчета' },
        ],
        duration: '2.5 сек',
      },
      output: {
        badge: 'Управленческий контроль',
        label: 'Дайджест в Telegram в 09:00',
        detail: 'Чистые ключевые цифры без необходимости открывать громоздкие таблицы',
        metric: '100% актуальность цен',
      },
    },
  ];

  const current = scenarios[activeScenarioIdx];

  const triggerAnimation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setPulseProgress(0);
    trackGoal('motion_demo_replayed');

    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 5;
      if (currentP >= 100) {
        clearInterval(interval);
        setPulseProgress(100);
        setIsSimulating(false);
      } else {
        setPulseProgress(currentP);
      }
    }, 40);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoRun) {
          setHasAutoRun(true);
          triggerAnimation();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAutoRun]);

  return (
    <section
      ref={containerRef}
      id="workflow"
      className="bg-[#0A0C16] text-paper py-20 sm:py-28 relative overflow-hidden border-b border-white/10"
      aria-label="Интерактивная архитектурная схема автоматизации"
    >
      {/* Background radial spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-blue/15 blur-[160px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-white/70">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Архитектура потока данных</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white">
              От хаоса к{' '}
              <span className="font-serif italic font-normal text-blue-light lowercase">
                системе
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-xs sm:text-sm text-white/70 max-w-sm font-sans leading-relaxed">
              Как входящие сигналы превращаются в готовый результат без ручного перекладывания и ошибок.
            </p>

            <button
              type="button"
              onClick={triggerAnimation}
              disabled={isSimulating}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-none text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                isSimulating
                  ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-blue border-blue hover:bg-blue-light text-white shadow-[0_0_20px_rgba(61,92,255,0.35)]'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Поток идет...' : 'Запустить поток'}</span>
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-8 pb-8 border-b border-white/5" role="tablist">
          {scenarios.map((sc, idx) => {
            const isSelected = activeScenarioIdx === idx;
            return (
              <button
                key={sc.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveScenarioIdx(idx);
                  triggerAnimation();
                }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-mono transition-all duration-150 border cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 text-white border-blue shadow-[inset_0_-2px_0_#3D5CFF]'
                    : 'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{sc.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tripartite Architectural Visualizer */}
        <div className="pt-10">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-light font-bold">
                {current.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white mt-1">
                {current.title}
              </h3>
            </div>
            <div className="text-xs font-mono text-white/50">
              Скорость цепочки: <span className="text-blue-light font-bold">{current.processing.duration}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 1. Input Node: Raw Signals */}
            <div className="lg:col-span-4 bg-[#0F111D] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20" />
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pb-2 border-b border-white/5">
                  <span className="uppercase tracking-wider">{current.input.badge}</span>
                  <span className="text-white/30">01</span>
                </div>
                <h4 className="font-display font-black text-lg text-white mb-2">
                  {current.input.label}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed mb-4">
                  {current.input.detail}
                </p>
              </div>

              <div className="bg-black/50 border border-white/10 p-3 rounded-none font-mono text-[11px] text-white/60 overflow-x-auto">
                <div className="text-[10px] uppercase text-white/40 mb-1">Payload dump</div>
                <div className="text-cyan-300 font-mono text-xs break-all leading-relaxed">
                  {current.input.rawPayload}
                </div>
              </div>
            </div>

            {/* 2. Center Conduit: Synthesizer & Code Pipeline */}
            <div className="lg:col-span-4 bg-[#0F111D] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
              {/* Animated high-voltage electric blue top rail */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
                <div
                  className="h-full bg-blue shadow-[0_0_12px_#3D5CFF] transition-all duration-100 ease-out"
                  style={{ width: `${pulseProgress}%` }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-blue-light mb-4 pb-2 border-b border-white/5">
                  <span className="uppercase tracking-wider">Инженерное ядро</span>
                  <span className="text-blue-light font-bold">02</span>
                </div>

                <div className="space-y-4 pt-2">
                  {current.processing.steps.map((st, i) => {
                    const stepActive = pulseProgress >= (i + 1) * 30;
                    return (
                      <div
                        key={st.label}
                        className={`p-3 border transition-all duration-200 ${
                          stepActive
                            ? 'bg-blue/10 border-blue/40 text-white'
                            : 'bg-white/[0.02] border-white/5 text-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <span>{st.label}</span>
                          {stepActive ? (
                            <Check className="w-3.5 h-3.5 text-blue-light shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-white/50 mt-1">
                          {st.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/60">
                <span>Протокол: API · Webhooks</span>
                <span className="text-blue-light">Zero data loss</span>
              </div>
            </div>

            {/* 3. Output Node: Clean Deliverable Artifact */}
            <div className="lg:col-span-4 bg-[#0F111D] border border-blue/30 p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(61,92,255,0.15)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue" />
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-4 pb-2 border-b border-white/5">
                  <span className="uppercase tracking-wider">{current.output.badge}</span>
                  <span className="text-white/30">03</span>
                </div>
                <h4 className="font-display font-black text-lg text-white mb-2">
                  {current.output.label}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed mb-4">
                  {current.output.detail}
                </p>
              </div>

              <div className="p-4 bg-blue/15 border border-blue/40">
                <div className="text-[10px] font-mono uppercase tracking-wider text-blue-light mb-1">
                  Измеримый результат
                </div>
                <div className="font-display font-black text-xl text-white">
                  {current.output.metric}
                </div>
              </div>
            </div>

          </div>

          {/* Under-canvas architectural datum rail */}
          <div className="mt-6 p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/60 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue" />
              <span>Архитектура разворачивается на ваших серверах или аккаунтах (self-hosted / Docker / VPS)</span>
            </div>
            <span className="text-white/80 font-bold">Полный суверенитет над кодом и базами</span>
          </div>
        </div>

      </div>
    </section>
  );
};
