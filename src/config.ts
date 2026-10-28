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
