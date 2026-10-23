import { config } from '../config';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ym?: (id: number, action: string, target?: any, params?: any) => void;
  }
}

export type AnalyticsGoal =
  | 'hero_cta_click'
  | 'header_cta_click'
  | 'sticky_cta_click'
  | 'about_cta_click'
  | 'final_cta_click'
  | 'case_cta_click'
  | 'audit_item_selected'
  | 'audit_cta_click'
  | 'task_selector_used'
  | 'selector_cta_click'
  | 'services_cta_click'
  | 'guide_click'
  | 'telegram_outbound'
  | 'roi_calculator_used'
  | 'service_selected'
  | 'motion_demo_replayed'
  | 'click_guide'
  | 'form_submit'
  | 'click_telegram'
  | 'click_instagram';

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
