import React, { useState } from 'react';
import { trackGoal } from '../../lib/analytics';
import { config } from '../../config';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGuideClick = () => {
    trackGoal('click_guide');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-paper/90 backdrop-blur-md border-b border-black/[0.06] transform-gpu">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Monogram */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="group relative inline-block font-display text-xl sm:text-2xl font-black tracking-tight select-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 cursor-pointer py-1"
            title="_angrove_ — автоматизация процессов"
          >
            {/* Base Solid Ink Text */}
            <span className="inline-block text-ink transition-opacity duration-200 ease-out group-hover:opacity-0">
              _angrove_
            </span>

            {/* Morphing Animated Leopard Text Overlay */}
            <span
              className="absolute inset-0 pt-1 text-leopard-flow opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 will-change-transform"
              aria-hidden="true"
            >
              _angrove_
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans text-xs lg:text-sm font-medium text-ink">
          <a
            href="#services"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Услуги
          </a>
          <a
            href="#process"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Процесс
          </a>
          <a
            href="#about"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Обо мне
          </a>
          <a
            href="#faq"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Вопросы
          </a>
          <a
            href="#guide"
            onClick={handleGuideClick}
            className="text-blue font-bold flex items-center gap-1 hover:underline transition-colors focus-visible:ring-2 focus-visible:ring-blue active:scale-[0.98]"
          >
            <span>Гид</span>
            <span aria-hidden="true">↓</span>
          </a>

          {/* Quick Header Telegram Action Button */}
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGoal('click_telegram')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue text-white hover:bg-blue-dark font-sans text-xs font-bold transition-all duration-150 active:scale-95 shadow-sm"
          >
            <span>Telegram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2.5 text-ink hover:text-blue focus-visible:ring-2 focus-visible:ring-blue active:scale-95 transition-transform cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper border-b border-line-dark px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-ink hover:text-blue py-1.5 focus-visible:ring-2 focus-visible:ring-blue"
          >
            Услуги
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-ink hover:text-blue py-1.5 focus-visible:ring-2 focus-visible:ring-blue"
          >
            Процесс
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-ink hover:text-blue py-1.5 focus-visible:ring-2 focus-visible:ring-blue"
          >
            Обо мне
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-ink hover:text-blue py-1.5 focus-visible:ring-2 focus-visible:ring-blue"
          >
            Вопросы
          </a>
          <a
            href="#guide"
            onClick={handleGuideClick}
            className="text-base font-bold text-blue py-1.5 flex items-center justify-between"
          >
            <span>Получить гид (PDF)</span>
            <span aria-hidden="true">↓</span>
          </a>

          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackGoal('click_telegram');
              setMobileMenuOpen(false);
            }}
            className="mt-2 py-3 px-5 rounded-xl bg-ink text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Написать в Telegram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
};
