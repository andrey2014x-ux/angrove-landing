import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TelegramChatScene,
  WorkflowSimulationScene,
} from './services/ServiceScenes';

interface ServiceItem {
  num: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  roiMetric: string;
}

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [stageMode, setStageMode] = useState<'chat' | 'demo'>('chat');

  const services: ServiceItem[] = [
    {
      num: '01',
      title: 'AI-агенты',
      shortDesc: 'Отвечают клиентам в Telegram 24/7',
      fullDesc: 'Знают ваш прайс, правила и услуги, понимают опечатки и голосовые, сложный вопрос передают вам.',
      roiMetric: 'Эффект: ответ за 5 секунд 24/7, +30% к конверсии из обращения в заявку',
    },
    {
      num: '02',
      title: 'AI-обзвон',
      shortDesc: 'Звонки по согласованному сценарию',
      fullDesc: 'Обзвон и приём звонков силами AI по согласованному сценарию. Работает только с контактами, которые дали согласие.',
      roiMetric: 'Эффект: до 1000 звонков в час без выгорания менеджеров, фильтрация холодной базы',
    },
    {
      num: '03',
      title: 'Парсеры',
      shortDesc: 'Свежие списки компаний из открытых источников',
      fullDesc: 'Собирают свежие списки компаний и цены конкурентов из открытых источников: проверяют сайты, отсекают нецелевые, выгружают чистую таблицу.',
      roiMetric: 'Эффект: тысячи целевых контактов и цен конкурентов за минуты вместо недель ручного поиска',
    },
    {
      num: '04',
      title: 'Автоматизации',
      shortDesc: 'Сайт, таблицы и мессенджеры в одной цепочке',
      fullDesc: 'Цифровой диспетчер соединяет сайт, таблицы, CRM и мессенджеры: заявка попадает в таблицу, а вам приходит сообщение.',
      roiMetric: 'Эффект: 0 потерянных лидов, мгновенная синхронизация сайта, CRM, таблиц и мессенджеров',
    },
  ];

  const renderScene = (index: number) => {
    if (stageMode === 'chat') {
      return <TelegramChatScene activeTab={index} />;
    }
    return <WorkflowSimulationScene activeTab={index} />;
  };

  return (
    <section className="bg-[#0D0F14] text-white pt-20 sm:pt-28 relative overflow-hidden" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rubric - Clean standard font, 14-16px, regular case */}
        <div className="flex items-center gap-2.5 mb-4 text-sm sm:text-base font-medium text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-blue" aria-hidden="true" />
          <span>Что я собираю</span>
        </div>

        {/* Section Headline */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between pb-10 sm:pb-14 border-b border-white/10 gap-6">
          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white">
            Четыре вида <span className="font-serif italic font-normal text-blue-light">систем</span>
          </h2>
          
          <div className="text-left lg:text-right font-sans text-sm sm:text-base text-white/70 max-w-sm">
            <p className="font-medium text-white">Интерактивная витрина решений.</p>
            <p>Выберите услугу и протестируйте живой диалог с AI-ассистентом прямо в окне справа.</p>
          </div>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center pt-10">
          
          {/* Left Column: 4 Service Tabs */}
          <div className="lg:col-span-5 flex flex-col space-y-3" role="tablist" aria-label="Виды систем">
            {services.map((item, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  type="button"
                  key={item.num}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(idx)}
                  className={`p-5 rounded-2xl text-left cursor-pointer transition-all duration-150 select-none border relative overflow-hidden active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                    isActive
                      ? 'bg-blue text-white border-blue shadow-[0_8px_24px_rgba(61,92,255,0.25)] translate-x-1'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] text-white/80 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className={`font-display font-bold text-sm ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                      {item.num}
                    </span>
                    <span className="text-lg font-bold font-sans">
                      {isActive ? '↗' : '→'}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl tracking-tight mb-1 text-white">
                    {item.title}
                  </h3>

                  <p className={`text-xs font-sans leading-relaxed ${isActive ? 'text-white/95' : 'text-white/60'}`}>
                    {item.shortDesc}
                  </p>

                  {/* Business Effect (ROI Metric) */}
                  <div className={`mt-3 pt-2.5 border-t text-xs font-sans leading-snug flex items-start gap-2 ${
                    isActive ? 'border-white/20 text-white' : 'border-white/10 text-blue-light'
                  }`}>
                    <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/15">
                      ЭФФЕКТ
                    </span>
                    <span>{item.roiMetric.replace('Эффект: ', '')}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Large Interactive Stage ~600x640px */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="w-full max-w-[620px] h-[580px] bg-[#11131A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
              {/* Window Header Bar with Mode Toggle */}
              <div className="px-5 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>

                {/* Segmented Mode Controls */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setStageMode('chat')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue ${
                      stageMode === 'chat'
                        ? 'bg-blue text-white shadow-sm font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Диалог с AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageMode('demo')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue ${
                      stageMode === 'demo'
                        ? 'bg-blue text-white shadow-sm font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Схема работы
                  </button>
                </div>

                <div className="text-xs font-mono text-white/40 hidden sm:block">
                  {services[activeTab].title}
                </div>
              </div>

              {/* Animated Scene Content */}
              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${stageMode}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="w-full h-full"
                  >
                    {renderScene(activeTab)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden mt-6">
          {/* Mobile Segmented Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setStageMode('chat')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  stageMode === 'chat'
                    ? 'bg-blue text-white shadow-md font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Диалог с AI
              </button>
              <button
                type="button"
                onClick={() => setStageMode('demo')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  stageMode === 'demo'
                    ? 'bg-blue text-white shadow-md font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Схема работы
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-b border-white/10">
            {services.map((item, idx) => {
              const isExpanded = activeTab === idx;
              return (
                <div key={item.num} className="py-5">
                  <div
                    onClick={() => setActiveTab(isExpanded ? (idx === 0 ? 1 : 0) : idx)}
                    className="flex items-center justify-between cursor-pointer py-1"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-display font-bold text-sm text-white/40">
                        {item.num}
                      </span>
                      <h3 className="font-display font-black text-2xl text-white">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-2xl font-bold text-blue-light">
                      {isExpanded ? '↓' : '→'}
                    </span>
                  </div>

                  <p className="text-sm text-white/70 mt-1 mb-2">
                    {item.shortDesc}
                  </p>

                  {/* Mobile ROI Metric */}
                  <div className="mb-3 text-xs text-blue-light flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue/20 border border-blue/40">
                      ЭФФЕКТ
                    </span>
                    <span>{item.roiMetric.replace('Эффект: ', '')}</span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#11131A] shadow-xl"
                    >
                      <div className="h-[520px]">
                        {renderScene(idx)}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Wide Blue Leopard Stripe Divider at bottom of Services */}
      <div
        className="w-full h-12 sm:h-16 mt-16 sm:mt-24 bg-leopard border-t border-b border-black select-none"
        style={{
          backgroundSize: '180px 120px',
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />
    </section>
  );
};
