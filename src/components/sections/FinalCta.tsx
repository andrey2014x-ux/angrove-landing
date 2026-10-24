import React, { useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Send, Instagram } from 'lucide-react';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

export const FinalCta: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div
          data-reveal="stage"
          className="bg-[#0A0C16] text-white rounded-3xl p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          {/* Subtle blue ambient radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <WordReveal
              as="h2"
              text="Есть процесс который съедает время?"
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-6"
              highlightWords={{ 'съедает': 'font-serif italic font-normal text-blue-light lowercase', 'время?': 'font-serif italic font-normal text-blue-light lowercase' }}
            />

            <p data-reveal="desc" className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
              Напишите в двух словах в Telegram — скажу, можно ли его автоматизировать, сколько это займет и какой стек подойдет лучше всего.
            </p>

            <div data-reveal="card" className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="group inline-flex items-center justify-center gap-3 bg-blue hover:bg-blue-dark text-white rounded-full px-8 sm:px-9 py-4 text-sm sm:text-base font-bold shadow-[0_12px_30px_rgba(61,92,255,0.4)] hover:shadow-[0_16px_40px_rgba(61,92,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
              >
                <Send className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                <span>Обсудить задачу в Telegram</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="group inline-flex items-center justify-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-full px-7 sm:px-8 py-4 text-sm sm:text-base font-bold border border-white/15 hover:border-white/30 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
              >
                <Instagram className="w-4 h-4 text-white/70 group-hover:text-[#E1306C] transition-colors" />
                <span>Instagram @_angrove_</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
