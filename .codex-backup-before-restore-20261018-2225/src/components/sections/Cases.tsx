import React from 'react';
import { Check, ArrowUpRight, FileSpreadsheet, Mic } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface MetricItem {
  value: string;
  label: string;
}

interface CaseItem {
  num: string;
  tag: string;
  audience: string;
  statusLabel: string;
  isVerified: boolean;
  title: string;
  problem: string;
  solution: string;
  timeline: string;
  budgetRange: string;
  stack: string;
  metrics: [MetricItem, MetricItem];
}

export const Cases: React.FC = () => {
  const cases: CaseItem[] = [
    {
      num: '01',
      tag: 'ПАРСИНГ И МОНИТОРИНГ',
      audience: 'Оптовые поставки и B2B',
      statusLabel: 'Подтвержденный проект',
      isVerified: true,
      title: 'Сбор базы поставщиков и цен за 3 минуты вместо недель ручной рутины',
      problem: 'Сотрудники тратили по 3–4 часа в день, вручную копируя контакты и прайс-листы поставщиков из открытых реестров, каталогов и карт.',
      solution: 'Регулярный парсер на Python с валидацией номеров, фильтрацией дублей и автоэкспортом в Google Таблицу менеджеров.',
      timeline: '3 рабочих дня',
      budgetRange: 'от 35 000 ₽',
      stack: 'Python · Scrapy · Sheets API · Telegram Alerts',
      metrics: [
        { value: '3 мин', label: 'на автоматический сбор таблицы вместо 2 недель' },
        { value: '~60 ч/мес', label: 'экономии рабочего времени команды' },
      ],
    },
    {
      num: '02',
      tag: 'AI-АССИСТЕНТ И РАСЧЕТЫ',
      audience: 'Услуги, монтаж и производство',
      statusLabel: 'Подтвержденный проект',
      isVerified: true,
      title: 'Ночной AI-ассистент рассчитывает смету за 6 секунд и бронирует выезд',
      problem: 'Клиенты оставляли заявки вечером и в выходные; до утра лиды остывали или заказывали расчет у более быстрых конкурентов.',
      solution: 'AI-ассистент в Telegram: понимает параметры объекта, мгновенно считает предварительную смету по прайсу компании и предлагает свободные слоты мастера.',
      timeline: '5 рабочих дней',
      budgetRange: 'от 55 000 ₽',
      stack: 'Node.js · Telegram Bot API · LLM-логика · Webhooks',
      metrics: [
        { value: '6 сек', label: 'скорость расчета предварительной сметы 24/7' },
        { value: '0 потерянных', label: 'вечерних и ночных заявок с сайта и соцсетей' },
      ],
    },
    {
      num: '03',
      tag: 'СИНТЕЗ ДАННЫХ И СВОДКИ',
      audience: 'Компании, дистрибуция и ритейл',
      statusLabel: 'Сценарный blueprint',
      isVerified: false,
      title: 'Сквозная связка CRM, эквайринга и рекламы: сводка собственнику в 09:00',
      problem: 'Заявки терялись в переписках сотрудников, а руководитель сводил финансовые отчеты по выходным из трех разрозненных таблиц и банковских выписок.',
      solution: 'Сквозной сбор: синхронизация заказов, платежей и статусов сделок в единую ежедневную выжимку в Telegram с прикрепленным файлом баланса.',
      timeline: '4 рабочих дня',
      budgetRange: 'от 45 000 ₽',
      stack: 'n8n · PostgreSQL · Telegram Bot API · CRM Integration',
      metrics: [
        { value: '09:00', label: 'ежедневный отчет в Telegram без ручной сборки' },
        { value: '1.5 сек', label: 'скорость синхронизации всех разрозненных баз' },
      ],
    },
    {
      num: '04',
      tag: 'КОНТЕНТ-КОНВЕЙЕР',
      audience: 'Для авторов, экспертов и продюсеров',
      statusLabel: 'Сценарный blueprint',
      isVerified: false,
      title: 'Превращение голосовых заметок в готовую матрицу публикаций и базу знаний',
      problem: 'Сотни ценных идей и наблюдений эксперта терялись в голосовых сообщениях «Избранного», а подготовка одного поста занимала до полутора часов.',
      solution: 'Персональный бот-стенографист: расшифровывает аудио через Whisper, очищает от слов-паразитов, формирует черновик с заголовками и тезисами и сохраняет в Notion.',
      timeline: '3 рабочих дня',
      budgetRange: 'от 30 000 ₽',
      stack: 'Whisper API · Claude API · Telegram Bot · Notion API',
      metrics: [
        { value: '45 мин', label: 'чистой экономии времени на каждый лонгрид' },
        { value: '100%', label: 'сохранение идей и структурирование базы знаний' },
      ],
    },
  ];

  const renderWidget = (num: string) => {
    // 01. B2B Parser Data Stream
    if (num === '01') {
      return (
        <div className="bg-[#0B0D18] text-white p-5 sm:p-6 border border-white/10 shadow-2xl relative font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <span className="text-blue-light font-bold">ПОИСК B2B: ПАРСЕР ПОСТАВЩИКОВ</span>
            <span className="text-white/40">Python 3.11 · Scrapy</span>
          </div>

          <div className="space-y-2 mb-4 text-[11px]">
            <div className="p-2.5 bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-white font-bold">ООО «СтройСити»</span>
                <span className="text-white/50 ml-2">+7 (903) 412-**-**</span>
              </div>
              <span className="text-emerald-400 font-bold">ИНН проверен</span>
            </div>
            <div className="p-2.5 bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-white font-bold">ТД «Металл-Опт»</span>
                <span className="text-white/50 ml-2">+7 (495) 890-**-**</span>
              </div>
              <span className="text-emerald-400 font-bold">Прайс обновлен</span>
            </div>
            <div className="p-2.5 bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-white font-bold">Завод «ГидроТех»</span>
                <span className="text-white/50 ml-2">+7 (812) 334-**-**</span>
              </div>
              <span className="text-emerald-400 font-bold">Каталог спарсен</span>
            </div>
          </div>

          <div className="p-3 bg-blue/15 border border-blue/40 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2 text-white font-bold">
              <Check className="w-4 h-4 text-blue-light" />
              <span>540 компаний выгружены в Google Таблицу</span>
            </div>
            <span className="font-mono text-blue-light text-xs font-bold">3.2 мин</span>
          </div>
        </div>
      );
    }

    // 02. AI Telegram Night Dialogue
    if (num === '02') {
      return (
        <div className="bg-[#0B0D18] text-white p-5 sm:p-6 border border-white/10 shadow-2xl relative font-sans text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-xs">
            <span className="text-blue-light font-bold">TELEGRAM · 23:15 (НЕРАБОЧЕЕ ВРЕМЯ)</span>
            <span className="text-emerald-400">AI-ассистент онлайн</span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="bg-white/5 border border-white/10 p-3 max-w-[90%] ml-auto text-white/90">
              <div className="text-[10px] font-mono text-white/40 mb-1">Клиент · 23:15</div>
              Здравствуйте! Нужен расчет остекления: 12 окон 70мм, ~28 м². Сколько выйдет под ключ и свободен ли замерщик в субботу?
            </div>

            <div className="bg-blue/15 border border-blue/40 p-3 max-w-[95%] text-white">
              <div className="text-[10px] font-mono text-blue-light font-bold mb-1">
                AI-ассистент · ответ через 6 сек
              </div>
              Добрый вечер! Расчет по прайсу: 12 окон + монтаж по ГОСТ — <strong className="text-blue-light">245 000 ₽</strong>. Замерщик свободен в субботу в 11:00 и 15:00. Забронировать выезд?
            </div>
          </div>

          <div className="p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
            <span>Статус: Лид квалифицирован & внесен в CRM</span>
            <span className="text-emerald-400 font-bold">+35% конверсия</span>
          </div>
        </div>
      );
    }

    // 03. Data Synthesis & Convergence Scene (Replacing the old dashboard)
    if (num === '03') {
      return (
        <div className="bg-[#0B0D18] text-white p-5 sm:p-6 border border-white/10 shadow-2xl relative font-sans text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-xs">
            <span className="text-blue-light font-bold">СИНТЕЗ: 3 ИСТОЧНИКА → 1 ДАЙДЖЕСТ</span>
            <span className="text-white/40">Ежедневно в 09:00</span>
          </div>

          {/* 3 Converging Input Streams */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-[11px] font-mono">
            <div className="p-2 bg-white/[0.03] border border-white/5 text-center">
              <div className="text-white/40 text-[9px] uppercase">CRM Лиды</div>
              <div className="font-bold text-white mt-0.5">24 новых</div>
            </div>
            <div className="p-2 bg-white/[0.03] border border-white/5 text-center">
              <div className="text-white/40 text-[9px] uppercase">Эквайринг</div>
              <div className="font-bold text-emerald-400 mt-0.5">540 000 ₽</div>
            </div>
            <div className="p-2 bg-white/[0.03] border border-white/5 text-center">
              <div className="text-white/40 text-[9px] uppercase">Просрочки</div>
              <div className="font-bold text-blue-light mt-0.5">0 задач</div>
            </div>
          </div>

          {/* Clean Telegram Morning Report message */}
          <div className="p-3.5 bg-blue/15 border border-blue/40 space-y-2 mb-3 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/60 pb-1 border-b border-white/10">
              <span className="text-blue-light font-bold">@ExecutiveReport_bot</span>
              <span>09:00 · Telegram</span>
            </div>
            <div className="text-white font-medium">
              Доброе утро! Сводка за прошлый день:
            </div>
            <div className="text-white/80 font-mono text-[11px] space-y-1">
              <div>· Выручка: 540 000 ₽ (4 оплаченных счета)</div>
              <div>· Конверсия входящих заявок: 41.2%</div>
              <div>· Все 24 клиента распределены по менеджерам</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/5 text-xs font-mono text-white/60">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Прикреплен Excel-баланс (142 KB)</span>
            </div>
            <span className="text-emerald-400 font-bold">Автосборка</span>
          </div>
        </div>
      );
    }

    // 04. Creator Voice-to-Notion Matrix
    if (num === '04') {
      return (
        <div className="bg-[#0B0D18] text-white p-5 sm:p-6 border border-white/10 shadow-2xl relative font-sans text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-xs">
            <span className="text-blue-light font-bold">ГОЛОС В ТЕКСТ И NOTION</span>
            <span className="text-white/40">Whisper + Claude API</span>
          </div>

          {/* Voice Input Waveform Simulation */}
          <div className="p-3 bg-white/[0.03] border border-white/5 mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-mono text-white/70">
              <Mic className="w-4 h-4 text-blue" />
              <span>voice_084.ogg (2 мин 40 сек)</span>
            </div>
            <div className="flex items-center gap-1">
              {[12, 24, 16, 28, 8, 20, 14, 26, 18, 10, 22].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue rounded-full"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>

          {/* Structured Output Outline */}
          <div className="p-3.5 bg-blue/15 border border-blue/40 space-y-1.5 mb-3 text-xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-blue-light font-bold">
              Сформированный черновик публикации
            </div>
            <div className="font-bold text-white text-sm">
              «3 скрытые ошибки при связке CRM и таблиц»
            </div>
            <div className="text-white/80 text-xs font-sans leading-relaxed">
              1. Дублирование контактов без нормализации телефонов<br />
              2. Отсутствие буферной очереди сообщений<br />
              3. Хранение коммерческих баз в сторонних cloud-сервисах
            </div>
          </div>

          <div className="p-2.5 bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono text-white/60">
            <span>Синхронизировано в Notion Database</span>
            <span className="text-emerald-400 font-bold">Готово к публикации</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="cases" className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Проекты и сценарии</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-ink">
              Реальные{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                результаты
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/75 max-w-md font-sans leading-relaxed">
            Подтвержденные внедрения и сценарии автоматизации под разные типы цифровых процессов.
          </p>
        </div>

        {/* Editorial Horizontal Rows with Bespoke Artifact Widgets */}
        <div className="divide-y divide-line-dark border-b border-line-dark">
          {cases.map((c) => (
            <div
              key={c.num}
              className="group py-12 sm:py-16 transition-colors duration-200 hover:bg-ink/[0.015]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Typography, Story, Metric */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    {/* Index & Meta Header */}
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-display text-4xl sm:text-6xl font-black text-ink/25 group-hover:text-blue transition-colors leading-none">
                        {c.num}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-blue font-bold">
                          {c.tag}
                        </span>
                        <span className="text-ink/30 hidden sm:inline">·</span>
                        <span className="text-xs font-sans text-ink/70 font-medium hidden sm:inline">
                          {c.audience}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 border font-semibold ${
                            c.isVerified
                              ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
                              : 'bg-ink/[0.04] text-ink/60 border-ink/10'
                          }`}
                        >
                          {c.statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-ink mb-4 leading-snug group-hover:text-blue transition-colors">
                      {c.title}
                    </h3>

                    {/* Problem & Solution */}
                    <div className="space-y-3 mb-6 font-sans text-xs sm:text-sm">
                      <div className="p-3.5 bg-ink/[0.02] border border-ink/[0.08]">
                        <span className="font-mono text-[10px] uppercase font-bold text-red-600 tracking-wider block mb-1">
                          Исходная сложность
                        </span>
                        <p className="text-ink/80 leading-relaxed">{c.problem}</p>
                      </div>

                      <div className="p-3.5 bg-blue/[0.03] border border-blue/20">
                        <span className="font-mono text-[10px] uppercase font-bold text-blue tracking-wider block mb-1">
                          Инженерное решение
                        </span>
                        <p className="text-ink/90 leading-relaxed">{c.solution}</p>
                      </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-ink/60 mb-4 pb-2 border-b border-ink/10">
                      <span>Стек: {c.stack}</span>
                      <span>·</span>
                      <span>Срок: {c.timeline}</span>
                      <span>·</span>
                      <span>Бюджет: {c.budgetRange}</span>
                    </div>
                  </div>

                  {/* 2-Column Metrics */}
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-ink/10">
                    <div>
                      <div className="font-display font-black text-2xl sm:text-4xl text-ink leading-tight">
                        {c.metrics[0].value}
                      </div>
                      <div className="text-xs sm:text-sm text-ink/70 font-sans mt-1 leading-snug">
                        {c.metrics[0].label}
                      </div>
                    </div>
                    <div className="border-l border-ink/10 pl-6">
                      <div className="font-display font-black text-2xl sm:text-4xl text-blue leading-tight">
                        {c.metrics[1].value}
                      </div>
                      <div className="text-xs sm:text-sm text-ink/70 font-sans mt-1 leading-snug">
                        {c.metrics[1].label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Visual Artifact Preview Widget */}
                <div className="lg:col-span-6">
                  {renderWidget(c.num)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 sm:mt-20 p-8 sm:p-12 bg-[#0A0C16] text-white border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue/20 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-light mb-3">
                <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
                <span>Индивидуальный аудит</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight mb-3">
                Хотите оценить потенциал автоматизации в вашем проекте?
              </h3>
              <p className="text-sm sm:text-base text-white/75 font-sans leading-relaxed">
                Опишите задачу или текущую рутину в двух предложениях — бесплатно покажу 2–3 точки, где код сэкономит вам часы и ресурсы.
              </p>
            </div>

            <div className="flex flex-col sm:items-start lg:items-end gap-2.5 shrink-0">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackGoal('case_cta_click');
                  trackGoal('telegram_outbound');
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue hover:bg-blue-light text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 border border-blue shadow-[0_0_25px_rgba(61,92,255,0.4)]"
              >
                <span>Обсудить задачу</span>
                <ArrowUpRight size={16} />
              </a>
              <span className="text-xs text-white/50 font-sans">
                Опишите процесс или идею в двух предложениях — отвечу лично
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
