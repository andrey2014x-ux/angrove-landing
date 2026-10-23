import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Activity, 
  ArrowUpRight,
  Database,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { config } from '../../config';

interface CaseItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  clientContext: string;
  problem: string;
  solution: string;
  stack: string[];
  metrics: {
    label: string;
    before: string;
    after: string;
    gain: string;
  }[];
}

const CASES_DATA: CaseItem[] = [
  {
    id: 'parser',
    num: '01',
    tag: 'ПАРСИНГ & ОБОГАЩЕНИЕ ДАННЫХ',
    title: 'Автоматический сбор B2B-каталогов и мониторинг цен конкурентов',
    clientContext: 'Оптовый поставщик строительного крепежа и промышленной фурнитуры',
    problem: '2 менеджера тратили по 3.5 часа ежедневно на ручной обход сайтов конкурентов, каталогов и карт, перебивая артикулы и телефоны в Excel.',
    solution: 'Развернут парсер на базе Python и Playwright. Робот в 06:00 собирает номенклатуру, цены и контакты, верифицирует номера по HLR и раскладывает по категориям.',
    stack: ['Python', 'Playwright', 'PostgreSQL', 'amoCRM API', 'Google Sheets'],
    metrics: [
      { label: 'Скорость обработки выборки', before: '3–4 часа ручного поиска', after: '3 мин 12 сек', gain: 'В 65 раз быстрее' },
      { label: 'Качество контактной базы', before: 'До 30% неактуальных номеров', after: '99.2% валидированных ЛПР', gain: 'Без мусора' },
      { label: 'Высвобожденное время', before: '70 человеко-часов в месяц', after: 'Автономный cron-запуск', gain: '~60 ч/мес в активные продажи' },
    ],
  },
  {
    id: 'assistant',
    num: '02',
    tag: 'КОНВЕРСИОННЫЙ AI-АССИСТЕНТ 24/7',
    title: 'Мгновенная квалификация лидов и расчет предварительных смет в Telegram',
    clientContext: 'Производственно-монтажная компания (остекление и алюминиевые конструкции)',
    problem: 'До 28% заявок поступали вечером и в выходные. Менеджеры отвечали только утром — потенциальные заказчики успевали заказать у конкурентов.',
    solution: 'Интегрирован FSM-ассистент с RAG по актуальному прайс-листу. Бот квалифицирует тип объекта, вычисляет ориентировочную вилку стоимости и записывает на замер.',
    stack: ['Telegram Bot API', 'Python / FastAPI', 'Redis FSM', 'Vector Store', 'Webhooks'],
    metrics: [
      { label: 'Время первого ответа', before: 'От 2 до 12 часов ожидания', after: '5.8 секунд 24/7', gain: 'Мгновенный захват лида' },
      { label: 'Конверсия ночного трафика', before: '11.4% переход в диалог', after: '34.8% переход в замер', gain: '+23.4 п.п. к выручке' },
      { label: 'Нагрузка на отдел продаж', before: 'Рутинные ответы на типовые вопросы', after: 'Менеджеры получают готовый бриф', gain: '100% целевые встречи' },
    ],
  },
  {
    id: 'digest',
    num: '03',
    tag: 'ИНТЕГРАЦИИ & СКВОЗНОЙ УЧЕТ',
    title: 'Синхронизация CRM, склада и автоматическая утренняя сводка владельцу',
    clientContext: 'Сеть сервисных центров и розничных магазинов запчастей',
    problem: 'Заявки терялись между почтой, мессенджерами и кассой. Собственник каждое утро тратил 40–50 минут на ручное сведение отчетов из трех систем.',
    solution: 'Собрана шина данных на базе n8n и webhooks: автоматическое сопоставление платежей, списание со склада и ежедневный пуш-дайджест в закрытый Telegram-канал.',
    stack: ['n8n Engine', 'amoCRM Webhooks', 'МойСклад API', 'PostgreSQL', 'Telegram Bot'],
    metrics: [
      { label: 'Сходимость финансового учета', before: 'Регулярные расхождения 3–7%', after: '100% совпадение реестров', gain: 'Ноль неучтенных заказов' },
      { label: 'Время подготовки сводки', before: '45 минут ручной сборки', after: 'Ровно в 08:30:00 каждое утро', gain: '0 минут участия человека' },
      { label: 'Забытые и зависшие клиенты', before: 'До 8–10% сделок без статуса', after: '0 просроченных этапов', gain: 'Полный контроль воронки' },
    ],
  },
];

