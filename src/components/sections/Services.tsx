import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

export const Services: React.FC = () => {
  const handleCtaClick = () => {
    trackGoal('click_services_cta');
    trackGoal('click_telegram');
  };

  return (
    <section
      id="services"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
              <span>Решения и возможности</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Что я{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                проектирую
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Автономные инструменты, которые берут на себя монотонные действия и работают 24/7.
          </p>
        </div>

        {/* Bento Grid (Dribbble Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 pt-10">
          
          {/* Bento Card 1 (Large Hero Card - 7 Cols, Dark Obsidian) */}
          <div className="lg:col-span-7 bg-ink text-paper p-7 sm:p-9 flex flex-col justify-between border border-line-light relative group hover:border-blue transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="font-mono text-[11px] font-bold text-blue-light uppercase tracking-wider">
                  SYS-01 // TELEGRAM · CLAUDE 3.5 · RAG
                </span>
                <span className="text-xs font-mono text-paper/40">3–5 ДНЕЙ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-paper mb-3 leading-snug">
                AI-ассистенты первого контакта
              </h3>

              <p className="text-sm sm:text-base text-paper/75 font-sans leading-relaxed max-w-lg mb-8">
                Обучаются на вашем прайсе и регламентах. Отвечают клиенту за 5 секунд в Telegram, рассчитывают смету и сразу создают сделку в CRM.
              </p>
            </div>

            <div className="pt-6 border-t border-line-light flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-emerald-400 tabular-nums">+30%</span>
                <span className="text-xs text-paper/60">конверсия ночного трафика</span>
              </div>

              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-light group-hover:text-white transition-colors"
              >
                <span>Обсудить бота</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Bento Card 2 (5 Cols, Light Card) */}
          <div className="lg:col-span-5 bg-paper p-7 sm:p-9 flex flex-col justify-between border border-line-dark hover:border-blue transition-colors duration-200 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="font-mono text-[11px] font-bold text-ink/50 uppercase tracking-wider">
                  SYS-02 // SIP · WHISPER · ELEVENLABS
                </span>
                <span className="text-xs font-mono text-ink/40">5–8 ДНЕЙ</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Голосовые AI-роботы
              </h3>

              <p className="text-sm text-ink/75 font-sans leading-relaxed mb-6">
                Прием звонков и холодный прозвон базы естественным живым голосом с задержкой ответа менее 0.5 секунды.
              </p>
            </div>

            <div className="pt-6 border-t border-line-dark/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-ink tabular-nums">1 000</span>
                <span className="text-xs text-ink/60">звонков в час</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink/40 group-hover:text-blue transition-colors" />
            </div>
          </div>

          {/* Bento Card 3 (5 Cols, Light Card) */}
          <div className="lg:col-span-5 bg-paper p-7 sm:p-9 flex flex-col justify-between border border-line-dark hover:border-blue transition-colors duration-200 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="font-mono text-[11px] font-bold text-ink/50 uppercase tracking-wider">
                  SYS-03 // PLAYWRIGHT · POSTGRESQL · HLR
                </span>
                <span className="text-xs font-mono text-ink/40">2–4 ДНЯ</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Парсеры и базы данных
              </h3>

              <p className="text-sm text-ink/75 font-sans leading-relaxed mb-6">
                Сбор открытых B2B-каталогов, мониторинг прайсов конкурентов и автоматическая валидация телефонов ЛПР.
              </p>
            </div>

            <div className="pt-6 border-t border-line-dark/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-ink tabular-nums">60x</span>
                <span className="text-xs text-ink/60">быстрее ручного поиска</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink/40 group-hover:text-blue transition-colors" />
            </div>
          </div>

          {/* Bento Card 4 (Large Card - 7 Cols, Light Card with Blue Accents) */}
          <div className="lg:col-span-7 bg-paper p-7 sm:p-9 flex flex-col justify-between border border-line-dark hover:border-blue transition-colors duration-200 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="font-mono text-[11px] font-bold text-blue uppercase tracking-wider">
                  SYS-04 // N8N · WEBHOOKS · МОЙСКЛАД · 1С
                </span>
                <span className="text-xs font-mono text-ink/40">4–7 ДНЕЙ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Сквозные интеграции сервисов
              </h3>

              <p className="text-sm sm:text-base text-ink/75 font-sans leading-relaxed max-w-lg mb-8">
                Бесшовная связка сайта, склада, кассы и мессенджеров. Оплата с сайта сразу списывает остатки и присылает отчет собственнику в 08:30:00.
              </p>
            </div>

            <div className="pt-6 border-t border-line-dark/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-blue tabular-nums">100%</span>
                <span className="text-xs text-ink/60">сходимость данных и учета</span>
              </div>

              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink group-hover:text-blue transition-colors"
              >
                <span>Обсудить интеграцию</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
