import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Database,
  Send,
  PhoneCall,
  Layers,
  Filter,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Clock,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { TelegramChatScene } from './services/ServiceScenes';
import { config } from '../../config';

interface NodeData {
  id: string;
  type: 'trigger' | 'ai' | 'logic' | 'action';
  badge: string;
  title: string;
  desc: string;
  outputLabel: string;
  latency: string;
  icon: React.ReactNode;
}

interface WorkflowData {
  id: string;
  num: string;
  tabLabel: string;
  title: string;
  filename: string;
  shortDesc: string;
  roiResult: string;
  chatPrompt: string;
  nodes: NodeData[];
}

const WORKFLOWS: WorkflowData[] = [
  {
    id: 'ai-agents',
    num: '01',
    tabLabel: 'AI-агенты',
    title: 'Автономный AI-ассистент первой линии в Telegram',
    filename: '01_telegram_ai_rag_agent.json',
    shortDesc: 'Отвечает клиентам за 5 секунд 24/7, консультирует по прайсу и правилам, квалифицирует лида.',
    roiResult: 'Результат: ответ за 5 секунд 24/7, +30% к конверсии в заявку, 0 пропущенных ночных лидов',
    chatPrompt: 'Протестируйте живой диалог с ботом',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        badge: 'TRIGGER',
        title: 'Telegram Webhook',
        desc: 'Входящее сообщение клиента (текст или войс)',
        outputLabel: 'text: "Сколько стоит интеграция?"',
        latency: '12ms',
        icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'node-2',
        type: 'ai',
        badge: 'AI AGENT',
        title: 'LLM Agent + RAG',
        desc: 'Поиск по прайсу компании и формулирование ответа',
        outputLabel: 'tokens: 142 · context: price_2026',
        latency: '240ms',
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      },
      {
        id: 'node-3',
        type: 'logic',
        badge: 'ROUTER',
        title: 'Lead Qualifier',
        desc: 'Проверка готовности к заказу и сбор контакта',
        outputLabel: 'intent: "commercial" · score: 0.94',
        latency: '18ms',
        icon: <Filter className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'node-4',
        type: 'action',
        badge: 'ACTION',
        title: 'amoCRM & Alert',
        desc: 'Создание сделки и отправка готового брифа в чат',
        outputLabel: 'lead_id: #48291 · status: created',
        latency: '85ms',
        icon: <Database className="w-4 h-4 text-emerald-400" />,
      },
    ],
  },
  {
    id: 'voice-ai',
    num: '02',
    tabLabel: 'AI-обзвон',
    title: 'Голосовой AI-робот для квалификации и повторных заказов',
    filename: '02_voice_ai_sip_qualifier.json',
    shortDesc: 'До 1000 звонков в час без выгорания операторов. Естественный голос, перебивания, задержка <0.5с.',
    roiResult: 'Результат: фильтрация холодной базы за 1 час вместо недели, экономия до 80 000 ₽/мес на колл-центре',
    chatPrompt: 'Протестируйте сценарий квалификации в чате',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        badge: 'TRIGGER',
        title: 'Cron / Контакты',
        desc: 'Выборка базы клиентов, давших согласие',
        outputLabel: 'queue: 450 contacts · SIP ready',
        latency: '15ms',
        icon: <Clock className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'node-2',
        type: 'ai',
        badge: 'VOICE AI',
        title: 'Speech-to-Speech Bot',
        desc: 'Диалог по скрипту без задержек (<0.5с)',
        outputLabel: 'latency: 420ms · sentiment: positive',
        latency: '420ms',
        icon: <PhoneCall className="w-4 h-4 text-purple-400" />,
      },
      {
        id: 'node-3',
        type: 'logic',
        badge: 'ROUTER',
        title: 'Согласие получено?',
        desc: 'Ответ «Да, отправьте счёт» → тёплая воронка',
        outputLabel: 'branch: "YES" · intent: "quote"',
        latency: '22ms',
        icon: <GitBranch className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'node-4',
        type: 'action',
        badge: 'ACTION',
        title: 'Карточка в CRM',
        desc: 'Прикрепление записи диалога и пуш менеджеру',
        outputLabel: 'audio_url: rec_921.mp3 · deal: hot',
        latency: '95ms',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      },
    ],
  },
  {
    id: 'parsers',
    num: '03',
    tabLabel: 'Парсеры данных',
    title: 'Автоматический сбор каталогов, цен конкурентов и баз B2B',
    filename: '03_data_scraper_enrichment.json',
    shortDesc: 'Автономный сбор реестров, карт и каталогов: отсечение неликвида, выгрузка чистой таблицы.',
    roiResult: 'Результат: 500+ проверенных контактов ЛПР за 3 минуты вместо 70 человеко-часов ручного копипаста',
    chatPrompt: 'Узнайте о технологиях парсинга в диалоге',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        badge: 'TRIGGER',
        title: 'Cron: 06:00 MSK',
        desc: 'Запуск автономного цикла по расписанию',
        outputLabel: 'sources: 2GIS · Yandex · Portals',
        latency: '8ms',
        icon: <Clock className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'node-2',
        type: 'ai',
        badge: 'SCRAPER',
        title: 'Playwright Crawler',
        desc: 'Обход сайтов с ротацией прокси и антикапчей',
        outputLabel: 'scraped: 520 items · status: 200',
        latency: '680ms',
        icon: <Layers className="w-4 h-4 text-purple-400" />,
      },
      {
        id: 'node-3',
        type: 'logic',
        badge: 'TRANSFORM',
        title: 'Deduplication & HLR',
        desc: 'Удаление дублей и проверка номеров телефонов',
        outputLabel: 'valid: 492 · junk_removed: 28',
        latency: '45ms',
        icon: <Filter className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'node-4',
        type: 'action',
        badge: 'ACTION',
        title: 'Google Sheets / CRM',
        desc: 'Чистая база с телефонами ЛПР уже в таблице',
        outputLabel: 'rows_added: 492 · sync: 100%',
        latency: '110ms',
        icon: <Database className="w-4 h-4 text-emerald-400" />,
      },
    ],
  },
  {
    id: 'automations',
    num: '04',
    tabLabel: 'Сквозные цепочки n8n',
    title: 'Цифровой диспетчер: сайт, CRM, склад и мессенджеры',
    filename: '04_n8n_cross_system_bridge.json',
    shortDesc: 'Связывает заявки с сайта, учёт склада, amoCRM/Bitrix24 и закрытый Telegram-канал без рутины.',
    roiResult: 'Результат: 0 потерянных заказов, сквозной финансовый учёт, автоматический дайджест собственнику',
    chatPrompt: 'Рассчитайте архитектуру интеграции в диалоге',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        badge: 'TRIGGER',
        title: 'Webhook: Заявка',
        desc: 'Лид с сайта, Tilda, Avito или мессенджера',
        outputLabel: 'client: Алексей · phone: +7 999 123-**',
        latency: '10ms',
        icon: <Terminal className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'node-2',
        type: 'ai',
        badge: 'TRANSFORM',
        title: 'Data Validator',
        desc: 'Нормализация данных и проверка на дубликаты',
        outputLabel: 'is_new: true · clean_phone: valid',
        latency: '14ms',
        icon: <Filter className="w-4 h-4 text-purple-400" />,
      },
      {
        id: 'node-3',
        type: 'logic',
        badge: 'ROUTER',
        title: '1С / МойСклад API',
        desc: 'Резерв номенклатуры и выставление счёта',
        outputLabel: 'invoice: #7821 · items_reserved: 4',
        latency: '120ms',
        icon: <GitBranch className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'node-4',
        type: 'action',
        badge: 'ACTION',
        title: 'Telegram & CRM Alert',
        desc: 'Мгновенное оповещение команды за 1.1 секунды',
        outputLabel: 'push_sent: true · elapsed: 1.1s',
        latency: '70ms',
        icon: <Send className="w-4 h-4 text-emerald-400" />,
      },
    ],
  },
];

