import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const Faq: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.06 });

  const [openId, setOpenId] = useState<string | null>('cost');

  const faqs: FaqItem[] = [
    {
      id: 'cost',
      question: 'Сколько это стоит?',
      answer: 'Каждая задача индивидуальна, но есть понятные ориентиры: точечный парсер — от 15 000 ₽, сценарий Telegram-бота или базовая интеграция — от 30 000 ₽, умный AI-агент под ключ — от 50 000 ₽. Точную смету и срок фиксируем до начала работ по итогам бесплатного разбора.',
    },
    {
      id: 'timeline',
      question: 'Сколько времени занимает внедрение?',
      answer: 'Базовый парсер или типовой сценарий Telegram-бота — 2–5 рабочих дней. Комплексная связка нескольких систем с CRM и AI-агентом — от 1 до 3 недель в зависимости от сложности логики.',
    },
    {
      id: 'coding-skills',
      question: 'Нужно ли мне уметь программировать?',
      answer: 'Нет. Вы получаете полностью готовую работающую систему под ключ и понятную видеоинструкцию. Вам и вашим сотрудникам остаётся только пользоваться результатом.',
    },
    {
      id: 'legal',
      question: 'Это законно?',
      answer: 'Да. Сбор данных настраивается исключительно из открытых общедоступных источников. Рассылки и коммуникации запускаются строго в рамках законодательства и по согласованным базам контактов.',
    },
    {
      id: 'replace-manager',
      question: 'Заменит ли AI живого сотрудника?',
      answer: 'AI забирает монотонную механическую работу: первичную квалификацию входящих контактов, ответы на повторяющиеся типовые вопросы в любое время суток и занесение данных в таблицы. Менеджеры освобождают время для реальных переговоров и закрытия сделок.',
    },
    {
      id: 'requirements',
      question: 'Что нужно подготовить с моей стороны?',
      answer: 'Только описать текущую проблему: где сейчас теряются заявки и клиенты, сколько времени уходит на рутину и какой результат вы хотите получить. Доступы к рабочим сервисам подключаем по ходу настройки.',
    },
    {
      id: 'data-storage',
      question: 'Где хранятся мои данные и базы клиентов?',
      answer: 'На ваших собственных серверах, в вашей CRM или защищённых облачных хранилищах. Конфиденциальные данные вашего бизнеса никогда не передаются сторонним сервисам.',
    },
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <WordReveal
              as="h2"
              text="Частые вопросы и ответы"
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink"
              highlightWords={{ вопросы: 'font-serif italic font-normal text-blue lowercase' }}
            />
          </div>
          <p data-reveal="desc" className="text-xs sm:text-sm text-ink/85 max-w-md font-sans leading-relaxed bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-black/[0.06] shadow-xs">
            Коротко и честно о сроках, стоимости, безопасности и принципах внедрения.
          </p>
        </div>

        {/* Clean Accordion Cards List */}
        <div className="space-y-3.5 mt-8 max-w-4xl">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                data-reveal="card"
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-black/15 shadow-md'
                    : 'bg-white border-black/[0.06] shadow-sm hover:border-black/20 hover:bg-zinc-50/50'
                }`}
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-6 sm:p-7 flex items-start justify-between gap-6 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                >
                  <div className="flex items-start gap-4 sm:gap-6 pt-0.5">
                    <span className="font-mono text-xs sm:text-sm text-blue font-bold pt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-tight text-ink group-hover:text-blue transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                    isOpen ? 'bg-blue text-white' : 'bg-zinc-100 text-ink/70 group-hover:bg-blue/10 group-hover:text-blue'
                  }`}>
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
                      <div className="pl-6 sm:pl-14 pr-6 pb-6 text-ink/80 text-sm sm:text-base leading-relaxed font-sans border-t border-black/[0.04] pt-4">
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
