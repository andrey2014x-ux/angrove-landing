import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, Send, CreditCard, Package, Flame, Sparkles, Check, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';

export const BusinessMeshSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: idle, 1..4: nodes active, 5: completed
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setShowTelegramModal(false);

    // Step 1: Webhook (Site)
    setTimeout(() => {
      setActiveStep(2); // Step 2: MoySklad
    }, 550);

    setTimeout(() => {
      setActiveStep(3); // Step 3: amoCRM
    }, 1100);

    setTimeout(() => {
      setActiveStep(4); // Step 4: Telegram Node
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

  return (
    <div className="bg-[#0A0C16] rounded-3xl p-5 sm:p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Editor Header Bar (n8n style) */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
          </div>
          <span className="text-xs font-mono font-bold text-white/90 ml-1">n8n_flow: order_pipeline</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE
          </span>
        </div>
      </div>

      {/* Trigger CTA Button */}
      <div className="mb-4 relative z-10">
        <button
          type="button"
          onClick={activeStep >= 5 ? resetSimulation : startSimulation}
          disabled={isRunning}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 select-none shadow-lg cursor-pointer flex items-center justify-center gap-2.5 ${
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
              <span>Выполняется цепочка: шаг {activeStep} из 4...</span>
            </>
          ) : activeStep >= 5 ? (
            <>
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Сымитировать оплату ещё раз</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Нажмите: «Сымитировать оплату клиентом 15 000 ₽»</span>
            </>
          )}
        </button>
      </div>

      {/* 2x2 Serpentine n8n Workflow Canvas */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-sm mb-3">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Dynamic Nodes Grid with Connectors */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Connector 1 -> 2 (Desktop Horizontal Beam) */}
          <div className="hidden sm:flex absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className={`px-1.5 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1 transition-all duration-300 ${
              activeStep >= 2
                ? 'bg-blue/30 border-blue text-white shadow-[0_0_15px_rgba(61,92,255,0.8)]'
                : 'bg-black/60 border-white/20 text-white/40'
            }`}>
              <span>JSON</span>
              <ArrowRight size={10} className={activeStep === 1 ? 'animate-pulse text-blue' : ''} />
            </div>
          </div>

          {/* Connector 2 -> 3 (Desktop Vertical Beam Right) */}
          <div className="hidden sm:flex absolute right-[25%] top-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className={`px-1 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1 transition-all duration-300 ${
              activeStep >= 3
                ? 'bg-amber-500/30 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                : 'bg-black/60 border-white/20 text-white/40'
            }`}>
              <ArrowDown size={10} className={activeStep === 2 ? 'animate-pulse text-amber-400' : ''} />
            </div>
          </div>

          {/* Connector 3 -> 4 (Desktop Horizontal Beam Bottom) */}
          <div className="hidden sm:flex absolute left-1/2 top-[76%] -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className={`px-1.5 py-0.5 rounded-full border text-[9px] font-mono font-bold flex items-center gap-1 transition-all duration-300 ${
              activeStep >= 4
                ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)]'
                : 'bg-black/60 border-white/20 text-white/40'
            }`}>
              <ArrowLeft size={10} className={activeStep === 3 ? 'animate-pulse text-purple-400' : ''} />
              <span>HOOK</span>
            </div>
          </div>

          {/* NODE 1: Webhook (Site) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              activeStep >= 1
                ? 'bg-blue/20 border-blue shadow-[0_0_25px_rgba(61,92,255,0.35)] ring-1 ring-blue/50'
                : 'bg-white/[0.03] border-white/10 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  activeStep >= 1 ? 'bg-blue text-white shadow-md' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeStep >= 1 ? 'bg-blue/30 text-blue-light border border-blue/40' : 'bg-white/5 text-zinc-500'
                }`}
              >
                {activeStep >= 1 ? '0.0s ✓ 200' : 'Webhook'}
              </span>
            </div>

            <div className={`font-bold text-xs ${activeStep >= 1 ? 'text-white' : 'text-zinc-300'}`}>
              1. Сайт: Оплата заказа
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Получено: <span className="font-semibold text-emerald-400">+15 000 ₽</span>
            </div>
          </div>

          {/* NODE 2: MoySklad */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative ${
              activeStep >= 2
                ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50'
                : 'bg-white/[0.03] border-white/10 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  activeStep >= 2 ? 'bg-amber-500 text-black shadow-md' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeStep >= 2 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-zinc-500'
                }`}
              >
                {activeStep >= 2 ? '0.4s ✓ Склад' : 'МойСклад API'}
              </span>
            </div>

            <div className={`font-bold text-xs ${activeStep >= 2 ? 'text-white' : 'text-zinc-300'}`}>
              2. Склад МойСклад
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Списано: <span className="font-semibold text-amber-300">-1 шт</span> (остаток 14)
            </div>
          </div>

          {/* NODE 4: Telegram (Bottom Left in desktop serpentine) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative sm:order-3 ${
              activeStep >= 4
                ? 'bg-blue/25 border-blue-light shadow-[0_0_30px_rgba(61,92,255,0.5)] ring-1 ring-blue-light/50'
                : 'bg-white/[0.03] border-white/10 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  activeStep >= 4 ? 'bg-blue text-white shadow-md animate-pulse' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeStep >= 4 ? 'bg-blue/40 text-white border border-blue' : 'bg-white/5 text-zinc-500'
                }`}
              >
                {activeStep >= 4 ? '1.2s ✓ Push' : 'Telegram Bot'}
              </span>
            </div>

            <div className={`font-bold text-xs ${activeStep >= 4 ? 'text-white' : 'text-zinc-300'}`}>
              4. Telegram собственника
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Сводка: <span className="font-semibold text-blue-light">чек + маржа</span>
            </div>
          </div>

          {/* NODE 3: amoCRM (Bottom Right in desktop serpentine) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 relative sm:order-4 ${
              activeStep >= 3
                ? 'bg-purple-600/20 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/50'
                : 'bg-white/[0.03] border-white/10 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  activeStep >= 3 ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeStep >= 3 ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' : 'bg-white/5 text-zinc-500'
                }`}
              >
                {activeStep >= 3 ? '0.8s ✓ amoCRM' : 'amoCRM Deals'}
              </span>
            </div>

            <div className={`font-bold text-xs ${activeStep >= 3 ? 'text-white' : 'text-zinc-300'}`}>
              3. amoCRM воронка
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Статус: <span className="font-semibold text-purple-300">«Оплачено»</span>
            </div>
          </div>

        </div>
      </div>

      {/* ANIMATED TELEGRAM NOTIFICATION MESSAGE (Springs up on step 4/5) */}
      <AnimatePresence>
        {showTelegramModal && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="mb-3 p-3.5 sm:p-4 rounded-2xl bg-[#17212B] border border-blue/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-20 text-white"
          >
            {/* Telegram message top bar */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue flex items-center justify-center text-white">
                  <Send size={10} />
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>_angrove_ бот</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-blue/30 text-blue-light font-mono font-medium">BOT</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">только что</span>
            </div>

            {/* Telegram Message Content Body */}
            <div className="text-xs space-y-0.5 font-sans leading-relaxed">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Новая оплата заказа #5812</span>
              </div>
              <div className="text-zinc-200 text-[11px]">
                💰 Сумма: <span className="font-bold text-white">15 000 ₽</span> · Маржа: <span className="font-bold text-emerald-400">+8 400 ₽ (56%)</span>
              </div>
              <div className="text-zinc-400 text-[10px] pt-0.5">
                ⚡️ <span className="text-zinc-300">МойСклад:</span> остаток списан (-1 шт)
              </div>
              <div className="text-zinc-400 text-[10px]">
                ⚡️ <span className="text-zinc-300">amoCRM:</span> сделка переведена в «Оплачено»
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400 pt-1 font-mono">
              <span>12:44:02</span>
              <span className="text-blue-light font-bold flex">
                <Check size={11} className="-mr-1.5" />
                <Check size={11} />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed & Autonomy Stat Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2.5 border-t border-white/10 text-[11px] text-zinc-400 relative z-10 font-sans">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
          <span>Всё произошло за 1.2 секунды. Ни один менеджер не отвлекался.</span>
        </div>
        <span className="text-white/40 font-mono text-[10px] sm:text-right shrink-0">0 ошибок · 100% автономия</span>
      </div>
    </div>
  );
};