export const Services: React.FC = () => {
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'flow' | 'chat'>('flow');
  const [activeStep, setActiveStep] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  const currentWorkflow = WORKFLOWS[activeWorkflowIndex];

  // Auto-reset execution animation on tab change
  useEffect(() => {
    setActiveStep(3); // default to all executed / ready
    setIsRunning(false);
    setSelectedNodeIndex(0);
  }, [activeWorkflowIndex]);

  // Run test simulation sequence
  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);
    setSelectedNodeIndex(0);

    const stepTimings = [0, 500, 1100, 1700];

    stepTimings.forEach((delay, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        setSelectedNodeIndex(idx);
        if (idx === 3) {
          setTimeout(() => {
            setIsRunning(false);
          }, 400);
        }
      }, delay);
    });
  };

  return (
    <section className="bg-[#0A0C13] text-white py-20 sm:py-28 relative overflow-hidden" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rubric Header */}
        <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
          <span>Архитектура решений</span>
        </div>

        {/* Section Headline */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between pb-8 sm:pb-10 border-b border-white/10 gap-6">
          <div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-white">
              Четыре вида <span className="font-serif italic font-normal text-blue-light">систем</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-sans mt-3 max-w-xl">
              Интерактивная среда n8n. Переключайте сценарии, запускайте тест цепочки или протестируйте живой диалог с AI.
            </p>
          </div>

          {/* Quick Segmented Mode Switcher (Flow vs Live Chat) */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono select-none">
            <button
              type="button"
              onClick={() => setViewMode('flow')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                viewMode === 'flow'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Схема n8n</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                viewMode === 'chat'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Чат с AI</span>
            </button>
          </div>
        </div>

        {/* Workflow Pills Tabs (Light, clean, responsive) */}
        <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none select-none">
          {WORKFLOWS.map((wf, idx) => {
            const isActive = activeWorkflowIndex === idx;
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => {
                  setActiveWorkflowIndex(idx);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border cursor-pointer active:scale-[0.98] flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue text-white border-blue shadow-[0_4px_16px_rgba(61,92,255,0.3)]'
                    : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`font-mono text-xs ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                  {wf.num}
                </span>
                <span>{wf.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* n8n Studio Canvas Box */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0E1017] shadow-2xl overflow-hidden relative">
          
          {/* Top Bar of n8n Editor */}
          <div className="px-4 sm:px-6 py-3 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              </div>

              <div className="h-4 w-[1px] bg-white/15 mx-1 hidden sm:block" />

              {/* Breadcrumb / Title */}
              <div className="flex items-center gap-2 font-mono text-xs text-white/80 truncate">
                <span className="text-white/40 hidden sm:inline">workflows /</span>
                <span className="text-white font-medium">{currentWorkflow.filename}</span>
              </div>

              {/* Active status pill */}
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>active</span>
              </span>
            </div>

            {/* Run Button in Top Bar */}
            {viewMode === 'flow' && (
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isRunning}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all active:scale-[0.98] cursor-pointer shadow-sm ${
                  isRunning
                    ? 'bg-blue/40 text-white/70 cursor-wait'
                    : 'bg-blue hover:bg-blue-light text-white'
                }`}
                title="Запустить выполнение цепочки нод"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Выполнение...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Тест цепочки</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Canvas Body */}
          <div className="relative min-h-[460px] flex flex-col justify-between">
            {/* Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <AnimatePresence mode="wait">
              {viewMode === 'flow' ? (
                <motion.div
                  key={`flow-${activeWorkflowIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 sm:p-8 flex-1 flex flex-col justify-between relative z-10"
                >
                  {/* Workflow Description Summary */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/60 pb-3 border-b border-white/5">
                    <div>{currentWorkflow.shortDesc}</div>
                    <div className="text-blue-light font-semibold shrink-0">
                      Всего узлов: 4 · Время отклика &lt;0.5с
                    </div>
                  </div>

                  {/* Horizontal Nodes Chain with Connecting Lines */}
                  <div className="overflow-x-auto py-4 scrollbar-none">
                    <div className="min-w-[820px] flex items-center justify-between relative">
                      
                      {/* SVG Bezier Connecting Wires */}
                      <svg
                        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-12 pointer-events-none -z-0"
                        style={{ overflow: 'visible' }}
                      >
                        {/* 3 wires between 4 nodes */}
                        {[0, 1, 2].map((wireIdx) => {
                          const x1 = (wireIdx * 33.33) + 16.66;
                          const x2 = ((wireIdx + 1) * 33.33) + 16.66;
                          const isWireActive = activeStep > wireIdx;

                          return (
                            <g key={`wire-${wireIdx}`}>
                              <line
                                x1={`${x1}%`}
                                y1="24"
                                x2={`${x2}%`}
                                y2="24"
                                stroke={isWireActive ? '#3D5CFF' : 'rgba(255,255,255,0.12)'}
                                strokeWidth="2"
                                strokeDasharray={isWireActive ? 'none' : '4 4'}
                              />
                              {isRunning && activeStep === wireIdx && (
                                <motion.circle
                                  cx={`${x1}%`}
                                  cy="24"
                                  r="4"
                                  fill="#60a5fa"
                                  animate={{ cx: [`${x1}%`, `${x2}%`] }}
                                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* 4 n8n Nodes */}
                      {currentWorkflow.nodes.map((node, nodeIdx) => {
                        const isExecuted = activeStep >= nodeIdx;
                        const isCurrentlyRunning = isRunning && activeStep === nodeIdx;
                        const isSelected = selectedNodeIndex === nodeIdx;

                        return (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNodeIndex(nodeIdx)}
                            className={`w-[195px] rounded-2xl border p-3.5 transition-all duration-200 select-none relative cursor-pointer active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[#181C2B] border-blue shadow-[0_8px_24px_rgba(61,92,255,0.25)]'
                                : isExecuted
                                ? 'bg-[#141722] border-white/15 hover:border-white/30'
                                : 'bg-[#10121A] border-white/5 opacity-50'
                            }`}
                          >
                            {/* Input Pin (left) */}
                            {nodeIdx > 0 && (
                              <div
                                className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                                  isExecuted
                                    ? 'bg-blue border-[#0E1017]'
                                    : 'bg-[#2A2F45] border-[#0E1017]'
                                }`}
                              />
                            )}

                            {/* Output Pin (right) */}
                            {nodeIdx < 3 && (
                              <div
                                className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                                  isExecuted
                                    ? 'bg-blue border-[#0E1017]'
                                    : 'bg-[#2A2F45] border-[#0E1017]'
                                }`}
                              />
                            )}

                            {/* Node Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                {node.icon}
                              </div>
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 border border-white/10 font-bold">
                                {node.badge}
                              </span>
                            </div>

                            {/* Node Title & Description */}
                            <div className="font-bold text-xs text-white truncate mb-1">
                              {node.title}
                            </div>
                            <div className="text-[11px] text-white/60 line-clamp-2 leading-relaxed h-8">
                              {node.desc}
                            </div>

                            {/* Node Footer Status */}
                            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-white/40">{node.latency}</span>
                              {isCurrentlyRunning ? (
                                <span className="text-blue-light animate-pulse font-bold">RUNNING</span>
                              ) : isExecuted ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <span>200 OK</span>
                                </span>
                              ) : (
                                <span className="text-white/30">idle</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Node Inspector Tray (Lightweight n8n Data Preview) */}
                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start md:items-center gap-3 min-w-0">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue/20 text-blue-light font-bold shrink-0">
                        OUTPUT [{currentWorkflow.nodes[selectedNodeIndex].title}]
                      </span>
                      <code className="font-mono text-xs text-emerald-400 truncate">
                        {currentWorkflow.nodes[selectedNodeIndex].outputLabel}
                      </code>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Action to test in live chat */}
                      <button
                        type="button"
                        onClick={() => setViewMode('chat')}
                        className="text-xs font-mono text-blue-light hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Протестировать в чате</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Business Outcome Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                    <div className="text-white/80 flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                        ЭФФЕКТ
                      </span>
                      <span>{currentWorkflow.roiResult.replace('Результат: ', '')}</span>
                    </div>

                    <a
                      href={config.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1 underline underline-offset-4 transition-colors"
                    >
                      <span>Обсудить реализацию цепочки</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* Chat with AI Scene inside n8n Studio */
                <motion.div
                  key={`chat-${activeWorkflowIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="h-[520px] flex-1 relative z-10"
                >
                  <TelegramChatScene activeTab={activeWorkflowIndex} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Wide Blue Leopard Stripe Divider at bottom of Services */}
      <div
        className="w-full h-12 sm:h-16 mt-16 sm:mt-24 bg-leopard border-t border-b border-black select-none"
        style={{
          backgroundSize: '180px 120px',
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
