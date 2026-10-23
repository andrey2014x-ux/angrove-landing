import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, MoreVertical, CheckCheck, ArrowUpRight } from 'lucide-react';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  crmAction?: string;
}

export const TelegramChatSimulator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Здравствуйте! Я интерактивный AI-ассистент Андрея. Отвечаю за 5 секунд, считаю смету и квалифицирую заявки 24/7.\n\nНапишите любой вопрос или выберите подсказку ниже 👇',
      time: '12:00',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastCrmAlert, setLastCrmAlert] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    'Сколько стоит бот под ключ?',
    'Какие сроки на парсер?',
    'У меня студия ремонта, как поможет?',
    'Стек: n8n или чистый Python?',
    'Как заявка попадает в CRM?',
  ];

  const getAiAnswer = (query: string): { reply: string; crmAction?: string } => {
    const q = query.toLowerCase().trim();
    const words = q.split(/[\s,.:;!?()+–—-]+/).filter(Boolean);
    const hasWord = (w: string) => words.includes(w);
    const hasAnyWord = (list: string[]) => list.some((w) => words.includes(w));

    // 1. Greetings
    if (hasAnyWord(['привет', 'здравствуйте', 'добрый', 'хай', 'ку', 'салют', 'вечер', 'утро'])) {
      return {
        reply: 'Здравствуйте! Рад знакомству. Я интерактивный ассистент Андрея — отвечаю за 5 секунд, считаю смету и помогаю автоматизировать рутину в бизнесе.\n\nЗадайте любой вопрос по вашей задаче или выберите подсказку ниже 👇',
      };
    }

    // 2. Who is Andrey / About creator
    if (q.includes('кто такой') || q.includes('кто ты') || q.includes('ты кто') || hasWord('автор') || hasWord('создатель') || q.includes('обо мне')) {
      return {
        reply: 'Андрей (_angrove_) — инженер-архитектор систем автоматизации. Более 70 боевых проектов в проде: разрабатывает умных Telegram-ботов с AI, высоконагруженные парсеры на Python и сквозные связки CRM/склада.\n\nРаботает без менеджеров и посредников — прямой контакт с автором системы. Напишите, какая у вас задача — посчитаем решение!',
        crmAction: 'amoCRM: Интерес к автору системы · Личный контакт',
      };
    }

    // 3. Price & Cost (STRICTLY PRIORITIZED before specific niches!)
    if (
      q.includes('скольк') ||
      q.includes('стои') ||
      q.includes('цен') ||
      q.includes('прайс') ||
      q.includes('тариф') ||
      q.includes('расценк') ||
      q.includes('бюджет') ||
      hasWord('почем') ||
      hasWord('рублей')
    ) {
      return {
        reply: 'Фиксированные ориентиры по стоимости разработки:\n\n• Точечный парсер данных — от 15 000 ₽ (2–4 дня)\n• Telegram-бот со сценарием продаж — от 30 000 ₽ (3–5 дней)\n• Умный AI-ассистент под ключ (Claude / GPT + CRM) — от 50 000 ₽ (1–2 нед)\n• Сквозная связка всех систем бизнеса — от 70 000 ₽\n\nСмета фиксируется в договоре до начала работ без скрытых доплат. Под какую нишу подбираете решение?',
        crmAction: 'amoCRM: Запрос прайс-листа · Смета зафиксирована',
      };
    }

    // 4. Timeline
    if (q.includes('срок') || q.includes('дней') || q.includes('быстро') || q.includes('когда') || q.includes('дедлайн') || q.includes('времени')) {
      return {
        reply: 'По срокам запуска:\n\n• Базовый парсер или типовой бот — 3–5 рабочих дней\n• Комплексная связка с AI-агентом и CRM — 1–2 недели\n\nРаботаем недельными спринтами: первый рабочий прототип вы тестируете уже через 48 часов после старта!',
        crmAction: 'amoCRM: Уточнение сроков внедрения',
      };
    }

    // 5. Tech Stack
    if (q.includes('стек') || q.includes('python') || q.includes('n8n') || q.includes('технолог') || (q.includes('баз') && q.includes('данных'))) {
      return {
        reply: 'Коммерческий продакшн-стек:\n\n• Бэкенд: Python 3.12, FastAPI, PostgreSQL, Redis\n• Сценарии и вебхуки: n8n, Docker\n• Парсинг: Playwright, BeautifulSoup, прокси-пулы\n• AI: Claude 3.5/3.7 Sonnet, OpenAI GPT-4o, LangChain\n• CRM: amoCRM REST API, Bitrix24 Webhooks, МойСклад JSON API\n\nВсё разворачивается на защищенном сервере клиента или выделенном VPS.',
      };
    }

    // 6. Parsers & Web Scraping
    if (q.includes('парсер') || q.includes('парсинг') || q.includes('сбор баз') || q.includes('2гис') || q.includes('авито') || q.includes('яндекс карт') || q.includes('циан')) {
      return {
        reply: 'Разрабатываю отказоустойчивые парсеры на Python + Playwright:\n\n• Обход капчи, Cloudflare и блокировок\n• Сбор контактов с 2ГИС, Яндекс Карт, маркетплейсов и закрытых B2B-каталогов\n• HLR-валидация номеров (отсекаем битые телефоны)\n• Выгрузка прямо в Google Таблицу или вашу CRM\n\nСтоимость — от 15 000 ₽. С каких источников нужно собирать данные?',
        crmAction: 'amoCRM: Заявка на разработку парсера данных',
      };
    }

    // 7. AI Agents & LLM (Claude, GPT)
    if (q.includes('ии') || q.includes('нейросет') || q.includes('ai') || q.includes('claude') || q.includes('gpt') || q.includes('чатгпт') || q.includes('гпт')) {
      return {
        reply: 'Внедряю языковые модели (Claude 3.5/3.7 Sonnet, OpenAI GPT-4o) прямо в бизнес:\n\n• AI-ассистенты продаж: квалифицируют лидов, помнят контекст диалога и доводят до оплаты\n• База знаний RAG: бот отвечает строго по вашим регламентам и прайсам без выдумок\n• Голосовые ответы: понимает аудиосообщения клиентов и переводит в текст\n\nСтоимость умного агента под ключ — от 50 000 ₽.',
        crmAction: 'amoCRM: Запрос на AI-ассистента под ключ',
      };
    }

    // 8. CRM Integrations
    if (q.includes('crm') || q.includes('амо') || q.includes('битрикс') || q.includes('bitrix') || q.includes('amo') || q.includes('склад') || q.includes('1с') || q.includes('интеграци')) {
      return {
        reply: 'Интеграция бесшовная: как только клиент пишет в бота или звонит, в amoCRM или Bitrix24 мгновенно создается сделка с контактом, резюме диалога от AI и суммой сметы. Менеджеру в Telegram падает уведомление: «Горячий лид готов к закрытию».',
        crmAction: 'amoCRM Webhook: Сделка #8821 создана за 0.8 сек',
      };
    }

    // 9. Voice Telephony
    if (q.includes('голос') || q.includes('звон') || q.includes('обзвон') || (hasWord('робот') && !hasWord('бот'))) {
      return {
        reply: 'Голосовой AI-робот обзванивает базу или принимает входящие живой русской речью без роботизированного акцента (задержка ответа < 0.4 сек). Заменяет 3–4 операторов колл-центра, квалифицирует клиентов и переводит готовых на менеджеров. Себестоимость — от 2 ₽/мин.',
        crmAction: 'amoCRM: Запрос демонстрации голосового робота',
      };
    }

    // 10. Specific Niches (Safe word matching)
    if (hasAnyWord(['ремонт', 'ремонта', 'стройк', 'стройка', 'квартир', 'квартиры', 'отделка', 'замер'])) {
      return {
        reply: 'Для строительных компаний и студий ремонта:\n\nБот уточняет метраж, тип объекта (новостройка/вторичка) и бюджет, моментально рассчитывает вилку сметы (например, «от 450 000 ₽») и предлагает свободное окно для выезда замерщика.',
        crmAction: 'Сделка «Ремонт под ключ» создана в amoCRM · Бюджет 450 000 ₽',
      };
    }

    if (hasAnyWord(['недвижимость', 'риелтор', 'агентство', 'квартира', 'жк', 'аренда', 'новостройки'])) {
      return {
        reply: 'В недвижимости:\n\nБот за 5 секунд выявляет бюджет, локацию и тип объекта (покупка/инвестиции). Горячим клиентам сразу отправляет PDF-презентацию ЖК и ставит задачу брокеру.',
        crmAction: 'amoCRM: Лид квалифицирован · Сегмент «Премиум новостройки»',
      };
    }

    if (hasAnyWord(['авто', 'автосервис', 'машина', 'машины', 'автомойка', 'шиномонтаж', 'запчасти', 'сто'])) {
      return {
        reply: 'Для автосервисов и автобизнеса:\n\nБот запрашивает VIN или госномер, марку авто и причину обращения, проверяет свободный подъемник в календаре и записывает клиента на удобное время.',
        crmAction: 'amoCRM: Запись на сервис создана · VIN зафиксирован',
      };
    }

    if (hasAnyWord(['клиника', 'врач', 'стоматолог', 'стоматология', 'салон', 'массаж'])) {
      return {
        reply: 'Для медицины и сферы услуг:\n\nИнтеграция с YClients или CRM, онлайн-выбор специалиста, расписание в реальном времени и автоматическое напоминание клиенту за 2 часа, чтобы снизить неявки.',
        crmAction: 'amoCRM: Онлайн-запись на услугу создана',
      };
    }

    // 11. Guarantees & Contract
    if (q.includes('гарант') || q.includes('договор') || q.includes('оплат') || q.includes('аванс') || q.includes('ип')) {
      return {
        reply: 'Работаем строго по договору с ИП. Оплата делится на этапы (50% аванс / 50% после проверки в боевых условиях). После сдачи предоставляю 14 дней гарантийной техподдержки и обучающую видеоинструкцию для ваших сотрудников.',
      };
    }

    // 12. Discounts
    if (q.includes('скидк') || q.includes('дешев') || q.includes('уступк') || q.includes('акци')) {
      return {
        reply: 'Цены фиксированные и честные, без скрытых переплат. При заказе комплексной связки (например: парсер + умный бот + CRM) действует пакетная скидка 15% на общую стоимость проекта.',
      };
    }

    // 13. Direct Contact & Booking
    if (q.includes('заказ') || q.includes('связаться') || q.includes('написать') || q.includes('контакт') || q.includes('разбор') || q.includes('созвон') || q.includes('купить')) {
      return {
        reply: 'Отлично! Напишите напрямую Андрею в Telegram: @_angrove_ — договоримся о бесплатном 20-минутном созвоне, разберем ваши процессы и покажем схему автоматизации.',
        crmAction: 'CRM: Лид готов к созвону с Андреем @_angrove_',
      };
    }

    // 14. Intelligent Fallback
    return {
      reply: 'Понял вашу задачу! В таких проектах отлично работает автоматический сценарий: бот квалифицирует клиента, рассчитывает смету и сразу передает данные в CRM.\n\nНапишите Андрею в Telegram @_angrove_ — за 20 минут бесплатно разберем структуру и предложим готовое решение!',
      crmAction: 'CRM: Запрос индивидуальной консультации',
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    trackGoal('simulate_bot_message');

    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Realistic typing delay (600 - 1000ms)
    setTimeout(() => {
      const { reply, crmAction } = getAiAnswer(text);
      const botTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: reply,
          time: botTime,
          crmAction,
        },
      ]);
      setIsTyping(false);

      if (crmAction) {
        setLastCrmAlert(crmAction);
      }
    }, 750);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-[#0E1621] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-[520px] sm:h-[560px] font-sans">
      
      {/* 1. Telegram Desktop Header */}
      <div className="bg-[#17212B] px-4 py-3 border-b border-[#101720] flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-blue/40">
              <img
                src="/andrey.jpg"
                alt="Андрей"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#17212B] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">Андрей | AI-Ассистент</span>
              <span className="px-1.5 py-0.2 rounded bg-blue/20 text-blue-light text-[9px] font-mono font-bold uppercase">
                bot
              </span>
            </div>
            <div className="text-[11px] text-[#798B9B]">
              {isTyping ? (
                <span className="text-blue-light font-medium animate-pulse">печатает...</span>
              ) : (
                'в сети · отвечает за 5 секунд'
              )}
            </div>
          </div>
        </div>

        {/* Telegram Header Action Icons */}
        <div className="flex items-center gap-1 text-[#798B9B]">
          <a
            href={config.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Открыть в Telegram"
            className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <button
            type="button"
            title="Опции диалога"
            className="p-2 rounded-full hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Telegram Messages Canvas */}
      <div ref={chatContainerRef} className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3 bg-[#0E1621] relative">
        
        {/* Date separator pill */}
        <div className="flex justify-center my-1 select-none">
          <span className="bg-[#182533]/90 text-[#798B9B] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-white/5">
            Сегодня
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-opacity duration-200`}
            >
              <div
                className={`relative max-w-[86%] sm:max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#2B5278] text-white rounded-br-xs'
                    : 'bg-[#182533] text-[#E4ECF2] border border-[#243547]/40 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap select-text">{msg.text}</div>
                
                {/* Message Meta: Time & Checks */}
                <div className="flex items-center justify-end gap-1 mt-1 -mb-1 select-none text-[10px] text-white/50">
                  <span>{msg.time}</span>
                  {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-light" />}
                </div>
              </div>

              {/* Instant CRM Action Notification Badge */}
              {msg.crmAction && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{msg.crmAction}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-[#182533] border border-[#243547]/40 px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-light animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-light animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-light animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Suggestion Pills */}
      <div className="px-3 py-2 bg-[#121B26] border-t border-[#101720] overflow-x-auto no-scrollbar flex items-center gap-2 select-none shrink-0">
        <span className="text-[10px] font-bold uppercase text-[#798B9B] shrink-0 pl-1">
          Быстрый вопрос:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-[#1E2D3D] hover:bg-blue hover:text-white text-[11px] text-[#A2B5C6] transition-colors cursor-pointer border border-white/5"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 4. Telegram Input Bar */}
      <div className="bg-[#17212B] px-3 py-2.5 sm:py-3 border-t border-[#101720] flex items-center gap-2 shrink-0">
        <button
          type="button"
          title="Прикрепить файл"
          className="p-2 text-[#798B9B] hover:text-[#5288C1] transition-colors cursor-pointer rounded-full"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение AI-ассистенту..."
          className="flex-1 bg-transparent text-white placeholder-[#798B9B] text-xs sm:text-sm focus:outline-none px-2"
        />

        <button
          type="button"
          title="Эмодзи"
          className="p-2 text-[#798B9B] hover:text-[#5288C1] transition-colors cursor-pointer rounded-full hidden sm:block"
        >
          <Smile className="w-5 h-5" />
        </button>

        {inputValue.trim() ? (
          <button
            type="button"
            onClick={() => handleSendMessage()}
            title="Отправить (Enter)"
            className="w-9 h-9 rounded-full bg-[#5288C1] hover:bg-[#4377B0] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            title="Голосовое сообщение"
            onClick={() => handleSendMessage('Сколько стоит разработка бота?')}
            className="w-9 h-9 rounded-full text-[#798B9B] hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Live amoCRM Sync Status Bar */}
      {lastCrmAlert && (
        <div className="bg-[#0A0E17] px-4 py-1.5 border-t border-emerald-500/20 text-[10px] text-emerald-300 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono">{lastCrmAlert}</span>
          </div>
          <span className="text-zinc-500 font-mono">LIVE API</span>
        </div>
      )}
    </div>
  );
};
