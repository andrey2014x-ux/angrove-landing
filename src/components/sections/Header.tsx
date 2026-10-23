import React, { useState } from 'react';
import { trackGoal } from '../../lib/analytics';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGuideClick = () => {
    trackGoal('click_guide');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-paper/95 backdrop-blur-sm border-b border-line-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Monogram: Morphs into animated leopard pattern on hover */}
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-sans text-sm font-medium text-ink">
          <a
            href="#services"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Услуги
          </a>
          <a
            href="#cases"
            className="editorial-link-hover hover:text-blue transition-colors focus-visible:ring-2 focus-visible:ring-blue"
          >
            Кейсы
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
            <span>Получить гид</span>
            <span aria-hidden="true">→</span>
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2.5 text-ink hover:text-blue focus-visible:ring-2 focus-visible:ring-blue active:scale-95 transition-transform"
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
            href="#cases"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-ink hover:text-blue py-1.5 focus-visible:ring-2 focus-visible:ring-blue"
          >
            Кейсы
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
            className="text-base font-bold text-blue flex items-center gap-1.5 pt-2 border-t border-line-dark/20"
          >
            <span>Получить практический гид</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </header>
  );
};
