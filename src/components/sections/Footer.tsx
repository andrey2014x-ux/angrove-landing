import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { Send, ArrowUpRight, ArrowUp, Instagram, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-transparent text-ink border-t border-black/[0.08] pt-20 pb-8 overflow-hidden relative" id="footer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-line-dark/15">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-base font-black tracking-widest text-ink select-none">
                  _ANGROVE_
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue" />
              </div>
              
              <p className="text-xs text-ink/70 font-sans max-w-sm leading-relaxed mb-5">
                Личный бренд Андрея. Проектирую и внедряю автономных AI-агентов, парсеры данных и сквозные связки с CRM, которые высвобождают часы рутинного труда предпринимателя.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Открыт для проектов · Q4 {currentYear}</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-1.5 text-[11px] font-mono text-ink/50">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-blue" />
                <span>Москва (UTC+3) · Работаю по всему миру</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-blue" />
                <span>Спринты разработки от 3 до 14 дней</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services & Tech Stack (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 font-mono text-xs">
            <span className="text-ink/40 uppercase tracking-wider font-bold">Решения & Стек</span>
            <div className="flex flex-col gap-2 font-sans text-xs">
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors flex items-center justify-between group">
                <span>Telegram AI-боты (Claude / GPT)</span>
                <span className="text-[10px] font-mono text-ink/30 group-hover:text-blue transition-colors">от 30k</span>
              </a>
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors flex items-center justify-between group">
                <span>Сбор баз & Парсинг гео/карт</span>
                <span className="text-[10px] font-mono text-ink/30 group-hover:text-blue transition-colors">от 15k</span>
              </a>
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors flex items-center justify-between group">
                <span>Голосовые AI-роботы обзвона</span>
                <span className="text-[10px] font-mono text-ink/30 group-hover:text-blue transition-colors">под ключ</span>
              </a>
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors flex items-center justify-between group">
                <span>Связка amoCRM / Bitrix24 / Склад</span>
                <span className="text-[10px] font-mono text-ink/30 group-hover:text-blue transition-colors">API</span>
              </a>
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors flex items-center justify-between group">
                <span>Сценарии n8n & Автономные пайплайны</span>
                <span className="text-[10px] font-mono text-ink/30 group-hover:text-blue transition-colors">n8n</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3 font-mono text-xs">
            <span className="text-ink/40 uppercase tracking-wider font-bold">Навигация</span>
            <div className="flex flex-col gap-2 font-sans text-xs">
              <a href="#cases" className="text-ink/75 hover:text-blue transition-colors">
                Кейсы с цифрами
              </a>
              <a href="#process" className="text-ink/75 hover:text-blue transition-colors">
                Этапы работы
              </a>
              <a href="#services" className="text-ink/75 hover:text-blue transition-colors">
                Интерактивный AI-чат
              </a>
              <a href="#faq" className="text-ink/75 hover:text-blue transition-colors">
                Частые вопросы (FAQ)
              </a>
              <a href="#about" className="text-ink/75 hover:text-blue transition-colors">
                Обо мне
              </a>
              <a href="#guide" className="text-ink/75 hover:text-blue transition-colors">
                Бесплатный AI-гид
              </a>
            </div>
          </div>

          {/* Col 4: Direct Contact & Cards (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 font-mono text-xs">
            <span className="text-ink/40 uppercase tracking-wider font-bold">Прямой диалог</span>
            
            <div className="flex flex-col gap-3">
              {/* Telegram Primary Contact Card */}
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal('click_telegram')}
                className="group flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-line-dark/15 hover:border-blue/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-blue/10 text-blue flex items-center justify-center flex-shrink-0 group-hover:bg-blue group-hover:text-white transition-colors">
                  <Send size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span>Telegram: @angrove</span>
                    <ArrowUpRight size={13} className="text-ink/40 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-ink/60 mt-0.5 font-sans">Личные сообщения · Ответ ~15 мин</p>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal('click_instagram')}
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white/80 border border-line-dark/10 hover:border-line-dark/25 transition-all text-xs font-sans text-ink/80 hover:text-ink"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram size={14} className="text-ink/50 group-hover:text-[#E1306C] transition-colors" />
                  <span>Instagram*: @_angrove_</span>
                </div>
                <ArrowUpRight size={12} className="text-ink/40 group-hover:text-ink transition-transform" />
              </a>

              <div className="text-[11px] font-mono text-ink/45 px-1 leading-relaxed">
                Фиксированная смета до старта, поэтапная оплата и гарантия 30 дней поддержки.
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Meta Bar */}
        <div className="pt-6 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-ink/60">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">© {currentYear} _ANGROVE_. Все права защищены.</span>
            <span className="text-ink/20">|</span>
            <a
              href="/privacy"
              className="text-[11px] hover:text-blue underline underline-offset-2 transition-colors"
            >
              Политика конфиденциальности
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-ink/60 hover:text-blue transition-colors cursor-pointer"
          >
            <span>Наверх страницы</span>
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Legal Meta Disclaimer (discreet, clean, bottom) */}
        <div className="pt-2 pb-6 text-[11px] font-sans text-ink/40 leading-relaxed text-center border-t border-line-dark/10 max-w-4xl mx-auto">
          * Деятельность компании Meta Platforms Inc. (соцсеть Instagram) признана экстремистской и запрещена на территории Российской Федерации.
        </div>

        {/* Architectural Brand Wordmark (Linear / Vercel style sculpture outline) */}
        <div className="pt-6 pb-2 overflow-hidden text-center select-none pointer-events-none">
          <span
            className="font-sans font-black tracking-[-0.04em] uppercase inline-block whitespace-nowrap leading-[0.8] text-transparent select-none transition-all duration-700 hover:text-black/[0.04]"
            style={{
              fontSize: 'clamp(3.5rem, 18vw, 20rem)',
              WebkitTextStroke: '1.5px rgba(15, 23, 42, 0.16)',
            }}
          >
            _angrove_
          </span>
        </div>
      </div>
    </footer>
  );
};
