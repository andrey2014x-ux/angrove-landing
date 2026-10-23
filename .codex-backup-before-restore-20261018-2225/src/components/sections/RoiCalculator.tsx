import React, { useState, useId } from 'react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { Calculator, ArrowUpRight, TrendingUp, Clock, Coins } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(40);
  const [hourlyRate, setHourlyRate] = useState<number>(500);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [setupCost, setSetupCost] = useState<number>(45000);
  const [infraCost] = useState<number>(1500);

  const hoursId = useId();
  const rateId = useId();
  const teamId = useId();
  const setupId = useId();

  // Calculations
  const monthlyManualLoss = hoursPerMonth * hourlyRate * teamSize;
  const netMonthlySavings = Math.max(0, monthlyManualLoss - infraCost);
  const paybackMonths = netMonthlySavings > 0 ? (setupCost / netMonthlySavings).toFixed(1) : '—';
  const annualSavings = Math.max(0, netMonthlySavings * 12 - setupCost);
  const savedHoursTotal = hoursPerMonth * teamSize;

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value);
    trackGoal('roi_calculator_used');
  };

  const prefilledCalcText = encodeURIComponent(
    `Здравствуйте, Андрей! Сделал расчет на калькуляторе:\n— Рутина: ${hoursPerMonth} ч/мес на ${teamSize} сотрудников\n— Текущие потери: ${monthlyManualLoss.toLocaleString('ru-RU')} ₽/мес\n— Ожидаемая окупаемость: ${paybackMonths} мес.\n\nХочу обсудить автоматизацию.`
  );
  const telegramCalcUrl = `${config.telegramUrl}?text=${prefilledCalcText}`;

  return (
    <section
      id="calculator"
      className="bg-paper text-ink py-20 sm:py-28 border-b border-line-dark relative overflow-hidden"
      aria-label="Калькулятор окупаемости автоматизации"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-line-dark">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-sm sm:text-base font-medium text-ink">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" aria-hidden="true" />
              <span>Экономика внедрения</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-ink">
              Калькулятор{' '}
              <span className="font-serif italic font-normal text-blue lowercase">
                окупаемости
              </span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/75 max-w-md font-sans leading-relaxed">
            Посчитайте, сколько бизнес тратит на ручной труд сотрудников прямо сейчас и за какой срок инвестиции в код окупятся полностью.
          </p>
        </div>

        {/* 2-Column Grid: Sliders (Left) vs Real-time ROI Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 sm:pt-14 items-start">
          
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-line-dark shadow-sm">
            
            {/* Input 1: Hours */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor={hoursId} className="font-sans text-xs sm:text-sm font-bold text-ink uppercase tracking-wide">
                  Часов рутины на 1 сотрудника в месяц
                </label>
                <span className="font-display font-black text-xl sm:text-2xl text-blue">
                  {hoursPerMonth} ч/мес
                </span>
              </div>
              <input
                id={hoursId}
                type="range"
                min={10}
                max={120}
                step={5}
                value={hoursPerMonth}
                onChange={(e) => handleSliderChange(setHoursPerMonth, Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue"
              />
              <div className="flex justify-between text-[11px] font-mono text-ink/40 mt-1">
                <span>10 ч</span>
                <span>60 ч</span>
                <span>120 ч</span>
              </div>
            </div>

            {/* Input 2: Rate */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor={rateId} className="font-sans text-xs sm:text-sm font-bold text-ink uppercase tracking-wide">
                  Стоимость часа сотрудника (с налогами)
                </label>
                <span className="font-display font-black text-xl sm:text-2xl text-ink">
                  {hourlyRate.toLocaleString('ru-RU')} ₽/ч
                </span>
              </div>
              <input
                id={rateId}
                type="range"
                min={300}
                max={2000}
                step={50}
                value={hourlyRate}
                onChange={(e) => handleSliderChange(setHourlyRate, Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue"
              />
              <div className="flex justify-between text-[11px] font-mono text-ink/40 mt-1">
                <span>300 ₽</span>
                <span>1 000 ₽</span>
                <span>2 000 ₽</span>
              </div>
            </div>

            {/* Input 3: Team Size */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor={teamId} className="font-sans text-xs sm:text-sm font-bold text-ink uppercase tracking-wide">
                  Количество сотрудников на этой задаче
                </label>
                <span className="font-display font-black text-xl sm:text-2xl text-ink">
                  {teamSize} чел.
                </span>
              </div>
              <input
                id={teamId}
                type="range"
                min={1}
                max={10}
                step={1}
                value={teamSize}
                onChange={(e) => handleSliderChange(setTeamSize, Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue"
              />
              <div className="flex justify-between text-[11px] font-mono text-ink/40 mt-1">
                <span>1 чел</span>
                <span>5 чел</span>
                <span>10 чел</span>
              </div>
            </div>

            {/* Input 4: Estimated Setup Cost */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor={setupId} className="font-sans text-xs sm:text-sm font-bold text-ink uppercase tracking-wide">
                  Ориентировочный бюджет внедрения
                </label>
                <span className="font-display font-black text-xl sm:text-2xl text-ink font-mono">
                  {setupCost.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <input
                id={setupId}
                type="range"
                min={30000}
                max={120000}
                step={5000}
                value={setupCost}
                onChange={(e) => handleSliderChange(setSetupCost, Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue"
              />
              <div className="flex justify-between text-[11px] font-mono text-ink/40 mt-1">
                <span>30 000 ₽</span>
                <span>60 000 ₽</span>
                <span>120 000 ₽</span>
              </div>
            </div>

            {/* Infrastructure Note */}
            <div className="pt-2 text-[11px] font-mono text-ink/50 border-t border-slate-100 flex items-center justify-between">
              <span>Ежемесячные расходы на инфраструктуру (сервер / API):</span>
              <span className="font-bold text-ink/70">~{infraCost} ₽/мес</span>
            </div>
          </div>

          {/* Right Column: High-contrast Dark Result Plaque */}
          <div className="lg:col-span-5 bg-[#0A0C16] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue/15 blur-3xl rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-light" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    Результат расчета
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Честный расчет
                </span>
              </div>

              {/* Metric 1: Monthly Loss without automation */}
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1">
                  Текущие потери на ручном труде:
                </div>
                <div className="font-display font-black text-2xl sm:text-3xl text-red-400">
                  ~{monthlyManualLoss.toLocaleString('ru-RU')} ₽ / месяц
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Оплата ФОТ за монотонную работу, которую может делать скрипт
                </div>
              </div>

              {/* 2-Grid Key Payoff Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blue/10 border border-blue/20">
                  <div className="flex items-center gap-1.5 text-blue-light text-xs font-mono mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Срок окупаемости</span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-white">
                    {paybackMonths} {paybackMonths === '1.0' ? 'месяц' : 'мес.'}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">
                    Инвестиции возвращаются в бизнес
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-mono mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Экономия за 1-й год</span>
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
                    {annualSavings.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">
                    Чистая выгода за вычетом разработки
                  </div>
                </div>
              </div>

              {/* Saved hours badge */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-sans mb-6">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-300" />
                  <span className="text-white/80">Освобожденное время команды:</span>
                </div>
                <span className="font-mono font-bold text-cyan-300">
                  {savedHoursTotal} ч / месяц
                </span>
              </div>
            </div>

            {/* Action Button & Disclaimer */}
            <div>
              <a
                href={telegramCalcUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackGoal('telegram_outbound');
                }}
                className="w-full py-4 px-6 rounded-xl bg-blue hover:bg-blue-light text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2.5 shadow-lg shadow-blue/30"
              >
                <span>Обсудить окупаемость в Telegram</span>
                <ArrowUpRight size={16} />
              </a>

              <p className="text-[11px] font-mono text-white/40 text-center mt-3">
                * Расчёт ориентировочный и не является публичной офертой или коммерческим предложением
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
