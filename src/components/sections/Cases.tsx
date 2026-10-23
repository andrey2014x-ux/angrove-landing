import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowUpRight,
  Database,
  Play,
  Pause,
  Calendar,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { config } from '../../config';

interface CaseItem {
  id: string;
  num: string;
  tabLabel: string;
  clientBadge: string;
  title: string;
  problem: string;
  solution: string;
  stack: string[];
  metrics: {
    value: string;
    label: string;
    detail: string;
  }[];
}

const CASES_DATA: CaseItem[] = [
  {
    id: 'parser',
    num: '01',
    tabLabel: 'Парсинг & обогащение данных',
    clientBadge: 'Оптовый поставщик строительного крепежа · Санкт-Петербург',
    title: 'Автоматический сбор B2B-каталогов и мониторинг цен конкурентов',
    problem: '2 менеджера ежедневно тратили по 3.5 часа на монотонный обход каталогов, справочников и сайтов конкурентов, вручную копируя контакты и цены в Excel.',
    solution: 'Развернут автономный парсер на Python и Playwright. Робот в 06:00 собирает номенклатуру и контакты, верифицирует телефоны по HLR-проверке и синхронизирует с amoCRM.',
    stack: ['Python', 'Playwright', 'PostgreSQL', 'HLR Lookup API', 'amoCRM Webhooks'],
    metrics: [
      {
        value: '65x',
        label: 'Ускорение сбора базы',
        detail: 'с 4 часов до 3 мин 12 сек',
      },
      {
        value: '99.2%',
        label: 'Чистая база ЛПР',
        detail: 'HLR-валидация без мусора',
      },
      {
        value: '60 ч/мес',
        label: 'Экономия времени',
        detail: 'перенаправлено в продажи',
      },
    ],
  },
  {
    id: 'assistant',
    num: '02',
    tabLabel: 'Конверсионный AI-ассистент 24/7',
    clientBadge: 'Производственно-монтажная компания (остекление) · Москва',
    title: 'Мгновенная квалификация лидов и расчет предварительных смет в Telegram',
    problem: 'До 28% заявок поступали вечером и в выходные. Менеджеры отвечали только утром — потенциальные заказчики успевали заказать у конкурентов.',
    solution: 'Интегрирован умный ассистент с RAG по актуальному прайс-листу компании. Бот мгновенно квалифицирует объект, рассчитывает вилку сметы и передает готовый бриф в CRM.',
    stack: ['Telegram Bot API', 'Python / FastAPI', 'RAG Knowledge Base', 'Redis FSM', 'amoCRM'],
    metrics: [
      {
        value: '5.8 сек',
        label: 'Время первого ответа',
        detail: 'круглосуточно без выходных',
      },
      {
        value: '+23.4%',
        label: 'Конверсия ночного трафика',
        detail: 'в назначенный замер',
      },
      {
        value: '0',
        label: 'Потерянных обращений',
        detail: '100% лидов в воронке',
      },
    ],
  },
  {
    id: 'digest',
    num: '03',
    tabLabel: 'Интеграции & сквозной учет',
    clientBadge: 'Сеть сервисных центров и розничных магазинов запчастей',
    title: 'Синхронизация CRM, склада и автоматическая утренняя сводка владельцу',
    problem: 'Заявки терялись между почтой, мессенджерами и кассой. Собственник каждое утро тратил 45 минут на ручное сведение отчетов из трех несовместимых систем.',
    solution: 'Собрана шина данных на базе n8n и вебхуков: автоматическое сопоставление платежей, списание остатков на складе и ежедневный пуш-дайджест ровно в 08:30:00.',
    stack: ['n8n Engine', 'amoCRM Webhooks', 'МойСклад API', 'Банковский эквайринг', 'Telegram Bot'],
    metrics: [
      {
        value: '100%',
        label: 'Сходимость финучета',
        detail: 'ноль неучтенных платежей',
      },
      {
        value: '08:30',
        label: 'Ежедневный дайджест',
        detail: 'автономно в Telegram',
      },
      {
        value: '0 мин',
        label: 'Ручной сборки отчетов',
        detail: 'экономия 45 минут в день',
      },
    ],
  },
];

