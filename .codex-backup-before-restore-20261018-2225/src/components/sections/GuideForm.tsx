import React, { useRef, useState } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { FileText, ArrowUpRight, Check } from 'lucide-react';

export const GuideForm: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width - 0.5) * 6;
    const yPercent = (y / rect.height - 0.5) * -6;
    setTilt({ x: yPercent, y: xPercent });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="guide"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
      aria-label="Бесплатный практический гид по автоматизации процессов"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-[#0A0C16] text-white p-6 sm:p-10 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-white/80">
                  <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
                  <span>Полезный материал</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                  Начните с{' '}
                  <span className="font-serif italic font-normal text-blue lowercase">
                    гида
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed font-sans mb-8">
                  Короткий прикладной документ без «воды», который поможет выявить рутину в ваших процессах и понять, что можно автоматизировать в первую очередь:
                </p>

                <div className="space-y-4 border-t border-b border-white/10 py-6 mb-8 font-sans">
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90">
                      <strong>Чек-лист «где теряется время»:</strong> 10 типовых сценариев рутины для авторов, экспертов и команд.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90">
                      <strong>Правило «3 раз подряд»:</strong> понятный алгоритм, когда операцию пора передавать коду.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90">
                      <strong>Сравнение 4 инструментов:</strong> когда нужен бот, когда n8n, а когда кастомный скрипт на Python.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-white/50 pt-2">
                <FileText size={16} className="text-blue flex-shrink-0" />
                <span>Формат: PDF · 12 страниц · Без анкет и регистраций</span>
              </div>
            </div>

            {/* Right Column */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease-out' : 'none',
              }}
              className="lg:col-span-6 bg-[#111422] border border-white/10 p-6 sm:p-10 flex flex-col justify-between gap-8 shadow-xl will-change-transform"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-blue-light uppercase tracking-wider font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
                  <span>PDF · Доступ сразу в Telegram</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white mb-3 leading-tight">
                  Забрать гид в один клик
                </h3>

                <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
                  Откройте материал напрямую в Telegram — без ввода почты, телефонных звонков и рекламных рассылок.
                </p>
              </div>

              {/* Minimalist File Plaque */}
              <div className="bg-[#0A0C16] text-white p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 bg-blue/20 border border-blue/40 flex items-center justify-center shrink-0 text-blue-light">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs sm:text-sm font-bold text-white truncate">
                      Гайд_Автоматизация_Процессов_2026.pdf
                    </div>
                    <div className="font-mono text-[11px] text-white/50 mt-0.5">
                      12 страниц · Практический документ
                    </div>
                  </div>
                </div>
                <div className="self-start sm:self-auto shrink-0 px-2.5 py-1 bg-white/10 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider border border-white/10">
                  PDF · 2.4 MB
                </div>
              </div>

              <div>
                <a
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackGoal('guide_click');
                    trackGoal('telegram_outbound');
                  }}
                  className="w-full py-4 px-6 bg-blue hover:bg-blue-light text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-3 shadow-lg shadow-blue/25"
                >
                  <span>Получить PDF в Telegram</span>
                  <ArrowUpRight size={18} />
                </a>

                <p className="text-[11px] font-mono text-white/40 text-center mt-3">
                  Без формы на сайте · документ откроется напрямую в боте
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
