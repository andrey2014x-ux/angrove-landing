import React from 'react';

interface TrustSignal {
  id: string;
  metric: string;
  title: string;
  subtitle: string;
}

export const TrustBar: React.FC = () => {
  const signals: TrustSignal[] = [
    {
      id: 'experience',
      metric: '5+ лет',
      title: 'IT-инженерия',
      subtitle: 'Разработка архитектур и AI-систем',
    },
    {
      id: 'projects',
      metric: '50+',
      title: 'Внедрений в проде',
      subtitle: 'Боты, парсеры, интеграции баз данных',
    },
    {
      id: 'contract',
      metric: 'Договор',
      title: 'Фиксированная смета',
      subtitle: 'Без неожиданных доплат по ходу работ',
    },
    {
      id: 'warranty',
      metric: '30 дней',
      title: 'Гарантийная поддержка',
      subtitle: 'Мониторинг и устранение любых сбоев',
    },
    {
      id: 'sovereignty',
      metric: 'Zero lock-in',
      title: 'На ваших серверах',
      subtitle: 'Все данные и исходный код остаются у вас',
    },
  ];

  return (
    <section
      id="trust-bar"
      className="bg-paper border-b border-line-dark py-6 sm:py-8 overflow-hidden select-none"
      aria-label="Инженерные стандарты и гарантии"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-line-dark/20">
          {signals.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col justify-start pt-4 sm:pt-0 ${
                idx > 0 ? 'lg:pl-6' : ''
              } ${idx === 4 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="font-display font-black text-xl sm:text-2xl text-ink tracking-tight flex items-baseline gap-1.5">
                <span>{item.metric}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block mb-0.5" />
              </div>
              <div className="font-sans font-bold text-xs sm:text-sm text-ink mt-1">
                {item.title}
              </div>
              <div className="font-sans text-[11px] sm:text-xs text-ink/60 mt-0.5 leading-snug">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
