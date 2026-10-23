export interface AppConfig {
  telegramUrl: string;
  instagramUrl: string;
  formEndpoint?: string;
  metrikaId?: string;
}

export const config: AppConfig = {
  telegramUrl: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/angrove',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/angrove',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  metrikaId: import.meta.env.VITE_METRIKA_ID || '',
};
