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
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Процесс работы</span>
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

        {/* 4-Step Cards Grid (Dribbble Process Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="border border-line-dark bg-paper p-6 sm:p-7 flex flex-col justify-between hover:border-blue transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-line-dark/30">
                  <span className="font-mono text-xl sm:text-2xl font-black text-ink/40 group-hover:text-blue transition-colors">
                    {step.num}
                  </span>
                  <span className="font-mono text-[10px] text-blue font-bold tracking-wider">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-ink mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink/75 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-line-dark/20 text-[10px] font-mono text-ink/40 uppercase">
                ЭТАП ПОД КЛЮЧ
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-ink/80 font-medium">
            Хотите понять, сколько времени займет автоматизация вашей задачи?
          </div>
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="group inline-flex items-center gap-2 bg-ink text-paper hover:bg-blue hover:text-white px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer active:scale-[0.98] whitespace-nowrap"
          >
            <span>Разобрать задачу бесплатно</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
