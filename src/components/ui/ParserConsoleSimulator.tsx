import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Play,
  RotateCcw,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CompanyRecord {
  id: string;
  name: string;
  activity: string;
  city: string;
  phone: string;
  phoneDept: string;
  email: string;
  website: string;
  source: string;
}

interface NichePreset {
  id: string;
  title: string;
  badge: string;
  totalFound: number;
  sources: string[];
  companies: CompanyRecord[];
}

const NICHES: NichePreset[] = [
  {
    id: 'construction',
    title: 'Строительство и СМР',
    badge: '🏗️ Стройка',
    totalFound: 420,
    sources: ['2ГИС', 'Яндекс Карты', 'ЕГРЮЛ'],
    companies: [
      {
        id: 'c1',
        name: 'ООО «СтройАльянс»',
        activity: 'Генподряд, монолитные и фасадные работы',
        city: 'Санкт-Петербург',
        phone: '+7 (812) 385-40-20',
        phoneDept: 'отдел закупок и снабжения',
        email: 'snab@stroy-aliance.ru',
        website: 'stroy-aliance.ru',
        source: '2ГИС',
      },
      {
        id: 'c2',
        name: 'ПКФ «СеверМонтаж»',
        activity: 'Монтаж металлоконструкций, промстроительство',
        city: 'Москва и МО',
        phone: '+7 (495) 740-12-90',
        phoneDept: 'коммерческий отдел / приемная',
        email: 'zakaz@sever-montazh.ru',
        website: 'sever-montazh.ru',
        source: 'Яндекс Карты',
      },
      {
        id: 'c3',
        name: 'ГК «ЕвроФасад Групп»',
        activity: 'Фасадные работы и промышленный альпинизм',
        city: 'Санкт-Петербург',
        phone: '+7 (812) 418-20-10',
        phoneDept: 'отдел по работе с подрядчиками',
        email: 'info@eurofasad.spb.ru',
        website: 'eurofasad.spb.ru',
        source: '2ГИС',
      },
    ],
  },
  {
    id: 'wholesale',
    title: 'Оптовые поставки и склады',
    badge: '📦 Опт и склады',
    totalFound: 360,
    sources: ['2ГИС', 'Яндекс Карты', 'B2B-каталоги'],
    companies: [
      {
        id: 'w1',
        name: 'ТД «БалтТоргСнаб»',
        activity: 'Оптовые поставки упаковки и тары для бизнеса',
        city: 'Санкт-Петербург',
        phone: '+7 (812) 334-19-80',
        phoneDept: 'отдел оптовых продаж',
        email: 'opt@balttorg.ru',
        website: 'balttorg.ru',
        source: '2ГИС',
      },
      {
        id: 'w2',
        name: 'ООО «АльфаПромСклад»',
        activity: 'Комплексное снабжение строительных баз',
        city: 'Москва',
        phone: '+7 (495) 662-81-10',
        phoneDept: 'отдел снабжения и закупок',
        email: 'info@alfapromsklad.ru',
        website: 'alfapromsklad.ru',
        source: 'Яндекс Карты',
      },
      {
        id: 'w3',
        name: 'ПКФ «Гермес-Логистик»',
        activity: 'Складское хранение и распределительный центр',
        city: 'Московская обл.',
        phone: '+7 (495) 901-44-20',
        phoneDept: 'отдел логистики и заказов',
        email: 'sales@germes-log.ru',
        website: 'germes-log.ru',
        source: 'B2B-каталог',
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Спецтехника и автосервис',
    badge: '🚜 Спецтехника & СТО',
    totalFound: 290,
    sources: ['2ГИС', 'Яндекс Карты'],
    companies: [
      {
        id: 'e1',
        name: 'ООО «СпецТехПарк»',
        activity: 'Аренда кранов, экскаваторов и тралов',
        city: 'Санкт-Петербург',
        phone: '+7 (812) 640-15-50',
        phoneDept: 'диспетчерская служба 24/7',
        email: 'arenda@spectehpark.ru',
        website: 'spectehpark.ru',
        source: '2ГИС',
      },
      {
        id: 'e2',
        name: 'ГК «МагистральТранс»',
        activity: 'Перевозка негабаритных грузов и аренда техники',
        city: 'Москва',
        phone: '+7 (495) 789-30-40',
        phoneDept: 'коммерческий отдел спецтехники',
        email: 'b2b@magistral-trans.ru',
        website: 'magistral-trans.ru',
        source: 'Яндекс Карты',
      },
      {
        id: 'e3',
        name: 'ПКФ «КранМонтаж»',
        activity: 'Услуги автовышек и манипуляторов',
        city: 'Московская обл.',
        phone: '+7 (495) 554-12-00',
        phoneDept: 'отдел аренды оборудования',
        email: 'info@kran-montazh.ru',
        website: 'kran-montazh.ru',
        source: '2ГИС',
      },
    ],
  },
];

export const ParserConsoleSimulator: React.FC = () => {
  const [selectedNicheIndex, setSelectedNicheIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [streamProgress, setStreamProgress] = useState(0);
  const [streamCount, setStreamCount] = useState(0);
  const [visibleCardsCount, setVisibleCardsCount] = useState(0);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const activeNiche = NICHES[selectedNicheIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartScrape = () => {
    if (status === 'running') return;
    setStatus('running');
    setStreamProgress(5);
    setStreamCount(0);
    setVisibleCardsCount(0);
    setExportFeedback(null);

    const startTime = Date.now();
    const duration = 2200; // 2.2s interactive animation

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setStreamProgress(progress);

      const targetCount = activeNiche.totalFound;
      const currentCount = Math.floor((progress / 100) * targetCount);
      setStreamCount(currentCount);

      // Staggered dynamic card pop-in during scrape
      if (progress >= 85) {
        setVisibleCardsCount(3);
      } else if (progress >= 50) {
        setVisibleCardsCount(2);
      } else if (progress >= 20) {
        setVisibleCardsCount(1);
      }

      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStreamCount(activeNiche.totalFound);
        setVisibleCardsCount(3);
        setStatus('completed');
      }
    }, 45);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setStreamProgress(0);
    setStreamCount(0);
    setVisibleCardsCount(0);
    setExportFeedback(null);
  };

  const handleExport = (type: 'excel' | 'crm') => {
    if (type === 'excel') {
      setExportFeedback(`✓ Файл «База_${activeNiche.title}.xlsx» (${activeNiche.totalFound} компаний) сформирован`);
    } else {
      setExportFeedback(`✓ Контакты ${activeNiche.totalFound} компаний синхронизированы с amoCRM`);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-[#0E1621] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col font-sans select-none">
      
      {/* 1. Header Bar */}
      <div className="bg-[#17212B] px-4 sm:px-6 py-3.5 border-b border-[#101720] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue/20 text-blue-light flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Сбор B2B-базы организаций</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-medium">
                152-ФЗ
              </span>
            </div>
            <div className="text-[11px] text-[#798B9B]">
              Открытые общедоступные контакты компаний из 2ГИС и Яндекс Карт
            </div>
          </div>
        </div>

        {status === 'completed' && (
          <button
            type="button"
            onClick={handleReset}
            title="Сбросить и протестировать другую нишу"
            className="text-xs text-[#798B9B] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сбросить</span>
          </button>
        )}
      </div>

      {/* 2. Interactive Canvas */}
      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Step 1: Niche Selector */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#798B9B] mb-2">
            Шаг 1. Выберите нишу компаний:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {NICHES.map((niche, idx) => {
              const isSelected = selectedNicheIndex === idx;
              return (
                <button
                  key={niche.id}
                  type="button"
                  onClick={() => {
                    setSelectedNicheIndex(idx);
                    if (status !== 'idle') handleReset();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E2D3D] border-[#5288C1] text-white shadow-md'
                      : 'bg-[#121B26] border-white/5 text-[#A2B5C6] hover:bg-[#182433] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{niche.badge}</div>
                  <div className="text-[11px] text-white/50">{niche.totalFound} организаций в РФ</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: 1-Click Action Button & Progress */}
        <div>
          {status === 'idle' && (
            <button
              type="button"
              onClick={handleStartScrape}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5288C1] hover:bg-[#4377B0] text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Запустить сбор B2B-базы: {activeNiche.title}</span>
            </button>
          )}

          {status === 'running' && (
            <div className="w-full p-4 rounded-2xl bg-[#121B26] border border-blue/30 text-white space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-light animate-ping" />
                  <span>Поиск организаций в 2ГИС, Яндекс Картах и реестрах...</span>
                </span>
                <span className="font-mono text-blue-light font-bold">
                  {streamCount} из {activeNiche.totalFound} компаний ({streamProgress}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${streamProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">
                    База успешно сформирована: {activeNiche.totalFound} организаций
                  </strong>
                  <span className="text-emerald-400/80">
                    Официальные многоканальные телефоны, отделы снабжения и корпоративные email
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase hidden sm:block">
                ГОТОВО
              </span>
            </div>
          )}
        </div>

        {/* Step 3: Dynamic Company Cards with Pixel-Perfect Grid Alignment */}
        <div>
          {/* Header Row for Cards */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#798B9B] mb-2 px-1">
            <span>
              {status === 'idle'
                ? 'Образец карточек (появятся при запуске):'
                : `Найдено организаций (${visibleCardsCount} из ${activeNiche.totalFound}):`}
            </span>
            <span className="text-emerald-400 font-medium normal-case flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% открытые данные (152-ФЗ)
            </span>
          </div>

          {/* Cards Container */}
          <div className="space-y-2">
            {/* Idle State Placeholder */}
            {status === 'idle' && (
              <div className="py-7 px-4 rounded-2xl border border-dashed border-white/10 bg-[#121B26]/40 text-center flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-blue/10 text-blue-light flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white/90 mb-1">
                  Нажмите синюю кнопку выше, чтобы запустить сбор
                </div>
                <div className="text-[11px] text-[#798B9B] max-w-sm">
                  Карточки найденных компаний с проверенными городскими телефонами отделов снабжения появятся прямо здесь в реальном времени.
                </div>
              </div>
            )}

            {/* Dynamic Animated Cards during running and completed */}
            {status !== 'idle' && (
              <div className="space-y-2">
                <AnimatePresence>
                  {activeNiche.companies.slice(0, visibleCardsCount).map((company) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="p-3.5 rounded-xl bg-[#121B26] border border-white/10 shadow-sm"
                    >
                      {/* Desktop Strict Grid (>= 768px) */}
                      <div className="hidden md:grid md:grid-cols-12 gap-x-4 items-center">
                        {/* 1. Name & Activity (Col 1-4) */}
                        <div className="col-span-4 min-w-0 pr-1">
                          <div className="font-bold text-white text-xs sm:text-sm truncate">
                            {company.name}
                          </div>
                          <div className="text-[11px] text-[#A2B5C6] truncate mt-0.5">
                            {company.activity}
                          </div>
                        </div>

                        {/* 2. City Badge (Col 5-7) - ample width, centered with generous breathing room */}
                        <div className="col-span-3 flex justify-center">
                          <span className="inline-block px-3 py-1 rounded-md bg-white/5 text-[#8E9FA5] text-[11px] font-medium whitespace-nowrap border border-white/5">
                            {company.city}
                          </span>
                        </div>

                        {/* 3. Phone & Department (Col 8-10) */}
                        <div className="col-span-3 min-w-0 pl-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate mt-0.5 whitespace-nowrap">
                            {company.phoneDept}
                          </div>
                        </div>

                        {/* 4. Corporate Email & Website (Col 11-12) */}
                        <div className="col-span-2 min-w-0 text-right">
                          <div className="flex items-center justify-end gap-1 text-[#8E9FA5] text-xs font-mono whitespace-nowrap truncate">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{company.email}</span>
                          </div>
                          <div className="text-[10px] text-blue-light/70 truncate mt-0.5 whitespace-nowrap">
                            {company.website}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout (< 768px) */}
                      <div className="md:hidden space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs truncate">
                            {company.name}
                          </span>
                          <span className="shrink-0 px-2 py-0.5 rounded bg-white/5 text-[#8E9FA5] text-[10px] whitespace-nowrap border border-white/5">
                            {company.city}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A2B5C6] line-clamp-1">
                          {company.activity}
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#8E9FA5] text-[11px] font-mono whitespace-nowrap truncate">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{company.email}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Export Buttons */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#798B9B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Источники: 2ГИС, Яндекс Карты, официальные сайты компаний</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleExport('excel')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2D3D] hover:bg-[#2A3E54] text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Выгрузить Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('crm')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2D3D] hover:bg-[#2A3E54] text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-light" />
              <span>Экспорт в amoCRM</span>
            </button>
          </div>
        </div>

        {/* Export Feedback notification */}
        <AnimatePresence>
          {exportFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-2.5 rounded-xl bg-blue/15 border border-blue/30 text-blue-light text-xs font-medium text-center"
            >
              {exportFeedback}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
