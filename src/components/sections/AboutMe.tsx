import React, { useRef } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { ArrowUpRight, ShieldCheck, Terminal, Compass } from 'lucide-react';
import { WordReveal } from '../ui/WordReveal';
import { useSectionReveal } from '../../lib/useScrollAnimation';

export const AboutMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { cardStagger: 0.1 });

  const handleTelegramClick = () => {
    trackGoal('click_telegram');
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-transparent text-ink py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/[0.06] mb-10">
          <div>
            <div data-reveal="badge" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-bold mb-3">
              <span>Личный бренд · Разработка под ключ</span>
            </div>
            <WordReveal
              as="h2"
              text="Инженерный подход вместо теории"
              className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink"
              highlightWords={{ вместо: 'font-serif italic font-normal text-blue lowercase', теории: 'font-serif italic font-normal text-blue lowercase' }}
            />
          </div>
          <p data-reveal="desc" className="text-xs sm:text-sm text-ink/70 max-w-md font-sans leading-relaxed">
            Прямой контакт с автором системы без менеджеров и перекладывания ответственности.
          </p>
        </div>

        {/* 2-Column Creator Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Andrey's Photo in rounded-3xl with Soft Glow */}
          <div data-reveal="card" className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] rounded-3xl overflow-hidden bg-zinc-900 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative aspect-[4/5]">
              <img
                src="/andrey.jpg"
                alt="Андрей — Архитектор систем"
                className="w-full h-full object-cover object-top select-none"
                loading="lazy"
                width={380}
                height={475}
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0A0C16]/80 backdrop-blur-md border border-white/10 text-white shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-blue-light font-bold">АНДРЕЙ · _ANGROVE_</div>
                  <div className="text-sm font-bold text-white mt-0.5">Архитектор цифровых систем</div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Right: Principles & Direct Value */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div data-reveal="desc" className="bg-white rounded-2xl p-6 sm:p-8 border border-black/[0.06] shadow-sm mb-8">
              <p className="font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
                «Я не продаю часы и не держу штат стажеров. Проектирую и пишу код сам: от схемы базы данных до развертывания на вашем сервере. Вы получаете работающий инструмент и прямую личную ответственность за результат.»
              </p>
            </div>

            {/* 3 Principles Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div data-reveal="card" className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
                <ShieldCheck className="w-5 h-5 text-blue mb-2.5" />
                <div className="font-bold text-sm text-ink mb-1">Фиксированная смета</div>
                <div className="text-xs text-ink/65 leading-relaxed">
                  Итоговая стоимость и срок утверждаются до старта и не растут.
                </div>
              </div>

              <div data-reveal="card" className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
                <Terminal className="w-5 h-5 text-blue mb-2.5" />
                <div className="font-bold text-sm text-ink mb-1">Чистый исходный код</div>
                <div className="text-xs text-ink/65 leading-relaxed">
                  100% прав на репозиторий Git и сервисы передаются вам.
                </div>
              </div>

              <div data-reveal="card" className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
                <Compass className="w-5 h-5 text-blue mb-2.5" />
                <div className="font-bold text-sm text-ink mb-1">14 дней гарантии</div>
                <div className="text-xs text-ink/65 leading-relaxed">
                  Бесплатный мониторинг и поддержка после запуска в боевой режим.
                </div>
              </div>
            </div>

            <div data-reveal="stage">
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTelegramClick}
                className="group inline-flex items-center gap-2.5 bg-blue text-white rounded-full px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_10px_25px_rgba(61,92,255,0.35)] hover:shadow-[0_12px_30px_rgba(61,92,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all select-none cursor-pointer"
              >
                <span>Написать Андрею напрямую</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
