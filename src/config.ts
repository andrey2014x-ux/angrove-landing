export interface AppConfig {
  siteUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  formEndpoint?: string;
  metrikaId?: string;
}

export const config: AppConfig = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://angrove.ru',
  telegramUrl: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/ANGROVE',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/_angrove_',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  metrikaId: import.meta.env.VITE_METRIKA_ID || '',
};
