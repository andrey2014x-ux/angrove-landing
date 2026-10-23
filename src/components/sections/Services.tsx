import React from 'react';
import { ArrowUpRight, Bot, PhoneCall, Database, Network } from 'lucide-react';
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
      className="bg-paper text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-3">
              <span>Решения и системы</span>
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

        {/* Bento Grid (Dribbble Modern Tech Studio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 pt-10">
          
          {/* Bento Card 1: AI Agents (Hero Dark Card, 7 Cols) */}
          <div className="lg:col-span-7 bg-[#0A0C16] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-white/10 shadow-[0_20px_50px_rgba(10,12,22,0.15)] relative overflow-hidden group hover:border-blue/50 transition-all duration-300">
            {/* Subtle blue ambient radial glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div>
              <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-light text-xs font-mono font-bold">
                  <Bot className="w-3.5 h-3.5 text-blue-light" />
                  <span>SYS-01 // TELEGRAM · CLAUDE · RAG</span>
                </div>
                <span className="text-xs font-mono text-white/40">3–5 ДНЕЙ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3 leading-snug relative z-10">
                AI-ассистенты первого контакта
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-lg mb-8 relative z-10">
                Обучаются на вашем каталоге и регламентах. Отвечают клиенту за 5 секунд в Telegram, рассчитывают точную смету и создают готовую сделку в CRM.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl text-emerald-400 tabular-nums">+30%</span>
                <span className="text-xs text-zinc-400">рост конверсии ночного трафика</span>
              </div>

              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-blue text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 cursor-pointer"
              >
                <span>Обсудить бота</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bento Card 2: Voice Telephony (5 Cols, Luxury White Card) */}
          <div className="lg:col-span-5 bg-white text-ink rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-mono font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>SYS-02 // SIP · WHISPER</span>
                </div>
                <span className="text-xs font-mono text-ink/40">5–8 ДНЕЙ</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Голосовые AI-роботы
              </h3>

              <p className="text-sm text-ink/75 font-sans leading-relaxed mb-6">
                Прием звонков и холодный прозвон базы естественным живым голосом с задержкой ответа менее 0.5 секунды.
              </p>
            </div>

            <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl text-ink tabular-nums">1 000</span>
                <span className="text-xs text-ink/60">звонков в час</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-ink/50 group-hover:bg-blue group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Bento Card 3: Parsers & Data (5 Cols, Luxury White Card) */}
          <div className="lg:col-span-5 bg-white text-ink rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>SYS-03 // PLAYWRIGHT · POSTGRES</span>
                </div>
                <span className="text-xs font-mono text-ink/40">2–4 ДНЯ</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Парсеры и базы данных
              </h3>

              <p className="text-sm text-ink/75 font-sans leading-relaxed mb-6">
                Сбор открытых B2B-каталогов, мониторинг прайсов конкурентов и автоматическая валидация телефонов ЛПР.
              </p>
            </div>

            <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl text-ink tabular-nums">60x</span>
                <span className="text-xs text-ink/60">быстрее ручного поиска</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-ink/50 group-hover:bg-blue group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Bento Card 4: End-to-End Integrations (7 Cols, Luxury White Card with Accent) */}
          <div className="lg:col-span-7 bg-white text-ink rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-mono font-bold">
                  <Network className="w-3.5 h-3.5" />
                  <span>SYS-04 // N8N · WEBHOOKS · МОЙСКЛАД · 1С</span>
                </div>
                <span className="text-xs font-mono text-ink/40">4–7 ДНЕЙ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-3 leading-snug">
                Сквозные интеграции сервисов
              </h3>

              <p className="text-sm sm:text-base text-ink/75 font-sans leading-relaxed max-w-lg mb-8">
                Бесшовная связка сайта, склада, кассы и мессенджеров. Оплата с сайта сразу списывает остатки и присылает отчет собственнику в 08:30:00.
              </p>
            </div>

            <div className="pt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-2xl text-blue tabular-nums">100%</span>
                <span className="text-xs text-ink/60">сходимость данных и учета</span>
              </div>

              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-blue text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 cursor-pointer"
              >
                <span>Обсудить интеграцию</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
