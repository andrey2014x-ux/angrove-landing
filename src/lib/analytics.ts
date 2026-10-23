import { config } from '../config';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ym?: (id: number, action: string, target?: any, params?: any) => void;
  }
}

export type AnalyticsGoal =
  | 'click_guide'
  | 'form_submit'
  | 'click_telegram'
  | 'click_instagram'
  | 'click_case_discuss'
  | 'click_process_cta'
  | 'click_services_cta';

export function initAnalytics(): void {
  if (!config.metrikaId || typeof window === 'undefined') return;

  const metrikaNum = parseInt(config.metrikaId, 10);
  if (isNaN(metrikaNum)) return;

  // Insert Metrika script if not already present
  if (!document.getElementById('ym-script')) {
    const script = document.createElement('script');
    script.id = 'ym-script';
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    
    script.onload = () => {
      if (window.ym) {
        window.ym(metrikaNum, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      }
    };

    document.head.appendChild(script);
  }
}

export function trackGoal(goal: AnalyticsGoal): void {
  if (!config.metrikaId || typeof window === 'undefined') return;
  const metrikaNum = parseInt(config.metrikaId, 10);
  if (!isNaN(metrikaNum) && window.ym) {
    window.ym(metrikaNum, 'reachGoal', goal);
  }
}
