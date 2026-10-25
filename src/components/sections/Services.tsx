import React, { useState, useRef } from 'react';
import { Bot, PhoneCall, Database, Network, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';
import { TelegramChatSimulator } from '../ui/TelegramChatSimulator';
import { BusinessMeshSimulator } from '../ui/BusinessMeshSimulator';
import { ParserConsoleSimulator } from '../ui/ParserConsoleSimulator';
import { VoiceCallSimulator } from '../ui/VoiceCallSimulator';

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.08 });

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleCtaClick = () => {
    trackGoal('click_services_cta');
    trackGoal('click_telegram');
  };

  const tabs = [
    {
      id: 'bot',
      title: 'Умный AI-бот в Telegram',
      tag: 'ПРОДАЕТ И ЗАПИСЫВАЕТ 24/7',
      simplePitch: 'Отвечает за 3 секунды, консультирует по прайсу и записывает клиентов, пока вы заняты',
    },
    {
      id: 'voice',
      title: 'Голосовой AI-помощник',
      tag: 'БЕЗ ПРОПУЩЕННЫХ ЗВОНКОВ',
      simplePitch: 'Звонит клиентам приятным живым голосом, подтверждает визиты и принимает звонки',
    },
    {
      id: 'parser',
      title: 'Сбор баз клиентов',
      tag: 'ЧИСТЫЕ НОМЕРА В EXCEL',
      simplePitch: 'Находит реальные контакты нужных людей и компаний без ручного поиска на картах',
    },
    {
      id: 'mesh',
      title: 'Автоматизация всех программ',
      tag: 'НОЛЬ РУЧНОЙ РУТИНЫ',
      simplePitch: 'Сайт, касса, склад, мессенджеры и CRM обмениваются данными сами без ошибок людей',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <WordReveal
              as="h2"
              text="Что я внедряю в ваш бизнес"
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink"
              highlightWords={{ бизнес: 'font-serif italic font-normal text-blue lowercase' }}
            />
          </div>
          <p data-reveal="desc" className="text-xs sm:text-sm text-ink/85 max-w-md font-sans leading-relaxed bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.06] shadow-xs">
            Без заумных технических терминов. Выбирайте задачу — пощупайте, как это работает на живом примере прямо на экране.
          </p>
        </div>

        {/* 4 Simple Human Selector Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={tab.id}
                id={`service-tab-${idx}`}
                type="button"
                data-reveal="card"
                onClick={() => setActiveTab(idx)}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0A0C16] text-white border-black/10 shadow-xl'
                    : 'bg-white text-ink border-black/[0.06] shadow-sm hover:border-black/20 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/10 text-blue-light' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {tab.tag}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>

                <div className="font-bold text-sm sm:text-base leading-tight mb-1">
                  {tab.title}
                </div>
                <div className={`text-xs line-clamp-2 leading-relaxed ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {tab.simplePitch}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage for Selected System */}
        <div data-reveal="stage" className="mt-8 relative">
          
          {/* SCENARIO 1: TELEGRAM BOT */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue/10 text-blue text-[11px] font-bold tracking-wider uppercase mb-3">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Сценарий 01 · Мессенджеры</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-ink mb-2 leading-tight tracking-tight">
                    AI-ассистент продаж 24/7
                  </h3>

                  <p className="text-sm text-ink/70 leading-relaxed mb-5 font-sans">
                    Общается как живой эксперт, рассчитывает смету и доводит клиента до записи или оплаты.
                  </p>

                  <div className="space-y-3 mb-5 text-xs sm:text-[13px] text-ink/80 leading-snug">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Ответ за 3 секунды</strong> — ловит клиентов ночью и в выходные, пока конкуренты спят</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Строго по регламенту</strong> — база знаний RAG без выдумок и галлюцинаций</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Синхронизация с CRM</strong> — запись и контакты в YClients / amoCRM за 1 клик</span>
                    </div>
                  </div>

                  {/* Subtle Result Pill */}
                  <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-black/[0.04] text-[11px] text-ink/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>+35% к оплаченным заявкам · Окупаемость от 1 мес</span>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.3)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Рассчитать AI-бота под ключ</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Side: Authentic Telegram AI Chat Simulator */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <TelegramChatSimulator />
              </div>
            </div>
          )}

          {/* SCENARIO 2: VOICE TELEPHONY */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold tracking-wider uppercase mb-3">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Сценарий 02 · Телефония</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-ink mb-2 leading-tight tracking-tight">
                    Голосовой робот с живой речью
                  </h3>

                  <p className="text-sm text-ink/70 leading-relaxed mb-5 font-sans">
                    Принимает звонки, подтверждает визиты и снижает неявки клиентов без участия операторов.
                  </p>

                  <div className="space-y-3 mb-5 text-xs sm:text-[13px] text-ink/80 leading-snug">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Естественная речь</strong> — живая русская интонация с задержкой ответа &lt; 0.4 сек</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Управление календарем</strong> — сам находит свободное окно и подтверждает визит</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">От 2 ₽ за минуту</strong> — в разы дешевле содержания штатного колл-центра</span>
                    </div>
                  </div>

                  {/* Subtle Result Pill */}
                  <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-black/[0.04] text-[11px] text-ink/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>До 70% меньше забытых визитов · Экономия до 250 000 ₽/мес</span>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.3)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Протестировать голосового AI</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Side: Interactive Live Voice Call Simulator with Synchronized Transcription */}
              <div className="lg:col-span-7">
                <VoiceCallSimulator />
              </div>
            </div>
          )}

          {/* SCENARIO 3: PARSERS & SCRAPING */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wider uppercase mb-3">
                    <Database className="w-3.5 h-3.5" />
                    <span>Сценарий 03 · Базы организаций</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-ink mb-2 leading-tight tracking-tight">
                    Сбор B2B-базы организаций
                  </h3>

                  <p className="text-sm text-ink/70 leading-relaxed mb-5 font-sans">
                    Автоматический сбор открытых контактов компаний за 15 минут вместо недель ручного поиска.
                  </p>

                  <div className="space-y-3 mb-5 text-xs sm:text-[13px] text-ink/80 leading-snug">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Открытые источники</strong> — 2ГИС, Яндекс Карты, реестры и официальные сайты</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">100% законно по 152-ФЗ</strong> — только общедоступные корпоративные контакты организаций</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Чистая выгрузка</strong> — телефоны отделов продаж и закупок, email и сайты в Excel или CRM</span>
                    </div>
                  </div>

                  {/* Subtle Result Pill */}
                  <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-black/[0.04] text-[11px] text-ink/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Сбор базы за 15 минут · Без нарушения 152-ФЗ</span>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.3)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Собрать базу под мою нишу</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Side: Interactive Scraper Live Table */}
              <div className="lg:col-span-7">
                <ParserConsoleSimulator />
              </div>
            </div>
          )}

          {/* SCENARIO 4: END-TO-END INTEGRATIONS */}
          {activeTab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue/10 text-blue text-[11px] font-bold tracking-wider uppercase mb-3">
                    <Network className="w-3.5 h-3.5" />
                    <span>Сценарий 04 · Бесшовные связки</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-ink mb-2 leading-tight tracking-tight">
                    Единая экосистема программ
                  </h3>

                  <p className="text-sm text-ink/70 leading-relaxed mb-5 font-sans">
                    Сайт, CRM, склад, касса и мессенджеры обмениваются данными мгновенно и без человеческих ошибок.
                  </p>

                  <div className="space-y-3 mb-5 text-xs sm:text-[13px] text-ink/80 leading-snug">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Мгновенный обмен</strong> — оплата на сайте сама списывает товар и ставит задачу курьеру</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Сводка в Telegram</strong> — утренний отчет владельцу о выручке и сделках в 08:30</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong className="text-ink font-semibold">Надежность 24/7</strong> — облачный контур с автоперезапуском и контролем ошибок 365 дней в году</span>
                    </div>
                  </div>

                  {/* Subtle Result Pill */}
                  <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-black/[0.04] text-[11px] text-ink/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>До 120 часов рутины сэкономлено · Ноль потерянных сделок</span>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.3)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Связать мои программы</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Side: Interactive n8n Glowing Nodes Business Pipeline Simulator */}
              <div className="lg:col-span-7">
                <BusinessMeshSimulator />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
