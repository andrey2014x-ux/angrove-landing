import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, MoreVertical, CheckCheck, ArrowUpRight } from 'lucide-react';
import { getTelegramUrl, TELEGRAM_MESSAGES } from '../../config';
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
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Direct native wheel handler to guarantee 100% reliable scrolling inside Lenis
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const { deltaY } = e;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 2;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 4;

      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        el.scrollTop += deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

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
    'Запиши меня к Андрею',
    'У меня студия ремонта, как поможет?',
    'А если бот ошибется клиенту?',
    'Стек: n8n или чистый Python?',
  ];

  const getAiAnswer = (query: string, history: ChatMessage[]): { reply: string; crmAction?: string } => {
    const q = query.toLowerCase().trim();
    const words = q.split(/[\s,.:;!?()+–—"'-]+/).filter(Boolean);
    const hasWord = (w: string) => words.includes(w);
    const hasAnyWord = (list: string[]) => list.some((w) => words.includes(w));
    const hasSubstring = (sub: string) => q.includes(sub);

    // Context: last bot message
    const lastBotMsg = [...history].reverse().find((m) => m.sender === 'bot')?.text.toLowerCase() || '';

    // ==========================================
    // 1. Direct Booking / Appointment with Andrey
    // ==========================================
    if (
      hasSubstring('запиши') ||
      hasSubstring('записа') ||
      hasSubstring('созвон') ||
      hasSubstring('встреч') ||
      hasSubstring('консультаци') ||
      hasSubstring('к андрею') ||
      hasSubstring('с андреем') ||
      hasSubstring('поговорить с андреем') ||
      hasSubstring('позови андрея') ||
      hasSubstring('свяжи с андреем') ||
      hasSubstring('дай андрея') ||
      hasSubstring('переведи на андрея') ||
      hasSubstring('номер андрея')
    ) {
      return {
        reply: 'С удовольствием запишу вас к Андрею! 🤝\n\nНа какой день и примерное время (по МСК) вам удобнее запланировать 20-минутный разбор? Напишите удобное время и ваш контакт (телефон или ник в Telegram), либо можете написать напрямую Андрею в Telegram: @ANGROVE — он ответит в течение 15 минут.',
        crmAction: 'amoCRM: Запрос на запись к Андрею · Создан лид «Согласование слота»',
      };
    }

    // ==========================================
    // 2. Time, Days, Contacts, Confirmation in Follow-up
    // ==========================================
    const hasTimeOrContact =
      hasAnyWord(['завтра', 'сегодня', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']) ||
      hasAnyWord(['утром', 'днем', 'вечером', 'после', 'мск']) ||
      /\d{1,2}[:.]\d{2}/.test(q) ||
      /\+?[78]\d{9,10}/.test(q) ||
      q.includes('@') ||
      hasSubstring('в 1') ||
      hasSubstring('в 2') ||
      hasSubstring('в 3') ||
      hasSubstring('в 4') ||
      hasSubstring('в 5');

    if (hasTimeOrContact && (lastBotMsg.includes('запишу') || lastBotMsg.includes('время') || lastBotMsg.includes('созвон') || lastBotMsg.includes('день'))) {
      return {
        reply: 'Отлично! Время зафиксировал в CRM. Передал заявку Андрею в личные сообщения. Он подтвердит слот в течение 15 минут в Telegram.\n\nКакую задачу или сферу бизнеса хотите разобрать на созвоне в первую очередь?',
        crmAction: 'amoCRM: Слот на созвон зафиксирован · Контакт передан Андрею @ANGROVE',
      };
    }

    // ==========================================
    // 3. Human / Operator Hand-off
    // ==========================================
    if (
      hasAnyWord(['человек', 'человека', 'человеком', 'оператор', 'оператора', 'менеджер', 'менеджера', 'живой']) ||
      hasSubstring('дай человека') ||
      hasSubstring('позови человека') ||
      hasSubstring('не с ботом')
    ) {
      return {
        reply: 'Без проблем! Переключаю диалог на человека. Андрей (@ANGROVE) работает без посредников и менеджеров — вы можете сразу написать ему в личные сообщения: @ANGROVE.\n\nОн на связи и подробно ответит на любые технические вопросы по проекту.',
        crmAction: 'CRM: Запрос перевода на живого инженера @ANGROVE',
      };
    }

    // ==========================================
    // 4. Agreement / Ready to proceed
    // ==========================================
    if (
      hasAnyWord(['да', 'давай', 'хочу', 'интересно', 'согласен', 'готов', 'погнали', 'давайте', 'ок давай', 'го']) &&
      words.length <= 4
    ) {
      return {
        reply: 'Договорились! Чтобы не терять время, напишите напрямую Андрею в Telegram: @ANGROVE — он покажет живой пример работы бота именно в вашей нише и сориентирует по точной смете.',
        crmAction: 'amoCRM: Клиент подтвердил готовность · Лид высокой температуры',
      };
    }

    // ==========================================
    // 5. Casual, Small Talk & Greetings
    // ==========================================
    if (hasAnyWord(['привет', 'здравствуйте', 'добрый', 'хай', 'ку', 'салют', 'вечер', 'утро', 'день', 'йо'])) {
      return {
        reply: 'Здравствуйте! Рад знакомству. Я интерактивный AI-ассистент Андрея — отвечаю за 5 секунд, считаю смету и помогаю бизнесу не терять клиентов 24/7.\n\nЗадайте вопрос по вашей задаче или выберите подсказку ниже 👇',
      };
    }

    if (hasSubstring('как дела') || hasSubstring('как жизнь') || hasSubstring('че как') || hasSubstring('что нового') || hasSubstring('как ты')) {
      return {
        reply: 'Отлично! Работаю в режиме 24/7 без сна и выходных, квалифицирую лидов и экономлю владельцам бизнеса сотни часов рутины каждый месяц.\n\nКакую задачу в вашем проекте хотите решить?',
      };
    }

    if (hasAnyWord(['спасибо', 'благодарю', 'от души', 'мерси', 'thanks', 'thx'])) {
      return {
        reply: 'Всегда рад помочь! Если хотите внедрить такого же ассистента или автоматизировать рутину у себя в бизнесе — напишите Андрею напрямую в Telegram: @ANGROVE 🤝',
      };
    }

    if (hasAnyWord(['круто', 'огонь', 'кайф', 'супер', 'класс', 'топ', 'норм', 'четко', 'понял', 'ясно', 'ок', 'хорошо', 'ладно', 'гуд']) && words.length <= 3) {
      return {
        reply: 'Приятно слышать! В реальном проекте мы можем обучить бота вашей базе знаний, каталогу услуг или связать с CRM за 3–7 дней. Хотите прикинуть смету под вашу нишу?',
        crmAction: 'CRM: Положительная реакция клиента · Готовность к диалогу',
      };
    }

    // ==========================================
    // 6. Tests, Math, Humor & Objections on Intelligence
    // ==========================================
    if (q.includes('2+2') || q.includes('2 + 2') || hasSubstring('сколько будет') || hasSubstring('посчитай')) {
      return {
        reply: 'Ровно 4! Считать я умею мгновенно, но лучше всего у меня получается считать конверсию и сэкономленные часы владельцев бизнеса 😉 Какую задачу хотите автоматизировать?',
      };
    }

    if (hasAnyWord(['анекдот', 'шутка', 'шутку', 'прикол', 'рассмеши'])) {
      return {
        reply: 'Владелец бизнеса решил сэкономить и посадил троих менеджеров вручную копировать лиды из мессенджера в Excel. Через месяц бот на Python за 30 000 ₽ сделал ту же работу за 3 секунды. Мораль: автоматизация бережет нервы и бюджет 🚀',
      };
    }

    if (
      hasAnyWord(['тупой', 'дурак', 'глупый', 'тупишь', 'не понимаешь']) ||
      hasSubstring('бот тупой') ||
      hasSubstring('не очень умный')
    ) {
      return {
        reply: 'Я учусь каждый день! В боевых проектах Андрей обучает меня по конкретным регламентам и базе знаний вашей компании, поэтому с вашими реальными клиентами я общаюсь четко, вежливо и строго по регламенту.\n\nНапишите вашу нишу — расскажу, как бот окупит себя у вас!',
      };
    }

    if (hasSubstring('почему андрей') || hasSubstring('почему именно') || hasSubstring('агентство') || hasSubstring('студия')) {
      return {
        reply: 'В агентстве вы переплачиваете 2-3 цены за офис, аккаунт-менеджеров и бюрократию, а проект отдают джуниору. С Андреем (@ANGROVE) вы работаете напрямую с senior-инженером: прозрачная смета, прототип за 48 часов и личная гарантия за каждый коммит.',
      };
    }

    // ==========================================
    // 7. Technical Risks & Failure Modes
    // ==========================================
    if (
      hasSubstring('завис') ||
      hasSubstring('упадет') ||
      hasSubstring('слома') ||
      hasSubstring('сбой') ||
      hasSubstring('баг') ||
      hasSubstring('ляжет')
    ) {
      return {
        reply: 'Система строится по отказоустойчивым стандартам: автоматический перезапуск контейнеров в Docker, повторные попытки вебхуков (retry queue), логирование в Sentry и мгновенный алерт в Telegram, если внешняя база или банк на минуту зависли. Ни одна заявка клиента не потеряется.',
        crmAction: 'CRM: Снятие технического возражения (отказоустойчивость)',
      };
    }

    if (
      hasSubstring('заблок') ||
      hasSubstring('бан') ||
      hasSubstring('блок') ||
      hasSubstring('забанят') ||
      hasSubstring('спам')
    ) {
      return {
        reply: 'Боты работают строго через официальный Telegram Bot API (токены от @BotFather) — это на 100% легальный белый протокол, блокировки здесь исключены. А для парсеров мы используем ротацию пулов мобильных прокси и эмуляцию живого браузера, поэтому защита сайтов видит только естественные запросы обычных пользователей.',
        crmAction: 'CRM: Снятие возражения о блокировках',
      };
    }

    if (
      hasSubstring('ошиб') ||
      hasSubstring('галлюцин') ||
      hasSubstring('врет') ||
      hasSubstring('напутает') ||
      hasSubstring('придумает')
    ) {
      return {
        reply: 'Отличный вопрос! Чтобы AI не придумывал лишнего, настраивается строгая RAG-архитектура: бот отвечает ТОЛЬКО по вашей утвержденной базе знаний (регламенты, прайсы, FAQ). Если клиент задает вопрос вне базы, бот честно говорит: «Уточняю у специалиста» и передает диалог живому менеджеру без неловких выдумок.',
        crmAction: 'CRM: Снятие возражения по галлюцинациям AI',
      };
    }

    // ==========================================
    // 8. Prices, Budget & Discounts
    // ==========================================
    if (
      hasSubstring('скольк') ||
      hasSubstring('стои') ||
      hasSubstring('цен') ||
      hasSubstring('прайс') ||
      hasSubstring('тариф') ||
      hasSubstring('расценк') ||
      hasSubstring('бюджет') ||
      hasSubstring('дорого') ||
      hasSubstring('дешев') ||
      hasWord('почем') ||
      hasWord('рублей')
    ) {
      return {
        reply: 'Фиксированные ориентиры по стоимости разработки:\n\n• Точечный парсер данных — от 15 000 ₽ (2–4 дня)\n• Telegram-бот со сценарием продаж — от 30 000 ₽ (3–5 дней)\n• Умный AI-ассистент под ключ (Claude / GPT + CRM) — от 50 000 ₽ (1–2 нед)\n• Сквозная связка всех систем бизнеса — от 70 000 ₽\n\nСмета фиксируется в договоре до старта работ. Под какую нишу подбираете решение?',
        crmAction: 'amoCRM: Запрос прайс-листа · Смета зафиксирована',
      };
    }

    // ==========================================
    // 9. Timelines & Speed
    // ==========================================
    if (
      hasSubstring('срок') ||
      hasSubstring('дней') ||
      hasSubstring('быстро') ||
      hasSubstring('когда') ||
      hasSubstring('дедлайн') ||
      hasSubstring('времени')
    ) {
      return {
        reply: 'Сроки запуска:\n\n• Базовый парсер или типовой бот — 3–5 рабочих дней\n• Комплексная связка с AI-агентом и CRM — 1–2 недели\n\nРаботаем быстрыми спринтами: первый рабочий прототип вы тестируете уже через 48 часов после старта!',
        crmAction: 'amoCRM: Уточнение сроков внедрения',
      };
    }

    // ==========================================
    // 10. Tech Stack
    // ==========================================
    if (
      hasSubstring('стек') ||
      hasSubstring('python') ||
      hasSubstring('n8n') ||
      hasSubstring('технолог') ||
      hasSubstring('сервер') ||
      (hasSubstring('баз') && hasSubstring('данных'))
    ) {
      return {
        reply: 'Коммерческий продакшн-стек:\n\n• Бэкенд: Python 3.12, FastAPI, PostgreSQL, Redis\n• Сценарии и вебхуки: n8n, Docker\n• Парсинг: Playwright, BeautifulSoup, резидентные прокси\n• AI: Claude 3.5/3.7 Sonnet, OpenAI GPT-4o, LangChain\n• CRM: amoCRM REST API, Bitrix24 Webhooks, МойСклад JSON API\n\nВсё разворачивается на защищенном сервере клиента или выделенном VPS.',
      };
    }

    // ==========================================
    // 11. Parsers & Web Scraping
    // ==========================================
    if (
      hasSubstring('парсер') ||
      hasSubstring('парсинг') ||
      hasSubstring('сбор баз') ||
      hasSubstring('2гис') ||
      hasSubstring('авито') ||
      hasSubstring('яндекс карт') ||
      hasSubstring('циан')
    ) {
      return {
        reply: 'Разрабатываю парсеры открытых данных на Python:\n\n• 100% законно по 152-ФЗ: сбор официальных контактов организаций из открытых источников\n• 2ГИС, Яндекс Карты, маркетплейсы и открытые B2B-реестры\n• Фильтрация дублей, проверка доступности номеров компаний\n• Выгрузка прямо в Google Таблицу, Excel или вашу CRM\n\nСтоимость — от 15 000 ₽. В какой сфере вам нужны контакты компаний?',
        crmAction: 'amoCRM: Заявка на сбор B2B-базы организаций (152-ФЗ)',
      };
    }

    // ==========================================
    // 12. AI Agents & LLM (Claude, GPT)
    // ==========================================
    if (
      hasSubstring('нейросет') ||
      hasSubstring('claude') ||
      hasSubstring('gpt') ||
      hasSubstring('чатгпт') ||
      hasSubstring('гпт') ||
      hasWord('ai') ||
      hasWord('ии')
    ) {
      return {
        reply: 'Внедряю современные языковые модели (Claude 3.5/3.7 Sonnet, GPT-4o) прямо в бизнес:\n\n• AI-ассистенты продаж: квалифицируют лидов, помнят контекст диалога и доводят до оплаты\n• База знаний RAG: бот отвечает строго по вашим регламентам без выдумок\n• Голосовые ответы: понимает аудиосообщения клиентов и транскрибирует в текст\n\nСтоимость умного агента под ключ — от 50 000 ₽.',
        crmAction: 'amoCRM: Запрос на AI-ассистента под ключ',
      };
    }

    // ==========================================
    // 13. CRM Integrations
    // ==========================================
    if (
      hasSubstring('crm') ||
      hasSubstring('амо') ||
      hasSubstring('битрикс') ||
      hasSubstring('bitrix') ||
      hasSubstring('amo') ||
      hasSubstring('1с') ||
      hasSubstring('интеграци')
    ) {
      return {
        reply: 'Интеграция бесшовная: как только клиент пишет в бота или оставляет заявку, в amoCRM или Bitrix24 мгновенно создается сделка с контактом, резюме диалога от AI и суммой сметы. Менеджеру в Telegram падает уведомление: «Горячий лид готов к закрытию».',
        crmAction: 'amoCRM Webhook: Сделка синхронизирована за 0.8 сек',
      };
    }

    // ==========================================
    // 14. Specific Niches
    // ==========================================
    // Beauty, Stylists, Salons
    if (
      hasAnyWord(['стилист', 'стилиста', 'стилисту', 'салон', 'салона', 'парикмахер', 'барбер', 'барбершоп', 'маникюр', 'ресницы', 'брови', 'бьюти', 'массаж', 'косметолог']) ||
      hasSubstring('стилист') ||
      hasSubstring('бьюти')
    ) {
      return {
        reply: 'Для бьюти-сферы и стилистов:\n\n• Связываем Telegram и Instagram с YClients или DIKIDI\n• Бот показывает портфолио по категориям (окрашивание, стрижки, капсулы гардероба)\n• Проверяет свободные слоты в календаре мастера и сам оформляет запись\n• Автоматически отправляет напоминание за 3 часа, чтобы клиент не забыл о визите\n\nНи один клиент из Direct или Telegram не потеряется ночью!',
        crmAction: 'amoCRM: Заявка на автоматизацию бьюти/стилиста · Интеграция с YClients',
      };
    }

    // Construction, Renovation, Interior Design
    if (
      hasAnyWord(['ремонт', 'ремонта', 'стройк', 'стройка', 'квартир', 'квартиры', 'отделка', 'замер', 'замерщик', 'интерьер', 'дизайн', 'дизайнер', 'мебель']) ||
      hasSubstring('ремонт') ||
      hasSubstring('стройк')
    ) {
      return {
        reply: 'Для строительных компаний, студий ремонта и мебели:\n\n• Бот уточняет метраж, тип объекта (новостройка/вторичка) и пожелания\n• Мгновенно рассчитывает вилку сметы (например, «от 450 000 ₽»)\n• Предлагает свободные окна для бесплатного выезда замерщика\n• В amoCRM падает готовая карточка с параметрами объекта и контактом.',
        crmAction: 'Сделка «Ремонт под ключ» создана в amoCRM · Бюджет 450 000 ₽',
      };
    }

    // Dentistry, Clinics, Doctors, Medicine
    if (
      hasAnyWord(['клиника', 'клиники', 'стоматолог', 'стоматология', 'врач', 'врача', 'доктор', 'медицин', 'анализы', 'прием']) ||
      hasSubstring('клиник') ||
      hasSubstring('стоматолог')
    ) {
      return {
        reply: 'Для медицины и стоматологий:\n\n• Первичный триаж: бот уточняет симптомы или необходимую услугу\n• Подбор специалиста и свободного времени в МИС (Инфоклиника, Medesk, 1C:Медицина)\n• Снижение неявок до 70% за счет подтверждения записи в мессенджере\n• Контакт и история обращения сразу фиксируются в карте пациента.',
        crmAction: 'amoCRM: Запись пациента · МИС интеграция',
      };
    }

    // E-commerce, Marketplaces (WB, Ozon), Retail
    if (
      hasAnyWord(['wb', 'ozon', 'вайлдберриз', 'озон', 'маркетплейс', 'магазин', 'одежда', 'шоурум', 'доставка', 'товар', 'товары']) ||
      hasSubstring('вайлдберриз') ||
      hasSubstring('озон') ||
      hasSubstring('маркетплейс')
    ) {
      return {
        reply: 'Для селлеров и e-commerce:\n\n• Автоматический мониторинг цен конкурентов и остатков на складах\n• Бот поддержки: статус заказа по трек-номеру через API МойСклад или служб доставки\n• Каталог товаров прямо в Telegram WebApp с оплатой в 1 клик\n• Сбор отзывов и повторные продажи по базе покупателей.',
        crmAction: 'amoCRM: Лид из E-commerce · МойСклад API',
      };
    }

    // Wholesale, Warehouses, B2B Manufacturing
    if (
      hasAnyWord(['опт', 'оптом', 'склад', 'склада', 'производство', 'завод', 'поставки', 'b2b']) ||
      hasSubstring('оптом') ||
      hasSubstring('склад')
    ) {
      return {
        reply: 'Для B2B, опта и складских компаний:\n\n• Авто-квалификация контрагента по ИНН через DaData/Контур.Фокус\n• Проверка остатков номенклатуры в 1С / МойСклад в реальном времени\n• Формирование и отправка PDF-счета и КП за 15 секунд\n• Разгрузка отдела продаж от рутинных переписок с мелкими запросами.',
        crmAction: 'amoCRM: B2B Оптовый клиент · Проверка контрагента выполнена',
      };
    }

    // General Services
    if (hasAnyWord(['услуги', 'услуг', 'сервис', 'консультант']) && words.length <= 3) {
      return {
        reply: 'Для сферы услуг главное — исключить долгое ожидание ответа. Бот моментально показывает прайс, свободные слоты в календаре мастера/эксперта, принимает предоплату и шлет напоминания. Какая конкретно у вас услуга?',
        crmAction: 'amoCRM: Сегмент «Сфера услуг»',
      };
    }

    // Auto Service, Detailing, Parts
    if (
      hasAnyWord(['авто', 'автосервис', 'машина', 'машины', 'автомойка', 'шиномонтаж', 'запчасти', 'сто', 'детейлинг']) ||
      hasSubstring('автосервис')
    ) {
      return {
        reply: 'Для автосервисов и детейлинга:\n\n• Бот запрашивает марку, год и госномер/VIN\n• Озвучивает вилку стоимости регламентных работ или оклейки\n• Записывает на свободный подъемник/бокс с синхронизацией в CRM.',
        crmAction: 'amoCRM: Запись на сервис создана · Автомобиль зафиксирован',
      };
    }

    // Online Schools, Coaches, Infobiz
    if (
      hasAnyWord(['курс', 'курсы', 'школа', 'обучение', 'коуч', 'инфобиз', 'клуб', 'вебинар', 'подписка']) ||
      hasSubstring('инфобиз') ||
      hasSubstring('онлайн-школ')
    ) {
      return {
        reply: 'Для онлайн-школ и экспертов:\n\n• Автовыдача лид-магнитов и прогревающие воронки сообщений\n• Платные закрытые Telegram-каналы по подписке (Prodamus/ЮKassa + авто-кик)\n• Интеграция с GetCourse и CRM, дожим сомневающихся до оплаты.',
        crmAction: 'amoCRM: Лид из образовательной воронки',
      };
    }

    // Guarantees & Contract
    if (
      hasSubstring('гарант') ||
      hasSubstring('договор') ||
      hasSubstring('оплат') ||
      hasSubstring('аванс') ||
      hasSubstring('ип') ||
      hasSubstring('безнал')
    ) {
      return {
        reply: 'Работаем официально по договору с ИП. Оплата делится на этапы (50% аванс / 50% после проверки системы в бою). После сдачи действует 14 дней гарантийной поддержки и обучающая видеоинструкция для команды.',
      };
    }

    // ==========================================
    // 15. Dynamic Rotating Contextual Fallbacks
    // ==========================================
    const fallbacks = [
      {
        reply: 'Интересная мысль! Я демонстрационный AI-ассистент Андрея (@ANGROVE).\n\nПодскажите, что в вашем бизнесе отнимает больше всего времени: переписка с клиентами 24/7, перенос заявок в CRM, расчет смет или сбор контактов?',
        crmAction: 'CRM: Уточнение бизнес-процесса клиента',
      },
      {
        reply: 'Понял вас! Любой нестандартный сценарий или интеграцию Андрей реализует под ключ на Python и n8n.\n\nНапишите Андрею напрямую в Telegram: @ANGROVE — он за 15 минут сориентирует по архитектуре и стоимости решения именно для вас.',
        crmAction: 'CRM: Запрос индивидуальной консультации',
      },
      {
        reply: 'Чтобы я помог точнее: в какой нише у вас проект (услуги, e-commerce, стройка, бьюти, опт) и какую систему учета вы используете (amoCRM, Bitrix24, МойСклад или Google Таблицы)?',
        crmAction: 'CRM: Уточнение используемой CRM-системы',
      },
    ];

    const currentFallback = fallbacks[fallbackIndex % fallbacks.length];
    setFallbackIndex((prev) => prev + 1);
    return currentFallback;
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = (textToSend || inputValue).trim();
    if (!rawText || isTyping) return;
    const text = rawText.slice(0, 500);

    trackGoal('simulate_bot_message');

    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: currentTime,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Realistic typing delay (600 - 850ms)
    setTimeout(() => {
      const { reply, crmAction } = getAiAnswer(text, newHistory);
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
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      data-lenis-prevent="true"
      className="w-full bg-[#0E1621] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-[520px] sm:h-[560px] font-sans overscroll-contain select-text"
    >
      
      {/* 1. Telegram Desktop Header */}
      <div className="bg-[#17212B] px-4 py-3 border-b border-[#101720] flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-blue/40">
              <img
                src="/andrey-avatar.webp"
                alt="Андрей"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                width={40}
                height={40}
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
            href={getTelegramUrl(TELEGRAM_MESSAGES.simulator)}
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
      <div 
        ref={chatContainerRef} 
        data-lenis-prevent="true"
        className="flex-1 p-3.5 sm:p-5 telegram-chat-scroll space-y-3 bg-[#0E1621] relative overscroll-contain"
      >
        
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
          maxLength={500}
          autoComplete="off"
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

      {/* Bottom Live System Sync Status Bar */}
      {lastCrmAlert && (
        <div className="bg-[#101721] px-4 py-2 border-t border-white/[0.06] text-[11px] text-zinc-300 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-light animate-pulse" />
            <span className="font-mono text-zinc-200">{lastCrmAlert}</span>
          </div>
          <span className="text-zinc-500 font-mono text-[10px]">LIVE SYNC</span>
        </div>
      )}
    </div>
  );
};
