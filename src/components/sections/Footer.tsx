import React, { useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Send, Instagram } from 'lucide-react';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

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
      className="bg-[#06080F] text-white relative overflow-hidden border-t border-white/[0.08]"
    >
      {/* Top subtle blue/cyan neon horizon line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] bg-gradient-to-r from-transparent via-blue via-cyan-400 to-transparent shadow-[0_0_30px_rgba(61,92,255,0.7)] pointer-events-none" />

      {/* Ambient background glow behind CTA */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* --- Upper Tier: The Monolithic Finale Call to Action --- */}
        <div className="pt-20 sm:pt-28 pb-16 sm:pb-20 text-center max-w-3xl mx-auto">
          
          {/* Availability Pill */}
          <div data-reveal="desc" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 font-mono text-xs mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">ОТКРЫТ К НОВЫМ ПРОЕКТАМ</span>
            <span className="text-white/20">·</span>
            <span className="text-zinc-400">МОСКВА &amp; REMOTE</span>
          </div>

          {/* Heading */}
          <WordReveal
            as="h2"
            text="Есть процесс который съедает время?"
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-6"
            highlightWords={{
              'съедает': 'font-serif italic font-normal text-blue-light lowercase',
              'время?': 'font-serif italic font-normal text-blue-light lowercase',
            }}
          />

          {/* Subtitle */}
          <p
            data-reveal="desc"
            className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Напишите в двух словах в Telegram — скажу, можно ли его автоматизировать, сколько это займёт и какой стек подойдёт лучше всего.
          </p>

          {/* Action Button Row */}
          <div data-reveal="card" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal('click_telegram')}
              className="group inline-flex items-center justify-center gap-3 bg-blue hover:bg-blue-dark text-white rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-bold shadow-[0_12px_35px_rgba(61,92,255,0.45)] hover:shadow-[0_16px_45px_rgba(61,92,255,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto"
            >
              <Send className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
              <span>Обсудить задачу в Telegram</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal('click_instagram')}
              className="group inline-flex items-center justify-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-full px-7 sm:px-8 py-4 text-sm sm:text-base font-bold border border-white/10 hover:border-white/25 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto font-mono text-xs sm:text-sm"
            >
              <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-[#E1306C] transition-colors" />
              <span>Instagram* @_angrove_</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            Отвечаю лично в течение 1–2 часов · Без навязчивых звонков и спама
          </p>
        </div>

        {/* --- Lower Tier: Seamless Studio Bar --- */}
        <div id="footer" className="pt-8 pb-10 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          
          {/* Identity & Role */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-bold text-white tracking-tight">_angrove_</span>
            <span className="text-white/20">·</span>
            <span className="text-zinc-300">AI &amp; Automation Architect</span>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-zinc-400 hidden sm:inline">UTC+3</span>
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

          {/* Copyright & Disclaimer */}
          <div className="flex flex-col md:items-end gap-1 text-center md:text-right">
            <div>
              <span>© {currentYear} _ANGROVE_</span>
              <span className="text-white/20 mx-2">·</span>
              <span className="text-zinc-400">Все права защищены</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-sans">
              * Деятельность Meta (Instagram) признана экстремистской в РФ
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};