import React, { useState, useRef, useEffect } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Clock, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export const Comparison: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(95, Math.max(5, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <section className="bg-ink text-white py-20 sm:py-28 relative overflow-hidden" id="comparison">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          category="СРАВНЕНИЕ"
          titlePart1="Вручную или"
          titlePart2="кодом"
          subtitle="Наглядная разница на примере стандартной операционной задачи. Потяните слайдер, чтобы сравнить."
          align="center"
          className="mb-10 sm:mb-14"
        />

        {/* Interactive Before/After Split Comparison Slider */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full rounded-card-lg overflow-hidden border border-line select-none shadow-card-soft min-h-[380px] sm:min-h-[320px] bg-surface"
        >
          {/* Card 1: Left Side (Вручную) */}
          <div className="p-6 sm:p-10 flex flex-col justify-between h-full bg-[#11162B]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider bg-line/40 px-3 py-1 rounded-md">
                  ВАРИАНТ 1
                </span>
                <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center text-warning">
                  <AlertTriangle size={18} />
                </div>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
                Вручную
              </h3>

              <div className="flex flex-col gap-3 font-mono text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-slate-500" />
                  <span>помощник на 2 недели</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-warning font-bold">₽</span>
                  <span className="text-warning font-bold text-base">30 000 руб.</span>
                </div>
                <div className="flex items-center gap-2.5 text-warning">
                  <span>✕</span>
                  <span>ошибки на 30-й строчке</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-line text-xs font-mono text-slate-500">
              Высокий человеческий фактор и затраты
            </div>
          </div>

          {/* Card 2: Right Side Overlay (Парсер / Кодом) with clip-path */}
          <div
            className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between h-full bg-surface border-2 border-accent transition-all duration-75 shadow-glow-accent overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-accent-bright uppercase tracking-wider bg-accent/20 px-3 py-1 rounded-md border border-accent/30">
                  ВАРИАНТ 2
                </span>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-bright">
                  <Zap size={18} />
                </div>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
                Парсер
              </h3>

              <div className="flex flex-col gap-3 font-mono text-sm text-slate-200">
                <div className="flex items-center gap-2.5 text-accent-bright font-semibold">
                  <Clock size={16} />
                  <span className="text-accent-bright font-bold text-base">2 минуты</span>
                </div>
                <div className="flex items-center gap-2.5 text-white font-semibold">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>500 номеров</span>
                </div>
                <div className="flex items-center gap-2.5 text-success">
                  <span>✓</span>
                  <span>Чистая структурированная база</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-line text-xs font-mono text-accent-bright">
              Окупается с первого запуска
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="absolute top-0 bottom-0 w-1 bg-accent-bright cursor-ew-resize z-30 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-accent border-2 border-white shadow-glow-accent-lg flex items-center justify-center text-white text-xs font-bold -ml-[1px] select-none hover:scale-110 active:scale-95 transition-transform">
              ◀▶
            </div>
          </div>
        </div>

        {/* Mandatory Caption */}
        <p className="mt-8 text-center font-mono text-xs text-slate-400">
          Пример типовой задачи сбора базы компаний, реальный эффект зависит от сложности процесса.
        </p>
      </div>
    </section>
  );
};
