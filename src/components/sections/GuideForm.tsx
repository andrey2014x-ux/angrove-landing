import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, FileText, CheckCircle2 } from 'lucide-react';

export const GuideForm: React.FC = () => {
  const handleOpenTelegram = () => {
    trackGoal('click_guide');
    window.open(config.telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="guide"
      className="bg-transparent text-ink py-16 sm:py-20 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-[#0A0C16] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle blue glow in corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-light text-xs font-mono font-bold mb-4">
                <FileText className="w-3.5 h-3.5" />
                <span>БЕСПЛАТНЫЙ МАТЕРИАЛ</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white mb-3">
                Руководство по ликвидации рутины в бизнесе
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-xl mb-6">
                12-страничный PDF-документ: как быстро оцифровать повторяющиеся процессы и выбрать стек без переплаты за дорогие зарубежные SaaS.
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Правило трёх повторений</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Архитектура Python + n8n</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Чек-лист готовности к AI</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                type="button"
                onClick={handleOpenTelegram}
                className="group inline-flex items-center justify-center gap-2.5 bg-blue text-white rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider shadow-[0_10px_25px_rgba(61,92,255,0.35)] hover:shadow-[0_12px_30px_rgba(61,92,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Забрать PDF в Telegram</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
