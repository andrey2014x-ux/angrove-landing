import { config } from '../config';

export interface ChatMessagePayload {
  sender: 'bot' | 'user';
  text: string;
  time?: string;
  id?: string;
  crmAction?: string;
  [key: string]: any;
}

export interface AiResponseResult {
  reply: string;
  crmAction?: string;
  isLive: boolean;
}

const WEBHOOK_TIMEOUT_MS = 5000;

/**
 * Queries external AI webhook if VITE_AI_WEBHOOK_URL is configured,
 * otherwise seamlessly falls back to the local scenario engine.
 * Guarantees zero UI breakage under any network, timeout, or format failure.
 */
export async function queryAiAssistant(
  query: string,
  history: ChatMessagePayload[],
  fallbackEngine: (query: string, history: any[]) => { reply: string; crmAction?: string }
): Promise<AiResponseResult> {
  const webhookUrl = (config.aiWebhookUrl || '').trim();

  // Fast path: if no webhook is set, run local engine immediately
  if (!webhookUrl) {
    const local = fallbackEngine(query, history);
    return { ...local, isLive: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: query,
        query,
        history: history.slice(-6).map((msg) => ({
          sender: msg.sender,
          text: msg.text,
          time: msg.time,
        })),
        timestamp: new Date().toISOString(),
        source: 'angrove-landing',
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const reply = data?.reply || data?.text || data?.message || data?.output || data?.response;

    if (typeof reply === 'string' && reply.trim().length > 0) {
      return {
        reply: reply.trim(),
        crmAction: typeof data.crmAction === 'string' && data.crmAction.trim() ? data.crmAction.trim() : undefined,
        isLive: true,
      };
    }

    throw new Error('Empty or invalid reply field in webhook payload');
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.warn('[AI Webhook Fallback]', err?.name === 'AbortError' ? 'Timeout' : err?.message);
    }
    const local = fallbackEngine(query, history);
    return { ...local, isLive: false };
  } finally {
    clearTimeout(timer);
  }
}
