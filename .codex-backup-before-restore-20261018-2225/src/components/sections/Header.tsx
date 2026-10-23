import React, { useState, useEffect, useRef } from 'react';
import { trackGoal } from '../../lib/analytics';
import { config } from '../../config';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escape key listener to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleCtaClick = () => {
    trackGoal('header_cta_click');
    trackGoal('telegram_outbound');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Сценарии', href: '#solutions' },
    { label: 'Как работает', href: '#workflow' },
    { label: 'Проекты', href: '#cases' },
    { label: 'Принципы', href: '#about' },
    { label: 'Вопросы', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-paper/95 backdrop-blur-md border-line-dark shadow-sm'
          : 'bg-paper border-line-dark'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Monogram: Morphs into animated leopard pattern on hover */}
        <a
          href="/"
          className="group relative inline-block font-display text-xl sm:text-2xl font-black tracking-tight select-none focus-visible:outline-none cursor-pointer py-1"
          title="_angrove_ — цифровые системы и автоматизация"
        >
          {/* Base Solid Ink Text */}
          <span className="inline-block text-ink transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95">
            _angrove_
          </span>

          {/* Morphing Animated Leopard Text Overlay */}
          <span
            className="absolute inset-0 pt-1 text-leopard-flow opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-105 will-change-transform filter drop-shadow-[0_0_6px_rgba(61,92,255,0.35)]"
            aria-hidden="true"
          >
            _angrove_
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 font-sans text-sm font-medium text-ink">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="editorial-link-hover hover:text-blue transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Action Button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-ink text-paper hover:bg-blue hover:text-white transition-colors duration-150 border border-ink shadow-sm"
          >
            <span>Обсудить задачу</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2 text-ink hover:text-blue focus-visible:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Навигация"
          className="md:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-paper/98 backdrop-blur-xl border-t border-line-dark px-6 py-8 flex flex-col justify-between overflow-y-auto animate-fadeIn z-50"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-ink hover:text-blue py-1.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#guide"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-blue flex items-center gap-1.5 pt-2"
            >
              <span>Бесплатный PDF-гид</span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="pt-8 border-t border-line-dark">
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              className="w-full flex items-center justify-center gap-2 py-4 bg-ink text-paper text-sm font-black uppercase tracking-wider hover:bg-blue hover:text-white transition-colors min-h-[48px]"
            >
              <span>Обсудить задачу в Telegram</span>
              <ArrowUpRight size={16} />
            </a>
            <p className="text-xs text-ink/60 text-center mt-2.5 font-sans">
              Отвечаю лично в Telegram в течение 2–3 часов
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
