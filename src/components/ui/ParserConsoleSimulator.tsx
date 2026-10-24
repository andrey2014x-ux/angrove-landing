import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  ShieldCheck,
  Play,
  RotateCcw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface LeadRecord {
  id: string;
  company: string;
  inn: string;
  region: string;
  person: string;
  role: string;
  phone: string;
  hasWhatsapp: boolean;
  operator: string;
}

interface NichePreset {
  id: string;
  title: string;
  badge: string;
  query: string;
  sources: string[];
  leads: LeadRecord[];
}

const NICHES: NichePreset[] = [
  {
    id: 'construction',
    title: 'Строительство и СМР',
    badge: '🏗️ Стройка',
    query: 'Генподрядчики, фасадные работы, монолитное строительство',
    sources: ['2ГИС', 'Яндекс Карты', 'ЕГРЮЛ', 'Rusprofile'],
    leads: [
      {
        id: 'c1',
        company: 'ООО «СтройАльянс»',
        inn: '7810849201',
        region: 'СПб & ЛО',
        person: 'Михаил Громов',
        role: 'Главный инженер / ЛПР',
        phone: '+7 (921) 840-12-88',
        hasWhatsapp: true,
        operator: 'МегаФон',
      },
      {
        id: 'c2',
        company: 'ПКФ «СеверМонтаж»',
        inn: '7724910283',
        region: 'Москва & МО',
        person: 'Игорь Власов',
        role: 'Директор по закупкам',
        phone: '+7 (916) 304-55-19',
        hasWhatsapp: true,
        operator: 'МТС',
      },
      {
        id: 'c3',
        company: 'ГК «ЕвроФасад Групп»',
        inn: '7802773410',
        region: 'Санкт-Петербург',
        person: 'Сергей Лебедев',
        role: 'Генеральный директор',
        phone: '+7 (981) 120-74-32',
        hasWhatsapp: true,
        operator: 'Теле2',
      },
      {
        id: 'c4',
        company: 'АО «ПромСтройСнаб»',
        inn: '7705192840',
        region: 'Москва',
        person: 'Дмитрий Орлов',
        role: 'Начальник отдела МТС',
        phone: '+7 (903) 778-91-04',
        hasWhatsapp: true,
        operator: 'Билайн',
      },
    ],
  },
  {
    id: 'wholesale',
    title: 'Оптовая торговля & FMCG',
    badge: '📦 Опт',
    query: 'Дистрибьюторы продуктов питания, хозтоваров и упаковки',
    sources: ['Контур.Фокус', '2ГИС', 'СБИС', 'Каталог B2B'],
    leads: [
      {
        id: 'w1',
        company: 'ТД «БалтТоргСнаб»',
        inn: '7814529011',
        region: 'СПб & СЗФО',
        person: 'Ольга Данилова',
        role: 'Коммерческий директор',
        phone: '+7 (921) 412-99-31',
        hasWhatsapp: true,
        operator: 'МегаФон',
      },
      {
        id: 'w2',
        company: 'ООО «РитейлЛогистик»',
        inn: '7719882310',
        region: 'Москва',
        person: 'Павел Кравцов',
        role: 'Руководитель опта',
        phone: '+7 (915) 238-41-77',
        hasWhatsapp: true,
        operator: 'МТС',
      },
      {
        id: 'w3',
        company: 'ПК «АгроПромХолдинг»',
        inn: '2310492817',
        region: 'ЮФО & Москва',
        person: 'Виталий Зубов',
        role: 'Директор по снабжению',
        phone: '+7 (918) 441-20-85',
        hasWhatsapp: true,
        operator: 'Билайн',
      },
      {
        id: 'w4',
        company: 'ГК «НордТрейд»',
        inn: '7811620943',
        region: 'Санкт-Петербург',
        person: 'Анна Смирнова',
        role: 'Директор по развитию',
        phone: '+7 (931) 501-19-64',
        hasWhatsapp: true,
        operator: 'Теле2',
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Спецтехника & Аренда',
    badge: '🚜 Техника',
    query: 'Аренда экскаваторов, тралов, самосвалов, грузоперевозки',
    sources: ['Авито Спецтехника', '2ГИС', 'Яндекс Карты', 'ЕГРЮЛ'],
    leads: [
      {
        id: 'e1',
        company: 'ООО «СпецТехПарк»',
        inn: '7805128490',
        region: 'СПб & ЛО',
        person: 'Артем Ковалев',
        role: 'Начальник автопарка',
        phone: '+7 (921) 993-28-11',
        hasWhatsapp: true,
        operator: 'МегаФон',
      },
      {
        id: 'e2',
        company: 'ГК «МагистральТранс»',
        inn: '7728193420',
        region: 'Москва & РФ',
        person: 'Владимир Чернов',
        role: 'Диспетчер негабарита',
        phone: '+7 (905) 554-19-82',
        hasWhatsapp: true,
        operator: 'Билайн',
      },
      {
        id: 'e3',
        company: 'ПКФ «КранМонтаж»',
        inn: '5032910481',
        region: 'Московская обл.',
        person: 'Денис Морозов',
        role: 'Руководитель логистики',
        phone: '+7 (916) 720-33-49',
        hasWhatsapp: true,
        operator: 'МТС',
      },
      {
        id: 'e4',
        company: 'ООО «НеваТралСервис»',
        inn: '7816401928',
        region: 'Санкт-Петербург',
        person: 'Максим Ильин',
        role: 'Главный диспетчер',
        phone: '+7 (981) 840-02-71',
        hasWhatsapp: true,
        operator: 'Теле2',
      },
    ],
  },
];

export const ParserConsoleSimulator: React.FC = () => {
  const [selectedNicheIndex, setSelectedNicheIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [streamProgress, setStreamProgress] = useState(0);
  const [streamCount, setStreamCount] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const activeNiche = NICHES[selectedNicheIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logMessages = [
    '2ГИС & Яндекс API: сканирование категории...',
    'Rusprofile: валидация ИНН и извлечение контактов ЛПР...',
    'HLR-валидация: проверка активности номеров в сотовой сети...',
    'Фильтрация: исключение закрытых юрлиц и дедупликация SHA-256...',
    'Экспорт: 380 чистых контактов с мобильными телефонами ЛПР готовы к выгрузке',
  ];

  const handleStartScrape = () => {
    if (status === 'running') return;
    setStatus('running');
    setStreamProgress(5);
    setStreamCount(0);
    setActiveLogIndex(0);
    setExportFeedback(null);

    const startTime = Date.now();
    const duration = 2400; // 2.4s simulation

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setStreamProgress(progress);

      const targetCount = 380;
      const currentCount = Math.floor((progress / 100) * targetCount);
      setStreamCount(currentCount);

      const logIdx = Math.min(
        logMessages.length - 1,
        Math.floor((progress / 100) * logMessages.length)
      );
      setActiveLogIndex(logIdx);

      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStreamCount(380);
        setStatus('completed');
      }
    }, 60);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setStreamProgress(0);
    setStreamCount(0);
    setActiveLogIndex(0);
    setExportFeedback(null);
  };

  const handleExportSim = (type: 'excel' | 'crm') => {
    if (type === 'excel') {
      setExportFeedback(`✓ Файл «База_${activeNiche.title}.xlsx» (380 строк) сформирован`);
    } else {
      setExportFeedback('✓ 380 контактов переданы в воронку amoCRM');
    }
    setTimeout(() => {
      setExportFeedback(null);
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-[#0A0C16] rounded-3xl p-4 sm:p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 pb-3 border-b border-white/10 mb-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            {/* macOS terminal dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <Terminal className="w-3.5 h-3.5 text-blue" />
              <span className="text-xs font-mono font-bold text-white/90">
                b2b_crawler_v4.2 · python/aiohttp
              </span>
            </div>
          </div>

          {/* Telemetry pill */}
          <div className="flex items-center gap-2">
            {status === 'running' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue/15 border border-blue/40 text-blue text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                140 req/s · 48 proxies
              </span>
            ) : status === 'completed' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                380 контактов валидно
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Готов к запуску · 0 дублей
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Niche Selector Pills */}
      <div className="relative z-10 mb-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
          <span>Выберите нишу для тест-драйва:</span>
          <span className="text-[10px] text-zinc-500">Пул: РФ + СНГ</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {NICHES.map((niche, idx) => {
            const isSelected = idx === selectedNicheIndex;
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => {
                  setSelectedNicheIndex(idx);
                  if (status === 'completed') handleReset();
                }}
                className={`py-2 px-2 sm:px-3 rounded-xl text-left transition-all text-xs font-sans cursor-pointer flex flex-col justify-center border ${
                  isSelected
                    ? 'bg-blue/20 border-blue/50 text-white shadow-[0_0_15px_rgba(61,92,255,0.25)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                }`}
              >
                <span className="font-semibold truncate text-[11px] sm:text-xs">{niche.badge}</span>
                <span className="text-[10px] text-zinc-400 truncate hidden sm:block">
                  {niche.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Bar & Active Sources */}
      <div className="relative z-10 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate text-zinc-300">
          <span className="text-zinc-500 text-[11px]">ФИЛЬТР:</span>
          <span className="truncate text-white text-[11px] font-sans font-medium">
            {activeNiche.query}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-zinc-400">
          <Database className="w-3 h-3 text-blue" />
          <span>{activeNiche.sources.join(' · ')}</span>
        </div>
      </div>

      {/* Main Interactive Button */}
      <div className="relative z-10 mb-3">
        <button
          type="button"
          onClick={status === 'completed' ? handleReset : handleStartScrape}
          disabled={status === 'running'}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 select-none shadow-lg cursor-pointer flex items-center justify-center gap-2.5 ${
            status === 'running'
              ? 'bg-blue/60 text-white/80 cursor-wait'
              : status === 'completed'
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                : 'bg-blue hover:bg-blue-dark text-white shadow-[0_10px_25px_rgba(61,92,255,0.4)] hover:shadow-[0_15px_35px_rgba(61,92,255,0.6)] hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {status === 'running' ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-white" />
              <span>
                Сбор и HLR-проверка: {streamCount} из 380 контактов ({streamProgress}%)
              </span>
            </>
          ) : status === 'completed' ? (
            <>
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>База собрана (380 контактов). Запустить тест заново</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Запустить сбор B2B-базы: {activeNiche.title}</span>
            </>
          )}
        </button>

        {/* Progress Bar (Visible when running or completed) */}
        {(status === 'running' || status === 'completed') && (
          <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue via-indigo-400 to-emerald-400 transition-all duration-150 rounded-full"
              style={{ width: `${status === 'completed' ? 100 : streamProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Live Log Terminal Ticker */}
      <div className="relative z-10 px-3 py-2 rounded-lg bg-black/60 border border-white/10 mb-3 text-[11px] font-mono flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-zinc-500 shrink-0">LOG:</span>
          <span className="text-emerald-400 truncate">
            {status === 'running'
              ? logMessages[activeLogIndex]
              : status === 'completed'
                ? '✓ 380/380 номеров проверены на активность (WhatsApp / сотовая сеть)'
                : 'Стенд инициализирован: прокси активны, антикапча подключена'}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono shrink-0 pl-2">
          {status === 'completed' ? '100% OK' : status === 'running' ? `${streamProgress}%` : 'IDLE'}
        </span>
      </div>

      {/* Data Table */}
      <div className="relative z-10 rounded-xl bg-black/40 border border-white/10 overflow-hidden mb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-2 px-3">Компания / ИНН</th>
                <th className="py-2 px-3 hidden sm:table-cell">Регион</th>
                <th className="py-2 px-3">ЛПР / Должность</th>
                <th className="py-2 px-3">Телефон (HLR)</th>
                <th className="py-2 px-3 text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {activeNiche.leads.map((lead, idx) => {
                // If running, progressively highlight or reveal
                const isRevealed =
                  status === 'idle' ||
                  status === 'completed' ||
                  streamProgress >= (idx + 1) * 20;

                return (
                  <tr
                    key={lead.id}
                    className={`transition-colors duration-200 hover:bg-white/[0.04] ${
                      !isRevealed ? 'opacity-40 blur-[0.5px]' : 'opacity-100'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-bold text-white text-xs">{lead.company}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">ИНН {lead.inn}</div>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300 hidden sm:table-cell text-[11px]">
                      {lead.region}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-sans font-medium text-zinc-200">{lead.person}</div>
                      <div className="text-[10px] text-zinc-400">{lead.role}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-white font-mono font-medium">{lead.phone}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span>✓ WA</span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-400">{lead.operator}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium font-sans">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        Валиден
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Export Action Bar & Guarantee Footer */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Сверка по ЕГРЮЛ, отсев дублей и живые мобильные телефоны ЛПР</span>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleExportSim('excel')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-mono transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportSim('crm')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-mono transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue" />
            <span>в amoCRM</span>
          </button>
        </div>
      </div>

      {/* Floating Export Toast */}
      <AnimatePresence>
        {exportFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-2 z-20 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium font-sans">{exportFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
