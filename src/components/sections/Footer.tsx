import React, { useRef, useState } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Send, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  // 1. Subtle magnetic physics for primary CTA button
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const pullX = (e.clientX - centerX) * 0.32;
    const pullY = (e.clientY - centerY) * 0.32;
    setBtnPos({ x: pullX, y: pullY });
  };

  const handleBtnMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  // 2. Ambient spotlight following cursor across the dark canvas
  const [spotlight, setSpotlight] = useState({ x: 50, y: 35 });

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  const navigation = [
    { label: 'Услуги', href: '#services' },
    { label: 'Процесс', href: '#process' },
    { label: 'Обо мне', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <footer
      ref={sectionRef}
      id="final-cta"
      onMouseMove={handleContainerMouseMove}
      className="bg-[#05070D] text-white relative overflow-hidden select-none"
    >
      {/* Top subtle hairline border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.08]" />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute pointer-events-none rounded-full blur-[130px] transition-all duration-300 ease-out hidden md:block"
        style={{
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '540px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(61,92,255,0.16) 0%, rgba(0,240,255,0.05) 50%, transparent 75%)',
        }}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* --- Central Editorial Hero Statement --- */}
        <div className="pt-24 sm:pt-36 pb-20 sm:pb-28 text-center max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Subtle Monospace Architect Tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs text-zinc-400 tracking-wider uppercase mb-6 sm:mb-8 text-center px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Андрей</span>
            <span className="text-white/20">·</span>
            <span>AI &amp; Automation Architect</span>
            <span className="text-white/20">·</span>
            <span>Москва (UTC+3)</span>
          </div>

          {/* Cinematic Headline with Serif Twist */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.15] mb-5 sm:mb-6 font-sans">
            Давайте создадим систему,
            <span className="block font-serif font-normal italic lowercase text-blue-light tracking-normal mt-1 sm:mt-2 text-3xl sm:text-5xl lg:text-7xl">
              которая работает за вас.
            </span>
          </h2>

          {/* Calm, Direct Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-xl mx-auto mb-12 leading-relaxed font-sans font-normal">
            Напишите в Telegram — за 15 минут разберём узкие места ваших процессов и определим точный стек автоматизации.
          </p>

          {/* Interactive Magnetic CTA Button */}
          <div className="flex items-center justify-center mb-8 w-full">
            <a
              ref={btnRef}
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal('click_telegram')}
              onMouseMove={handleBtnMouseMove}
              onMouseLeave={handleBtnMouseLeave}
              style={{
                transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)`,
                transition: btnPos.x === 0 ? 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2)' : 'transform 0.08s ease-out',
              }}
              className="group inline-flex items-center justify-center gap-3 bg-blue hover:bg-blue-dark text-white rounded-full px-8 sm:px-10 py-4 sm:py-4.5 text-sm sm:text-base font-bold shadow-[0_12px_40px_rgba(61,92,255,0.4)] hover:shadow-[0_16px_50px_rgba(61,92,255,0.6)] cursor-pointer w-full sm:w-auto active:scale-[0.98] transition-[background-color,box-shadow]"
            >
              <Send className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
              <span>Обсудить задачу в Telegram</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Micro Assurance */}
          <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-2">
            <span>Личный ответ без менеджеров</span>
            <span className="text-white/20">·</span>
            <span>В течение 1–2 часов</span>
          </div>

        </div>

        {/* --- Minimalist Studio Sub-bar --- */}
        <div id="footer" className="pt-8 pb-10 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          
          {/* Brand Signature */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">_angrove_</span>
            <span className="text-white/20">·</span>
            <span className="text-zinc-300">Автономные AI-системы и интеграции</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navigation.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col md:items-end items-center gap-3 text-center md:text-right">
            {/* Minimal Social & Channel Icon Buttons */}
            <div className="flex items-center gap-2">
              {/* Telegram Channel */}
              <a
                href={config.telegramChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram-канал @angrove_ai"
                aria-label="Telegram-канал @angrove_ai"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#229ED9]/50 bg-white/[0.03] hover:bg-[#229ED9]/10 flex items-center justify-center text-zinc-400 hover:text-[#229ED9] transition-all duration-200 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 -translate-x-[0.5px] translate-y-[0.5px]" />
              </a>

              {/* VK */}
              <a
                href={config.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="ВКонтакте"
                aria-label="ВКонтакте"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-[#0077FF]/50 bg-white/[0.03] hover:bg-[#0077FF]/10 flex items-center justify-center text-zinc-400 hover:text-[#0077FF] transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="3.5 6.5 17 11.5">
                  <path d="M6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" />
                </svg>
              </a>

              {/* VC.ru */}
              <a
                href={config.vcUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Статьи на vc.ru"
                aria-label="Статьи на vc.ru"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <span className="font-sans font-black text-[10px] tracking-tight leading-none uppercase">vc</span>
              </a>

              {/* Instagram */}
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal('click_instagram')}
                title="Instagram @_angrove_"
                aria-label="Instagram @_angrove_"
                className="w-8 h-8 rounded-full border border-white/10 hover:border-pink-500/50 bg-white/[0.03] hover:bg-pink-500/10 flex items-center justify-center text-zinc-400 hover:text-pink-400 transition-all duration-200 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Copyright & Disclaimer */}
            <div className="flex flex-col md:items-end items-center gap-0.5">
              <div>© {currentYear} _ANGROVE_</div>
              <div className="text-[10px] text-zinc-500 font-sans">
                * Meta (Instagram) признана экстремистской в РФ
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};