import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { Send, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-paper text-ink border-t border-line-dark pt-16 pb-10 overflow-hidden relative" id="footer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Navigation & Meta Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-line-dark/20 items-start">
          <div className="md:col-span-5">
            <span className="group relative inline-block font-mono text-sm font-black tracking-widest cursor-pointer select-none mb-2">
              <span className="inline-block text-ink transition-opacity duration-300 group-hover:opacity-0">
                _ANGROVE_
              </span>
              <span
                className="absolute inset-0 text-leopard-flow opacity-0 transition-opacity duration-300 group-hover:opacity-100 filter drop-shadow-[0_0_6px_rgba(61,92,255,0.4)]"
                aria-hidden="true"
              >
                _ANGROVE_
              </span>
            </span>
            <p className="text-xs text-ink/60 font-sans max-w-sm leading-relaxed">
              Личный бренд Андрея. Автоматизация бизнеса, AI-агенты, парсеры данных и высвобождение ресурсов предпринимателя.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3 font-mono text-xs">
            <span className="text-ink/40 uppercase tracking-wider font-bold">Связь и соцсети</span>
            <div className="flex flex-col gap-2">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal('click_telegram')}
                className="inline-flex items-center gap-2 text-ink hover:text-blue transition-colors font-sans"
              >
                <Send size={13} className="text-blue flex-shrink-0" />
                <span>Telegram: @angrove</span>
                <ArrowUpRight size={11} className="text-ink/40" />
              </a>

              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal('click_instagram')}
                className="inline-flex items-center gap-2 text-ink hover:text-blue transition-colors font-sans"
              >
                <span>Instagram*: @_angrove_</span>
                <ArrowUpRight size={11} className="text-ink/40" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3 font-mono text-xs">
            <span className="text-ink/40 uppercase tracking-wider font-bold">Навигация</span>
            <div className="flex flex-col gap-1.5 font-sans text-xs">
              <a href="#services" className="text-ink/70 hover:text-blue transition-colors">Услуги</a>
              <a href="#how-it-works" className="text-ink/70 hover:text-blue transition-colors">Как работает</a>
              <a href="#cases" className="text-ink/70 hover:text-blue transition-colors">Кейсы</a>
              <a href="#comparison" className="text-ink/70 hover:text-blue transition-colors">Сравнение</a>
              <a href="#faq" className="text-ink/70 hover:text-blue transition-colors">Вопросы</a>
            </div>
            <span className="text-ink/40 text-[11px] mt-2 font-mono">
              © {currentYear} · Все права защищены
            </span>
          </div>
        </div>

        {/* Legal Meta Disclaimer */}
        <div className="pt-6 pb-4 text-[11px] font-sans text-ink/50 leading-relaxed border-b border-line-dark/15 max-w-4xl">
          * Деятельность компании Meta Platforms Inc. (соцсеть Instagram) признана экстремистской и запрещена на территории Российской Федерации.
        </div>

        {/* Giant Leopard Wordmark without bottom clipping */}
        <div className="pt-8 select-none pointer-events-none pb-2 overflow-hidden text-center">
          <span
            className="text-leopard-flow font-sans font-black tracking-tighter uppercase inline-block whitespace-nowrap leading-[0.9] opacity-90"
            style={{ fontSize: 'clamp(3rem, 16vw, 18rem)' }}
          >
            _angrove_
          </span>
        </div>
      </div>
    </footer>
  );
};

