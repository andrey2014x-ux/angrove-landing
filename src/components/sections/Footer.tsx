import React from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Send, Instagram } from 'lucide-react';
import { CircuitWordmark } from '../ui/CircuitWordmark';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { label: 'Услуги', href: '#services' },
    { label: 'Кейсы', href: '#cases' },
    { label: 'Процесс', href: '#process' },
    { label: 'Обо мне', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <footer className="bg-[#06080F] text-white border-t border-white/[0.08] relative overflow-hidden" id="footer">
      {/* Top ambient neon horizon glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue via-cyan-400 to-transparent shadow-[0_0_25px_rgba(61,92,255,0.6)] pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-6 relative z-10">
        
        {/* Upper Tier: Clean Studio Bar (Identity, Nav, Direct Channels) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-white/[0.06]">
          
          {/* 1. Identity & Role */}
          <div className="max-w-sm">
            <div className="font-mono text-sm font-semibold text-white tracking-tight mb-1.5 flex items-center gap-2">
              <span>Андрей</span>
              <span className="text-white/30">·</span>
              <span className="text-zinc-300 font-normal">AI & Automation Architect</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Проектирование и внедрение автономных AI-систем, n8n-пайплайнов и глубокой автоматизации бизнес-процессов.
            </p>
          </div>

          {/* 2. Minimal Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
            {navigation.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-zinc-400 hover:text-white transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3. Direct Contact Channels (Sleek Pills, Zero Slop) */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href={config.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal('click_telegram')}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-blue/15 border border-white/10 hover:border-blue/50 text-white font-mono text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(61,92,255,0.3)] hover:-translate-y-0.5"
            >
              <Send size={13} className="text-blue-light group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
              <span className="text-zinc-400 font-normal">@ANGROVE</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-blue-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGoal('click_instagram')}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-white font-mono text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              <Instagram size={13} className="text-zinc-400 group-hover:text-[#E1306C] transition-colors" />
              <span>Instagram*</span>
              <span className="text-zinc-400 font-normal">@_angrove_</span>
              <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Centerpiece: Architectural Brand Wordmark with 2D n8n Electric Contour Loop */}
        <div
          id="footer-brand-wordmark"
          className="w-full px-2 pt-6 pb-8 text-center select-none pointer-events-none flex items-center justify-center overflow-hidden relative"
        >
          <CircuitWordmark />
        </div>

        {/* Lower Tier: Sub-bar with Copyright and Clean Disclaimer */}
        <div className="pt-4 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-center md:text-left">
            <span>© {currentYear} _ANGROVE_</span>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-[11px] text-zinc-400">Прямой диалог и согласование в Telegram</span>
          </div>

          <div className="text-[10px] text-zinc-400 font-sans text-center md:text-right">
            * Деятельность Meta (Instagram) признана экстремистской в РФ
          </div>
        </div>

      </div>
    </footer>
  );
};