export const Cases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('parser');
  const currentCase = CASES_DATA.find((c) => c.id === activeTab) || CASES_DATA[0];

  const renderWidget = (id: string) => {
    if (id === 'parser') {
      return (
        <div className="bg-[#111113] text-white rounded-xl border border-zinc-800 p-4 sm:p-5 font-mono text-xs select-none">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-zinc-200 tracking-wide">SCRAPER.RUNNER // v2.4</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="bg-zinc-900 border border-zinc-700/60 px-2 py-0.5 rounded text-zinc-300">
                CRON: 06:00 MSK
              </span>
              <span className="text-emerald-400 font-semibold">STATUS: STREAMING</span>
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Источники</div>
              <div className="text-zinc-200 font-bold mt-0.5">3 каталога + карты</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Таймаут запроса</div>
              <div className="text-zinc-200 font-bold mt-0.5">140 ms / proxy</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">HLR-проверка</div>
              <div className="text-emerald-400 font-bold mt-0.5">Включена</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Дедупликация</div>
              <div className="text-zinc-200 font-bold mt-0.5">По ИНН + ОГРН</div>
            </div>
          </div>

          {/* Live Data Records Table */}
          <div className="bg-black/50 border border-zinc-800/80 rounded-lg overflow-hidden mb-3.5">
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-zinc-900/90 text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-semibold">
              <div className="col-span-5">Организация / ИНН</div>
              <div className="col-span-4">Контакт ЛПР</div>
              <div className="col-span-3 text-right">Статус</div>
            </div>

            <div className="divide-y divide-zinc-800/50 text-[11px]">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-zinc-800/30 transition-colors">
                <div className="col-span-5 truncate">
                  <span className="text-zinc-100 font-medium">ООО «ПромСнаб-Урал»</span>
                  <div className="text-[10px] text-zinc-400">ИНН 6670412891 · Екатеринбург</div>
                </div>
                <div className="col-span-4 truncate text-zinc-300">
                  +7 (343) 289-41-** <span className="text-zinc-400">(Дмитрий В.)</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" /> ВАЛИДЕН
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-zinc-800/30 transition-colors">
                <div className="col-span-5 truncate">
                  <span className="text-zinc-100 font-medium">ТД «Полимер-Трейд»</span>
                  <div className="text-[10px] text-zinc-400">ИНН 7721590442 · Москва</div>
                </div>
                <div className="col-span-4 truncate text-zinc-300">
                  +7 (495) 782-19-** <span className="text-zinc-400">(Светлана Р.)</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" /> ВАЛИДЕН
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-zinc-800/30 transition-colors">
                <div className="col-span-5 truncate">
                  <span className="text-zinc-100 font-medium">АО «СпецМашПрибор»</span>
                  <div className="text-[10px] text-zinc-400">ИНН 7802819430 · СПб</div>
                </div>
                <div className="col-span-4 truncate text-zinc-300">
                  +7 (812) 334-08-** <span className="text-zinc-400">(Алексей К.)</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" /> ВАЛИДЕН
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Execution Capsule */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px]">
            <div className="flex items-center gap-2 text-zinc-300">
              <Database className="w-3.5 h-3.5 text-blue-light" />
              <span>Экспорт: <strong>542 контакта</strong> выгружены в CRM и Google Sheets</span>
            </div>
            <div className="text-zinc-400">
              Время выполнения: <strong className="text-zinc-200">03 мин 12 сек</strong>
            </div>
          </div>
        </div>
      );
    }

    if (id === 'assistant') {
      return (
        <div className="bg-[#111113] text-white rounded-xl border border-zinc-800 p-4 sm:p-5 font-mono text-xs select-none">
          {/* Chat Window Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue/20 border border-blue/40 flex items-center justify-center text-blue-light font-bold text-xs">
                AI
              </div>
              <div>
                <div className="text-zinc-200 font-bold font-sans">Telegram Bot // Sales FSM</div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  RAG-модуль подключен · База цен 2026
                </div>
              </div>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              22:48 · Нерабочее время
            </span>
          </div>

          {/* Dialog Stream */}
          <div className="space-y-3 mb-3.5 font-sans">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-zinc-800/90 text-zinc-200 rounded-xl rounded-tr-none px-3.5 py-2.5 max-w-[85%] text-xs border border-zinc-700/50">
                <div className="text-[10px] text-zinc-400 font-mono mb-1">Потенциальный клиент · 22:48:01</div>
                Добрый вечер! Делаете фахверковое остекление на 140 м² в Истринском районе? Какой ориентир по срокам и смете?
              </div>
            </div>

            {/* AI Latency Indicator */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-400 py-0.5">
              <Cpu className="w-3 h-3 text-blue-light" />
              <span>RAG-анализ номенклатуры (latency: 180ms) → Расчет вилки цен</span>
            </div>

            {/* Assistant Response */}
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl rounded-tl-none px-3.5 py-2.5 max-w-[92%] text-xs text-zinc-200">
                <div className="text-[10px] text-blue-light font-mono font-bold mb-1 flex items-center justify-between">
                  <span>AI-ассистент · 22:48:06</span>
                  <span className="text-emerald-400 font-normal">Ответ за 5.8 сек</span>
                </div>
                <p className="leading-relaxed mb-2">
                  Здравствуйте! Да, остекляем фахверковые дома двухкамерными энергосберегающими стеклопакетами 52 мм (триплекс + закаленное стекло).
                </p>
                <div className="p-2 rounded bg-black/40 border border-zinc-800 font-mono text-[11px] mb-2 space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>Ориентир сметы (140 м²):</span>
                    <strong className="text-white">1 840 000 – 2 150 000 ₽</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[10px]">
                    <span>Срок изготовления:</span>
                    <span>18–22 рабочих дня</span>
                  </div>
                </div>
                <p className="leading-relaxed text-zinc-300">
                  У вас уже есть проектная документация со спецификацией проемов или требуется согласовать выезд инженера для замера?
                </p>
              </div>
            </div>
          </div>

          {/* CRM Handover Capsule */}
          <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Лид зафиксирован в CRM: <strong>сделка создана, тег #фахверк_ночной</strong></span>
            </div>
            <span className="text-[10px] text-zinc-400">Конверсия в диалог: 94.6%</span>
          </div>
        </div>
      );
    }

    if (id === 'digest') {
      return (
        <div className="bg-[#111113] text-white rounded-xl border border-zinc-800 p-4 sm:p-5 font-mono text-xs select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-zinc-200">DAILY DIGEST PIPELINE</span>
            </div>
            <span className="text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-700/60 px-2 py-0.5 rounded">
              08:30:00 MSK · Автономно
            </span>
          </div>

          {/* High-density Status Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Оборот за 24 ч</div>
              <div className="text-base font-bold text-white mt-0.5">418 200 ₽</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">32 чека (100% сверка)</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Сходимость склада</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">100.0%</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">0 расхождений</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded">
              <div className="text-[10px] text-zinc-400 uppercase">Зависшие задачи</div>
              <div className="text-base font-bold text-zinc-200 mt-0.5">0</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Все лиды в работе</div>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-3 mb-3.5 space-y-2 text-[11px]">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              Журнал выполнения утренней шины n8n:
            </div>
            <div className="space-y-1.5 text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">08:29:41 [amoCRM]</span>
                <span className="text-zinc-200">Выгрузка 32 сделок воронки</span>
                <span className="text-emerald-400 font-semibold">[OK: 240ms]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">08:29:46 [МойСклад]</span>
                <span className="text-zinc-200">Сверка списаний и резервов остатков</span>
                <span className="text-emerald-400 font-semibold">[OK: 310ms]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">08:29:52 [Банк/Эквайринг]</span>
                <span className="text-zinc-200">Сверка реестра выписок с чеками касс</span>
                <span className="text-emerald-400 font-semibold">[OK: 180ms]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">08:30:00 [Telegram]</span>
                <span className="text-zinc-200">Формирование и отправка дайджеста собственнику</span>
                <span className="text-emerald-400 font-semibold">[DELIVERED]</span>
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Доставка в Telegram-канал руководства завершена без сбоев</span>
            </span>
            <span className="text-zinc-400">Экономия: ~45 мин/день</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section 
      id="cases" 
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      {/* Anchor for #work URL navigation */}
      <div id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header (No Serif, Clean Fluid Display Typography) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2 mb-2.5 text-xs font-mono uppercase tracking-wider text-blue font-bold">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Кейсы внедрений // Практика</span>
            </div>
            <h2 className="text-[clamp(1.85rem,3.8vw,3.25rem)] font-display font-black uppercase tracking-tight leading-[1.08] text-ink">
              Инженерные решения <span className="text-blue">[в цифрах]</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/80 max-w-lg font-sans leading-[1.6]">
            Никаких абстрактных метрик: реальные конфигурации скриптов, парсеров и чат-ассистентов с прозрачной экономией времени и устранением операционных потерь.
          </p>
        </div>

        {/* Case Switcher Tabs (Flat, Emil Kowalski Active Feedback) */}
        <div className="flex flex-wrap gap-2.5 my-8 border-b border-line-dark/20 pb-4">
          {CASES_DATA.map((c) => {
            const isActive = activeTab === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono font-medium transition-[background-color,border-color,color,transform] duration-160 ease-out active:scale-[0.97] ${
                  isActive
                    ? 'bg-[#111113] text-white border border-zinc-800'
                    : 'bg-white/40 text-ink/70 border border-line-dark/20 hover:bg-white/80 hover:text-ink'
                }`}
              >
                <span className={`text-[11px] font-bold ${isActive ? 'text-blue-light' : 'text-ink/40'}`}>
                  {c.num}
                </span>
                <span className="font-sans font-semibold tracking-tight">{c.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Active Case Details Layout (Asymmetric Two-Column Grid) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: Context, Problem, Solution, Exact Metrics Table */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2 font-mono text-xs text-ink/50">
                  <span className="font-bold text-blue font-mono">{currentCase.num} // КЕЙС</span>
                  <span>·</span>
                  <span className="text-ink/70">{currentCase.clientContext}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-ink leading-snug tracking-tight mb-4">
                  {currentCase.title}
                </h3>

                {/* Structured Context: Problem vs Solution */}
                <div className="space-y-3.5 bg-white/40 border border-line-dark/20 p-4 sm:p-5 rounded-xl text-xs sm:text-sm">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-rose-600 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      Исходная проблема
                    </div>
                    <p className="text-ink/80 leading-[1.6] font-sans">
                      {currentCase.problem}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line-dark/15">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                      Реализованное решение
                    </div>
                    <p className="text-ink/80 leading-[1.6] font-sans">
                      {currentCase.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Engineering Metrics Table (Anti-AI Tells: No Isolated Giant Numbers) */}
              <div className="border border-line-dark/25 rounded-xl bg-white/60 overflow-hidden text-xs">
                <div className="px-4 py-2 bg-ink/5 border-b border-line-dark/20 font-mono text-[10px] uppercase tracking-wider text-ink/60 font-bold flex justify-between">
                  <span>Измеряемый параметр</span>
                  <span>Было → Стало // Итог</span>
                </div>

                <div className="divide-y divide-line-dark/15">
                  {currentCase.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <div className="font-bold text-ink text-xs">{m.label}</div>
                        <div className="text-[11px] text-ink/60 mt-0.5">
                          <span className="line-through text-ink/40">{m.before}</span> → <span className="font-mono font-semibold text-ink">{m.after}</span>
                        </div>
                      </div>
                      <div className="shrink-0 font-mono text-[11px] font-bold text-blue bg-blue/10 border border-blue/20 px-2.5 py-1 rounded-md self-start sm:self-auto">
                        {m.gain}
                      </div>
                    </div>
                  ))}
                </div>
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
                      className="px-2.5 py-1 rounded bg-white/70 border border-line-dark/20 font-mono text-[11px] text-ink/80 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity UI Widget */}
            <div className="lg:col-span-6 sticky top-24">
              <div className="text-[10px] font-mono text-ink/40 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Интерфейс в боевом режиме</span>
                <span>Live Preview</span>
              </div>
              {renderWidget(currentCase.id)}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Editorial Callout (TasteKill Clean Dark Card, No Neon Blobs) */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-10 rounded-2xl bg-[#111113] text-white border border-zinc-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Экспресс-аудит бизнес-процессов</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white leading-tight mb-2.5">
                Хотите узнать, какие операции выгоднее всего автоматизировать у вас?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-[1.6]">
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
