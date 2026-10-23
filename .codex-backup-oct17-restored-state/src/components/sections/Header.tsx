import React, { useState, useEffect } from 'react';
import { PillButton } from '../ui/PillButton';
import { LeopardDivider } from '../ui/LeopardDivider';
import { trackGoal } from '../../lib/analytics';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGuideClick = () => {
    trackGoal('click_guide');
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-ink/85 backdrop-blur-xl border-b border-line shadow-card-soft py-3' 
        : 'bg-transparent py-4 sm:py-5'
    }`}>
      {/* Subtle Leopard accent strip at very top of header */}
      <LeopardDivider height={3} className="opacity-75" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mt-2">
        {/* Brand Name */}
        <a 
          href="/" 
          className="font-mono text-lg sm:text-xl font-bold tracking-tight text-white hover:text-accent-bright transition-colors flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span className="text-accent">_</span>angrove<span className="text-accent">_</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="hover-link-line text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Услуги
          </a>
          <a href="#how-it-works" className="hover-link-line text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Как работает
          </a>
          <a href="#faq" className="hover-link-line text-sm font-medium text-slate-300 hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <PillButton 
            href="#guide" 
            variant="primary" 
            size="sm"
            onClick={handleGuideClick}
          >
            Получить гид
          </PillButton>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus-visible:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-2xl border-b border-line px-6 py-6 flex flex-col gap-5 mt-2 animate-fadeIn">
          <a 
            href="#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-accent-bright py-1"
          >
            Услуги
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-accent-bright py-1"
          >
            Как работает
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-accent-bright py-1"
          >
            FAQ
          </a>
          <div className="pt-2">
            <PillButton 
              href="#guide" 
              variant="primary" 
              size="md" 
              className="w-full justify-center"
              onClick={handleGuideClick}
            >
              Получить гид
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
};
