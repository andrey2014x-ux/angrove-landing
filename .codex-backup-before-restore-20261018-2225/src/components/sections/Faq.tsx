import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const Faq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('cost');

  const faqs: FaqItem[] = [
    {
      id: 'cost',
      question: 'Сколько стоит разработка и от чего зависит цена?',
      answer:
        'Стоимость зависит от количества связываемых сервисов и сложности логики. Точечный парсер или скрипт — от 15 000 ₽, интеграция сервисов или сценарий Telegram-бота — от 30 000 ₽, комплексный AI-ассистент под ключ — от 50 000 ₽. Смета фиксируется до старта работ и не меняется в процессе.',
    },
    {
      id: 'timeline',
      question: 'Сколько времени занимает запуск системы?',
      answer:
        'Базовые интеграции и боты запускаются за 2–5 рабочих дней. Комплексные системы с AI, CRM и базами данных — за 1–3 недели. Рабочий прототип на ваших реальных данных тестируем уже на 2–3 день.',
    },
    {
      id: 'staff-training',
      question: 'Придется ли переучивать команду или нанимать программиста?',
      answer:
        'Нет. Решения встраиваются в привычные инструменты вашей команды — Telegram, amoCRM, Битрикс24 или Google Таблицы. К проекту прилагается короткая видеоинструкция и архитектурная схема, поэтому сотрудники начинают пользоваться результатом без специального обучения.',
    },
    {
      id: 'security',
      question: 'Где хранятся коммерческие данные и базы клиентов?',
      answer:
        'Все сценарии разворачиваются на ваших собственных серверах (self-hosted n8n / Docker / VPS) или в ваших аккаунтах. Базы клиентов и переписки остаются строго в вашем контуре и не передаются третьим сервисам.',
    },
    {
      id: 'support',
      question: 'Что произойдет, если сторонний сервис обновит API или произойдет сбой?',
      answer:
        'В каждый проект включено 30 дней бесплатного гарантийного сопровождения и мониторинга ошибок. В системе настроены алерты в отдельный технический Telegram-чат: о любых нештатных ситуациях становится известно до того, как они повлияют на бизнес.',
    },
    {
      id: 'preparation',
      question: 'Что нужно подготовить с моей стороны для старта?',
      answer:
        'Достаточно описать текущий процесс: где именно менеджеры тратят время, откуда приходят заявки и куда их нужно передавать. На бесплатном разборе я предложу оптимальную схему автоматизации, после чего мы подключим необходимые доступы.',
    },
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <section
      id="faq"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Вопросы и ответы</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink">
              Частые{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                вопросы
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Честно о ценообразовании, сроках внедрения, безопасности данных и гарантийной поддержке.
          </p>
        </div>

        {/* Clean Editorial Accordion List */}
        <div className="divide-y divide-line-dark border-b border-line-dark mt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="transition-colors duration-150">
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                  onClick={() => toggle(faq.id)}
                  onKeyDown={(e) => handleKeyDown(e, faq.id)}
                  className="w-full text-left py-6 sm:py-8 flex items-start justify-between gap-6 hover:text-blue transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                >
                  <div className="flex items-start gap-4 sm:gap-8 pt-0.5">
                    <span className="font-mono text-xs sm:text-sm text-ink/40 font-bold group-hover:text-blue transition-colors pt-1">
                      0{idx + 1}
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-ink group-hover:text-blue transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <span className="w-8 h-8 flex items-center justify-center border border-line-dark text-ink flex-shrink-0 group-hover:border-blue group-hover:text-blue transition-colors mt-0.5">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 sm:pl-16 pb-8 pt-1 text-ink/80 text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
