import React, { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';

interface ProcessStation {
  num: string;
  phase: string;
  duration: string;
  title: string;
  description: string;
  artifact: string;
  stackOrDetail: string;
}

const STATIONS: ProcessStation[] = [
  {
    num: '01',
    phase: 'АНАЛИТИКА',
    duration: '1–2 дня',
    title: 'Архитектурный аудит и смета',
    description: 'Декомпозируем текущий ручной процесс, выявляем узкие места, согласуем стек технологий и составляем архитектурную схему данных.',
    artifact: 'АРТЕФАКТ: Инженерная карта связки, ТЗ и фиксированная смета',
    stackOrDetail: 'Бесплатный разбор · 0 ₽ скрытых платежей',
  },
  {
    num: '02',
    phase: 'РАЗРАБОТКА',
    duration: '3–5 дней',
    title: 'Сборка ядра и логики системы',
    description: 'Пишем чистый асинхронный код на Python или настраиваем сценарии n8n. Обучаем AI-агентов на вашей базе знаний, настраиваем валидацию.',
    artifact: 'АРТЕФАКТ: Работающий прототип на изолированном тестовом сервере',
    stackOrDetail: 'Python · FastAPI · PostgreSQL / Redis · LangChain',
  },
  {
    num: '03',
    phase: 'ИНТЕГРАЦИЯ',
    duration: '2–4 дня',
    title: 'Сквозная связка с сервисами',
    description: 'Подключаем боевые аккаунты CRM, мессенджеров, эквайринга, склада и баз данных. Настраиваем отказоустойчивые вебхуки.',
    artifact: 'АРТЕФАКТ: Бесшовный контур обмена данными в реальном времени',
    stackOrDetail: 'amoCRM / Bitrix24 · Telegram API · 1С / МойСклад · Webhooks',
  },
  {
    num: '04',
    phase: 'ТЕСТИРОВАНИЕ',
    duration: '1–2 дня',
    title: 'Стресс-тесты и отказоустойчивость',
    description: 'Симулируем пиковые нагрузки, проверяем обработку нестандартных запросов, настраиваем автоматический перезапуск и алерты в Telegram.',
    artifact: 'АРТЕФАКТ: Автономный мониторинг, логирование ошибок, 99.9% uptime',
    stackOrDetail: '14 дней гарантийной техподдержки и калибровки',
  },
  {
    num: '05',
    phase: 'СДАЧА',
    duration: '1 день',
    title: 'Передача прав и запуск в продакшн',
    description: 'Разворачиваем систему на ваших серверах, записываем понятную видеоинструкцию для сотрудников и передаем 100% исходного кода.',
    artifact: 'АРТЕФАКТ: Репозиторий Git, доступы, видеогайд для команды',
    stackOrDetail: '100% права принадлежат вам · Независимость от подрядчика',
  },
];

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleCtaClick = () => {
    trackGoal('click_process_cta');
    trackGoal('click_telegram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('.station-row');
      if (items && items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Регламент разработки</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Пять станций{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                запуска системы
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/75 max-w-md font-sans leading-relaxed">
            Никаких абстрактных спринтов и размытых смет. Четкий линейный инженерный регламент с осязаемым артефактом на каждом шаге.
          </p>
        </div>

        {/* Engineering Ledger (Full-Width Stations) */}
        <div className="divide-y divide-line-dark border-b border-line-dark">
          {STATIONS.map((station) => (
            <div
              key={station.num}
              className="station-row py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start group hover:bg-black/[0.015] transition-colors duration-150 px-2 sm:px-4"
            >
              {/* Col 1: Phase Number & Duration */}
              <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start justify-between gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-black text-ink/40 group-hover:text-blue transition-colors">
                  {station.num}
                </span>
                <div className="flex flex-col items-end lg:items-start">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink/60 font-semibold">
                    {station.phase}
                  </span>
                  <span className="font-mono text-xs text-blue font-bold mt-0.5">
                    {station.duration}
                  </span>
                </div>
              </div>

              {/* Col 2: Phase Title & Description */}
              <div className="lg:col-span-5">
                <h3 className="font-sans font-bold text-lg sm:text-xl uppercase tracking-tight text-ink mb-2">
                  {station.title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-ink/75 leading-relaxed font-normal">
                  {station.description}
                </p>
              </div>

              {/* Col 3: Tangible Artifact & Guarantee */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full pt-1 lg:pt-0">
                <div className="border border-line-dark bg-paper p-3 sm:p-3.5">
                  <div className="font-mono text-[10px] text-blue uppercase tracking-wider font-bold mb-1">
                    Ключевой результат этапа
                  </div>
                  <div className="font-sans font-semibold text-xs sm:text-sm text-ink leading-snug">
                    {station.artifact}
                  </div>
                </div>

                <div className="font-mono text-[11px] text-ink/50 mt-2.5">
                  {station.stackOrDetail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Ledger Callout */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-ink/80 font-medium">
            Готовы начать с первого шага? Проведем разбор вашей задачи и сформируем архитектурную карту бесплатно.
          </div>
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="group inline-flex items-center gap-2.5 bg-ink text-paper hover:bg-blue hover:text-white px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer active:scale-[0.98] whitespace-nowrap"
          >
            <span>Записаться на разбор задачи</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
