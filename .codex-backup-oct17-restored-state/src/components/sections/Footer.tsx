import React, { useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { Send, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const letters = '_angrove_'.split('');

  const handleWordmarkHover = () => {
    if (!wordmarkRef.current || window.innerWidth < 768) return;
    const spans = wordmarkRef.current.querySelectorAll('.wordmark-letter');
    gsap.fromTo(
      spans,
      { y: 0, color: '#FFFFFF' },
      {
        y: -5,
        color: '#617DFF',
        stagger: {
          each: 0.04,
          yoyo: true,
          repeat: 1,
        },
        duration: 0.25,
        ease: 'power2.out',
      }
    );
  };

  const handlePrivacyTransition = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Smooth fade out before navigation
    document.body.style.transition = 'opacity 0.35s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = '/privacy';
    }, 350);
  };

  return (
    <footer className="bg-ink border-t border-line py-12 sm:py-16 text-slate-400 text-xs sm:text-sm" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Brand Wordmark with letter wave effect */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div
            ref={wordmarkRef}
            onMouseEnter={handleWordmarkHover}
            className="font-mono text-xl sm:text-2xl font-black text-white cursor-pointer select-none flex items-center tracking-wider"
          >
            {letters.map((char, i) => (
              <span
                key={i}
                className={`wordmark-letter inline-block transition-transform ${
                  char === '_' ? 'text-accent' : ''
                }`}
              >
                {char}
              </span>
            ))}
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="font-mono text-xs text-slate-400">Автоматизация бизнеса</span>
        </div>

        {/* Links with underline sweep */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-medium">
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGoal('click_telegram')}
            className="hover-link-line flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Send size={15} className="text-accent-bright" />
            <span>Telegram</span>
          </a>

          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGoal('click_instagram')}
            className="hover-link-line flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Instagram size={15} className="text-accent-bright" />
            <span>Instagram</span>
          </a>

          <a
            href="/privacy"
            onClick={handlePrivacyTransition}
            className="hover-link-line text-slate-400 hover:text-white transition-colors"
          >
            Политика конфиденциальности
          </a>
        </div>

        {/* Copyright */}
        <div className="font-mono text-slate-500 text-xs">
          © {currentYear} _angrove_
        </div>
      </div>
    </footer>
  );
};
