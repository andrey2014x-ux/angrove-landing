import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, Send, CreditCard, Package, Flame, Check, ArrowDown, Zap } from 'lucide-react';

interface StepItem {
  id: number;
  number: string;
  title: string;
  service: string;
  desc: string;
  highlight: string;
  badgeIdle: string;
  badgeDone: string;
  icon: React.ReactNode;
  activeColor: string;
  borderColor: string;
  badgeDoneBg: string;
  connectorText: string;
}

export const BusinessMeshSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: idle, 1..4: steps active, 5: completed
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setShowTelegramModal(false);

    // Step 1: Site payment
    setTimeout(() => {
      setActiveStep(2); // Step 2: Warehouse
    }, 550);

    setTimeout(() => {
      setActiveStep(3); // Step 3: CRM
    }, 1100);

    setTimeout(() => {
      setActiveStep(4); // Step 4: Telegram
    }, 1650);

    setTimeout(() => {
      setActiveStep(5); // Completed & Show Telegram
      setShowTelegramModal(true);
      setIsRunning(false);
    }, 2200);
  };

  const resetSimulation = () => {
    setActiveStep(0);
    setShowTelegramModal(false);
    setIsRunning(false);
  };

  const steps: StepItem[] = [
    {
      id: 1,
      number: '1',
      title: 'Сайт и онлайн-касса',
      service: 'T-Касса / ЮKassa',
      desc: 'Оплата получена:',
      highlight: '+15 000 ₽ (чек в ОФД)',
      badgeIdle: 'Шаг 1 · Старт',
      badgeDone: '✓ Оплата получена',
      icon: <CreditCard className="w-4 h-4" />,
      activeColor: 'bg-blue/20 text-blue-light',
      borderColor: 'border-blue shadow-[0_0_20px_rgba(61,92,255,0.35)]',
      badgeDoneBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      connectorText: 'авто-передача данных на склад',
    },
    {
      id: 2,
      number: '2',
      title: 'Склад и учет товаров',
      service: 'МойСклад / 1С',
      desc: 'Списано со склада:',
      highlight: '-1 шт (остаток: 14)',
      badgeIdle: 'Шаг 2 · Склад',
      badgeDone: '✓ Остаток списан',
      icon: <Package className="w-4 h-4" />,
      activeColor: 'bg-amber-500/20 text-amber-300',
      borderColor: 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      badgeDoneBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      connectorText: 'авто-создание сделки в CRM',
    },
    {
      id: 3,
      number: '3',
      title: 'CRM-система',
      service: 'amoCRM / Битрикс24',
      desc: 'Сделка переведена:',
      highlight: '«Оплачено» + задача логисту',
      badgeIdle: 'Шаг 3 · CRM',
      badgeDone: '✓ Сделка закрыта',
      icon: <Flame className="w-4 h-4" />,
      activeColor: 'bg-purple-600/20 text-purple-300',
      borderColor: 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      badgeDoneBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      connectorText: 'мгновенная сводка владельцу',
    },
    {
      id: 4,
      number: '4',
      title: 'Telegram собственника',
      service: 'Мгновенный бот',
      desc: 'Отчет доставлен:',
      highlight: 'прибыль + маржа 56%',
      badgeIdle: 'Шаг 4 · Отчет',
      badgeDone: '✓ Отчет в Telegram',
      icon: <Send className="w-4 h-4" />,
      activeColor: 'bg-blue/25 text-blue-light',
      borderColor: 'border-blue-light shadow-[0_0_25px_rgba(61,92,255,0.45)]',
      badgeDoneBg: 'bg-blue/30 text-blue-light border-blue/40',
      connectorText: '',
    },
  ];

  return (
    <div className="bg-[#0E1621] rounded-3xl p-5 sm:p-6 text-white border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue/15 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue/20 text-blue-light flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-blue-light" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Синхронизация сервисов в реальном времени</span>
            </div>
            <div className="text-[11px] text-[#798B9B]">
              Как 4 разные программы обмениваются данными без участия человека
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            1.2 сек вместо 20 мин
          </span>
        </div>
      </div>

      {/* 2. Interactive Trigger Button */}
      <div className="mb-4 relative z-10">
        <button
          type="button"
          onClick={activeStep >= 5 ? resetSimulation : startSimulation}
          disabled={isRunning}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 select-none shadow-lg cursor-pointer flex items-center justify-center gap-2.5 ${
            isRunning
              ? 'bg-blue/50 text-white/70 cursor-not-allowed'
              : activeStep >= 5
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                : 'bg-blue hover:bg-blue-dark text-white shadow-[0_10px_25px_rgba(61,92,255,0.4)] hover:shadow-[0_15px_35px_rgba(61,92,255,0.6)] hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-white" />
              <span>Выполняется авто-процесс: шаг {activeStep} из 4...</span>
            </>
          ) : activeStep >= 5 ? (
            <>
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Проверить авто-процесс ещё раз</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Нажмите: «Клиент оплатил заказ на 15 000 ₽»</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Vertical Pipeline Stepper (Zero overlap, 100% readable) */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-[#121B26] border border-white/10 mb-3 space-y-2.5">
        {steps.map((step, idx) => {
          const isCurrentActive = activeStep === step.id;
          const isHighlighted = activeStep >= step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Card Row */}
              <motion.div
                animate={{
                  scale: isCurrentActive ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isHighlighted
                    ? `${step.activeColor} ${step.borderColor}`
                    : 'bg-white/[0.02] border-white/5 text-zinc-400'
                }`}
              >
                {/* Left: Icon & Step Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isHighlighted
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'bg-white/5 text-zinc-500'
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs sm:text-sm truncate ${isHighlighted ? 'text-white' : 'text-zinc-300'}`}>
                        {step.number}. {step.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 hidden md:inline">
                        ({step.service})
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {step.desc}{' '}
                      <strong className={`font-semibold ${isHighlighted ? 'text-white' : 'text-zinc-300'}`}>
                        {step.highlight}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div className="shrink-0">
                  <span
                    className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap border transition-all duration-300 ${
                      isHighlighted
                        ? step.badgeDoneBg
                        : 'bg-white/5 text-zinc-500 border-white/5'
                    }`}
                  >
                    {isHighlighted ? step.badgeDone : step.badgeIdle}
                  </span>
                </div>
              </motion.div>

              {/* Clean, Non-Overlapping Connecting Flow Indicator */}
              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center py-0.5">
                  <div
                    className={`px-3 py-0.5 rounded-full border text-[10px] font-medium flex items-center gap-1.5 transition-all duration-300 ${
                      activeStep > step.id
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : activeStep === step.id
                          ? 'bg-blue/30 border-blue text-white shadow-[0_0_12px_rgba(61,92,255,0.5)] animate-pulse'
                          : 'bg-white/[0.02] border-white/5 text-zinc-500'
                    }`}
                  >
                    <ArrowDown size={10} className={activeStep === step.id ? 'animate-bounce text-blue-light' : ''} />
                    <span>{step.connectorText}</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 4. Realistic Telegram Pop-Up Message */}
      <AnimatePresence>
        {showTelegramModal && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-[#17212B] border border-blue/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-20 text-white"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center text-white">
                  <Send size={10} />
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>_angrove_ бот</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-blue/30 text-blue-light font-mono font-medium">BOT</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400">только что</span>
            </div>

            {/* Content Body (Authentic Telegram Bot Markdown style) */}
            <div className="text-xs space-y-1.5 font-sans leading-relaxed pt-0.5">
              <div className="font-bold text-white text-xs sm:text-[13px] flex items-center gap-1.5">
                <span>⚡️</span>
                <span>Новая оплата заказа #5812</span>
              </div>
              <div className="text-zinc-200 text-xs">
                💰 <b>Чек:</b> <span className="font-semibold text-white">15 000 ₽</span> · <b>Маржа:</b> <span className="font-semibold text-emerald-400">+8 400 ₽ (56%)</span>
              </div>
              <div className="text-zinc-300 text-[11px]">
                📦 <b>МойСклад:</b> списано 1 шт (остаток: 14)
              </div>
              <div className="text-zinc-300 text-[11px]">
                📊 <b>amoCRM:</b> сделка «Оплачено», задача курьеру создана
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400 pt-1.5 font-mono">
              <span>12:44:02</span>
              <span className="text-blue-light font-bold flex">
                <Check size={11} className="-mr-1.5" />
                <Check size={11} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Business Value Comparison Footer */}
      <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 relative z-10 font-sans">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span><strong>1.2 секунды</strong> на всю цепочку без единого клика сотрудников</span>
        </div>
        <span className="text-emerald-400 font-medium text-[11px] sm:text-right shrink-0">
          0 ручных переносов · 0 ошибок
        </span>
      </div>
    </div>
  );
};
