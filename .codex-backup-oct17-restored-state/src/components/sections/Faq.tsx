import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const Faq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FaqItem[] = [
    {
      id: 'timeline',
      question: 'Сколько времени занимает внедрение?',
      answer: 'Базовый парсер или простой сценарий Telegram-бота — 2–5 рабочих дней. Комплексная связка нескольких систем — от 1 до 3 недель в зависимости от задачи.',
    },
    {
      id: 'coding-skills',
      question: 'Нужно ли уметь программировать?',
      answer: 'Нет. Вы получаете полностью готовую работающую систему под ключ и короткую видеоинструкцию. Вам остаётся только пользоваться результатом.',
    },
    {
      id: 'legal',
      question: 'Это законно?',
      answer: 'Да. Сбор данных настраивается только из открытых общедоступных источников. Голосовые сценарии и рассылки запускаются строго по согласованной базе контактов с их предварительного согласия.',
    },
    {
      id: 'replace-manager',
      question: 'Заменит ли AI менеджера?',
      answer: 'AI забирает рутину: квалификацию лидов, ответы на типовые вопросы 24/7 и занесение данных в CRM. Менеджеры освобождают время для реальных продаж и ключевых клиентов.',
    },
    {
      id: 'requirements',
      question: 'Что нужно от меня?',
      answer: 'Описать текущий процесс и боль: где сейчас теряется время или заказы. Доступы к нужным сервисам подключаем по ходу работы.',
    },
    {
      id: 'data-storage',
      question: 'Где хранятся данные?',
      answer: 'На ваших собственных серверах, в вашей CRM или защищённых облачных сервисах. Конфиденциальные данные вашего бизнеса не передаются третьим лицам.',
    },
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-ink text-white py-20 sm:py-28 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          category="ВОПРОСЫ И ОТВЕТЫ"
          titlePart1="Частые"
          titlePart2="вопросы"
          subtitle="Коротко и по делу о том, как устроена работа и безопасность."
          align="center"
          className="mb-12 sm:mb-16"
        />

        {/* Accordion List with Spring Animation */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                animate={{
                  scale: isOpen ? 1.01 : 1,
                  y: isOpen ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`bg-surface/80 border rounded-2xl overflow-hidden transition-colors ${
                  isOpen ? 'border-accent shadow-card-soft' : 'border-line hover:border-accent/40'
                }`}
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-bold text-lg sm:text-xl text-white hover:text-accent-bright transition-colors focus-visible:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-accent text-white' : 'bg-line/50 text-slate-400'
                    }`}
                  >
                    <Plus size={18} />
                  </motion.div>
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
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-line/40 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
