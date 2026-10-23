import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  PhoneCall,
  Check,
  Clock,
  Coins,
  Copy,
  Search,
  CheckCheck,
  Send,
  Filter,
} from 'lucide-react';
import { config } from '../../config';

interface ServiceTab {
  id: string;
  num: string;
  tabTitle: string;
  badge: string;
  headline: string;
  subheadline: string;
  timeline: string;
  budget: string;
  stack: string[];
  businessEffect: string;
}

const SERVICES_DATA: ServiceTab[] = [
  {
    id: 'assistant',
    num: '01',
    tabTitle: 'AI-агенты в Telegram',
    badge: 'ПЕРВАЯ ЛИНИЯ 24/7',
    headline: 'Отвечает клиентам за 5 секунд и ведёт к сделке',
    subheadline:
      'Обучается на вашем прайсе, регламентах и базе знаний. Понимает опечатки и голосовые сообщения, квалифицирует бюджет и передаёт готовый бриф менеджеру.',
    timeline: '3–5 рабочих дней',
    budget: 'от 30 000 ₽',
    stack: ['Python', 'Telegram Bot API', 'amoCRM / Bitrix24', 'OpenAI / Claude', 'RAG'],
    businessEffect: '+30% к конверсии из первого контакта за счёт мгновенного ответа даже ночью и в выходные',
  },
  {
    id: 'voice',
    num: '02',
    tabTitle: 'AI-обзвон и телефония',
    badge: 'ГОЛОСОВЫЕ РОБОТЫ',
    headline: 'Обзвон и приём звонков без выгорания операторов',
    subheadline:
      'Синтез естественного живого голоса с задержкой ответа менее 0.5 секунды. Робот понимает перебивания, фильтрует холодную базу и переводит заинтересованных на менеджера.',
    timeline: '5–8 рабочих дней',
    budget: 'от 40 000 ₽',
    stack: ['SIP-телефония', 'Whisper STT', 'ElevenLabs / Cartesia', 'FastAPI', 'CRM Webhooks'],
    businessEffect: 'До 1000 звонков в час при стоимости минуты от 2 ₽. Никаких больничных и текучки кадров',
  },
  {
    id: 'parsers',
    num: '03',
    tabTitle: 'Парсеры и базы данных',
    badge: 'B2B ДАННЫЕ & МОНИТОРИНГ',
    headline: 'Свежие реестры контактов и цен конкурентов на автопилоте',
    subheadline:
      'Сбор открытых данных с карт, каталогов, маркетплейсов и отраслевых сайтов. Автоматическое отсечение неликвида, валидация телефонов ЛПР и выгрузка в чистую таблицу.',
    timeline: '2–4 рабочих дня',
    budget: 'от 25 000 ₽',
    stack: ['Python / Playwright', 'PostgreSQL', 'HLR Lookup', 'Google Sheets API', 'Anti-Captcha'],
    businessEffect: '500+ актуальных контактов за несколько минут вместо недель монотонного ручного поиска',
  },
  {
    id: 'automation',
    num: '04',
    tabTitle: 'Сквозные интеграции',
    badge: 'ИНТЕГРАЦИИ & n8n',
    headline: 'Сайт, CRM, склад и мессенджеры в единой бесшовной цепочке',
    subheadline:
      'Новая заявка мгновенно попадает в CRM, товар резервируется на складе, а вам в телефон приходит структурированное уведомление со всеми данными.',
    timeline: '4–7 рабочих дней',
    budget: 'от 35 000 ₽',
    stack: ['n8n Engine', 'amoCRM / Bitrix24', '1C / МойСклад', 'Webhooks', 'Telegram API'],
    businessEffect: '0 потерянных лидов, исключение человеческого фактора и прозрачный учет каждой сделки',
  },
];

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Tab 1: AI Chat interactive state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; buttons?: string[] }>>([
    {
      sender: 'user',
      text: 'Добрый день! За сколько дней запускается бот для отдела продаж?',
      time: '14:30',
    },
    {
      sender: 'bot',
      text: 'Здравствуйте! Базовый сценарий с интеграцией в CRM запускаем за 3–4 дня. Бот сразу берёт на себя ответы по прайсу и квалификацию лидов. Какую CRM используете?',
      time: '14:30',
      buttons: ['Рассчитать смету', 'Сроки запуска', 'Позвать Андрея'],
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');

  const quickQuestions = [
    'Сколько стоит бот?',
    'Как бот учит прайс?',
    'С какими CRM работаете?',
  ];

  const handleAskQuick = (question: string) => {
    if (isTyping) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setChatMessages((prev) => [...prev, { sender: 'user', text: question, time: timeStr }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let buttons: string[] = [];
      if (question.includes('стоит')) {
        reply = 'Кастомный Telegram-бот с базой знаний и интеграцией в amoCRM/Bitrix24 стоит от 30 000 ₽. Смета фиксируется до старта разработки.';
        buttons = ['Оценить мою задачу', 'Сроки внедрения'];
      } else if (question.includes('прайс')) {
        reply = 'Загружаем ваши таблицы, PDF-каталоги и регламенты в векторную базу (RAG). Бот цитирует только проверенные данные компании.';
        buttons = ['Форматы документов', 'Тест на примерах'];
      } else {
        reply = 'Интегрируемся с amoCRM, Bitrix24, МойСклад, 1C и Google Таблицами через официальные API и Webhooks.';
        buttons = ['Нужна amoCRM', 'Нужен МойСклад'];
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, time: timeStr, buttons }]);
      setIsTyping(false);
    }, 600);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const q = inputVal.trim();
    setInputVal('');
    handleAskQuick(q);
  };

  // Tab 3: Parser Table Filter state
  const [onlyValidFilter, setOnlyValidFilter] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Tab 4: Active Event Payload
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  const currentService = SERVICES_DATA[activeTab];

  const copyEventJson = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 1500);
  };

  return (
    <section className="bg-[#0B0D13] text-white py-16 sm:py-24 relative overflow-hidden" id="services">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Rubric & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-white/50 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" />
              <span>Направления разработки</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Четыре вида{' '}
              <span className="font-serif italic font-normal text-blue-light lowercase">
                систем
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-white/60 max-w-md font-sans leading-relaxed">
            Практичные решения, которые окупаются в первые недели за счёт экономии времени и исключения рутины.
          </p>
        </div>

        {/* Minimalist Horizontal Tab Selector */}
        <div className="border-b border-white/10 overflow-x-auto scrollbar-none py-4 flex items-center gap-2 sm:gap-4 select-none">
          {SERVICES_DATA.map((service, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`group py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer flex items-center gap-2.5 border ${
                  isActive
                    ? 'bg-blue text-white border-blue shadow-[0_4px_20px_rgba(61,92,255,0.35)]'
                    : 'bg-white/[0.03] text-white/60 border-white/5 hover:border-white/15 hover:text-white'
                }`}
              >
                <span className={`font-mono text-xs ${isActive ? 'text-white/80 font-bold' : 'text-white/40'}`}>
                  {service.num}
                </span>
                <span className="font-sans font-semibold">{service.tabTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-10 items-stretch">
          
          {/* Left Column (5 cols): Clear Business Substance */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-white/70 font-semibold tracking-wider mb-4">
                <span>{currentService.badge}</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-4">
                {currentService.headline}
              </h3>

              <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed mb-6">
                {currentService.subheadline}
              </p>

              {/* 3 Clear Conditions (Timeline, Budget, Stack) */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-5 mb-6 font-sans">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-light" />
                    <span>Срок запуска</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {currentService.timeline}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono mb-1">
                    <Coins className="w-3.5 h-3.5 text-blue-light" />
                    <span>Ориентир стоимости</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {currentService.budget}
                  </div>
                </div>

                <div className="col-span-2 pt-2">
                  <div className="text-xs text-white/50 font-mono mb-2">Стек технологий:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentService.stack.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Effect Banner */}
              <div className="p-4 rounded-xl bg-blue/10 border border-blue/25 text-xs sm:text-sm text-blue-light font-sans leading-relaxed">
                <span className="font-mono text-[10px] uppercase font-bold text-white mr-2 bg-blue px-2 py-0.5 rounded">
                  Эффект
                </span>
                {currentService.businessEffect}
              </div>
            </div>

            {/* Direct CTA Link */}
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:py-4 rounded-xl bg-white text-ink text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-blue hover:text-white transition-all duration-150 active:scale-[0.98] shadow-md group"
            >
              <span>Обсудить задачу в Telegram</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Right Column (7 cols): High-Craft Digital Product Interface */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 bg-[#131622] rounded-3xl border border-white/10 p-4 sm:p-6 flex flex-col justify-between shadow-2xl h-[520px] max-h-[520px] overflow-hidden relative">
              
              <AnimatePresence mode="wait">
                {/* 01: Authentic Telegram Client Interface */}
                {activeTab === 0 && (
                  <motion.div
                    key="chat-artifact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    {/* Telegram Client Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center font-display shadow-sm">
                            _a_
                          </div>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#131622] absolute bottom-0 right-0" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                            <span>_angrove_ assistant</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-blue text-white text-[9px] flex items-center justify-center">✓</span>
                          </div>
                          <div className="text-[10px] text-white/50 font-mono">
                            Telegram Bot API · ответ 2.4с
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-emerald-400">
                        онлайн 24/7
                      </span>
                    </div>

                    {/* Chat Messages Stream (Strict Flex-1 to Never Overflow Parent) */}
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1.5 text-xs sm:text-sm font-sans scrollbar-thin">
                      {/* Voice Note Simulation */}
                      <div className="flex items-start gap-2 max-w-[85%]">
                        <div className="p-2.5 rounded-2xl bg-white/10 text-white rounded-tl-none border border-white/5 w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 rounded-full bg-blue text-white flex items-center justify-center text-[10px]">
                              ▶
                            </span>
                            <div className="flex-1 h-2.5 flex items-center gap-0.5">
                              {[40, 70, 90, 60, 30, 80, 100, 50, 20, 60, 85, 40, 70].map((h, i) => (
                                <span key={i} className="w-1 bg-white/40 rounded-full" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-white/50">0:14</span>
                          </div>
                          <div className="text-[10px] text-white/70 italic border-t border-white/10 pt-1">
                            [Голос]: «Добрый день! Успеем запустить бота до конца недели?»
                          </div>
                        </div>
                      </div>

                      {/* Dialogue History */}
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            msg.sender === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-blue text-white rounded-br-none shadow-md'
                                : 'bg-white/[0.08] text-white rounded-bl-none border border-white/10'
                            }`}
                          >
                            <div className="text-xs sm:text-[13px]">{msg.text}</div>

                            {/* Telegram Inline Buttons */}
                            {msg.buttons && (
                              <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                                {msg.buttons.map((b) => (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => handleAskQuick(b)}
                                    className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] sm:text-[11px] text-blue-light font-medium transition-colors cursor-pointer border border-white/10"
                                  >
                                    {b}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-mono text-white/40 mt-0.5 px-1">
                            <span>{msg.time}</span>
                            {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="text-xs font-mono text-white/50 flex items-center gap-2 p-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                          <span>Бот печатает ответ...</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom: Quick Chips & Interactive Input Form */}
                    <div className="pt-2.5 border-t border-white/10 mt-2 shrink-0">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                        {quickQuestions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleAskQuick(q)}
                            disabled={isTyping}
                            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-sans text-white/70 border border-white/10 transition-colors cursor-pointer active:scale-95"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleCustomSend} className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={inputVal}
                          onChange={(e) => setInputVal(e.target.value)}
                          placeholder="Задайте любой вопрос боту..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue"
                        />
                        <button
                          type="submit"
                          disabled={!inputVal.trim() || isTyping}
                          className="w-8 h-8 rounded-xl bg-blue disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer transition-transform active:scale-95"
                          title="Отправить сообщение"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* 02: High-End Telephony Operator Studio */}
                {activeTab === 1 && (
                  <motion.div
                    key="voice-artifact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Telephony Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-white">
                              Сессия звонка #CALL-8842
                            </div>
                            <div className="text-[10px] font-mono text-white/50">
                              SIP: RT-Telecom · Opus 48kHz · Задержка: 380ms
                            </div>
                          </div>
                        </div>

                        <div className="font-mono text-xs px-2.5 py-1 rounded-md bg-blue/20 text-blue-light border border-blue/30 font-bold">
                          00:48
                        </div>
                      </div>

                      {/* Caller Meta & Audio Waveform Banner */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ООО «ПромСнаб-М» · Отдел снабжения</span>
                          </div>
                          <div className="text-[10px] font-mono text-white/50 mt-0.5">
                            +7 (926) 410-**-** · Квалификация потребности
                          </div>
                        </div>

                        {/* Animated Equalizer Waveform */}
                        <div className="flex items-center gap-1 h-5">
                          {[30, 80, 50, 100, 70, 40, 90, 60, 85, 45, 95, 35].map((h, i) => (
                            <motion.span
                              key={i}
                              animate={{ scaleY: [0.3, 1, 0.4] }}
                              transition={{ duration: 0.8 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1 bg-emerald-400 rounded-full origin-bottom"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Live Transcript Dialog */}
                      <div className="space-y-2 bg-black/40 rounded-2xl p-3.5 border border-white/10 text-xs sm:text-[13px] font-sans max-h-[220px] overflow-y-auto">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue/20 text-blue-light font-mono text-[9px] font-bold shrink-0">
                            AI РОБОТ
                          </span>
                          <span className="text-white/80 leading-relaxed">
                            «Добрый день! Подтверждаем заказ на оптовую партию крепежа. Спецификацию согласовали?»
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[9px] font-bold shrink-0">
                            КЛИЕНТ
                          </span>
                          <span className="text-white/95 leading-relaxed">
                            «Да, объём актуален. Отправьте счёт и договор сразу на рабочую почту snab@prom.ru.»
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-blue/20 text-blue-light font-mono text-[9px] font-bold shrink-0">
                            AI РОБОТ
                          </span>
                          <span className="text-white/80 leading-relaxed">
                            «Счёт сформирован и уже отправлен. Менеджер на связи в WhatsApp для подтверждения оплаты.»
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Intent & Qualification Status Banner */}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Интент: Запрос КП (Score: 0.98)</span>
                      </div>
                      <span className="text-emerald-300/80 font-medium text-[11px]">
                        Сделка в amoCRM создана за 0.4с
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 03: High-Craft Data Intelligence Grid */}
                {activeTab === 2 && (
                  <motion.div
                    key="parser-artifact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Controls: Search & Filter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex-1 max-w-sm">
                          <Search className="w-3.5 h-3.5 text-white/40" />
                          <input
                            type="text"
                            readOnly
                            value="Поиск: Оптовые поставщики оборудования"
                            className="bg-transparent text-xs text-white/90 focus:outline-none w-full"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setOnlyValidFilter(!onlyValidFilter)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                            onlyValidFilter
                              ? 'bg-blue text-white border-blue'
                              : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                          }`}
                        >
                          <Filter className="w-3 h-3" />
                          <span>{onlyValidFilter ? 'Только валидные (3)' : 'Все записи (4)'}</span>
                        </button>
                      </div>

                      {/* Structured Data Table */}
                      <div className="bg-black/30 rounded-2xl border border-white/10 overflow-hidden text-xs font-mono">
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-white/5 text-[10px] text-white/50 uppercase tracking-wider font-semibold border-b border-white/10">
                          <span className="col-span-5">Компания / ИНН</span>
                          <span className="col-span-4">Контакт ЛПР</span>
                          <span className="col-span-3 text-right">HLR Сеть</span>
                        </div>

                        <div className="divide-y divide-white/5 text-[11px]">
                          <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-white/[0.02]">
                            <div className="col-span-5 truncate">
                              <span className="text-white font-semibold block">ООО «ПромТехСнаб»</span>
                              <span className="text-[10px] text-white/40">ИНН 78129481 · СПб</span>
                            </div>
                            <div className="col-span-4 truncate text-white/80 whitespace-nowrap">
                              +7 (812) 334-**-**
                              <span className="block text-[10px] text-white/40">Дмитрий К. (Директор)</span>
                            </div>
                            <div className="col-span-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                                Активен ✓
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-white/[0.02]">
                            <div className="col-span-5 truncate">
                              <span className="text-white font-semibold block">АО «Завод Крепёж»</span>
                              <span className="text-[10px] text-white/40">ИНН 77218492 · Москва</span>
                            </div>
                            <div className="col-span-4 truncate text-white/80 whitespace-nowrap">
                              +7 (495) 710-**-**
                              <span className="block text-[10px] text-white/40">Иван Р. (Отдел закупок)</span>
                            </div>
                            <div className="col-span-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                                Активен ✓
                              </span>
                            </div>
                          </div>

                          {!onlyValidFilter && (
                            <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center opacity-40 bg-white/[0.01]">
                              <div className="col-span-5 truncate">
                                <span className="text-white font-semibold block">ИП Смирнов В.А.</span>
                                <span className="text-[10px] text-white/40">Розничный павильон</span>
                              </div>
                              <div className="col-span-4 truncate text-white/50">
                                Номер отключен
                              </div>
                              <div className="col-span-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">
                                  Отсеян
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-white/[0.02]">
                            <div className="col-span-5 truncate">
                              <span className="text-white font-semibold block">ООО «СеверСклад»</span>
                              <span className="text-[10px] text-white/40">ИНН 78049102 · СПб</span>
                            </div>
                            <div className="col-span-4 truncate text-white/80 whitespace-nowrap">
                              +7 (812) 991-**-**
                              <span className="block text-[10px] text-white/40">Ольга С. (Снабжение)</span>
                            </div>
                            <div className="col-span-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                                Активен ✓
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Plaque */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-3">
                      <div>Собрано: 542 контакта за 3 мин 12 сек · Дубли удалены</div>
                      <div className="text-blue-light font-bold">Выгрузка в CRM / Sheets</div>
                    </div>
                  </motion.div>
                )}

                {/* 04: Real Enterprise Event Pipeline Studio */}
                {activeTab === 3 && (
                  <motion.div
                    key="integration-artifact"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Studio Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue" />
                          <div className="font-bold text-xs sm:text-sm text-white">
                            Шина: Сайт → amoCRM → МойСклад → Telegram
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          Сквозное: 1.1с
                        </span>
                      </div>

                      {/* 3 Step Interactive Cards */}
                      <div className="space-y-2.5 font-sans">
                        {[
                          {
                            step: 1,
                            tag: 'TRIGGER',
                            tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                            title: '1. Webhook с сайта (Tilda / React)',
                            desc: 'Мгновенный перехват отправки формы с именем, телефоном и заказом.',
                            latency: '14ms',
                            payload: '{\n  "event": "lead.submit",\n  "client": "Алексей Смирнов",\n  "phone": "+7 999 123-45-67",\n  "sku_list": ["Крепёж М8", "Шайба 10"]\n}',
                          },
                          {
                            step: 2,
                            tag: 'SYNC & CRM',
                            tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                            title: '2. amoCRM & МойСклад API',
                            desc: 'Проверка дублей, создание сделки и резервирование на складе.',
                            latency: '180ms',
                            payload: '{\n  "crm_deal_id": 48291,\n  "pipeline": "Новые заявки",\n  "warehouse_status": "RESERVED"\n}',
                          },
                          {
                            step: 3,
                            tag: 'DISPATCH',
                            tagColor: 'bg-blue/20 text-blue-light border-blue/30',
                            title: '3. Алерт в закрытый Telegram-канал',
                            desc: 'Собственник и менеджер получают карточку сделки с кнопкой прямого звонка.',
                            latency: '85ms',
                            payload: '{\n  "telegram_alert": "sent",\n  "chat_id": "@sales_inner",\n  "button": "https://amocrm.ru/leads/48291"\n}',
                          },
                        ].map((item, idx) => (
                          <div
                            key={item.step}
                            onClick={() => setSelectedEventIndex(idx)}
                            className={`p-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                              selectedEventIndex === idx
                                ? 'bg-white/10 border-blue shadow-lg'
                                : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${item.tagColor}`}>
                                  {item.tag}
                                </span>
                                <span className="font-bold text-xs sm:text-sm text-white">
                                  {item.title}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-white/40">{item.latency}</span>
                            </div>

                            <p className="text-[11px] text-white/60 mb-1 leading-relaxed font-sans">{item.desc}</p>

                            {selectedEventIndex === idx && (
                              <div className="relative mt-1.5">
                                <pre className="p-2.5 rounded-xl bg-black/60 font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed border border-white/5">
                                  {item.payload}
                                </pre>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyEventJson(item.payload);
                                  }}
                                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 text-[9px] font-mono flex items-center gap-1 transition-colors"
                                  title="Скопировать JSON"
                                >
                                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedPayload ? 'Скопировано' : 'Copy'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/50 flex items-center justify-between mt-3">
                      <span>Архитектура: Python Webhooks + n8n Engine</span>
                      <span className="text-emerald-400 font-bold">0 потерянных заказов</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
