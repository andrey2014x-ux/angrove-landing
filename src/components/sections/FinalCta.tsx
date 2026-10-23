import React, { useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Send } from 'lucide-react';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

export const FinalCta: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div data-reveal="stage" className="bg-[#0A0C16] text-white rounded-3xl p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden border border-white/10 shadow-2xl">
          {/* Subtle blue ambient radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div data-reveal="badge" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-light text-xs font-mono font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ОТКРЫТ ДЛЯ НОВЫХ ЗАДАЧ</span>
            </div>

            <WordReveal
              as="h2"
              text="Есть процесс который съедает время?"
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-6"
              highlightWords={{ 'съедает': 'font-serif italic font-normal text-blue-light lowercase', 'время?': 'font-serif italic font-normal text-blue-light lowercase' }}
            />

            <p data-reveal="desc" className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
              Напишите в двух словах в Telegram — скажу, можно ли его автоматизировать, сколько это займет и какой стек подойдет лучше всего.
            </p>

            <div data-reveal="card" className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="group inline-flex items-center justify-center gap-2.5 bg-blue text-white rounded-full px-10 py-5 text-sm sm:text-base font-bold shadow-[0_12px_30px_rgba(61,92,255,0.4)] hover:shadow-[0_15px_40px_rgba(61,92,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Обсудить задачу в Telegram</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-full px-8 py-5 text-sm font-bold border border-white/10 transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>Instagram @_angrove_</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
