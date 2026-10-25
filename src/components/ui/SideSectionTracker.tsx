import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'hero', name: 'Главная', index: '01' },
  { id: 'pain', name: 'Знакомо?', index: '02' },
  { id: 'services', name: 'Услуги', index: '03' },
  { id: 'how-it-works', name: 'Практика', index: '04' },
  { id: 'comparison', name: 'Сравнение', index: '05' },
  { id: 'cases', name: 'Кейсы', index: '06' },
  { id: 'process', name: 'Процесс', index: '07' },
  { id: 'guide', name: 'Гид', index: '08' },
  { id: 'faq', name: 'FAQ', index: '09' },
  { id: 'about', name: 'Обо мне', index: '10' },
  { id: 'final-cta', name: 'Финал', index: '11' },
];

export const SideSectionTracker: React.FC = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop screens
    if (window.innerWidth < 1024) return;
    setVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = SECTIONS.find((s) => s.id === entry.target.id);
            if (found) {
              setActiveSection(found);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-2 pointer-events-none select-none transition-opacity duration-300"
      aria-hidden="true"
    >
      <div className="bg-surface/70 backdrop-blur-md border border-line/80 px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-card-soft">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
        <span className="font-mono text-[11px] font-bold text-white tracking-widest">
          {activeSection.index} <span className="text-slate-500 font-normal">/ 11</span>
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mr-1.5">
        {activeSection.name}
      </span>
    </div>
  );
};
