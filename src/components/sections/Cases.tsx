import React, { useState, useRef } from 'react';
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Boxes,
  Building2,
  XCircle,
  Quote,
  Clock,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTelegramUrl } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

export interface MetricItem {
  value: string;
  label: string;
  sub: string;
}

export interface CaseStudy {
  id: string;
  tabLabel: string;
  nicheBadge: string;
  clientTitle: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  before: {
    badge: string;
    title: string;
    description: string;
    lossMetric: string;
    lossDetails: string[];
  };
  after: {
    badge: string;
    title: string;
    description: string;
    architecture: string[];
    pushSnippet: {
      source: string;
      badge: string;
      time: string;
      message: string;
    };
  };
  metrics: MetricItem[];
  payback: {
    value: string;
    label: string;
  };
  quote: {
    text: string;
    author: string;
    role: string;
    initials: string;
  };
  ctaText: string;
  telegramMessage: string;
}

const CASES_DATA: CaseStudy[] = [
  {
    id: 'case-salons',
    tabLabel: '01. Салоны красоты & клиники',
    nicheBadge: 'Салоны красоты & косметология',
    clientTitle: 'Сеть студий лазерной эпиляции (Москва, 3 филиала)',
    title: 'Автоматическое подтверждение визитов и допродажи в YClients',
    summary: 'Автономный AI-ассистент подтверждает приход клиентов живым голосом и текстом, спасает сгорающие слоты и за 3 секунды оформляет ночные заявки с рекламы.',
    icon: Sparkles,
    before: {
      badge: 'Ручной труд',
      title: 'Ручной обзвон и сгорающие окна',
      description: '2 администратора вели переписку вручную в мессенджерах. 22% клиентов забывали о визите и не приходили. Ночные лиды с таргета оставались без ответа до утра.',
      lossMetric: '~210 000 ₽ / мес потерь на пустых окнах и 4 ч рутины администраторов в день',
      lossDetails: [
        '4 часа в день администраторы тратили на рутинный обзвон вместо сервиса в салоне',
        '22% неявок из-за отсутствия своевременных напоминаний за 24 ч и 2 ч',
        'Заявки с таргетированной рекламы после 21:00 оставались без ответа до 10:00 утра',
      ],
    },
    after: {
      badge: 'Код и AI',
      title: 'AI-ассистент записи и автоподтверждение',
      description: 'Автономный связной контур: подтверждение визитов живым голосом и текстом в Telegram/WhatsApp за 24 ч и 2 ч. Мгновенная запись ночных лидов с авто-внесением в календарь YClients.',
      architecture: [
        'Claude 3.5 Sonnet',
        'n8n Workflow',
        'YClients API',
        'Telegram Bot API',
        'WhatsApp Business',
      ],
      pushSnippet: {
        source: 'Telegram · Бот записи',
        badge: 'YClients',
        time: 'только что',
        message: '«Пациент Анна (завтра 14:00, чистка лица) подтвердила приход живым голосом. Слот в расписании окрашен в зеленый».',
      },
    },
    metrics: [
      {
        value: '–68%',
        label: 'Неявок на процедуры',
        sub: 'клиенты подтверждают визит вовремя',
      },
      {
        value: '+240 000 ₽',
        label: 'Выручки в месяц',
        sub: 'за счет сохранения сгорающих окон',
      },
      {
        value: '3 сек',
        label: 'Время ответа ночью',
        sub: '0 потерянных заявок с рекламы',
      },
    ],
    payback: {
      value: '14 дней',
      label: 'Окупаемость внедрения',
    },
    quote: {
      text: '«Раньше администраторы полдня сидели на телефоне, а окна всё равно сгорали. Теперь бот сам ведет запись и напоминает. В расписании зеленые статусы, а выручка филиалов выросла уже в первый месяц».',
      author: 'Елена В.',
      role: 'Управляющая сетью студий эпиляции',
      initials: 'ЕВ',
    },
    ctaText: 'Хочу такой же результат',
    telegramMessage: 'Добрый день, Андрей! Увидел кейс салонов красоты на сайте. Хочу внедрить AI-бота записи и подтверждения визитов с YClients под ключ.',
  },
  {
    id: 'case-ecom',
    tabLabel: '02. Товарный бизнес & склад',
    nicheBadge: 'Товарный бизнес & E-commerce',
    clientTitle: 'Производство и опт аксессуаров (склад МО + интернет-магазин)',
    title: 'Мгновенная синхронизация сайта, остатков и кассы в МойСклад',
    summary: 'Отказоустойчивая шина синхронизации: секунда-в-секунду списание остатков при заказе на любой витрине, автопечать листов сборки и утренний дайджест собственнику в Telegram.',
    icon: Boxes,
    before: {
      badge: 'Ручной труд',
      title: 'Ручной перенос заказов и пересорты',
      description: 'Заказы с сайта и маркетплейсов менеджеры вручную переносили в МойСклад. Задержка списания остатков до 3 часов приводила к продаже уже отсутствующих позиций. Еженедельная ручная сверка съедала выходные.',
      lossMetric: '15 срывов отгрузок в месяц и 120 ч ручной сверки остатков',
      lossDetails: [
        'Задержка обновления остатков до 3 часов между сайтом, маркетплейсами и складом',
        '15 инцидентов продажи отсутствующих позиций в месяц с возвратами и негативом',
        'Менеджеры тратили по 6 часов каждую субботу на ручную сверку остатков',
      ],
    },
    after: {
      badge: 'Код и AI',
      title: 'Отказоустойчивая шина синхронизации',
      description: 'Интеграционная шина n8n: секунда-в-секунду списание остатков при заказе на любой витрине. Автоматическая печать листов сборки и трек-номеров СДЭК. Утренний аналитический дайджест собственнику в Telegram в 08:30.',
      architecture: [
        'n8n Engine',
        'МойСклад API',
        'PostgreSQL',
        'Telegram Bot API',
        'СДЭК API',
      ],
      pushSnippet: {
        source: 'Telegram · Утренний дайджест',
        badge: 'МойСклад',
        time: '08:30',
        message: '«Вчера: 34 заказа с сайта и кассы. Остатки на складе списаны секунда в секунду. Ошибок и пересортов: 0».',
      },
    },
    metrics: [
      {
        value: '0 ошибок',
        label: 'Учета и пересортов',
        sub: 'мгновенное списание остатков',
      },
      {
        value: '120 ч',
        label: 'Экономии команды/мес',
        sub: 'ручная сверка полностью исключена',
      },
      {
        value: '< 2 мин',
        label: 'От оплаты до трек-номера',
        sub: 'автоматическая передача в доставку',
      },
    ],
    payback: {
      value: '18 дней',
      label: 'Окупаемость внедрения',
    },
    quote: {
      text: '«Пересорт и продажа товаров, которых нет на складе, были нашей главной головной болью. Андрей за неделю собрал связку: остатки списываются мгновенно, а я каждое утро получаю чистый отчет в Telegram».',
      author: 'Максим Т.',
      role: 'Основатель бренда аксессуаров',
      initials: 'МТ',
    },
    ctaText: 'Хочу такой же результат',
    telegramMessage: 'Добрый день, Андрей! Увидел кейс товарного бизнеса и склада. Хочу настроить мгновенную синхронизацию МойСклад, сайта и трекинга доставки.',
  },
  {
    id: 'case-b2b',
    tabLabel: '03. B2B-услуги & снабжение',
    nicheBadge: 'B2B-услуги & Снабжение',
    clientTitle: 'Поставщик крепежа и металлоконструкций (Санкт-Петербург)',
    title: 'Автоматический сбор баз ЛПР и мгновенный расчет смет в amoCRM',
    summary: 'Автономный сбор прямых контактов директоров с карт и реестров, проверка сотовых номеров по HLR и автогенерация коммерческих предложений в PDF за 30 секунд.',
    icon: Building2,
    before: {
      badge: 'Ручной труд',
      title: 'Холодный поиск вручную и затянутые КП',
      description: 'Менеджеры вручную искали контакты строительных компаний на картах и сайтах. До 40% номеров — общие городские АТС с глухим барьером секретаря. Расчет сметы и отправка КП занимали до 2 суток.',
      lossMetric: 'До 4 ч рутины каждого менеджера в день, цикл сделки 18 дней',
      lossDetails: [
        'Менеджеры тратили 2 недели в месяц на ручной поиск контактов на картах',
        '40% звонков разбивались о секретарские барьеры городских номеров 8-800',
        'Подготовка коммерческого предложения и расчет сметы вручную занимали до 2 суток',
      ],
    },
    after: {
      badge: 'Код и AI',
      title: 'Парсер с верификацией + автогенератор КП',
      description: 'Автономный парсер на Python + Playwright собирает прямые мобильные телефоны ЛПР с карт и каталогов, валидирует по HLR и проверяет наличие WhatsApp. При входящем запросе КП формируется автоматически в PDF за 30 секунд и ставится задача в amoCRM.',
      architecture: [
        'Python Playwright',
        'amoCRM API',
        'HLR Lookup',
        'Telegram Alerts',
        'n8n Webhooks',
      ],
      pushSnippet: {
        source: 'Telegram · Сбор контактов',
        badge: 'Excel / amoCRM',
        time: '15:10',
        message: '«Сбор по 14 городам завершен: 4 200 мобильных номеров директоров проверены по сотовой сети и загружены в amoCRM».',
      },
    },
    metrics: [
      {
        value: '60x быстрее',
        label: 'Сбор и валидация базы',
        sub: '3 часа вместо 2 недель ручного поиска',
      },
      {
        value: '98.4%',
        label: 'Чистых номеров ЛПР',
        sub: 'без секретарских барьеров и АТС',
      },
      {
        value: '+38%',
        label: 'К закрытым договорам',
        sub: 'быстрый расчет смет в день обращения',
      },
    ],
    payback: {
      value: '21 день',
      label: 'Окупаемость внедрения',
    },
    quote: {
      text: '«Раньше отдел продаж две недели собирал базу для обзвона и натыкался на секретарей. Парсер Андрея выдал чистые мобильные номера директоров за несколько часов. Конверсия выросла сразу, потому что звоним напрямую ЛПР».',
      author: 'Дмитрий К.',
      role: 'Коммерческий директор',
      initials: 'ДК',
    },
    ctaText: 'Хочу такой же результат',
    telegramMessage: 'Добрый день, Андрей! Увидел кейс B2B-снабжения и парсинга. Хочу автоматизировать сбор базы контактов ЛПР и связку с CRM.',
  },
];

