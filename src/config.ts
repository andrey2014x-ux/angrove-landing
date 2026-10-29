export interface AppConfig {
  siteUrl: string;
  telegramUrl: string;
  telegramChannelUrl: string;
  vcUrl: string;
  vkUrl: string;
  instagramUrl: string;
  formEndpoint?: string;
  metrikaId?: string;
}

export const config: AppConfig = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://angrove.ru',
  telegramUrl: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/ANGROVE',
  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/angrove_ai',
  vcUrl: import.meta.env.VITE_VC_URL || 'https://vc.ru/id6161578',
  vkUrl: import.meta.env.VITE_VK_URL || 'https://vk.com/angrove',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/_angrove_',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  metrikaId: import.meta.env.VITE_METRIKA_ID || '',
};

export const TELEGRAM_MESSAGES = {
  general: 'Добрый день, Андрей! Я с сайта angrove.ru, хочу обсудить автоматизацию процессов и аудит.',
  bot: 'Добрый день, Андрей! Интересует разработка умного Telegram-бота для бизнеса.',
  voice: 'Добрый день, Андрей! Интересует внедрение голосового AI-помощника для звонков.',
  parser: 'Добрый день, Андрей! Нужен сбор базы клиентов и парсинг под мою нишу.',
  n8n: 'Добрый день, Андрей! Хочу связать CRM, сайт и склад через n8n без ошибок.',
  cases: 'Добрый день, Андрей! Увидел кейсы на сайте, хочу реализовать похожее решение.',
  process: 'Добрый день, Андрей! Хочу обсудить спринт и запустить проект автоматизации.',
  about: 'Добрый день, Андрей! Хочу проконсультироваться по архитектуре автоматизации для моей компании.',
  simulator: 'Добрый день, Андрей! Протестировал демо-бота на сайте, хочу заказать похожего под свою нишу.',
  guide: 'Добрый день, Андрей! Хочу получить гайд по автоматизации и задать вопрос по своему проекту.',
  pain: 'Добрый день, Андрей! Хочу убрать рутину и автоматизировать повторяющиеся процессы в бизнесе.',
  footer: 'Добрый день, Андрей! Я по поводу AI-автоматизации бизнеса под ключ.',
} as const;

/**
 * Generates a direct Telegram deep link with an optional pre-filled message.
 * When the user taps the link, Telegram opens the chat with @ANGROVE
 * and pre-populates the input box with the provided message.
 */
export function getTelegramUrl(message?: string): string {
  const base = config.telegramUrl;
  const text = message || TELEGRAM_MESSAGES.general;
  return `${base}?text=${encodeURIComponent(text)}`;
}
