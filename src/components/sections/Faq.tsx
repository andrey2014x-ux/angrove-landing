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
      id="faq"
      className="bg-paper text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-3">
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
            Коротко и честно о сроках, стоимости, безопасности и принципах внедрения.
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="divide-y divide-black/[0.06] border-b border-black/[0.06] mt-4">
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
                  className="w-full text-left py-6 sm:py-8 flex items-start justify-between gap-6 hover:text-blue transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
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
