import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Send, Database, ShieldCheck, Webhook } from 'lucide-react';

export const PipelineDemo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1); // -1: idle, 0..3: active node, 4: done
  const [hasAutoPlayed, setHasAutoPlayed] = useState<boolean>(false);

  const startPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);

    // Sequence timeline
    setTimeout(() => {
      setActiveStep(1); // Node 1: Validation
    }, 700);

    setTimeout(() => {
      setActiveStep(2); // Node 2: Database
    }, 1500);

    setTimeout(() => {
      setActiveStep(3); // Node 3: Telegram
    }, 2300);

    setTimeout(() => {
      setActiveStep(4); // Finished
      setIsRunning(false);
    }, 3100);
  };

  // Auto-play once when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoPlayed) {
          setHasAutoPlayed(true);
          startPipeline();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAutoPlayed]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="bg-[#07080E] text-white py-20 sm:py-28 border-b border-white/10 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue/15 blur-[160px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Rubric */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-white/70">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Практика</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white">
              Как это выглядит{' '}
              <span className="font-serif italic font-normal text-blue-light">
                на деле
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/70 max-w-md font-sans leading-relaxed">
            Полноценный сценарий обработки входящих заявок. Без задержек, ручного копирования и потери клиентов.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-end gap-1.5 text-xs text-white/50 mb-3 pt-4">
          <span>Свайпните флоу</span>
          <span className="animate-pulse">→</span>
        </div>

        {/* n8n Editor Canvas Container */}
        <div className="mt-6 rounded-3xl border border-white/15 bg-[#090A13] shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden relative">
          
          {/* Header Bar of n8n Editor */}
          <div className="px-5 sm:px-7 py-4 bg-black/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>

              <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

              <span className="font-bold text-sm sm:text-base text-white/90">
                Заявки → таблица → Telegram
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                активен
              </span>
            </div>

            {/* Run Button */}
            <button
              onClick={startPipeline}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 select-none shadow-lg cursor-pointer ${
                isRunning
                  ? 'bg-blue/50 text-white/70 cursor-not-allowed'
                  : 'bg-blue hover:bg-blue-light text-white shadow-[0_0_20px_rgba(61,92,255,0.4)] hover:shadow-[0_0_25px_rgba(61,92,255,0.6)]'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Выполнение...</span>
                </>
              ) : activeStep >= 4 ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Запустить снова</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Запустить цепочку</span>
                </>
              )}
            </button>
          </div>

          {/* Canvas Scrollable Area (responsive on mobile) */}
          <div className="overflow-x-auto p-6 sm:p-10 relative">
            <div className="min-w-[880px] h-[380px] relative select-none">
              
              {/* Dot Grid Background */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1.2px, transparent 1.2px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* SVG Connecting Bezier Lines & Traveling Packets */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3D5CFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glowPacket" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Path 1: Node 0 -> Node 1 (Webhook -> Validate) */}
                <path
                  d="M 180 120 C 215 120, 240 120, 275 120"
                  fill="none"
                  stroke={activeStep >= 1 ? 'url(#lineGrad1)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="3"
                  strokeDasharray={activeStep < 1 ? '4 4' : 'none'}
                />

                {/* Path 2: Node 1 -> Node 2 (Validate -> Database) */}
                <path
                  d="M 465 120 C 500 120, 520 120, 555 120"
                  fill="none"
                  stroke={activeStep >= 2 ? 'url(#lineGrad2)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="3"
                  strokeDasharray={activeStep < 2 ? '4 4' : 'none'}
                />

                {/* Path 3: Node 2 -> Node 3 (Database -> Telegram) */}
                <path
                  d="M 745 120 C 780 120, 800 120, 835 120"
                  fill="none"
                  stroke={activeStep >= 3 ? 'url(#lineGrad3)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="3"
                  strokeDasharray={activeStep < 3 ? '4 4' : 'none'}
                />

                {/* Branch Down: Node 1 -> Node Down (Дубль: пропуск) */}
                <path
                  d="M 370 170 C 370 215, 370 220, 370 255"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Traveling packet from Node 0 to 1 */}
                {activeStep === 0 && (
                  <motion.circle
                    cx="180"
                    cy="120"
                    r="5"
                    fill="#3D5CFF"
                    filter="url(#glowPacket)"
                    animate={{ cx: [180, 275] }}
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                  />
                )}

                {/* Traveling packet from Node 1 to 2 */}
                {activeStep === 1 && (
                  <motion.circle
                    cx="465"
                    cy="120"
                    r="5"
                    fill="#A855F7"
                    filter="url(#glowPacket)"
                    animate={{ cx: [465, 555] }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                )}

                {/* Traveling packet from Node 2 to 3 */}
                {activeStep === 2 && (
                  <motion.circle
                    cx="745"
                    cy="120"
                    r="5"
                    fill="#10B981"
                    filter="url(#glowPacket)"
                    animate={{ cx: [745, 835] }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                )}
              </svg>

              {/* NODE 0: Webhook (Blue) */}
              <div
                className={`absolute left-0 top-[70px] w-[180px] p-4 rounded-[28px] border transition-all duration-300 z-20 ${
                  activeStep >= 0
                    ? 'bg-gradient-to-b from-blue/25 to-[#0F1328] border-blue shadow-[0_0_30px_rgba(61,92,255,0.4)]'
                    : 'bg-[#101322] border-white/10'
                }`}
              >
                {/* Connector Pin Right */}
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-blue" />

                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue/20 border border-blue/40 flex items-center justify-center text-blue-light">
                    <Webhook className="w-5 h-5" />
                  </div>
                  {activeStep >= 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue/20 text-blue-light text-[10px] font-mono font-bold">
                      0.0s ok
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white">Webhook</div>
                <div className="text-xs text-white/60">Заявка с сайта</div>
              </div>

              {/* NODE 1: Validation (Purple) */}
              <div
                className={`absolute left-[275px] top-[70px] w-[190px] p-4 rounded-[28px] border transition-all duration-300 z-20 ${
                  activeStep >= 1
                    ? 'bg-gradient-to-b from-purple-600/25 to-[#161226] border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                    : 'bg-[#101322] border-white/10'
                }`}
              >
                {/* Connector Pins Left & Right & Bottom */}
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-purple-500" />
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-purple-500" />
                <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-white/30" />

                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {activeStep >= 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                      0.5s ok
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white">Проверка данных</div>
                <div className="text-xs text-white/60">Форматирование & спам</div>
              </div>

              {/* BRANCH DOWN: Skip Duplicate (Gray) */}
              <div className="absolute left-[285px] top-[255px] w-[170px] p-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white/50 z-20">
                <span className="absolute left-1/2 -top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#090A13] border border-white/30" />
                <div className="text-xs font-semibold text-white/70">Дубль: пропуск</div>
                <div className="text-[11px] text-white/40">Остановить сценарий</div>
              </div>

              {/* NODE 2: Database (Green) */}
              <div
                className={`absolute left-[555px] top-[70px] w-[190px] p-4 rounded-[28px] border transition-all duration-300 z-20 ${
                  activeStep >= 2
                    ? 'bg-gradient-to-b from-emerald-600/25 to-[#0E1A16] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                    : 'bg-[#101322] border-white/10'
                }`}
              >
                {/* Connector Pins Left & Right */}
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-emerald-500" />
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-emerald-500" />

                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Database className="w-5 h-5" />
                  </div>
                  {activeStep >= 2 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      0.8s ok
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white">Запись в таблицу</div>
                <div className="text-xs text-white/60">Google Sheets / CRM</div>
              </div>

              {/* NODE 3: Telegram (Cyan) */}
              <div
                className={`absolute left-[835px] top-[70px] w-[180px] p-4 rounded-[28px] border transition-all duration-300 z-20 ${
                  activeStep >= 3
                    ? 'bg-gradient-to-b from-cyan-600/25 to-[#0D1822] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : 'bg-[#101322] border-white/10'
                }`}
              >
                {/* Connector Pin Left */}
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#090A13] border-2 border-cyan-400" />

                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 transition-transform ${
                      activeStep === 3 ? 'scale-110 animate-pulse' : ''
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </div>
                  {activeStep >= 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-mono font-bold">
                      1.1s ok
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white">Сообщение вам</div>
                <div className="text-xs text-white/60">Telegram-уведомление</div>
              </div>

              {/* Success Result Toast when complete */}
              <AnimatePresence>
                {activeStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-3 z-30 px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-3 backdrop-blur-md"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Новая заявка · успешно записано в таблицу за 1.1 с</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/80 font-mono text-xs">0 ошибок</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Caption footer */}
          <div className="px-6 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span>Иллюстрация типового сценария</span>
            <span className="font-mono">Скорость обработки: 1.1 с</span>
          </div>

        </div>

        {/* Integration Stack Badges */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/60 font-mono">
            Интегрирую с вашим привычным стеком:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              'Telegram API',
              'amoCRM',
              'Bitrix24',
              'Google Sheets',
              'МойСклад',
              'OpenAI / Claude',
              'Make / n8n',
              'Python',
              'Webhooks / REST API',
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white/80 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
