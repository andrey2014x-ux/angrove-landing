import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  PhoneCall,
  Zap,
  Database,
  RotateCw,
  Check,
  Bell,
  MessageSquare,
  Layers,
  Filter,
  Sparkles,
} from 'lucide-react';
import { getTelegramUrl, TELEGRAM_MESSAGES } from '../../../config';

interface ChatMessage {
  id: string;
  sender: 'client' | 'bot';
  text: string;
  time: string;
  hasCta?: boolean;
}

interface TelegramChatSceneProps {
  activeTab?: number;
}

const TAB_CHAT_CONFIGS = [
  {
    title: 'AI-агенты',
    botName: 'Ассистент первой линии',
    botRole: 'Telegram-бот · отвечает мгновенно',
    chips: ['Сколько стоит бот?', 'Сроки запуска?', 'Интеграция с CRM?'],
    starter: {
      client: 'Добрый день! Подскажите, успеем сделать интеграцию до конца недели и сколько стоит?',
      bot: 'Здравствуйте! Да, стандартный сценарий запускаем за 3–4 дня. Базовый коннектор от 30 000 ₽. Сбросить вам бриф и пример аналогичного кейса?',
    },
  },
  {
    title: 'AI-обзвон',
    botName: 'AI-ассистент обзвона',
    botRole: 'Голосовой робот · задержка <0.5с',
    chips: ['Сколько звонков в час?', 'Как обучается голос?', 'Стоимость звонков?'],
    starter: {
      client: 'Как работает голосовой ассистент и не будут ли клиенты сразу бросать трубку?',
      bot: 'Синтезируем естественный голос без задержек (<0.5с). Бот слушает клиента, понимает перебивания и ведёт диалог строго по сценарию квалификации. Прислать запись звонка?',
    },
  },
  {
    title: 'Парсеры',
    botName: 'Парсер каталогов & карт',
    botRole: 'Парсинг B2B · автовыгрузка',
    chips: ['Откуда собираете базы?', 'Как обходите блокировки?', 'Формат выгрузки?'],
    starter: {
      client: 'Нужно собрать контакты поставщиков оборудования по всей РФ. Это возможно?',
      bot: 'Да, собираем открытые данные из карт, каталогов и сайтов, фильтруем дубли и выгружаем готовую базу с ЛПР напрямую в CRM или Google Таблицы. Собрать тестовую выборку?',
    },
  },
  {
    title: 'Автоматизации',
    botName: 'Цифровой диспетчер n8n',
    botRole: 'Сквозной интегратор · 24/7',
    chips: ['Какие сервисы связываете?', 'Если сервис упадет?', 'Сроки внедрения n8n?'],
    starter: {
      client: 'Хотим связать заявки с сайта, amoCRM, склад и Telegram-чат для курьеров.',
      bot: 'Собираем сквозную цепочку на n8n: заявка мгновенно попадает в CRM, менеджеру ставится задача, а клиенту уходит чек в мессенджер. Рассчитать архитектуру под ваш стек?',
    },
  },
];