export const Cases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('parser');
  const [filterMode, setFilterMode] = useState<'all' | 'valid'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const currentCase = CASES_DATA.find((c) => c.id === activeTab) || CASES_DATA[0];

  const renderWidget = (id: string) => {
    if (id === 'parser') {
      const records = [
        {
          name: 'ООО «ПромТехСнаб»',
          inn: 'ИНН 6670412891 · Екатеринбург',
          contact: 'Дмитрий Волков',
          phone: '+7 (343) 289-41-**',
          carrier: 'МТС · Активен',
          deal: 'Сделка #9102',
          valid: true,
        },
        {
          name: 'ТД «Полимер-Трейд»',
          inn: 'ИНН 7721590442 · Москва',
          contact: 'Светлана Романова',
          phone: '+7 (495) 782-19-**',
          carrier: 'МегаФон · Активен',
          deal: 'Сделка #9103',
          valid: true,
        },
        {
          name: 'АО «СпецМашПрибор»',
          inn: 'ИНН 7802819430 · СПб',
          contact: 'Алексей Котов',
          phone: '+7 (812) 334-08-**',
          carrier: 'Билайн · Активен',
          deal: 'Сделка #9104',
          valid: true,
        },
      ];

      return (
        <div className="bg-[#0E1015] text-zinc-100 rounded-2xl border border-zinc-800/90 shadow-2xl overflow-hidden select-none font-sans">
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-[#13151C] border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
              </div>
              <span className="text-zinc-600 text-xs">/</span>
              <span className="font-mono text-xs text-zinc-300 font-semibold tracking-wide truncate">
                b2b-hardware-scraper.py
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CRON 06:00
              </span>
            </div>
          </div>

          {/* Interactive Toolbar */}
          <div className="p-3.5 bg-[#101218] border-b border-zinc-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  filterMode === 'all'
                    ? 'bg-blue text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Все записи (542)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('valid')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  filterMode === 'valid'
                    ? 'bg-blue text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Валидные (538)
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span>Скорость:</span>
              <span className="text-zinc-200 font-semibold">240/мин</span>
              <span className="text-zinc-700">|</span>
              <span className="text-emerald-400 font-semibold">HLR 100%</span>
            </div>
          </div>

          {/* Data List: Responsive Cards on Mobile, Table on Desktop */}
          <div className="divide-y divide-zinc-800/50">
            {records.map((r, idx) => (
              <div 
                key={idx}
                className="p-3 sm:px-4 sm:py-2.5 hover:bg-zinc-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-100 truncate">{r.name}</div>
                  <div className="font-mono text-[10px] text-zinc-400 truncate">{r.inn}</div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-zinc-200 font-medium text-[11px] sm:text-xs">{r.contact}</div>
                    <div className="font-mono text-[10px] text-blue-light whitespace-nowrap">{r.phone}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {r.carrier}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50 whitespace-nowrap">
                      {r.deal}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Execution Bar */}
          <div className="p-3 bg-[#13151C] border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Database className="w-3.5 h-3.5 text-blue-light shrink-0" />
              <span>Выгрузка: <strong>542 контакта</strong> в amoCRM и Sheets</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-400">
              Выполнено за <strong className="text-emerald-400">03 мин 12 сек</strong>
            </div>
          </div>
        </div>
      );
    }

    if (id === 'assistant') {
      return (
        <div className="bg-[#111318] text-zinc-100 rounded-2xl border border-zinc-800/90 shadow-2xl overflow-hidden select-none font-sans">
          {/* Telegram Header */}
          <div className="px-4 py-3 bg-[#161821] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center text-white font-bold text-xs shadow-md">
                  ФМ
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#161821]" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                  <span>Фахверк Монтаж Bot</span>
                  <span className="bg-blue/20 text-blue-light font-mono text-[9px] px-1 rounded uppercase font-bold">
                    AI 24/7
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400">бот компании · онлайн</div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              🌙 22:48 · Ночной трафик
            </span>
          </div>

          {/* Dialog Stream */}
          <div className="p-3.5 sm:p-4 space-y-2.5 bg-[#0D0F14]/60 text-xs">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#1E2333] border border-blue/20 text-zinc-100 rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[88%] shadow-sm">
                <p className="leading-relaxed">
                  Добрый вечер! Делаете фахверковое остекление на 140 м² в Истринском районе? Какой ориентир по смете и срокам?
                </p>
                <div className="text-[9px] text-zinc-400 text-right mt-1 font-mono">22:48:01</div>
              </div>
            </div>

            {/* Audio Voice Note from Bot */}
            <div className="flex justify-start">
              <div className="bg-[#181B24] border border-zinc-800 text-zinc-100 rounded-2xl rounded-tl-none p-2.5 sm:p-3 max-w-[90%] shadow-sm">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-7 h-7 rounded-full bg-blue hover:bg-blue-dark flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5 h-3.5">
                      {[40, 70, 30, 90, 60, 100, 45, 80, 50, 65, 85, 35, 75, 45].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${isPlayingAudio ? Math.random() * 80 + 20 : h}%` }}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isPlayingAudio ? 'bg-blue' : 'bg-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">0:14</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Голосовой ответ инженера · синтез за 1.2 сек
                </div>
              </div>
            </div>

            {/* Bot text quote response */}
            <div className="flex justify-start">
              <div className="bg-[#181B24] border border-zinc-800 text-zinc-100 rounded-2xl rounded-tl-none p-3 sm:p-3.5 max-w-[94%] shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-800/80">
                  <span className="text-blue-light font-semibold text-[11px]">AI-ассистент</span>
                  <span className="text-[10px] font-mono text-emerald-400">Ответ за 5.8 сек</span>
                </div>
                <p className="leading-relaxed mb-2 text-zinc-200">
                  Здравствуйте! Да, остекляем фахверковые объекты двухкамерным мультифункциональным триплексом 52 мм.
                </p>

                {/* Structured Estimate Card */}
                <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-2.5 font-mono text-[11px] space-y-1 mb-2">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Ориентир сметы (140 м²):</span>
                    <strong className="text-emerald-400 font-bold">1 840 000 – 2 150 000 ₽</strong>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 text-[10px]">
                    <span>Срок изготовления:</span>
                    <span className="text-zinc-200">18–22 рабочих дня</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 text-[10px]">
                    <span>Доставка в Истринский р-н:</span>
                    <span className="text-zinc-200">Включена</span>
                  </div>
                </div>

                {/* Inline Action Pills */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded bg-blue hover:bg-blue-dark text-white font-mono text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    Записаться на замер
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[10px] transition-colors cursor-pointer"
                  >
                    Скачать спецификацию (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CRM Notification Banner */}
          <div className="p-3 bg-[#161821] border-t border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Лид зафиксирован в amoCRM: <strong>тег #фахверк_ночной</strong></span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">Конверсия: 94.6%</span>
          </div>
        </div>
      );
    }

    if (id === 'digest') {
      return (
        <div className="bg-[#0E1015] text-zinc-100 rounded-2xl border border-zinc-800/90 shadow-2xl overflow-hidden select-none font-sans">
          {/* Top Bar */}
          <div className="px-4 py-3 bg-[#13151C] border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-xs text-white">Утренний дайджест собственнику</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              08:30:00 MSK · Автономно
            </span>
          </div>

          {/* 3 Pipeline Nodes */}
          <div className="p-3 sm:p-3.5 bg-[#101218] border-b border-zinc-800/60">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 sm:p-2.5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">amoCRM</div>
                <div className="text-xs sm:text-sm font-bold text-white mt-0.5">32 сделки</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5 truncate">
                  <Check className="w-2.5 h-2.5 shrink-0" /> 100% сверено
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 sm:p-2.5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">МойСклад</div>
                <div className="text-xs sm:text-sm font-bold text-white mt-0.5">32 списания</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5 truncate">
                  <Check className="w-2.5 h-2.5 shrink-0" /> 0 расхождений
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 sm:p-2.5 rounded-xl">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Банк / Касса</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 truncate">418 200 ₽</div>
                <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 truncate">Сверка реестров</div>
              </div>
            </div>
          </div>

          {/* Telegram Dispatch Card */}
          <div className="p-3.5 sm:p-4 bg-[#0D0F14]/70">
            <div className="bg-[#181B24] border border-zinc-800 rounded-xl p-3 sm:p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5 truncate">
                  <span>📱 Telegram: «Дирекция · Операционная сводка»</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 shrink-0">08:30:00</span>
              </div>

              <div className="font-mono text-[11px] space-y-1.5 text-zinc-300">
                <div className="text-emerald-400 font-semibold text-xs">
                  🌅 Доброе утро! Итоги вторника (автоматический аудит):
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Выручка за 24 ч:</span>
                  <span className="text-white font-bold">418 200 ₽ (+14% к плану)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Оплачено заказов:</span>
                  <span className="text-white">32 чека (средний чек: 13 068 ₽)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Складские остатки:</span>
                  <span className="text-emerald-400">100% сходимость, 0 потерь</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Зависшие лиды:</span>
                  <span className="text-emerald-400 font-bold">0 сделок без ответа</span>
                </div>
              </div>

              <div className="pt-1.5 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[10px] transition-colors flex items-center gap-1 cursor-pointer">
                  <FileSpreadsheet className="w-3 h-3 text-blue-light" />
                  Открыть сводный отчет в DataLens
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-3 bg-[#13151C] border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Шина n8n отработала за 1.8 сек</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-400">Экономия: 45 мин/день</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section 
      id="cases" 
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
    >
      {/* Anchor for #work URL navigation */}
      <div id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-line-dark/25">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue font-bold">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Кейсы внедрений · Реальный опыт</span>
            </div>
            <h2 className="text-[clamp(1.9rem,3.8vw,3.25rem)] font-display font-black tracking-tight leading-[1.1] text-ink">
              Инженерные решения{' '}
              <span className="font-serif italic font-normal text-blue whitespace-nowrap">
                в цифрах
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/75 max-w-lg font-sans leading-relaxed">
            Никаких выдуманных историй: реальные конфигурации скриптов, парсеров и чат-ассистентов с прозрачной экономией времени и устранением операционных потерь.
          </p>
        </div>

        {/* Case Switcher Tabs: Smooth Horizontal Scroll on Mobile, Flex on Desktop */}
        <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-2 sm:gap-2.5 my-6 sm:my-8 border-b border-line-dark/15 pb-4 sm:flex-wrap select-none">
          {CASES_DATA.map((c) => {
            const isActive = activeTab === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-[background-color,border-color,color,transform] duration-160 ease-out active:scale-[0.98] shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-white border border-ink shadow-sm'
                    : 'bg-white/60 text-ink/75 border border-line-dark/20 hover:bg-white hover:text-ink'
                }`}
              >
                <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue-light' : 'text-ink/40'}`}>
                  {c.num}
                </span>
                <span className="font-sans font-semibold tracking-tight">{c.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Case Details Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: Context, Problem, Solution, Exact Metrics Cards */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Client Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-line-dark/20 text-xs text-ink/75 font-sans mb-3 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                  <span>{currentCase.clientBadge}</span>
                </div>

                {/* Case Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-ink leading-snug tracking-tight mb-5">
                  {currentCase.title}
                </h3>

                {/* Refined Before / After Editorial Blocks */}
                <div className="space-y-3.5">
                  {/* Before */}
                  <div className="bg-black/[0.03] border border-black/10 rounded-xl p-4 sm:p-5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-ink/90 font-sans text-xs">
                        Исходная ситуация и рутина
                      </span>
                      <span className="font-mono text-[10px] text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded font-medium">
                        До внедрения
                      </span>
                    </div>
                    <p className="text-ink/75 leading-relaxed font-sans">
                      {currentCase.problem}
                    </p>
                  </div>

                  {/* After */}
                  <div className="bg-white border border-line-dark/20 rounded-xl p-4 sm:p-5 text-xs sm:text-sm shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-ink font-sans text-xs">
                        Архитектура решения
                      </span>
                      <span className="font-mono text-[10px] text-blue bg-blue/10 border border-blue/20 px-2 py-0.5 rounded font-semibold">
                        Автоматизация
                      </span>
                    </div>
                    <p className="text-ink/85 leading-relaxed font-sans">
                      {currentCase.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Grand Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentCase.metrics.map((m, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-white border border-line-dark/20 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50 font-semibold mb-1">
                        {m.label}
                      </div>
                      <div className="text-2xl sm:text-3xl font-display font-black text-ink tracking-tight tabular-nums">
                        {m.value}
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-line-dark/10 font-mono text-[10px] text-blue font-medium">
                      {m.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Chips */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink/50 font-bold mb-2">
                  Использованный стек технологий
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCase.stack.map((item, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-line-dark/20 font-mono text-[11px] text-ink/80 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity UI Widget (Fixed: ONLY lg:sticky so it NEVER breaks mobile scroll!) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 w-full">
              {renderWidget(currentCase.id)}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Editorial Callout Card */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-2xl bg-ink text-white border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Экспресс-аудит бизнес-процессов</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white leading-tight mb-2.5">
                Хотите узнать, какие операции выгоднее всего автоматизировать у вас?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                Опишите в 2–3 предложениях ваши ежедневные рутинные задачи (сбор данных, ответы клиентам, перенос таблиц). Я изучу стек и предложу точный сценарий экономии времени с оценкой сроков разработки.
              </p>
            </div>

            <div className="flex flex-col sm:items-start lg:items-end gap-2 shrink-0">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue hover:bg-blue-dark text-white font-mono text-xs uppercase tracking-wider font-bold transition-[transform,background-color] duration-160 ease-out active:scale-[0.97]"
              >
                <span>Обсудить задачу в Telegram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-zinc-400 font-mono">
                Ответ инженера в течение 15 минут · Без спама
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
