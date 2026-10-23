import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  PhoneCall,
  Filter,
  Check,
  Clock,
  Coins,
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
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Добрый день! Подскажите, за сколько дней реально запустить AI-бота для отдела продаж?',
      time: '14:30',
    },
    {
      sender: 'bot',
      text: 'Здравствуйте! Базовый сценарий с интеграцией CRM запускаем за 3–4 дня. Бот сразу берёт на себя ответы по прайсу и сбор контактов. На какой мессенджер ориентируетесь?',
      time: '14:30',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const quickQuestions = [
    'Сколько стоит бот под ключ?',
    'Как бот учит наш прайс?',
    'С какими CRM интегрируетесь?',
  ];

  const handleAskQuick = (question: string) => {
    if (isTyping) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setChatMessages((prev) => [...prev, { sender: 'user', text: question, time: timeStr }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (question.includes('Сколько стоит')) {
        reply = 'Кастомный Telegram-бот с базой знаний и интеграцией в amoCRM/Bitrix24 стоит от 30 000 ₽. Смета фиксируется до старта.';
      } else if (question.includes('прайс')) {
        reply = 'Загружаем ваши таблицы, PDF-каталоги и регламенты в векторную базу (RAG). Бот цитирует только проверенные данные компании.';
      } else {
        reply = 'Работаем с amoCRM, Bitrix24, МойСклад, 1C и Google Таблицами через официальные API и Webhooks.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, time: timeStr }]);
      setIsTyping(false);
    }, 600);
  };

  // Tab 3: Parser Table Filter state
  const [onlyValidFilter, setOnlyValidFilter] = useState<boolean>(false);

  // Tab 4: Automation Flow Step state
  const [activeFlowStep, setActiveFlowStep] = useState<number>(1);

  const currentService = SERVICES_DATA[activeTab];

  return (
    <section className="bg-[#0D0F14] text-white py-20 sm:py-28 relative overflow-hidden" id="services">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Rubric & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
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
        <div className="border-b border-white/10 overflow-x-auto scrollbar-none py-4 flex items-center gap-2 sm:gap-6 select-none">
          {SERVICES_DATA.map((service, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`group py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer flex items-center gap-2.5 border ${
                  isActive
                    ? 'bg-white/10 text-white border-white/20 shadow-sm'
                    : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`font-mono text-xs ${isActive ? 'text-blue-light font-bold' : 'text-white/40'}`}>
                  {service.num}
                </span>
                <span className="font-sans font-semibold">{service.tabTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Minimalist Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 items-stretch">
          
          {/* Left Column (5 cols): Clear Business Substance */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-white/70 font-semibold tracking-wider mb-4">
                <span>{currentService.badge}</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-4">
                {currentService.headline}
              </h3>

              <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed mb-8">
                {currentService.subheadline}
              </p>

              {/* 3 Clear Conditions (Timeline, Budget, Stack) */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-5 mb-8 font-sans">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-light" />
                    <span>Срок запуска</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {currentService.timeline}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono mb-1">
                    <Coins className="w-3.5 h-3.5 text-blue-light" />
                    <span>Ориентир стоимости</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">
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
              <div className="p-4 rounded-xl bg-blue/10 border border-blue/20 text-xs sm:text-sm text-blue-light font-sans mb-8 leading-relaxed">
                <span className="font-mono text-[10px] uppercase font-bold text-white/90 mr-2 bg-blue px-1.5 py-0.5 rounded">
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
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-ink text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-blue hover:text-white transition-all duration-150 active:scale-[0.98] shadow-md group"
            >
              <span>Обсудить задачу в Telegram</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Right Column (7 cols): Minimalist, Clean Interactive Artifact */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex-1 bg-[#12141D] rounded-2xl border border-white/10 p-5 sm:p-7 flex flex-col justify-between shadow-lg min-h-[460px]">
              
              <AnimatePresence mode="wait">
                {/* 01: Interactive Telegram Bot Chat */}
                {activeTab === 0 && (
                  <motion.div
                    key="chat-artifact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Clean Chat Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center">
                            AI
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white">
                              Ассистент квалификации
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono">
                              ● онлайн 24/7 · Telegram Bot API
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-white/40">
                          Живой тест
                        </span>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 text-xs sm:text-sm font-sans">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${
                              msg.sender === 'user' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-blue text-white rounded-br-none'
                                  : 'bg-white/10 text-white/90 rounded-bl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] font-mono text-white/40 mt-1 px-1">
                              {msg.time}
                            </span>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="text-xs font-mono text-white/40 italic flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                            <span>Бот печатает ответ...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Question Chips */}
                    <div className="pt-4 border-t border-white/10 mt-4">
                      <div className="text-[11px] font-mono text-white/50 mb-2">
                        Нажмите вопрос для проверки ответа:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleAskQuick(q)}
                            disabled={isTyping}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-sans text-white/80 border border-white/10 transition-colors cursor-pointer text-left active:scale-[0.98]"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 02: Minimalist Voice Call Transcript & Audio Card */}
                {activeTab === 1 && (
                  <motion.div
                    key="voice-artifact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Call Info */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <PhoneCall className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-xs sm:text-sm text-white">
                            Сценарий: Квалификация входящего лида
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          Задержка &lt;0.5с
                        </span>
                      </div>

                      {/* Caller Meta */}
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-4 text-xs font-mono text-white/70 flex justify-between items-center">
                        <div>
                          <span className="text-white/40">Абонент: </span>
                          <span className="text-white font-medium">+7 (926) 410-**-** (ООО «ПромСнаб»)</span>
                        </div>
                        <div className="text-white/40">Длительность: 00:48</div>
                      </div>

                      {/* Real Dialogue Snippet */}
                      <div className="space-y-2.5 bg-black/30 rounded-xl p-4 border border-white/10 text-xs sm:text-sm font-sans">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-light font-bold shrink-0 font-mono">[AI Робот]:</span>
                          <span className="text-white/80">
                            «Добрый день! Подтверждаем заказ на оптовую партию крепежа. Спецификацию согласовали?»
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0 font-mono">[Клиент]:</span>
                          <span className="text-white/95">
                            «Да, актуально. Отправьте счёт и договор сразу на рабочую почту.»
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-light font-bold shrink-0 font-mono">[AI Робот]:</span>
                          <span className="text-white/80">
                            «Счёт сформирован и уже отправлен. Менеджер на связи в WhatsApp для уточнений.»
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result Plaque */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 font-bold">
                        <Check className="w-4 h-4" />
                        <span>Результат звонка: Согласие получено</span>
                      </div>
                      <span className="text-emerald-300/70">Сделка в CRM создана</span>
                    </div>
                  </motion.div>
                )}

                {/* 03: Clean Minimalist Parser Table */}
                {activeTab === 2 && (
                  <motion.div
                    key="parser-artifact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar with Filter */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white">
                            Выгрузка: Оптовые поставщики оборудования
                          </div>
                          <div className="text-[11px] font-mono text-white/50">
                            Источники: 2ГИС · Карты · Отраслевые каталоги
                          </div>
                        </div>

                        {/* Filter Toggle */}
                        <button
                          type="button"
                          onClick={() => setOnlyValidFilter(!onlyValidFilter)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            onlyValidFilter
                              ? 'bg-blue text-white border-blue'
                              : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                          }`}
                        >
                          <Filter className="w-3 h-3" />
                          <span>{onlyValidFilter ? 'Только валидные (3)' : 'Все записи (4)'}</span>
                        </button>
                      </div>

                      {/* Clean Data Rows */}
                      <div className="divide-y divide-white/10 text-xs font-mono">
                        <div className="py-2 text-[10px] text-white/40 uppercase tracking-wider grid grid-cols-12 gap-2">
                          <span className="col-span-5">Компания / Сфера</span>
                          <span className="col-span-4">Контакт ЛПР</span>
                          <span className="col-span-3 text-right">Статус</span>
                        </div>

                        <div className="py-2.5 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5 truncate font-medium text-white">
                            ООО «ПромТехСнаб»
                            <span className="block text-[10px] text-white/50">Металлообработка</span>
                          </div>
                          <div className="col-span-4 text-white/80">+7 (812) 334-**-**</div>
                          <div className="col-span-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                              Валиден
                            </span>
                          </div>
                        </div>

                        <div className="py-2.5 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5 truncate font-medium text-white">
                            АО «Завод Крепёж»
                            <span className="block text-[10px] text-white/50">Производство</span>
                          </div>
                          <div className="col-span-4 text-white/80">+7 (495) 710-**-**</div>
                          <div className="col-span-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                              Валиден
                            </span>
                          </div>
                        </div>

                        {!onlyValidFilter && (
                          <div className="py-2.5 grid grid-cols-12 gap-2 items-center opacity-50">
                            <div className="col-span-5 truncate font-medium text-white">
                              ИП Смирнов В.А.
                              <span className="block text-[10px] text-white/50">Розничный магазин</span>
                            </div>
                            <div className="col-span-4 text-white/50">Номер не отвечает</div>
                            <div className="col-span-3 text-right">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] border border-white/10">
                                Отсеян
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="py-2.5 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5 truncate font-medium text-white">
                            ООО «СеверСклад»
                            <span className="block text-[10px] text-white/50">Складская логистика</span>
                          </div>
                          <div className="col-span-4 text-white/80">+7 (812) 991-**-**</div>
                          <div className="col-span-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] border border-emerald-500/30">
                              Валиден
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status */}
                    <div className="pt-3 border-t border-white/10 text-xs font-mono text-white/50 flex items-center justify-between mt-3">
                      <span>Экспорт: Google Sheets, Excel или напрямую в CRM</span>
                      <span className="text-blue-light font-bold">HLR-проверка номеров</span>
                    </div>
                  </motion.div>
                )}

                {/* 04: Linear 3-Step Integration Flow */}
                {activeTab === 3 && (
                  <motion.div
                    key="integration-artifact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                        <div className="font-bold text-xs sm:text-sm text-white">
                          Архитектура: Сайт → CRM → Склад → Telegram
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">
                          ● Синхронизация: 1.1с
                        </span>
                      </div>

                      {/* 3 Step Interactive Row */}
                      <div className="space-y-3 font-sans">
                        {[
                          {
                            step: 1,
                            title: '1. Клиент оставил заявку',
                            desc: 'Сайт, Tilda или бот получает имя, телефон и состав заказа.',
                            payload: 'webhook: POST /lead { name: "Алексей", items: 4 }',
                          },
                          {
                            step: 2,
                            title: '2. Проверка дублей и резерв',
                            desc: 'Данные сопоставляются с CRM, в МойСклад ставится резерв.',
                            payload: 'crm: deal_id #9182 · stock_reserved: true',
                          },
                          {
                            step: 3,
                            title: '3. Мгновенный алерт команде',
                            desc: 'Менеджеру уходит пуш в Telegram со ссылкой на сделку.',
                            payload: 'telegram_bot: sendAlert(chat_id, deal_summary)',
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            onClick={() => setActiveFlowStep(item.step)}
                            className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                              activeFlowStep === item.step
                                ? 'bg-white/10 border-blue text-white'
                                : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/[0.08]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs sm:text-sm text-white">
                                {item.title}
                              </span>
                              {activeFlowStep === item.step && (
                                <span className="font-mono text-[10px] text-blue-light font-bold">
                                  Выбран
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/60 mb-2">{item.desc}</div>
                            {activeFlowStep === item.step && (
                              <code className="block p-2 rounded bg-black/50 font-mono text-[11px] text-emerald-400">
                                {item.payload}
                              </code>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-xs font-mono text-white/50 flex items-center justify-between mt-3">
                      <span>На базе n8n / Python webhooks</span>
                      <span className="text-emerald-400">0 потерянных заказов</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>

      {/* Subtle bottom separator line */}
      <div className="w-full h-px bg-white/10 mt-20" aria-hidden="true" />
    </section>
  );
};
