import React, { useState, useEffect } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Zap } from 'lucide-react';

export const MobileStickyCta: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = 450; // past hero

      // Check if we are near the contact / final CTA section
      const contactSection = document.getElementById('contact');
      let nearBottom = false;
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
          nearBottom = true;
        }
      }

      setIsVisible(scrollY > heroThreshold && !nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    trackGoal('sticky_cta_click');
    trackGoal('telegram_outbound');
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Быстрое действие"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t border-line-dark shadow-[0_-8px_20px_rgba(10,12,22,0.08)] px-4 py-3 transition-all duration-200"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue font-bold uppercase tracking-wider">
            <Zap size={12} className="fill-blue text-blue" />
            <span>Цифровые системы</span>
          </div>
          <div className="text-xs text-ink/70 truncate font-sans">
            Отвечу лично в Telegram
          </div>
        </div>

        <a
          href={config.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-ink text-paper text-xs font-black uppercase tracking-wider rounded-none hover:bg-blue hover:text-white transition-colors flex-shrink-0 min-h-[44px] min-w-[140px] border border-ink shadow-sm active:scale-95"
        >
          <span>Обсудить</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </aside>
  );
};
