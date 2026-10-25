import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, PhoneCall, CheckCircle2, User, Bot, MessageSquare } from 'lucide-react';
import transcriptData from '../../data/voice_call_transcript.json';

interface DialogReplica {
  id: number;
  speaker: string;
  name: string;
  roleBadge: string;
  text: string;
  startTime: number;
  endTime: number;
}

const BASE_HEIGHTS = [
  12, 18, 26, 20, 32, 28, 16, 30, 32, 22, 14, 24, 30, 18, 32, 26,
  16, 28, 32, 22, 14, 20, 30, 16, 24, 32, 18, 26, 22, 16, 20, 14
];

export const VoiceCallSimulator: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(transcriptData.duration || 104.8);
  const [isCompleted, setIsCompleted] = useState(false);

  const dialog: DialogReplica[] = transcriptData.dialog;

  // Find currently active replica based on audio playback time
  const activeReplica = dialog.find(
    (item) => currentTime >= item.startTime && currentTime < item.endTime
  );

  // 60 FPS audio visualizer & smooth playback loop
  useEffect(() => {
    let lastStateSync = 0;

    const tick = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const time = audioRef.current.currentTime;
        const now = performance.now();

        // Sync React state at ~20fps for responsive transcript & scrubber
        if (now - lastStateSync > 50) {
          setCurrentTime(time);
          lastStateSync = now;
        }

        // Check if anyone is speaking right now
        const isSpeaking = dialog.some(
          (item) => time >= item.startTime && time < item.endTime
        );

        // 60 FPS direct DOM update for equalizer bars
        const tSec = now / 1000;
        for (let i = 0; i < 32; i++) {
          const bar = barsRef.current[i];
          if (bar) {
            const baseH = BASE_HEIGHTS[i % 32];
            let dynamicH = 4;
            if (isSpeaking) {
              // Rich multi-harmonic wave simulation at 60 FPS
              const wave =
                0.45 +
                0.35 * Math.sin(tSec * 14 + i * 0.65) +
                0.2 * Math.cos(tSec * 24 - i * 0.85);
              dynamicH = Math.max(6, Math.min(32, Math.round(baseH * wave)));
            } else {
              // Gentle ambient breathing during pauses
              dynamicH = Math.max(3, Math.min(7, Math.round(baseH * 0.2 + Math.sin(tSec * 4 + i) * 1.5)));
            }
            bar.style.height = `${dynamicH}px`;
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Reset bars to calm state
      for (let i = 0; i < 32; i++) {
        const bar = barsRef.current[i];
        if (bar) {
          const baseH = BASE_HEIGHTS[i % 32];
          bar.style.height = `${Math.round(baseH * 0.35)}px`;
        }
      }
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, dialog]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isCompleted || currentTime >= duration - 0.5) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsCompleted(false);
      }
      audioRef.current.play().catch((err) => {
        console.warn('Audio play failed, user interaction needed:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleSeekReplica = (startTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = startTime;
    setCurrentTime(startTime);
    setIsCompleted(false);
    if (!isPlaying) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  // Scroll active replica smoothly into the center of the viewport
  useEffect(() => {
    if (activeLineRef.current && transcriptContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeReplica?.id]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#0E1621] rounded-3xl p-5 sm:p-6 text-white border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between font-sans select-none min-h-[540px]">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (e.currentTarget.duration) setDuration(e.currentTarget.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setIsCompleted(true);
          setCurrentTime(duration);
        }}
      >
        <source src="/audio/ai_call_dialog.mp3" type="audio/mpeg" />
        <source src="/audio/ai_call_dialog.m4a" type="audio/mp4" />
      </audio>

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Top Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">
              Запись реального звонка
            </div>
            <div className="text-[11px] text-[#798B9B]">
              Клиника «Дента» · Входящая заявка с сайта на профгигиену
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#798B9B] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-white/5"
            title="Сбросить запись на начало"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сначала</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Audio Wave & Controller */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121B26] border border-white/10 mb-4 relative z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all select-none shadow-lg cursor-pointer flex items-center gap-2 shrink-0 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_5px_15px_rgba(245,158,11,0.3)]'
                : 'bg-blue hover:bg-blue-dark text-white shadow-[0_5px_15px_rgba(61,92,255,0.4)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Пауза</span>
              </>
            ) : isCompleted ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Слушать еще раз</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Слушать диалог</span>
              </>
            )}
          </button>

          {/* Real-time Dynamic Speaker Indicator */}
          <div className="min-w-0 flex-1 text-right sm:text-left">
            {isPlaying && activeReplica ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border animate-fadeIn">
                <span
                  className={`w-2 h-2 rounded-full animate-ping ${
                    activeReplica.speaker === 'robot' ? 'bg-blue-light' : 'bg-amber-400'
                  }`}
                />
                <span className={activeReplica.speaker === 'robot' ? 'text-blue-light' : 'text-amber-300'}>
                  {activeReplica.speaker === 'robot' ? '● Говорит AI-администратор (Анна)' : '● Говорит клиент (Смирнов)'}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-[#798B9B] hidden sm:inline">
                {isCompleted ? 'Звонок завершен · Сделка закрыта' : 'Нажмите воспроизведение для запуска речи'}
              </span>
            )}
          </div>

          {/* Time display */}
          <div className="font-mono text-xs text-white/80 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Dynamic 60 FPS Equalizer Visualizer & Scrub Bar */}
        <div className="relative pt-1">
          {/* 32 Equalizer Bars running at 60 FPS */}
          <div className="flex items-center justify-between gap-1 h-8 mb-2 px-1">
            {Array.from({ length: 32 }).map((_, idx) => {
              const progressRatio = duration > 0 ? currentTime / duration : 0;
              const barProgress = idx / 32;
              const isPast = barProgress <= progressRatio;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    barsRef.current[idx] = el;
                  }}
                  className={`w-1 rounded-full transition-[background-color] duration-150 ${
                    isPast
                      ? activeReplica?.speaker === 'client'
                        ? 'bg-amber-400'
                        : 'bg-blue'
                      : 'bg-white/10'
                  }`}
                  style={{ height: `${Math.round(BASE_HEIGHTS[idx % 32] * 0.35)}px` }}
                />
              );
            })}
          </div>

          {/* Interactive Progress Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              handleSeekReplica(newTime);
            }}
            className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative"
          >
            <div
              className="h-full bg-blue rounded-full transition-all duration-75"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Live Synchronized Transcript Feed */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 mb-3">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#798B9B] mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-light" />
            <span>Синхронная транскрибация диалога:</span>
          </span>
          <span className="text-[10px] text-zinc-400 font-normal normal-case">
            Кликните на реплику для перемотки
          </span>
        </div>

        {/* Scrollable Transcript Box with generous padding so cards are NEVER cut off */}
        <div
          ref={transcriptContainerRef}
          className="space-y-3 h-[290px] overflow-y-auto px-1 py-3 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth"
        >
          {dialog.map((line) => {
            const isLineActive = activeReplica?.id === line.id;
            const isLinePassed = currentTime >= line.endTime;
            const isRobot = line.speaker === 'robot';

            return (
              <div
                key={line.id}
                ref={isLineActive ? activeLineRef : null}
                onClick={() => handleSeekReplica(line.startTime)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer scroll-my-4 ${
                  isLineActive
                    ? isRobot
                      ? 'bg-blue/20 border-blue text-white shadow-[0_0_20px_rgba(61,92,255,0.3)] ring-1 ring-blue/50 scale-[1.01]'
                      : 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50 scale-[1.01]'
                    : isLinePassed
                      ? 'bg-white/[0.04] border-white/10 text-white/90 hover:bg-white/[0.07]'
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isRobot
                          ? 'bg-blue/30 text-blue-light'
                          : 'bg-amber-500/30 text-amber-300'
                      }`}
                    >
                      {isRobot ? <Bot size={11} /> : <User size={11} />}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isLineActive
                          ? 'text-white'
                          : isRobot
                            ? 'text-blue-light/90'
                            : 'text-amber-300/90'
                      }`}
                    >
                      {line.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">
                    {formatTime(line.startTime)}
                  </span>
                </div>

                <div
                  className={`text-xs leading-relaxed pl-7 ${
                    isLineActive
                      ? 'text-white font-medium'
                      : isLinePassed
                        ? 'text-zinc-200'
                        : 'text-zinc-400'
                  }`}
                >
                  «{line.text}»
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Automated CRM Result Bottom Banner */}
      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 relative z-10 font-sans">
        <div className="flex items-center gap-2 text-zinc-200">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span>
            <strong>Итог звонка:</strong> запись на среду 19:00 внесена в YClients (акция 3 500 ₽, врач Смирнова)
          </span>
        </div>
        <span className="text-emerald-400 font-medium text-[11px] sm:text-right shrink-0">
          ✓ CRM и WhatsApp обновлены
        </span>
      </div>
    </div>
  );
};