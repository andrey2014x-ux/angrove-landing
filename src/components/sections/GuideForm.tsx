import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { FileText, ArrowUpRight, CheckCircle2, DownloadCloud } from 'lucide-react';

export const GuideForm: React.FC = () => {
  const handleOpenTelegram = () => {
    trackGoal('click_guide');
    window.open(config.telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="guide"
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Architectural Document Enclosure */}
        <div className="bg-[#0E1015] text-white rounded-3xl border border-zinc-800 p-6 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Value & Contents (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-blue-light font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue" aria-hidden="true" />
                  <span>Инженерный регламент · Без «воды»</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.1] text-white mb-4">
                  Руководство по ликвидации{' '}
                  <span className="font-serif italic font-normal text-blue-light whitespace-nowrap">
                    рутины в бизнесе
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed mb-6">
                  Практический 12-страничный документ для владельцев бизнеса и руководителей. Помогает быстро оцифровать повторяющиеся задачи и понять, что выгоднее автоматизировать в первую очередь:
                </p>

                {/* 3 Chapters Checklist */}
                <div className="space-y-3 font-sans border-t border-b border-zinc-800 py-5 text-xs sm:text-sm text-zinc-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Правило трёх повторений:</strong> объективный тест, когда ручной труд начинает приносить чистый убыток компании.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Стек без переплаты:</strong> как связка Python, Telegram Bot API и n8n заменяет дорогие зарубежные SaaS-сервисы.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Чек-лист 20 точек утечки:</strong> разбор скрытых потерь на ночных заявках, ручном парсинге и сведении таблиц.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <FileText className="w-3.5 h-3.5 text-blue-light" />
                  <span>Формат: PDF (2.4 MB)</span>
                </span>
                <span>·</span>
                <span>v2.4 (Актуально на 2026)</span>
                <span>·</span>
                <span className="text-emerald-400">Сразу в работу</span>
              </div>
            </div>

            {/* Right Column: Physical Document Passport & Instant Download (5 cols) */}
            <div className="lg:col-span-5 bg-white text-ink p-6 sm:p-8 rounded-2xl border border-line-dark shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-line-dark/20">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-ink/60">
                    Технический паспорт
                  </span>
                  <span className="font-mono text-[10px] text-blue bg-blue/10 border border-blue/20 px-2 py-0.5 rounded font-bold">
                    БЕСПЛАТНО
                  </span>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-ink tracking-tight mb-2">
                  Забрать документ в Telegram
                </h3>

                <p className="text-xs sm:text-sm text-ink/70 font-sans leading-relaxed mb-5">
                  Без заполнения длинных форм на сайте, ожидания менеджера и спам-рассылок. Материал открывается мгновенно в один клик.
                </p>

                {/* Tactile PDF File Preview Card */}
                <div className="p-3.5 rounded-xl bg-paper border border-line-dark/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue text-white flex items-center justify-center shrink-0">
                      <DownloadCloud className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-ink truncate">
                        angrove_automation_guide.pdf
                      </div>
                      <div className="text-[10px] font-mono text-ink/50 mt-0.5">
                        12 страниц · Схемы и чек-листы
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ГОТОВ
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleOpenTelegram}
                  className="w-full py-4 px-6 rounded-xl bg-ink hover:bg-blue text-white text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-md"
                >
                  <span>Получить гид в Telegram</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="text-[10px] font-mono text-ink/40 text-center mt-2.5">
                  Не собираем персональные данные на сайте · Переход в Telegram
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
