import React, { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { CardSpotlight } from '../ui/CardSpotlight';
import { gsap } from '../../lib/motion';
import { Bot, PhoneCall, TableProperties, Workflow, CheckCircle2 } from 'lucide-react';

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Live Widget 1: Chat typing
  const [chatMsg, setChatMsg] = useState('Зависит от сайта...');
  useEffect(() => {
    const msgs = [
      'Зависит от сайта и объема.',
      'Базовый сбор — от 2 дней.',
      'AI обучен на вашем прайсе.',
      'Сложные вопросы передаю вам.',
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setChatMsg(msgs[i]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Live Widget 3: Parser progress & counter
  const [parserCount, setParserCount] = useState(120);
  useEffect(() => {
    const interval = setInterval(() => {
      setParserCount((prev) => (prev >= 500 ? 120 : prev + 38));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Horizontal Scroll Pin on Desktop
  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current;
        if (!track || !sectionRef.current) return;

        // Calculate horizontal travel distance
        const getScrollDistance = () => track.scrollWidth - window.innerWidth + 120;

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      id: 'ai-agents',
      title: 'AI-агенты',
      description:
        'Отвечают клиентам в Telegram 24/7. Знают ваш прайс, правила и услуги, понимают опечатки и голосовые, сложный вопрос передают вам.',
      tag: 'КЛИЕНТСКИЙ СЕРВИС 24/7',
      icon: <Bot size={22} className="text-accent-bright" />,
      uiMockup: (
        /* Иллюстрация кодом: Чат с клиентом + Живой ответ */
        <div className="bg-ink/80 rounded-xl p-3 border border-line text-[11px] font-mono flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-line/60 text-slate-400">
            <span>● Чат с клиентом</span>
            <span className="text-success text-[10px]">в сети</span>
          </div>
          <div className="bg-surface/90 rounded-lg p-2 text-slate-300 max-w-[85%] self-start">
            Сколько стоит внедрение парсера?
          </div>
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-2 text-white max-w-[88%] self-end flex items-center gap-1.5 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-ping flex-shrink-0" />
            <span className="truncate">{chatMsg}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-calling',
      title: 'AI-обзвон',
      description:
        'Обзвон и приём звонков силами AI по согласованному сценарию. Работает только с контактами, которые дали согласие.',
      tag: 'ТЕЛЕФОНИЯ БЕЗ ПАУЗ',
      icon: <PhoneCall size={22} className="text-accent-bright" />,
      uiMockup: (
        /* Иллюстрация кодом: Сценарий диалога + Пульсирующая звуковая волна */
        <div className="bg-ink/80 rounded-xl p-3 border border-line text-[11px] font-mono flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-line/60 text-slate-400">
            <span>Сценарий диалога</span>
            {/* Живой аудио-эквалайзер */}
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 bg-accent-bright rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-accent rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-ice rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
              <span className="w-1 bg-accent-bright rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Входящий звонок: +7 (9**) ***-12</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between bg-surface/70 p-1.5 rounded">
            <span>Статус:</span>
            <span className="text-success font-semibold">Согласие получено ✓</span>
          </div>
        </div>
      ),
    },
    {
      id: 'parsers',
      title: 'Парсеры',
      description:
        'Собирают свежие списки компаний и цены конкурентов из открытых источников: проверяют сайты, отсекают нецелевые, выгружают чистую таблицу.',
      tag: 'СБОР БАЗ И ЦЕН',
      icon: <TableProperties size={22} className="text-accent-bright" />,
      uiMockup: (
        /* Иллюстрация кодом: Живой прогресс-бар и счётчик */
        <div className="bg-ink/80 rounded-xl p-3 border border-line text-[11px] font-mono flex flex-col gap-1.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-line/60 text-slate-400">
            <span>Сбор базы</span>
            <span className="text-accent-bright font-bold">{parserCount} / 500</span>
          </div>
          {/* Animated Progress bar */}
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-bright transition-all duration-300"
              style={{ width: `${(parserCount / 500) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 font-semibold border-b border-line/40 pb-1 pt-1">
            <span>Компания</span>
            <span>Телефон</span>
            <span>Статус</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300">
            <span className="truncate">ООО Вектор</span>
            <span className="truncate">+7 999...</span>
            <span className="text-success">Целевой</span>
          </div>
        </div>
      ),
    },
    {
      id: 'automations',
      title: 'Автоматизации',
      description:
        'Цифровой диспетчер соединяет сайт, таблицы, CRM и мессенджеры: заявка попадает в таблицу, а вам приходит сообщение.',
      tag: 'БЕСШОВНАЯ СВЯЗКА',
      icon: <Workflow size={22} className="text-accent-bright" />,
      uiMockup: (
        /* Иллюстрация кодом: Пульсирующие узлы схемы */
        <div className="bg-ink/80 rounded-xl p-3 border border-line text-[11px] font-mono flex flex-col gap-1.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-line/60 text-slate-400">
            <span>Связка сервисов</span>
            <span className="text-success text-[10px]">активна</span>
          </div>
          <div className="flex items-center justify-between py-1 px-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] text-slate-300">Сайт</span>
            </div>
            <span className="text-accent-bright text-xs">──▶</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent-bright animate-pulse" />
              <span className="text-[10px] text-slate-300">CRM</span>
            </div>
            <span className="text-accent-bright text-xs">──▶</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] text-slate-300">Telegram</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-surface/80 p-1.5 rounded-lg text-slate-200 mt-1">
            <CheckCircle2 size={13} className="text-success flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-slate-400">CRM обновлена · Счёт отправлен</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section ref={sectionRef} className="bg-ink text-white py-20 sm:py-28 relative overflow-hidden" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <SectionHeading
          category="УСЛУГИ"
          titlePart1="Что я"
          titlePart2="собираю"
          subtitle="Решения, которые избавляют команду от рутины и работают стабильно без сбоев."
          align="left"
        />
      </div>

      {/* Desktop Horizontal Track & Mobile Vertical Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={trackRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-nowrap gap-6 sm:gap-8 items-stretch will-change-transform"
        >
          {services.map((service) => (
            <CardSpotlight
              key={service.id}
              className="bg-surface border border-line rounded-card-lg p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-accent hover:shadow-card-soft lg:w-[380px] lg:flex-shrink-0"
            >
              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center border border-accent/20 shadow-sm">
                    {service.icon}
                  </div>
                  <span className="font-mono text-[10px] font-bold text-accent-bright uppercase tracking-wider bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                    {service.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              {/* Code-drawn interactive UI mockup */}
              <div className="mt-4 pt-4 border-t border-line/50">{service.uiMockup}</div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
};
