import React, { useState, useRef } from 'react';
import { Bot, PhoneCall, Database, Network, ArrowUpRight, Play, Pause, CheckCircle2 } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';
import { TelegramChatSimulator } from '../ui/TelegramChatSimulator';
import { BusinessMeshSimulator } from '../ui/BusinessMeshSimulator';
import { ParserConsoleSimulator } from '../ui/ParserConsoleSimulator';

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.08 });

  const [activeTab, setActiveTab] = useState<number>(0);

  // Tab 2: Audio Simulation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCtaClick = () => {
    trackGoal('click_services_cta');
    trackGoal('click_telegram');
  };

  const tabs = [
    {
      id: 'bot',
      title: 'Умный бот в Telegram',
      tag: 'САМ ПРОДАЕТ 24/7',
      simplePitch: 'Отвечает клиентам за 5 секунд, считает смету и записывает на замер, пока вы спите',
    },
    {
      id: 'voice',
      title: 'Голосовой AI-робот',
      tag: 'ВМЕСТО ОПЕРАТОРОВ',
      simplePitch: 'Обзванивает базу или принимает звонки живым голосом без выгорания и задержек',
    },
    {
      id: 'parser',
      title: 'Сбор баз клиентов',
      tag: 'ЗА 3 МИНУТЫ В EXCEL',
      simplePitch: 'Собирает чистые контакты поставщиков и клиентов с проверенными телефонами',
    },
    {
      id: 'mesh',
      title: 'Связка всего бизнеса',
      tag: 'НОЛЬ РУЧНОГО ТРУДА',
      simplePitch: 'Сайт, склад, касса и мессенджеры сами обмениваются данными без ошибок людей',
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
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-4">
                    <Bot className="w-3.5 h-3.5" />
                    <span>СЦЕНАРИЙ: КЛИЕНТ ПИШЕТ В НЕРАБОЧЕЕ ВРЕМЯ</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-4 leading-tight">
                    Бот отвечает клиенту за 5 секунд, квалифицирует и заносит сделку в CRM
                  </h3>

                  <p className="text-sm sm:text-base text-ink/75 leading-relaxed mb-6 font-sans">
                    Вам больше не нужно дежурить у телефона вечером или терять заявки в выходные. Бот сам задаст клиенту нужные вопросы по прайсу, рассчитает смету и запишет на замер или созвон.
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs sm:text-sm font-medium text-ink/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Понимает голосовые сообщения и текст с опечатками</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Моментально создает сделку в amoCRM или Bitrix24</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Присылает вам уведомление: «Горячий клиент готов к оплате»</span>
                    </div>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.35)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Хочу такого бота в свой бизнес</span>
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
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>СЦЕНАРИЙ: ОБЗВОН БАЗЫ ИЛИ ВХОДЯЩИЕ ЗВОНКИ</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-4 leading-tight">
                    Голосовой робот обзванивает базу живым голосом и передает готовых клиентов
                  </h3>

                  <p className="text-sm sm:text-base text-ink/75 leading-relaxed mb-6 font-sans">
                    Больше не нужно нанимать операторов, которые быстро выгорают и делают по 40 звонков в день. Робот делает 1000 звонков в час, отвечает без пауз, слушает клиента и переводит заинтересованных на вас.
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs sm:text-sm font-medium text-ink/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Живая русская речь без роботизированного металлического акцента</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Себестоимость звонка от 2 ₽ за минуту вместо зарплаты оператора</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Запись разговора и краткая суть звонка сразу в вашей CRM</span>
                    </div>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.35)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Обсудить голосового робота</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right Side: Interactive Audio Telephony Simulator */}
              <div className="lg:col-span-7 bg-[#0E111A] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-2xl flex flex-col justify-between min-h-[460px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold">Симуляция звонка клиенту</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">ЗАДЕРЖКА &lt; 0.4 СЕК</span>
                </div>

                {/* Visual Audio Wave */}
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1.5 h-16 mb-4">
                    {[12, 28, 45, 60, 32, 55, 40, 20, 60, 48, 30, 50, 22].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full bg-blue transition-all duration-150 ${
                          isPlayingAudio ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{ height: isPlayingAudio ? `${h}px` : '12px' }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink font-bold text-xs uppercase tracking-wider hover:bg-blue hover:text-white transition-all cursor-pointer shadow-lg"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingAudio ? 'Пауза демо-диалога' : 'Воспроизвести пример звонка'}</span>
                  </button>
                </div>

                {/* Dialog Script Subtitles */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                  <div className="font-bold text-blue-light text-[11px] mb-1">Фрагмент живого диалога:</div>
                  <p className="italic">
                    {isPlayingAudio
                      ? '«— Алло, здравствуйте, Алексей! Звоню из клиники "Дента", вы оставляли заявку на консультацию. Вам удобно в четверг в 15:00 или в субботу?»'
                      : 'Нажмите кнопку выше, чтобы прослушать, как звучит реальный диалог робота с клиентом.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCENARIO 3: PARSERS & SCRAPING */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                    <Database className="w-3.5 h-3.5" />
                    <span>СЦЕНАРИЙ: ПОИСК ПОСТАВЩИКОВ И БАЗ КЛИЕНТОВ</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-4 leading-tight">
                    Программа за 3 минуты собирает чистую базу контактов с проверенными номерами
                  </h3>

                  <p className="text-sm sm:text-base text-ink/75 leading-relaxed mb-6 font-sans">
                    Вместо того чтобы вручную сидеть на картах, каталогах и сайтах и копировать телефоны в Excel, программа обходит все нужные источники, убирает дубли и проверяет, что номер живой.
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs sm:text-sm font-medium text-ink/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Сбор с любых закрытых каталогов, 2ГИС, Яндекс Карт и маркетплейсов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Проверка доступности телефонных номеров (ноль битых контактов)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Выгрузка прямо в Google Таблицу или в вашу CRM</span>
                    </div>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.35)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Заказать сбор базы под мою нишу</span>
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
              <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-4">
                    <Network className="w-3.5 h-3.5" />
                    <span>СЦЕНАРИЙ: СВЯЗКА ВСЕХ СЕРВИСОВ БИЗНЕСА</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-4 leading-tight">
                    Сайт, склад, касса и мессенджеры синхронизируются сами за 1 секунду
                  </h3>

                  <p className="text-sm sm:text-base text-ink/75 leading-relaxed mb-6 font-sans">
                    Когда клиент платит на сайте, остатки на складе списываются автоматически, чек пробивается в налоговой, а вам в телефон приходит точный отчет. Ни один сотрудник ничего не перебивает руками.
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs sm:text-sm font-medium text-ink/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Ноль потерянных заказов и двойных продаж отсутствующего товара</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Утренняя персональная сводка о деньгах и марже в Telegram в 08:30:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Работает бесперебойно 365 дней в году</span>
                    </div>
                  </div>
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 bg-blue text-white rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.35)] hover:bg-blue-dark transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span>Связать мои программы и сервисы</span>
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