function getBotResponse(userQuestion: string, tabIndex: number): string {
  const q = userQuestion.toLowerCase().trim();

  // 1. Direct chip exact matches
  if (q.includes('сколько стоит бот')) {
    return 'Разработка кастомного Telegram-бота под ключ — от 30 000 ₽. Включает интеграцию с amoCRM/Bitrix24, базу знаний компании и запуск за 3–5 дней. Оценить вашу задачу?';
  }
  if (q.includes('сроки запуска')) {
    return 'Простой парсер или сценарий бота запускаем за 2–4 дня. Полноценный AI-агент или сквозная интеграция с CRM занимает от 5 до 10 дней вместе с тестированием.';
  }
  if (q.includes('интеграция с crm') || q.includes('интеграция с црм')) {
    return 'Интегрируемся с amoCRM, Bitrix24, МойСклад, 1C и Google Таблицами. Заявки передаются мгновенно, автоматически ставятся задачи и распределяются лиды.';
  }
  if (q.includes('сколько звонков в час')) {
    return 'Голосовой AI-ассистент может одновременно совершать до 1000 звонков в час без выгорания менеджеров. Холодная база фильтруется, а теплые лиды сразу переводятся в CRM.';
  }
  if (q.includes('как обучается голос')) {
    return 'Синтезируем естественный голос на основе реальных удачных диалогов. Робот слушает собеседника, понимает перебивания, задержка ответа составляет менее 0.5 секунды.';
  }
  if (q.includes('стоимость звонков') || q.includes('стоимость минуты')) {
    return 'Настройка сценария голосового робота — от 40 000 ₽. Трафик телефонии оплачивается по тарифам SIP-провайдера (обычно 1.5–3 ₽/мин). Точную смету фиксируем до старта.';
  }
  if (q.includes('откуда собираете базы')) {
    return 'Парсим открытые реестры, 2ГИС, Яндекс Карты, Avito, отраслевые каталоги и сайты поставщиков строго в рамках действующего законодательства.';
  }
  if (q.includes('как обходите блокировки')) {
    return 'Используем ротацию приватных прокси, имитацию поведения реального браузера (fingerprinting), антикапчу и устойчивость к Cloudflare.';
  }
  if (q.includes('формат выгрузки')) {
    return 'Выгружаем очищенную базу в Google Таблицы, Excel (XLSX/CSV) или отправляем готовыми лидами напрямую в вашу CRM по расписанию.';
  }
  if (q.includes('какие сервисы связываете')) {
    return 'Связываем любой стек с API и Webhooks: сайты (Tilda, WordPress, кастом), CRM (amo, Bitrix), Google Sheets, МойСклад, 1С, мессенджеры и платёжные сервисы.';
  }
  if (q.includes('если сервис упадет')) {
    return 'В сценариях n8n настраиваем автоматические повторные попытки (retry policy), логирование ошибок и мгновенный алерт вам в Telegram в случае сбоя внешнего API.';
  }
  if (q.includes('сроки внедрения n8n')) {
    return 'Базовая связка из 2–3 сервисов запускается за 2–3 дня. Комплексная сквозная автоматизация компании — за 5–7 рабочих дней под ключ.';
  }

  // 2. Intent: Price / Cost / Budget
  const isPrice = /цена|цены|стоимост|стоит|бюджет|прайс|деньг|руб|тариф|расценк|оплат|скольк/.test(q);
  if (isPrice) {
    if (tabIndex === 0) {
      return 'Разработка решения под ключ: Telegram-боты и AI-ассистенты — от 30 000 ₽. Включает интеграцию с CRM и базу знаний. Точную смету фиксируем до старта. Оценить вашу задачу?';
    }
    if (tabIndex === 1) {
      return 'Сценарий AI-обзвона под ключ — от 40 000 ₽. Минута телефонии — 1.5–3 ₽/мин по тарифам SIP-провайдера. Точную смету фиксируем до начала работ. Оценить проект?';
    }
    if (tabIndex === 2) {
      return 'Разработка кастомного парсера — от 15 000 ₽ за источник. С фильтрацией дублей и автовыгрузкой в CRM или Таблицы. Точную смету фиксируем до старта. Оценить вашу задачу?';
    }
    if (tabIndex === 3) {
      return 'Сквозная автоматизация цепочек (n8n / CRM / Таблицы) — от 30 000 ₽. Без скрытых платежей и абонентской платы no-code сервисов. Рассчитать архитектуру под ваш стек?';
    }
    return 'Разработка решения под ключ: простые парсеры и скрипты — от 15 000 ₽, Telegram-боты и связки с CRM — от 30 000 ₽, кастомные AI-агенты на вашей базе знаний — от 50 000 ₽. Точную смету фиксируем до старта. Оценить вашу задачу?';
  }

  // 3. Intent: Timelines / Speed
  const isTimeline = /срок|сроки|долг|быстр|врем|дней|день|недел|когда|успеем/.test(q);
  if (isTimeline) {
    return 'Простой парсер или скрипт запускаем за 2–4 дня. Полноценный AI-агент или сквозная интеграция с CRM занимает от 5 до 10 дней вместе с тестированием.';
  }

  // 4. Intent: CRM / Stack / Integrations / Tables / 1C / Bitrix / Amo
  const isCrm = /crm|црм|амо|amocrm|битрикс|bitrix|таблиц|excel|google|sheets|1с|1c|api|апи|сайт|интеграц|нотион|notion|склад/.test(q);
  if (isCrm) {
    return 'Интегрируемся с любым стеком по API и Webhooks: amoCRM, Bitrix24, МойСклад, Google Sheets, Notion, Telegram и вашим сайтом. Данные передаются за ~1 секунду без потерь.';
  }

  // 5. Intent: Parsing / Databases / Contacts / Competitors
  const isParsing = /парс|баз|контакт|телефон|конкурент|каталог|2гис|2gis|карт|яндекс|авито|avito|лпр/.test(q);
  if (isParsing) {
    return 'Парсер собирает только открытые данные из каталогов, карт и сайтов, очищает дубли, проверяет валидность и выгружает готовую таблицу прямо в CRM или Telegram по расписанию.';
  }

  // 6. Intent: Security / Contract / Guarantees / Legal / Support
  const isSecurity = /договор|гарант|закон|безопасн|поддержк|сломает|ошибк|ип|юридическ|персональн|пдн|152/.test(q);
  if (isSecurity) {
    return 'Работаем официально по договору (ИП). Все базы и ключи хранятся на вашем сервере/облаке. После запуска обеспечиваю техподдержку и мониторинг работы скриптов.';
  }

  // 7. Intent: Voice / Calls
  const isVoice = /голос|звон|минут|трубк|робот|разговор|речи/.test(q);
  if (isVoice) {
    return 'Голосовой AI-агент обучается на вашей базе знаний и скриптах. Естественный синтез речи без пауз (задержка <0.5с). Заинтересованных клиентов бот сразу вносит в CRM.';
  }

  // 8. Smart Fallback: Accept custom user context gracefully
  const cleanSnippet = userQuestion.replace(/\s+/g, ' ').slice(0, 60).trim();
  const suffix = userQuestion.length > 60 ? '...' : '';
  return `Понял вашу задачу: «${cleanSnippet}${suffix}». Технически это можно автоматизировать через связку скрипта и API. Давайте разберем детали напрямую с Андреем в Telegram — он скажет точный срок и стоимость за 15 минут.`;
}

