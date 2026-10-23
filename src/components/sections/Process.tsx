import React, { useState, useRef, useEffect } from 'react';
import { gsap } from '../../lib/motion';
import { 
  ArrowUpRight, 
  CheckCircle2
} from 'lucide-react';
import { config } from '../../config';

interface ProcessStation {
  num: string;
  stageName: string;
  title: string;
  description: string;
  deliverable: string;
  duration: string;
  codeSnippet: string;
}

const STATIONS: ProcessStation[] = [
  {
    num: '01',
    stageName: 'АУДИТ & КАРТА ШАГОВ',
    title: 'Разбор логики «Если А → То Б»',
    description: 'Разбираем существующий процесс без лишней теории: какие данные поступают, где сейчас тратится ручное время и в каком формате нужен готовый результат.',
    deliverable: 'Карта процесса + зафиксированная смета до старта',
    duration: '1 рабочий день',
    codeSnippet: '# 1. Анализ входящего потока данных\nflow = {\n  "trigger": "Заявка на сайте / звонок",\n  "manual_steps": ["Перенос в CRM", "Расчет сметы"],\n  "target": "Автоматизировать за 5.8 сек"\n}',
  },
  {
    num: '02',
    stageName: 'АРХИТЕКТУРА & API',
    title: 'Проектирование шины данных',
    description: 'Определяем стек, протоколы API и модель состояний (FSM). Исключаем уязвимости: закладываем дедупликацию лидов, валидацию номеров и резервные каналы.',
    deliverable: 'Архитектурная схема связки сервисов',
    duration: '1–2 рабочих дня',
    codeSnippet: '# 2. Архитектура интеграционной шины\nservices = [\n  "Telegram Bot API (FastAPI)",\n  "amoCRM Webhook Engine",\n  "PostgreSQL Storage & Redis FSM"\n]',
  },
  {
    num: '03',
    stageName: 'РАЗРАБОТКА & ТЕСТЫ',
    title: 'Написание чистого рабочего кода',
    description: 'Пишем кастомный скрипт на Python, обучаем RAG-модуль на вашем прайсе или разворачиваем сценарии n8n. Тестируем на краевых случаях и неверных форматах.',
    deliverable: 'Рабочий тестовый стенд для проверки командой',
    duration: '2–3 рабочих дня',
    codeSnippet: '# 3. Обработка запроса нейросетевым модулем\nasync def handle_lead(event):\n    rag_context = await search_knowledge_base(event.text)\n    quote = calculate_estimate(rag_context, event.dimensions)\n    return await crm.create_lead(event.user, quote)',
  },
  {
    num: '04',
    stageName: 'ДЕПЛОЙ & БОЕВОЙ ЗАПУСК',
    title: 'Бесшовная врезка в бизнес',
    description: 'Разворачиваем софт на защищённом сервере, подключаем боевые ключи CRM, склада и мессенджеров. Проводим сквозную проверку на реальных клиентах.',
    deliverable: 'Действующая система в вашем рабочем контуре',
    duration: '1 рабочий день',
    codeSnippet: '# 4. Статус развертывания на production-сервере\n$ docker compose up -d\n[+] Running 3/3: redis (OK), api_engine (OK), cron_runner (OK)\nStatus: 200 OK · Webhook latency: 14ms',
  },
  {
    num: '05',
    stageName: 'НАДЗОР & ГАРАНТИЯ',
    title: 'Непрерывная поддержка и надзор',
    description: 'Подключаем мониторинг сбоев (Sentry), следим за актуальностью токенов сторонних сервисов и оперативно дорабатываем логику под новые задачи бизнеса.',
    deliverable: 'Гарантия стабильности 24/7 и оперативная поддержка',
    duration: 'Бессрочно',
    codeSnippet: '# 5. Мониторинг стабильности системы\nsystem_telemetry = {\n  "uptime": "99.98%",\n  "processed_events": 14820,\n  "failed_retries": 0,\n  "alert_channel": "@angrove_ops"\n}',
  },
];

export const Process: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const current = STATIONS[activeStation];

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Subtle entrance
      const rows = sectionRef.current?.querySelectorAll('.process-station-btn');
      if (rows && rows.length) {
        gsap.fromTo(
          rows,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="process" 
      ref={sectionRef}
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-line-dark/25">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue font-bold">
              <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
              <span>Методология разработки · Прозрачный цикл</span>
            </div>
            <h2 className="text-[clamp(1.9rem,3.8vw,3.25rem)] font-display font-black tracking-tight leading-[1.1] text-ink">
              От задачи к запуску:{' '}
              <span className="font-serif italic font-normal text-blue whitespace-nowrap">
                конвейер разработки
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/75 max-w-lg font-sans leading-relaxed">
            Без многомесячных согласований и раздутых ТЗ: выверенный инженерный конвейер от аудита рутины до боевого деплоя и автономного надзора.
          </p>
        </div>

        {/* 2-Column Continuous Pipeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-10 items-start">
          
          {/* Left Column: 5 Pipeline Stations (6 cols) */}
          <div className="lg:col-span-6 space-y-3 select-none">
            {STATIONS.map((station, idx) => {
              const isActive = activeStation === idx;
              return (
                <div
                  key={station.num}
                  onClick={() => setActiveStation(idx)}
                  className={`process-station-btn p-4 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white border-blue shadow-md'
                      : 'bg-white/40 border-line-dark/15 hover:bg-white/70 hover:border-line-dark/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono text-xs font-bold ${isActive ? 'text-blue' : 'text-ink/40'}`}>
                        {station.num}
                      </span>
                      <span className="font-mono text-[10px] text-ink/50 uppercase tracking-wider font-semibold">
                        {station.stageName}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 text-ink/70 font-medium">
                      {station.duration}
                    </span>
                  </div>

                  <h3 className={`font-sans font-bold text-base sm:text-lg tracking-tight mb-1 transition-colors ${
                    isActive ? 'text-ink' : 'text-ink/80'
                  }`}>
                    {station.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ink/70 font-sans leading-relaxed">
                    {station.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Deliverable & Terminal Preview (6 cols, Sticky) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="bg-[#0E1015] text-zinc-100 rounded-3xl border border-zinc-800 shadow-2xl p-5 sm:p-7 overflow-hidden select-none">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80" />
                  </div>
                  <span className="text-zinc-600 text-xs">/</span>
                  <span className="font-mono text-xs text-zinc-300 font-semibold">
                    stage_{current.num}_pipeline.py
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  СТАДИЯ {current.num} / 05
                </div>
              </div>

              {/* Station Deliverable Badge */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                <div className="text-[10px] font-mono text-blue-light uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-light" />
                  <span>Результат стадии:</span>
                </div>
                <div className="font-sans font-bold text-sm sm:text-base text-white">
                  {current.deliverable}
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-1">
                  Нормативный срок: <strong className="text-zinc-200">{current.duration}</strong>
                </div>
              </div>

              {/* Syntax-Highlighted Logic Preview */}
              <div className="relative mb-6">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                  Фрагмент архитектурного кода / конфигурации:
                </div>
                <pre className="p-4 rounded-xl bg-black/60 font-mono text-[11px] sm:text-xs text-emerald-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                  {current.codeSnippet}
                </pre>
              </div>

              {/* Bottom Quick Call to Action */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-zinc-400 font-sans">
                  Смета фиксируется до старта. Никаких скрытых платежей.
                </div>

                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue hover:bg-blue-dark text-white font-mono text-xs uppercase tracking-wider font-bold transition-all duration-150 shrink-0 active:scale-95 shadow-md"
                >
                  <span>Начать с этапа 01</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
