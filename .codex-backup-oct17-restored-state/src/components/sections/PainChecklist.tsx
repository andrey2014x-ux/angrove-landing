import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { PillButton } from '../ui/PillButton';
import { LeopardDivider } from '../ui/LeopardDivider';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export const PainChecklist: React.FC = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const items: ChecklistItem[] = [
    {
      id: 'data-transfer',
      title: 'Ручной перенос данных',
      description: 'копируете контакты и заказы из одного приложения в другое.',
    },
    {
      id: 'repetitive-questions',
      title: 'Повторяющиеся вопросы',
      description: 'больше 30 минут в день на одни и те же ответы и прайсы.',
    },
    {
      id: 'delayed-response',
      title: 'Задержки с ответом',
      description: 'клиент написал, а вы ответили через 2–3 часа.',
    },
    {
      id: 'manual-search',
      title: 'Ручной поиск',
      description: 'поставщиков и клиентов ищете вручную по картам и сайтам.',
    },
    {
      id: 'forgotten-tasks',
      title: 'Забытые дела',
      description: 'заявки теряются в личных переписках, никто не поставил напоминание.',
    },
  ];

  const toggleItem = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const countChecked = Object.values(selected).filter(Boolean).length;
  const showBanner = countChecked >= 2;

  // SVG Circular progress ring calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (countChecked / items.length) * circumference;

  const handleResolveClick = () => {
    trackGoal('click_telegram');
  };

  return (
    <section className="relative bg-light text-text-dark py-20 sm:py-28 overflow-hidden" id="pain">
      {/* Top Leopard divider strip */}
      <div className="absolute top-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
          <SectionHeading
            category="ЗНАКОМО?"
            titlePart1="Где у вас"
            titlePart2="утекает время?"
            subtitle="Отметьте то, с чем сталкиваетесь."
            align="left"
            isLight={true}
          />

          {/* Circular Progress Ring */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-slate-200/90 shadow-card-light mt-4 sm:mt-0 flex-shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  className="stroke-slate-200"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  className="stroke-accent transition-all duration-500 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-text-dark">
                {countChecked}/{items.length}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Пункты</span>
              <span className="text-xs font-bold text-text-dark">
                {countChecked === 0 ? 'Выберите боли' : `${countChecked} выбрано`}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Checklist Items with Spring Checkboxes */}
        <div className="flex flex-col gap-3.5 sm:gap-4 mb-8">
          {items.map((item) => {
            const isChecked = !!selected[item.id];
            return (
              <label
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-card border transition-all duration-300 cursor-pointer select-none group ${
                  isChecked
                    ? 'bg-white border-accent shadow-card-light translate-x-1.5'
                    : 'bg-white/70 hover:bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Custom Spring Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                    isChecked
                      ? 'bg-accent border-accent text-white shadow-glow-accent scale-105'
                      : 'border-slate-300 bg-white group-hover:border-accent'
                  }`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleItem(item.id);
                    }
                  }}
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.svg
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-sm sm:text-base leading-snug">
                  <span className="font-bold text-text-dark">{item.title}:</span>{' '}
                  <span className="text-text-dark-muted">{item.description}</span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Dynamic Alert Banner when >= 2 items checked with soft electric glow */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-ink text-white rounded-card-lg p-6 sm:p-8 border border-accent/60 shadow-[0_0_40px_rgba(61,92,255,0.35)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
            >
              {/* Soft electric flash aura */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 pointer-events-none animate-pulse"
                aria-hidden="true"
              />

              <div className="flex items-start gap-3.5 text-left relative z-10">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent-bright flex-shrink-0 mt-0.5">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-lg sm:text-xl text-white mb-1">
                    Это можно отдать коду.
                  </h4>
                  <p className="text-slate-300 text-sm sm:text-base">
                    Вы тратите десятки часов в месяц впустую.
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-full sm:w-auto">
                <PillButton
                  href={config.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto whitespace-nowrap"
                  onClick={handleResolveClick}
                >
                  <span>Разобрать мою задачу</span>
                  <ArrowRight size={16} />
                </PillButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Leopard divider strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>
    </section>
  );
};
