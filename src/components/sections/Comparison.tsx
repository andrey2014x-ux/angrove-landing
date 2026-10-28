import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Comparison: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [manualProgress, setManualProgress] = useState<number>(100);
  const [codeProgress, setCodeProgress] = useState<number>(100);
  const [showErrorBadge, setShowErrorBadge] = useState<boolean>(true);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(true);
  const [hasAutoStarted, setHasAutoStarted] = useState<boolean>(false);

  const startRace = () => {
    if (isRacing) return;
    setIsRacing(true);
    setManualProgress(0);
    setCodeProgress(0);
    setShowErrorBadge(false);
    setShowSuccessBadge(false);

    // Code bar: finishes in ~1.1s
    const codeStartTime = performance.now();
    const codeAnim = () => {
      const now = performance.now();
      const elapsed = (now - codeStartTime) / 1100;
      if (elapsed < 1) {
        setCodeProgress(Math.min(100, Math.round(elapsed * 100)));
        requestAnimationFrame(codeAnim);
      } else {
        setCodeProgress(100);
        setShowSuccessBadge(true);
      }
    };
    requestAnimationFrame(codeAnim);

    // Manual bar: slowly crawls over 6.0s
    const manualStartTime = performance.now();
    const manualAnim = () => {
      const now = performance.now();
      const elapsed = (now - manualStartTime) / 6000;
      if (elapsed < 1) {
        const p = Math.min(100, Math.round(elapsed * 100));
        setManualProgress(p);
        if (p >= 42) {
          setShowErrorBadge(true);
        }
        requestAnimationFrame(manualAnim);
      } else {
        setManualProgress(100);
        setIsRacing(false);
      }
    };
    requestAnimationFrame(manualAnim);
  };

  // Auto-start race once on scroll into view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoStarted) {
          setHasAutoStarted(true);
          startRace();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAutoStarted]);

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Rubric */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Сравнение</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-ink">
              Вручную или{' '}
              <span className="font-serif italic font-normal text-blue">
                кодом
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm sm:text-base text-ink/75 max-w-sm font-sans leading-relaxed">
              Скорость, затраты и результат при выполнении одной типовой задачи.
            </p>

            <button
              onClick={startRace}
              disabled={isRacing}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-none font-bold text-sm transition-all duration-200 select-none shadow-md cursor-pointer ${
                isRacing
                  ? 'bg-ink/50 text-paper cursor-not-allowed'
                  : 'bg-ink text-paper hover:bg-blue hover:text-white'
              }`}
            >
              {isRacing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Гонка идёт...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Запустить сравнение</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* The Two Parallel Race Tracks */}
        <div className="py-10 space-y-8">
          
          {/* TRACK 1: Вручную (Slow, 6s) */}
          <div className="bg-white p-6 sm:p-8 border border-line-dark shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="font-display font-black text-xl sm:text-2xl text-ink">
                  Вручную
                </span>
                <span className="text-xs sm:text-sm text-ink/75 font-sans">
                  (ручной сбор данных менеджером)
                </span>
              </div>

              <div className="font-display font-black text-lg sm:text-xl text-ink/80 font-mono">
                2 недели · 30 000 руб.
              </div>
            </div>

            {/* Horizontal Track Container */}
            <div className="relative h-14 sm:h-16 bg-slate-100 border border-slate-300/80 rounded-xl overflow-hidden flex items-center p-1.5">
              {/* Progress Fill */}
              <div
                className="h-full bg-slate-300 rounded-lg transition-all ease-linear"
                style={{
                  width: `${manualProgress}%`,
                  transitionDuration: isRacing ? '80ms' : '0ms',
                }}
              />

              {/* Red Error Badge popping up mid-race */}
              <AnimatePresence>
                {showErrorBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/3 sm:left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>Ошибки на 30-й строчке</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Indicator inside */}
              <span className="absolute right-4 text-xs font-mono font-bold text-ink/75">
                {manualProgress}%
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-ink/60 mt-3 font-sans">
              <span>Монотонная рутина, усталость к вечеру</span>
              <span>Риск потери контактов</span>
            </div>
          </div>

          {/* TRACK 2: Кодом (Fast, 1.1s, Glowing Blue) */}
          <div className="bg-[#0A0C16] text-white p-6 sm:p-8 border border-blue/40 shadow-[0_12px_40px_rgba(61,92,255,0.15)] rounded-2xl relative overflow-hidden">
            {/* Ambient outer glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue/20 via-indigo-500/10 to-transparent blur-xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue" />
                </span>
                <span className="font-display font-black text-xl sm:text-2xl text-white">
                  Кодом
                </span>
                <span className="text-xs sm:text-sm text-blue-light font-sans">
                  (парсер + автоматизация)
                </span>
              </div>

              <div className="font-display font-black text-lg sm:text-xl text-blue-light font-mono">
                2 минуты · 500 номеров
              </div>
            </div>

            {/* Horizontal Track Container */}
            <div className="relative h-14 sm:h-16 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center p-1.5 z-10">
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-blue via-indigo-500 to-cyan-400 rounded-lg shadow-[0_0_25px_rgba(61,92,255,0.7)] transition-all ease-out"
                style={{
                  width: `${codeProgress}%`,
                  transitionDuration: isRacing ? '60ms' : '0ms',
                }}
              />

              {/* Green Success Badge */}
              <AnimatePresence>
                {showSuccessBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-4 z-20 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>500 компаний собрано</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center text-xs text-white/60 mt-3 font-sans relative z-10">
              <span>Скрипт работает без усталости и человеческого фактора</span>
              <span className="text-blue-light font-medium">Готовая таблица в CRM</span>
            </div>
          </div>

        </div>

        {/* Honest Footnote */}
        <div className="pt-4 border-t border-line-dark/40 text-xs sm:text-sm text-ink/60 font-sans">
          * Пример типовой задачи по поиску и проверке 500 целевых компаний из открытых реестров и каталогов.
        </div>

      </div>
    </section>
  );
};
