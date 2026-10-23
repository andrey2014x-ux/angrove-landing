import React, { useState } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, Check, Sparkles, Layers } from 'lucide-react';

interface TaskItem {
  id: string;
  num: string;
  label: string;
  category: string;
  architectureHint: string;
}

export const PainChecklist: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['messages', 'sync']);

  const tasks: TaskItem[] = [
    {
      id: 'messages',
      num: '01',
      label: 'Отвечать на повторяющиеся сообщения и вопросы клиентов',
      category: 'Коммуникации',
      architectureHint: 'AI-ассистент в Telegram/WhatsApp с базой знаний',
    },
    {
      id: 'content',
      num: '02',
      label: 'Собирать, транскрибировать и структурировать контент',
      category: 'Контент и медиа',
      architectureHint: 'Пайплайн транскрипции + саммаризация + автопостинг',
    },
    {
      id: 'sync',
      num: '03',
      label: 'Переносить данные между таблицами, CRM и сервисами',
      category: 'Синхронизация',
      architectureHint: 'Сквозные вебхуки и двусторонняя синхронизация',
    },
    {
      id: 'parsing',
      num: '04',
      label: 'Искать и проверять информацию в открытых источниках',
      category: 'Сбор данных',
      architectureHint: 'Автоматизированный парсер с фильтрацией дублей',
    },
    {
      id: 'reports',
      num: '05',
      label: 'Формировать регулярные сводные отчеты и документы',
      category: 'Отчетность',
      architectureHint: 'Генератор документов + утренний дайджест в Telegram',
    },
    {
      id: 'tracking',
      num: '06',
      label: 'Контролировать статусы заявок, счетов и задач',
      category: 'Трекинг процессов',
      architectureHint: 'Монитор событий с мгновенными пушами команде',
    },
    {
      id: 'custom',
      num: '07',
      label: 'Реализовать собственный нестандартный цифровой алгоритм',
      category: 'Кастомная разработка',
      architectureHint: 'Персональный backend-инструмент под вашу специфику',
    },
  ];

  const toggleTask = (id: string) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      const next = isSelected ? prev.filter((item) => item !== id) : [...prev, id];
      trackGoal('task_selector_used');
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTask(id);
    }
  };

  const selectedTasks = tasks.filter((t) => selectedIds.includes(t.id));

  // Determine synthesized solution profile
  let solutionTitle = 'Персональный цифровой инструмент';
  if (selectedIds.includes('messages') && selectedIds.includes('sync')) {
    solutionTitle = 'Интеллектуальный ассистент + Сквозная интеграция сервисов';
  } else if (selectedIds.includes('parsing') || selectedIds.includes('reports')) {
    solutionTitle = 'Автоматизированный пайплайн сбора данных и отчетности';
  } else if (selectedIds.includes('content')) {
    solutionTitle = 'Медиа-пайплайн обработки контента и публикаций';
  } else if (selectedIds.length > 3) {
    solutionTitle = 'Комплексная цифровая система процессов';
  }

  // Generate dynamic prefilled telegram message
  const prefilledText = encodeURIComponent(
    `Здравствуйте, Андрей! Выбрал задачи для автоматизации на сайте:\n` +
      selectedTasks.map((t) => `— ${t.label}`).join('\n') +
      `\n\nХочу обсудить архитектуру решения.`
  );
  const telegramUrlWithPrefill = `${config.telegramUrl}?text=${prefilledText}`;

  return (
    <section
      id="interactive"
      className="bg-paper text-ink py-16 sm:py-24 border-b border-line-dark relative overflow-hidden"
      aria-label="Интерактивный конструктор задач"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-xs sm:text-sm font-mono uppercase tracking-widest text-ink/75">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Диагностика процессов</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase text-ink">
              Что вы хотите перестать{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                делать вручную?
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/70 max-w-md font-sans leading-relaxed">
            Отметьте задачи, которые отнимают внимание — система соберет персональную конфигурацию автоматизации.
          </p>
        </div>

        {/* 2-Column Workspace: Left Task Items / Right Architectural Assembly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10 sm:mt-14 items-start">
          
          {/* Left: Task Interactive Buttons */}
          <div className="lg:col-span-7 space-y-3" role="group" aria-label="Список задач">
            {tasks.map((task) => {
              const isSelected = selectedIds.includes(task.id);
              return (
                <button
                  key={task.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  className={`w-full text-left p-4 sm:p-5 border transition-all duration-150 flex items-start gap-4 sm:gap-5 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                    isSelected
                      ? 'bg-ink text-paper border-ink shadow-md -translate-y-0.5'
                      : 'bg-paper text-ink border-line-dark/30 hover:border-line-dark hover:bg-ink/[0.02]'
                  }`}
                >
                  <div className="font-mono text-xs sm:text-sm font-bold pt-0.5 shrink-0 opacity-60">
                    {task.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[11px] uppercase tracking-wider opacity-60">
                        {task.category}
                      </span>
                      {isSelected && (
                        <span className="text-blue-light font-mono text-xs flex items-center gap-1 font-bold">
                          <Check size={14} className="stroke-[3]" />
                          <span>Выбрано</span>
                        </span>
                      )}
                    </div>
                    <div className="font-sans font-bold text-sm sm:text-base leading-snug">
                      {task.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Architecture Assembly Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#0A0C16] text-white p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              
              {/* Card Meta Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-blue-light uppercase tracking-wider">
                  <Layers size={15} />
                  <span>Архитектура решения</span>
                </div>
                <div className="font-mono text-xs text-white/50">
                  {selectedIds.length} {selectedIds.length === 1 ? 'задача' : selectedIds.length < 5 ? 'задачи' : 'задач'}
                </div>
              </div>

              {/* Solution Title */}
              <div className="mb-6">
                <div className="font-mono text-[11px] text-white/50 uppercase tracking-widest mb-1.5">
                  Рекомендуемый тип системы:
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight leading-snug">
                  {solutionTitle}
                </h3>
              </div>

              {/* Selected Modules Stream */}
              <div className="space-y-2 mb-8 max-h-[220px] overflow-y-auto pr-1">
                {selectedTasks.length === 0 ? (
                  <p className="text-xs text-white/40 font-mono italic">
                    Выберите хотя бы одну задачу слева, чтобы увидеть конфигурацию...
                  </p>
                ) : (
                  selectedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded bg-white/[0.04] border border-white/5 flex items-start gap-2.5 font-sans text-xs text-white/80"
                    >
                      <Sparkles size={14} className="text-blue shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white text-[13px]">{t.label}</div>
                        <div className="text-[11px] text-blue-light font-mono mt-0.5">
                          ↳ {t.architectureHint}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Direct Telegram Action */}
              <a
                href={telegramUrlWithPrefill}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackGoal('selector_cta_click');
                  trackGoal('telegram_outbound');
                }}
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-blue hover:bg-blue-light text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-colors duration-150 shadow-[0_0_20px_rgba(61,92,255,0.4)]"
              >
                <span>Обсудить этот сценарий</span>
                <ArrowUpRight size={16} />
              </a>

              <p className="font-sans text-[11px] text-white/50 text-center mt-3">
                Передаст выбранный список в диалог · отвечу лично
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
