import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { FileText, ArrowUpRight } from 'lucide-react';

export const GuideForm: React.FC = () => {
  const handleOpenTelegram = () => {
    trackGoal('click_guide');
    window.open(config.telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="guide"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Frame container with Bold Leopard Background */}
        <div className="bg-leopard p-2.5 sm:p-8 md:p-12 border border-line-dark shadow-2xl relative">
          {/* Inner Paper Card */}
          <div className="bg-paper text-ink border border-line-dark p-4 sm:p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              {/* Left Column: Editorial Value Proposition */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
                    <span>Полезный материал</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink mb-6">
                    Начните с{' '}
                    <span className="font-serif italic font-normal text-blue lowercase">
                      гида
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-ink/80 leading-relaxed font-sans mb-8">
                    Короткий прикладной документ без «воды», который поможет найти рутину в вашей компании и понять, что можно автоматизировать в первую очередь:
                  </p>

                  <div className="space-y-4 border-t border-b border-line-dark py-6 mb-8 font-sans">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-blue pt-0.5">—</span>
                      <span className="text-sm font-semibold text-ink">правило «3 раза подряд»</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-blue pt-0.5">—</span>
                      <span className="text-sm font-semibold text-ink">3 инструмента автоматизации</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-blue pt-0.5">—</span>
                      <span className="text-sm font-semibold text-ink">чек-лист «где утекает время»</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-ink/60 pt-2">
                  <FileText size={16} className="text-blue flex-shrink-0" />
                  <span>Формат: PDF · Практический документ · Сразу в работу</span>
                </div>
              </div>

              {/* Right Column: Clean Minimalist 1-Click Telegram Card */}
              <div className="lg:col-span-7 bg-white border border-line-dark p-8 sm:p-12 flex flex-col justify-between gap-8 shadow-sm">
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 font-mono text-xs text-blue uppercase tracking-wider font-bold mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                    <span>PDF · 12 страниц · Доступ сразу</span>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink mb-3 leading-tight">
                    Забрать гид в один клик
                  </h3>

                  <p className="text-sm sm:text-base text-ink/75 font-sans leading-relaxed">
                    Откройте материал напрямую в Telegram — без заполнения анкет, регистрации и ожидания.
                  </p>
                </div>

                {/* Minimalist File Preview Plaque */}
                <div className="bg-[#11131A] text-white p-4 sm:p-5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 bg-blue/20 border border-blue/40 flex items-center justify-center shrink-0 text-blue-light">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs sm:text-sm font-bold text-white truncate">
                        Automate_Routine_Guide_2026.pdf
                      </div>
                      <div className="font-mono text-[11px] text-white/50 mt-0.5">
                        PDF Документ · 2.4 MB · v2.1
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 px-2.5 py-1 bg-white/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Готов
                  </div>
                </div>

                {/* Full-width Black CTA Button & Subtext */}
                <div>
                  <button
                    type="button"
                    onClick={handleOpenTelegram}
                    className="w-full py-4 px-6 bg-ink text-paper text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-blue hover:text-white active:scale-[0.98] transition-all duration-150 border border-ink flex items-center justify-center gap-3 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <span>Открыть гид в Telegram</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <p className="text-[11px] font-mono text-ink/50 text-center mt-3">
                    Не собираем и не храним персональные данные на сайте
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


