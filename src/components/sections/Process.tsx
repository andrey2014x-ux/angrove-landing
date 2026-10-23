import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface Step {
  num: string;
  duration: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    duration: '1–2 ДНЯ',
    title: 'Аудит и смета',
    description: 'Разбираем текущий процесс, проектируем схему связки и фиксируем итоговую стоимость до старта.',
  },
  {
    num: '02',
    duration: '3–5 ДНЕЙ',
    title: 'Разработка ядра',
    description: 'Пишем чистый код на Python / n8n, обучаем AI-агента и поднимаем рабочий прототип на тестовом сервере.',
  },
  {
    num: '03',
    duration: '2–4 ДНЯ',
    title: 'Интеграция CRM & API',
    description: 'Подключаем боевые аккаунты мессенджеров, склада, банка и CRM через отказоустойчивые вебхуки.',
  },
  {
    num: '04',
    duration: '1 ДЕНЬ',
    title: 'Запуск и передача',
    description: 'Разворачиваем систему на ваших серверах, передаем репозиторий и записываем видеогайд для команды.',
  },
];

export const Process: React.FC = () => {
  const handleCtaClick = () => {
    trackGoal('click_process_cta');
    trackGoal('click_telegram');
  };

  return (
    <section
      id="process"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-3">
              <span>Линейный регламент</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Четыре шага{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                до запуска
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Понятный линейный план без затягивания сроков и скрытых платежей.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-10">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-7 flex flex-col justify-between border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.06]">
                  <span className="font-mono text-2xl font-black text-ink/30 group-hover:text-blue transition-colors">
                    {step.num}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue/10 text-[10px] font-mono text-blue font-bold">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-ink mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.04] text-[10px] font-mono text-ink/40 uppercase">
                ЭТАП ПОД КЛЮЧ
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-ink/80 font-medium">
            Хотите понять, сколько времени займет автоматизация вашей конкретной задачи?
          </div>
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="group inline-flex items-center gap-2 bg-blue text-white rounded-full px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_20px_rgba(61,92,255,0.3)] hover:shadow-[0_12px_25px_rgba(61,92,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all select-none cursor-pointer whitespace-nowrap"
          >
            <span>Разобрать задачу бесплатно</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