// SCENE 1: Live Interactive Telegram Chat AI-Agent
export const TelegramChatScene: React.FC<TelegramChatSceneProps> = ({ activeTab = 0 }) => {
  const currentTab = Math.max(0, Math.min(activeTab, TAB_CHAT_CONFIGS.length - 1));
  const tabConfig = TAB_CHAT_CONFIGS[currentTab];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `init-client-${currentTab}`,
      sender: 'client',
      text: tabConfig.starter.client,
      time: '14:32',
    },
    {
      id: `init-bot-${currentTab}`,
      sender: 'bot',
      text: tabConfig.starter.bot,
      time: '14:32',
      hasCta: true,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Sync starter messages when activeTab changes
  useEffect(() => {
    const cfg = TAB_CHAT_CONFIGS[currentTab];
    setMessages([
      {
        id: `init-client-${currentTab}`,
        sender: 'client',
        text: cfg.starter.client,
        time: '14:32',
      },
      {
        id: `init-bot-${currentTab}`,
        sender: 'bot',
        text: cfg.starter.bot,
        time: '14:32',
        hasCta: true,
      },
    ]);
  }, [currentTab]);

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerBotReply = (userQuestion: string) => {
    const replyText = getBotResponse(userQuestion, currentTab);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: timeStr,
          hasCta: true,
        },
      ]);
    }, 900);
  };

  const handleSend = (textToSend?: string) => {
    const rawText = (textToSend || inputValue).trim();
    if (!rawText || isTyping) return;
    const text = rawText.slice(0, 500);

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMessages((prev) => [
      ...prev,
      {
        id: `client-${Date.now()}`,
        sender: 'client',
        text,
        time: timeStr,
      },
    ]);

    setInputValue('');
    triggerBotReply(text);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-white font-sans bg-[#11131A]">
      {/* Telegram Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue flex items-center justify-center font-bold text-xs text-white">
            AI
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>{tabConfig.botName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-white/50">{tabConfig.botRole}</div>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Онлайн 24/7</span>
        </div>
      </div>

      {/* Date Plaque with Dedicated Spacing Below Header */}
      <div className="text-center pt-3 pb-1 shrink-0">
        <span className="inline-block px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50 tracking-wider font-mono">
          СЕГОДНЯ
        </span>
      </div>

      {/* Messages Feed Container */}
      <div
        ref={chatScrollRef}
        className="flex-1 py-2 px-1 space-y-3 overflow-y-auto"
        style={{ maxHeight: '340px' }}
      >

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${m.sender === 'client' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm shadow-md leading-relaxed ${
                m.sender === 'client'
                  ? 'bg-white/10 border border-white/10 rounded-tl-xs text-white/90'
                  : 'bg-blue text-white rounded-tr-xs shadow-[0_4px_20px_rgba(61,92,255,0.35)]'
              }`}
            >
              <div className="text-[10px] opacity-70 mb-1 font-medium flex items-center justify-between">
                <span>{m.sender === 'client' ? 'Вы (клиент)' : 'AI-Агент'}</span>
                {m.sender === 'bot' && (
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                    GPT-4o
                  </span>
                )}
              </div>
              <p>{m.text}</p>

              {/* Inline Action Button in Bot Message */}
              {m.hasCta && (
                <div className="mt-2.5 pt-2 border-t border-white/20">
                  <a
                    href={getTelegramUrl(TELEGRAM_MESSAGES.simulator)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-ink px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-paper transition-all shadow-sm"
                  >
                    <span>Обсудить задачу в Telegram</span>
                    <span className="text-blue font-bold">↗</span>
                  </a>
                </div>
              )}

              <div className="text-[10px] opacity-60 text-right mt-1 font-mono">
                {m.time} {m.sender === 'bot' ? '· доставлено' : ''}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator bubble */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end"
          >
            <div className="bg-blue/20 border border-blue/40 rounded-2xl rounded-tr-xs px-3.5 py-2 flex items-center gap-2">
              <span className="text-xs text-blue-light font-medium">AI формулирует ответ</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-light animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Chips & Interactive Input Form */}
      <div className="pt-2.5 border-t border-white/10 shrink-0 space-y-2">
        {/* Quick Question Chips (Dynamic per active tab) */}
        <div className="flex flex-wrap gap-1.5">
          {tabConfig.chips.map((chip, idx) => (
            <button
              key={`${currentTab}-${idx}`}
              type="button"
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue/20 hover:border-blue/50 border border-white/10 text-[11px] text-white/80 transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Real Working Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={500}
            autoComplete="off"
            placeholder="Напишите вопрос или задачу..."
            className="flex-1 bg-white/5 border border-white/15 focus:border-blue rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-blue hover:bg-blue-light disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(61,92,255,0.4)] transition-all cursor-pointer"
            title="Отправить"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};

// SCENE 2: Voice Call AI Assistant (No emojis, clean SVGs)
export const VoiceCallScene: React.FC = () => {
  const [seconds, setSeconds] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev >= 45 ? 28 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-white font-sans bg-[#11131A]">
      {/* Top Bar: Call Status */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 uppercase font-mono">
            Звонок активен
          </span>
        </div>
        <div className="font-mono text-xs sm:text-sm text-blue-light font-bold bg-blue/15 px-2.5 py-1 rounded-md border border-blue/30">
          00:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      {/* Center: Audio Waveform & Participant info */}
      <div className="py-4 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-blue/20 border border-blue/40 flex items-center justify-center text-blue-light mb-3 p-3">
          <PhoneCall className="w-6 h-6 text-white" />
        </div>
        <div className="font-bold text-base sm:text-lg text-white">
          ООО «ПромСнаб-М»
        </div>
        <div className="text-xs text-white/50 mb-5">
          +7 (926) 410-**-** · Согласование условий поставки
        </div>

        {/* Audio Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-14 w-full max-w-xs">
          {[18, 45, 80, 55, 95, 65, 30, 75, 100, 70, 85, 40, 90, 60, 35, 70, 50, 25].map((h, i) => (
            <motion.span
              key={i}
              animate={{
                scaleY: [0.3, 1, 0.4, 0.9, 0.3],
              }}
              transition={{
                duration: 1.2 + (i % 4) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.05,
              }}
              className="w-1.5 bg-blue-light rounded-full origin-bottom"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Appearing Transcript Lines */}
      <div className="space-y-2 bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 text-xs sm:text-sm">
        <div className="flex items-start gap-2">
          <span className="text-blue-light font-bold flex-shrink-0">[AI]:</span>
          <span className="text-white/80">«Добрый день! Подтверждаем заявку на оптовую партию крепежа.»</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-bold flex-shrink-0">[Клиент]:</span>
          <span className="text-white/90">«Да, актуально. Отправьте счёт и спецификацию на почту.»</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-light font-bold flex-shrink-0">[AI]:</span>
          <span className="text-white/80">«Счёт сформирован и уже отправлен. Дублирую в WhatsApp?»</span>
        </div>
      </div>

      {/* Green status badge at bottom */}
      <div className="mt-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Согласие получено</span>
        </div>
        <span className="text-[11px] text-emerald-300/80 font-mono">
          Карточка в CRM создана
        </span>
      </div>
    </div>
  );
};

// SCENE 3: Parser Laser Grid
export const ParserGridScene: React.FC = () => {
  const [count, setCount] = useState(482);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev >= 500 ? 470 : prev + 3));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const sites = [
    { name: 'b2b-spb.ru', status: 'target' },
    { name: 'avito.ru/spb', status: 'target' },
    { name: 'prom-opt.ru', status: 'skip' },
    { name: 'yandex.ru/maps', status: 'target' },
    { name: '2gis.ru/firms', status: 'target' },
    { name: 'metall-pro.com', status: 'skip' },
    { name: 'snab-store.ru', status: 'target' },
    { name: 'zavod-portal.ru', status: 'target' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-white font-sans bg-[#11131A]">
      {/* Top Header with live counter */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div>
          <div className="text-xs text-white/50">Парсинг каталогов & карт</div>
          <div className="font-bold text-sm sm:text-base text-white">
            Поиск: Поставщики оборудования
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-white/50">Собрано данных</div>
          <div className="font-mono text-sm sm:text-base font-bold text-cyan-400">
            {count} / 500 <span className="text-[11px] text-white/50">(пример)</span>
          </div>
        </div>
      </div>

      {/* Grid of site squares scanned by laser beam */}
      <div className="relative py-4">
        {/* Laser Scanning Beam */}
        <motion.div
          animate={{
            top: ['0%', '95%', '0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {sites.map((site, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl border text-center transition-colors duration-300 ${
                site.status === 'target'
                  ? 'bg-blue/15 border-blue/40 text-blue-light'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              <div className="text-[10px] font-mono text-white/50 mb-1">SRC #0{i + 1}</div>
              <div className="font-mono text-xs truncate font-medium text-white/90">
                {site.name}
              </div>
              <div
                className={`text-[9px] mt-1 font-semibold ${
                  site.status === 'target' ? 'text-emerald-400' : 'text-white/30'
                }`}
              >
                {site.status === 'target' ? 'Найдено' : '— Пропуск'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: 3 clean table rows falling in */}
      <div className="space-y-1.5 bg-black/40 rounded-xl p-3 border border-white/10 text-xs">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider pb-1 border-b border-white/10 flex justify-between">
          <span>Компания / Контакт</span>
          <span>Статус</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div>
            <div className="font-semibold text-white">ООО «ПромТехСнаб»</div>
            <div className="text-[11px] text-white/50">+7 (812) 334-**-** · ИНН 7812***</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
            Целевой
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div>
            <div className="font-semibold text-white">Завод «Гидромаш»</div>
            <div className="text-[11px] text-white/50">+7 (495) 789-**-** · ИНН 7701***</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
            Целевой
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <div className="font-semibold text-white">ТД «ЭлектроСеть»</div>
            <div className="text-[11px] text-white/50">+7 (843) 211-**-** · ИНН 1655***</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
            Целевой
          </span>
        </div>
      </div>
    </div>
  );
};

// SCENE 4: Mini n8n Workflow Automation (Clean SVG icons)
export const MiniAutomationScene: React.FC = () => {
  return <WorkflowSimulationScene activeTab={3} />;
};

// SCENE 5: Real-time Live Animated Workflow Simulation Scene for ALL 4 Tabs
export const WORKFLOW_CONFIGS = [
  {
    title: 'Как AI-ассистент работает за менеджера (без вашего участия)',
    badge: 'Ответ клиенту за 4 секунды',
    notification: {
      app: 'Telegram',
      time: 'только что',
      title: 'Новая горячая заявка: Иван (+7 911 234-**-**)',
      subtitle: 'Клиент ознакомился с прайсом и подтвердил интерес. Запись передана в CRM.',
    },
    steps: [
      {
        stepNum: '01',
        title: 'Клиент написал в нерабочее время (Telegram / Сайт)',
        subTag: 'Время: 23:18 · «Сколько стоит монтаж под ключ?»',
        durationMs: 350,
        icon: 'message',
      },
      {
        stepNum: '02',
        title: 'ИИ мгновенно сверился с базой знаний и прайсом',
        subTag: 'Точный расчет · Ответ сформирован за 4 сек',
        durationMs: 420,
        icon: 'ai',
      },
      {
        stepNum: '03',
        title: 'Клиент получил расчет, а заявка уже в CRM и в телефоне',
        subTag: 'Без ожидания до утра · Контакт зафиксирован',
        badges: ['Расчет клиенту', 'amoCRM / Bitrix24', 'Telegram руководителю'],
        durationMs: 300,
        icon: 'crm',
      },
    ],
  },
  {
    title: 'Как голосовой робот обзванивает базу (без выгорания людей)',
    badge: '1000 звонков в час',
    notification: {
      app: 'Telegram',
      time: 'только что',
      title: 'Звонок завершен: ООО «ПромСнаб» (+7 926 410-**-**)',
      subtitle: 'Клиент подтвердил встречу на вторник 14:00. Карточка обновлена в CRM.',
    },
    steps: [
      {
        stepNum: '01',
        title: 'Запуск обзвона по согласованному сценарию',
        subTag: 'База: 300 контактов · Скорость: 10 звонков/сек',
        durationMs: 320,
        icon: 'voice',
      },
      {
        stepNum: '02',
        title: 'Робот говорит живым голосом и понимает ответы',
        subTag: 'Распознавание речи · Задержка ответа <0.5с',
        durationMs: 480,
        icon: 'flow',
      },
      {
        stepNum: '03',
        title: 'Заинтересованные клиенты сразу переведены на менеджеров',
        subTag: 'Горячий лид · Запись разговора прикреплена',
        badges: ['Запись звонка', 'amoCRM', 'SMS клиенту'],
        durationMs: 310,
        icon: 'crm',
      },
    ],
  },
  {
    title: 'Как программа собирает базу контактов (вместо ручного поиска)',
    badge: '500+ компаний за 3 мин',
    notification: {
      app: 'Telegram',
      time: 'только что',
      title: 'База поставщиков обновлена: 480 целевых контактов',
      subtitle: 'Дубли удалены, контакты директоров занесены в Google Таблицу.',
    },
    steps: [
      {
        stepNum: '01',
        title: 'Сканирование открытых источников по расписанию',
        subTag: 'Источники: 2ГИС · Яндекс Карты · Отраслевые каталоги',
        durationMs: 450,
        icon: 'scrape',
      },
      {
        stepNum: '02',
        title: 'Умная очистка: отсекли дубли и неактивные компании',
        subTag: 'Только реальные телефоны и прямые контакты ЛПР',
        durationMs: 520,
        icon: 'filter',
      },
      {
        stepNum: '03',
        title: 'Чистая база сама загрузилась в Таблицы и CRM',
        subTag: 'Готово к работе менеджеров без ручной копипасты',
        badges: ['Google Таблицы / Excel', 'Выгрузка в CRM', 'Отчет в Telegram'],
        durationMs: 340,
        icon: 'crm',
      },
    ],
  },
  {
    title: 'Как робот работает за человека (без вашего участия)',
    badge: '1.1 сек на всю цепочку',
    notification: {
      app: 'Telegram',
      time: 'только что',
      title: 'Новая заявка от Алексея (+7 999 123-**-**)',
      subtitle: 'Данные проверены, сделка в CRM создана, алерт отправлен в чат!',
    },
    steps: [
      {
        stepNum: '01',
        title: 'Клиент оставил заявку (Сайт / Авито / Соцсети)',
        subTag: 'Имя: Алексей · Запрос: Расчет стоимости',
        durationMs: 120,
        icon: 'flow',
      },
      {
        stepNum: '02',
        title: 'Умная фильтрация: отсекли спам и проверили базу',
        subTag: 'Реальный клиент · Дублей нет',
        durationMs: 410,
        icon: 'filter',
      },
      {
        stepNum: '03',
        title: 'Данные сами разлетелись в Таблицу, CRM и вам в телефон',
        subTag: 'Синхронизация 0 ошибок · Мгновенное оповещение',
        badges: ['Excel / Google Таблицы', 'CRM', 'Уведомление в Telegram'],
        durationMs: 330,
        icon: 'crm',
      },
    ],
  },
];

export interface WorkflowSimulationSceneProps {
  activeTab?: number;
}

export const WorkflowSimulationScene: React.FC<WorkflowSimulationSceneProps> = ({ activeTab = 0 }) => {
  const currentTab = Math.max(0, Math.min(activeTab, WORKFLOW_CONFIGS.length - 1));
  const cfg = WORKFLOW_CONFIGS[currentTab];

  const [activeStep, setActiveStep] = useState<number>(1);
  const [cycleCount, setCycleCount] = useState<number>(0);

  // Restart sequence manually
  const handleRestart = () => {
    setActiveStep(1);
    setCycleCount((c) => c + 1);
  };

  // Reset to step 1 whenever activeTab changes
  useEffect(() => {
    setActiveStep(1);
  }, [currentTab]);

  // Live cycle loop: step 1 -> step 2 -> step 3 -> step 4 (notification) -> reset
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (activeStep === 1) {
      timer = setTimeout(() => setActiveStep(2), 1700);
    } else if (activeStep === 2) {
      timer = setTimeout(() => setActiveStep(3), 1700);
    } else if (activeStep === 3) {
      timer = setTimeout(() => setActiveStep(4), 1700);
    } else if (activeStep === 4) {
      timer = setTimeout(() => {
        setActiveStep(1);
        setCycleCount((c) => c + 1);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [activeStep, cycleCount, currentTab]);

  const renderStepIcon = (iconType: string, isCurrent: boolean, isDone: boolean) => {
    const iconClass = `w-4 h-4 ${
      isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-300' : 'text-white/40'
    }`;
    switch (iconType) {
      case 'message':
        return <MessageSquare className={iconClass} />;
      case 'ai':
        return <Sparkles className={iconClass} />;
      case 'voice':
        return <PhoneCall className={iconClass} />;
      case 'scrape':
        return <Layers className={iconClass} />;
      case 'filter':
        return <Filter className={iconClass} />;
      case 'flow':
        return <Zap className={iconClass} />;
      case 'crm':
        return <Database className={iconClass} />;
      default:
        return <Zap className={iconClass} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 sm:p-5 text-white font-sans bg-[#11131A] relative overflow-hidden select-none">
      {/* Background Dot Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #3D5CFF 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-xs sm:text-sm text-white truncate font-mono">
            {cfg.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs text-white font-mono transition-all cursor-pointer shadow-sm shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue"
          title="Запустить тест заново"
        >
          <RotateCw className={`w-3.5 h-3.5 text-blue-light ${activeStep < 4 ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Запустить тест</span>
          <span className="sm:hidden">Тест</span>
        </button>
      </div>

      {/* Steps Flow Container */}
      <div className="relative z-10 py-3 flex-1 flex flex-col justify-center">
        {cfg.steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = activeStep > stepNumber;
          const isCurrent = activeStep === stepNumber;

          return (
            <React.Fragment key={step.stepNum}>
              {/* Step Card */}
              <div
                className={`rounded-xl border p-2.5 sm:p-3 transition-all duration-200 relative overflow-hidden ${
                  isCurrent
                    ? 'border-blue/60 bg-blue/10 shadow-sm'
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                    : 'border-white/5 bg-white/[0.02] opacity-40'
                }`}
              >
                {/* Active step progress fill bar */}
                {isCurrent && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-[2px] bg-blue"
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Icon container */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isCurrent
                          ? 'bg-blue/20 border-blue/40 text-blue-light'
                          : isDone
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {renderStepIcon(step.icon, isCurrent, isDone)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/40 font-bold">
                          ШАГ {step.stepNum}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate leading-snug">
                          {step.title}
                        </h4>
                      </div>

                      <div className="text-[11px] sm:text-xs text-white/70 mt-0.5 leading-snug">
                        {step.subTag}
                      </div>

                      {/* Optional badges for step 3 */}
                      {step.badges && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {step.badges.map((b) => (
                            <span
                              key={b}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                isDone || isCurrent
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-white/5 border-white/10 text-white/40'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="shrink-0 flex items-center">
                    {isDone ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Готово
                      </span>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded bg-blue/20 text-blue-light border border-blue/40 text-[10px] sm:text-[11px] font-mono font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-light" />
                        <span>В процессе...</span>
                      </span>
                    ) : (
                      <span className="text-white/30 text-[10px] sm:text-[11px] font-mono">
                        ожидание
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {idx < cfg.steps.length - 1 && (
                <div className="h-4 sm:h-5 w-0.5 mx-6 relative overflow-hidden bg-white/10 my-0.5">
                  {(isDone || isCurrent) && (
                    <motion.div
                      animate={{ top: ['-20%', '120%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-blue rounded-full"
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Final Cycle Realistic Phone-Like Push Notification */}
      <div className="relative z-10 pt-2 shrink-0 min-h-[76px]">
        <AnimatePresence mode="wait">
          {activeStep === 4 ? (
            <motion.div
              key="notification-card"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="p-3 sm:p-3.5 rounded-2xl bg-[#181A24] border border-white/15 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-1.5 font-medium text-white/70">
                  <span className="w-5 h-5 rounded-lg bg-blue flex items-center justify-center text-white shadow-sm">
                    <Bell className="w-3 h-3" />
                  </span>
                  <span className="font-bold text-white">Telegram</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/50">{cfg.notification.time}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> В базе
                </span>
              </div>
              <div className="font-display font-bold text-white text-xs sm:text-sm leading-snug">
                {cfg.notification.title}
              </div>
              <div className="text-white/70 text-[11px] sm:text-xs mt-0.5 leading-relaxed truncate sm:whitespace-normal font-sans">
                {cfg.notification.subtitle}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting-notification-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/50 font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue" />
                <span>Автоматический цикл выполняется без участия человека</span>
              </div>
              <span className="text-blue-light">{cfg.badge}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