export const Cases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.08 });

  const currentCase = CASES_DATA[activeTab];

  const handleDiscussClick = () => {
    trackGoal('click_case_discuss');
    trackGoal('click_telegram');
  };

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/[0.06]">
          <div>
            <div
              data-reveal="badge"
              className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-mono font-bold tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
              <span>Реальные внедрения в цифрах</span>
            </div>
            <WordReveal
              as="h2"
              text="Кейсы: до и после внедрения кода"
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink"
              highlightWords={{
                до: 'font-serif italic font-normal text-blue lowercase',
                после: 'font-serif italic font-normal text-blue lowercase',
              }}
            />
            <p
              data-reveal="desc"
              className="text-xs sm:text-sm text-ink/70 max-w-xl font-sans leading-relaxed mt-3"
            >
              Без выдуманных историй: реальная экономия ФОТ, устранение потерь и окупаемость систем за первые недели работы.
            </p>
          </div>

          <a
            href={getTelegramUrl(currentCase.telegramMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDiscussClick}
            className="inline-flex items-center gap-2 bg-white text-ink border border-black/[0.08] hover:border-black/20 hover:bg-zinc-50 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs self-start md:self-auto shrink-0"
          >
            <span>Обсудить мою задачу</span>
            <ArrowUpRight className="w-4 h-4 text-blue" />
          </a>
        </div>

        {/* 3-Tab Selector */}
        <div className="pt-6 sm:pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-zinc-100/90 border border-black/[0.06]">
            {CASES_DATA.map((item, idx) => {
              const isActive = idx === activeTab;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`case-tab-${idx}`}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left select-none ${
                    isActive
                      ? 'bg-[#0A0C16] text-white shadow-md'
                      : 'bg-white/80 text-ink/80 hover:text-ink hover:bg-white border border-black/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/10 text-blue-light' : 'bg-zinc-100 text-ink/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-tight truncate">
                      {item.tabLabel}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" />
                  ) : (
                    <span className="text-[10px] font-mono text-ink/40 hidden lg:inline-block shrink-0 ml-2">
                      {item.nicheBadge.split('&')[0].trim()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Case Bento Content */}
        <div data-reveal="stage" className="mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCase.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Case Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-md bg-blue/10 text-blue">
                      {currentCase.nicheBadge}
                    </span>
                    <span className="text-xs text-ink/60 font-sans">
                      • {currentCase.clientTitle}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-ink tracking-tight">
                    {currentCase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/75 mt-2 max-w-3xl leading-relaxed">
                    {currentCase.summary}
                  </p>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-700">
                        {currentCase.payback.label}
                      </div>
                      <div className="text-lg font-black font-mono text-emerald-800 tabular-nums">
                        {currentCase.payback.value}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Split Comparison: ДО vs ПОСЛЕ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* 1. ДО: Исходная рутина и потери */}
                <div className="bg-rose-50/60 border border-rose-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    {/* Badge & Title */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-rose-200/40">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-mono font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>ДО: Исходная рутина и потери</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-200/60 text-rose-800">
                        {currentCase.before.badge}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-ink mb-2 tracking-tight">
                      {currentCase.before.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans mb-5">
                      {currentCase.before.description}
                    </p>

                    {/* Detailed pain points */}
                    <div className="space-y-2.5 mb-6">
                      {currentCase.before.lossDetails.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-ink/80">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlight Loss Metric Box */}
                  <div className="bg-white/90 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-600">
                        Прямые финансовые и временные потери
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-rose-900 mt-0.5 leading-snug">
                        {currentCase.before.lossMetric}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ПОСЛЕ: Архитектура автоматизации */}
                <div className="bg-white border border-black/[0.08] shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    {/* Badge & Title */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-black/[0.04]">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-mono font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue" />
                        <span>ПОСЛЕ: Архитектура автоматизации</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        {currentCase.after.badge}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-ink mb-2 tracking-tight">
                      {currentCase.after.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans mb-4">
                      {currentCase.after.description}
                    </p>

                    {/* Push Notification Snippet (Live Telegram preview) */}
                    <div className="bg-zinc-50/90 rounded-2xl p-3.5 border border-black/[0.04] mb-5">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.04] text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 font-bold text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                          <span>{currentCase.after.pushSnippet.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-600 font-semibold">
                            {currentCase.after.pushSnippet.badge}
                          </span>
                          <span className="text-ink/50">{currentCase.after.pushSnippet.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-ink/85 font-sans leading-relaxed italic">
                        {currentCase.after.pushSnippet.message}
                      </p>
                    </div>
                  </div>

                  {/* Stack Tags */}
                  <div>
                    <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-ink/50 mb-2">
                      Использованный стек интеграции:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCase.after.architecture.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-mono font-medium border border-black/[0.04]"
                        >
                          <Check className="w-3 h-3 text-blue" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: 3 Hard Metrics + Owner Quote & CTA Button */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* 3 Hard Metric Cards + Payback Bar */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {currentCase.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-5 border border-black/[0.06] shadow-2xs flex flex-col justify-between"
                      >
                        <div className="text-2xl sm:text-3xl font-black font-display text-ink tabular-nums tracking-tight">
                          {metric.value}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs sm:text-sm font-bold text-ink leading-snug">
                            {metric.label}
                          </div>
                          <div className="text-[11px] text-ink/60 font-sans mt-0.5 leading-tight">
                            {metric.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payback Banner */}
                  <div className="bg-gradient-to-r from-emerald-50/80 via-white to-blue/5 border border-emerald-200/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink">
                          Срок полной окупаемости системы: {currentCase.payback.value}
                        </div>
                        <div className="text-[11px] text-ink/60 font-sans">
                          Инвестиции возвращаются за счет устранения прямых потерь и автоматизации рутины
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto shrink-0">
                      ROI подтвержден
                    </span>
                  </div>
                </div>

                {/* Owner Quote & Direct Deep Link CTA Card */}
                <div className="lg:col-span-5 bg-[#0A0C16] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Quote className="w-5 h-5 text-blue-light" />
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400">
                        Отзыв заказчика
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 italic font-serif leading-relaxed mb-4">
                      {currentCase.quote.text}
                    </p>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                      <div className="w-8 h-8 rounded-full bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {currentCase.quote.initials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {currentCase.quote.author}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-sans">
                          {currentCase.quote.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    <a
                      href={getTelegramUrl(currentCase.telegramMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleDiscussClick}
                      className="w-full inline-flex items-center justify-center gap-2 bg-blue hover:bg-blue-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg shadow-blue/25 cursor-pointer"
                    >
                      <span>{currentCase.ctaText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <div className="text-center text-[10px] text-zinc-400 font-sans mt-2">
                      Фиксированная смета • Спринт 7–14 дней • 30 дней гарантии
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
