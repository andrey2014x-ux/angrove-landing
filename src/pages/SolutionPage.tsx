import React, { useState } from 'react';
import { SolutionItem } from '../data/solutionsData';
import { LeopardDivider } from '../components/ui/LeopardDivider';
import { RoiCalculator } from '../components/ui/RoiCalculator';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronDown,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface SolutionPageProps {
  solution: SolutionItem;
}

export const SolutionPage: React.FC<SolutionPageProps> = ({ solution }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const telegramLeadUrl = `https://t.me/angrove?text=${encodeURIComponent(
    `Здравствуйте, Андрей! Интересует внедрение: ${solution.title} (${solution.badge}). Хочу обсудить задачу.`
  )}`;

  return (
    <div className="min-h-screen bg-ink text-white font-sans selection:bg-accent selection:text-white">
      {/* Top Sticky Header */}
      <header className="border-b border-line bg-surface/85 backdrop-blur-md sticky top-0 z-40">
        <LeopardDivider height={3} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-slate-300 hover:text-accent-bright transition-colors"
          >
            <ArrowLeft size={16} />
            <span>На главную</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-xs text-accent-bright font-bold">
              _angrove_ · РЕШЕНИЯ
            </span>
            <a
              href={telegramLeadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-lg bg-accent/20 border border-accent/40 text-accent-bright hover:bg-accent hover:text-white text-xs font-mono transition-all"
            >
              Связаться в TG
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16 sm:space-y-24">
        {/* 1. Hero Section */}
        <section className="relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6" aria-label="Хлебные крошки">
            <a href="/" className="hover:text-white transition-colors">Главная</a>
            <span>/</span>
            <span className="text-slate-500">Решения</span>
            <span>/</span>
            <span className="text-accent-bright">{solution.slug}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-bright font-mono text-xs uppercase tracking-wider mb-5">
            <Sparkles size={14} />
            <span>{solution.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
            {solution.title}{' '}
            <span className="font-serif italic font-normal text-accent-bright">
              {solution.titleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
            {solution.description}
          </p>

          {/* Key Meta Badges & CTA */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <a
              href={telegramLeadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-7 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all active:scale-[0.98]"
            >
              <Zap size={18} className="text-cyan-200" />
              <span>Обсудить задачу в Telegram</span>
              <ArrowRight size={18} />
            </a>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-l border-line/80 pl-4 sm:pl-6">
              <div>
                <span className="block text-slate-500 text-[10px] uppercase">Срок:</span>
                <span className="text-white font-bold">{solution.deliveryDays}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] uppercase">Бюджет:</span>
                <span className="text-accent-bright font-bold">{solution.priceFrom}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Metrics Bento */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {solution.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-surface/70 border border-line/70 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-2">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-400">
                {metric.label}
              </div>
            </div>
          ))}
        </section>

        {/* 3. Pain Points */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={14} />
              Точки потерь
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              С чем сталкивается бизнес до автоматизации
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {solution.painPoints.map((point, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-paper/70 border border-line/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono text-xs font-bold mb-4">
                    !
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Deliverables Roadmap */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-accent-bright flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={14} />
              Архитектура решения
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Что входит в проект под ключ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {solution.deliverables.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface/90 border border-line flex flex-col justify-between relative group hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="font-mono text-xs text-accent-bright font-bold mb-3 tracking-widest">
                    ШАГ {item.step}
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Interactive ROI Calculator */}
        <RoiCalculator sourceContext={solution.title} />

        {/* 6. FAQ Accordion */}
        <section className="space-y-6 max-w-3xl mx-auto w-full">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent-bright">
              <HelpCircle size={14} />
              <span>Частые вопросы</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Ответы на ключевые вопросы
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {solution.faq.map((item, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-accent-bright transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-base sm:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-accent-bright' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-line/50 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Bottom CTA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-surface via-paper to-surface border border-accent/30 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              Готовы внедрить в свой бизнес?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Напишите в Telegram — обсудим вашу инфраструктуру, покажем демо аналогичных сценариев и составим план внедрения без предоплаты.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={telegramLeadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm sm:text-base inline-flex items-center gap-2 shadow-xl shadow-accent/30 transition-all active:scale-[0.98]"
            >
              <span>Написать в Telegram @_angrove_</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="/"
              className="py-4 px-6 rounded-xl border border-line hover:border-slate-400 text-slate-300 hover:text-white font-medium text-sm transition-all"
            >
              Все услуги на главной
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-center text-xs font-mono text-slate-500">
        <p>© {new Date().getFullYear()} _angrove_ · Андрей. Все решения лицензируются на инфраструктуре клиента.</p>
        <p className="mt-1">
          <a href="/privacy" className="hover:text-slate-300 transition-colors">Политика конфиденциальности</a>
        </p>
      </footer>
    </div>
  );
};
