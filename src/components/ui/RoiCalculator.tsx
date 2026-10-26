import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Zap, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface RoiCalculatorProps {
  className?: string;
  sourceContext?: string;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ className = '', sourceContext = 'Калькулятор ROI' }) => {
  const [employees, setEmployees] = useState<number>(5);
  const [routineHours, setRoutineHours] = useState<number>(2.5);
  const [avgSalary, setAvgSalary] = useState<number>(85000);

  // 21 working days per month, 8 hours per day = 168 hours
  const monthlyStats = useMemo(() => {
    const workingDays = 21;
    const workingHoursPerMonth = workingDays * 8;
    const hourlyRate = avgSalary / workingHoursPerMonth;

    // Monthly routine hours across team
    const totalRoutineHours = Math.round(employees * routineHours * workingDays);

    // Direct monthly salary cost spent on routine
    const directLossMonthly = Math.round(totalRoutineHours * hourlyRate);

    // Annual loss
    const annualLoss = directLossMonthly * 12;

    // Projected savings with 75% automation
    const potentialMonthlySavings = Math.round(directLossMonthly * 0.75);
    const potentialAnnualSavings = potentialMonthlySavings * 12;

    // Hours freed per month
    const hoursSavedPerMonth = Math.round(totalRoutineHours * 0.75);

    return {
      totalRoutineHours,
      directLossMonthly,
      annualLoss,
      potentialMonthlySavings,
      potentialAnnualSavings,
      hoursSavedPerMonth,
    };
  }, [employees, routineHours, avgSalary]);

  const telegramMessage = useMemo(() => {
    const text = `Привет, Андрей! Рассчитал на сайте потери на рутине (${sourceContext}):
- Сотрудников: ${employees} чел.
- Рутины: ${routineHours} ч/день на сотрудника
- Потери: ~${monthlyStats.directLossMonthly.toLocaleString('ru-RU')} ₽/мес
Хочу автоматизировать процессы и сэкономить время команды.`;
    return encodeURIComponent(text);
  }, [employees, routineHours, monthlyStats.directLossMonthly, sourceContext]);

  return (
    <section className={`rounded-3xl border border-line bg-surface/90 backdrop-blur-xl p-6 sm:p-10 text-white relative overflow-hidden ${className}`}>
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="relative z-10 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent-bright font-mono text-xs uppercase tracking-wider mb-3">
          <Calculator size={14} />
          <span>Интерактивный аудит</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
          Сколько бизнес <span className="font-serif italic font-normal text-accent-bright">теряет на рутине</span> прямо сейчас?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Передвижение сделок, копирование данных между CRM и таблицами, ответы на типовые вопросы клиентов — скрытый налог на ваш бизнес.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-stretch">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Employees */}
          <div className="p-4 sm:p-5 rounded-2xl bg-paper/60 border border-line/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Сотрудников в операционке и продажах
              </label>
              <span className="font-mono font-bold text-accent-bright text-base sm:text-lg">
                {employees} чел.
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="w-full accent-accent-bright cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>1 чел.</span>
              <span>20 чел.</span>
              <span>40 чел.</span>
            </div>
          </div>

          {/* Slider 2: Routine hours per day */}
          <div className="p-4 sm:p-5 rounded-2xl bg-paper/60 border border-line/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Часов рутины в день на сотрудника
              </label>
              <span className="font-mono font-bold text-accent-bright text-base sm:text-lg">
                {routineHours} ч / день
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={routineHours}
              onChange={(e) => setRoutineHours(Number(e.target.value))}
              className="w-full accent-accent-bright cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>30 мин</span>
              <span>3 часа</span>
              <span>6 часов</span>
            </div>
          </div>

          {/* Slider 3: Average salary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-paper/60 border border-line/60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">
                Средняя зарплата сотрудника (с налогами)
              </label>
              <span className="font-mono font-bold text-accent-bright text-base sm:text-lg">
                {avgSalary.toLocaleString('ru-RU')} ₽ / мес
              </span>
            </div>
            <input
              type="range"
              min="40000"
              max="250000"
              step="5000"
              value={avgSalary}
              onChange={(e) => setAvgSalary(Number(e.target.value))}
              className="w-full accent-accent-bright cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>40 000 ₽</span>
              <span>120 000 ₽</span>
              <span>250 000 ₽</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-paper to-surface border border-accent/30 shadow-2xl relative">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                <AlertCircle size={14} />
                Текущие прямые потери
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                {monthlyStats.directLossMonthly.toLocaleString('ru-RU')} ₽
                <span className="text-sm font-sans font-normal text-slate-400 block sm:inline sm:ml-2">/ месяц</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Это ≈ <strong className="text-slate-200">{monthlyStats.annualLoss.toLocaleString('ru-RU')} ₽ в год</strong>, выплаченных за механические действия.
              </p>
            </div>

            <div className="pt-4 border-t border-line/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-emerald-400" />
                  Экономия после автоматизации:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  +{monthlyStats.potentialMonthlySavings.toLocaleString('ru-RU')} ₽/мес
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock size={16} className="text-accent-bright" />
                  Высвобождаем часов для продаж:
                </span>
                <span className="font-mono font-bold text-accent-bright">
                  ~{monthlyStats.hoursSavedPerMonth} ч / мес
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line/60">
            <a
              href={`https://t.me/angrove?text=${telegramMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full py-3.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98]"
            >
              <Zap size={16} className="text-cyan-200" />
              <span>Остановить потери — Telegram</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Аудит процессов и дорожная карта автоматизации — бесплатно.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
