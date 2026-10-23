import React, { useState, useEffect } from 'react';
import { LeopardDivider } from '../ui/LeopardDivider';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { CheckCircle2, Download, AlertCircle, FileText, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuideForm: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [business, setBusiness] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Honeypot check (anti-bot)
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    // Validation
    if (!name.trim()) {
      setErrorMsg('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('Пожалуйста, укажите Telegram-ник или телефон для связи.');
      return;
    }
    if (!consent) {
      setErrorMsg('Необходимо согласиться на обработку персональных данных.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      contact: contact.trim(),
      business: business.trim(),
      ...utmParams,
      submittedAt: new Date().toISOString(),
    };

    try {
      if (config.formEndpoint) {
        const response = await fetch(config.formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
      } else {
        // Fallback simulation when endpoint is not configured
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Morph button to checkmark
      setShowCheck(true);
      trackGoal('form_submit');

      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Form submission error:', err);
      setErrorMsg('Не удалось отправить данные. Попробуйте еще раз или напишите напрямую в Telegram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-accent text-white py-20 sm:py-28 overflow-hidden" id="guide">
      {/* Top Leopard Accent Strip */}
      <div className="absolute top-0 left-0 w-full">
        <LeopardDivider height={8} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: What's inside the guide */}
          <div className="lg:col-span-5 text-left">
            <span className="font-mono text-xs font-bold text-ice tracking-[0.2em] uppercase bg-white/10 px-3 py-1 rounded-full mb-3 inline-block">
              БЕСПЛАТНЫЙ МАТЕРИАЛ
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1] mb-6">
              Начните с гида
            </h2>

            <p className="text-ice/90 text-sm sm:text-base mb-6 leading-relaxed">
              Короткий прикладной документ без «воды», который поможет найти рутину в вашей компании и понять, что можно автоматизировать в первую очередь:
            </p>

            <ul className="flex flex-col gap-3.5 mb-8 text-sm sm:text-base font-medium text-white">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                <span>правило «3 раза подряд»</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                <span>3 инструмента автоматизации</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
                <span>чек-лист «где утекает время»</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-mono text-ice">
              <FileText size={20} className="text-white flex-shrink-0" />
              <span>Формат: PDF · Читается за 7 минут · Сразу в работу</span>
            </div>
          </div>

          {/* Right Column: Lead Form with Floating Labels or Success State */}
          <div className="lg:col-span-7">
            <div className="bg-ink rounded-card-lg p-6 sm:p-10 border border-line shadow-2xl relative">
              {!submitted ? (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 text-left">
                  <h3 className="font-display font-black text-2xl text-white mb-1">
                    Получить гид
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mb-4">
                    Заполните пару полей — файл станет доступен для скачивания сразу.
                  </p>

                  {/* Honeypot field (hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Leave empty</label>
                    <input
                      type="text"
                      id="website_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Field: Name with floating label */}
                  <div className="relative">
                    <input
                      type="text"
                      id="form_name"
                      required
                      placeholder=" "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer w-full bg-surface border border-line rounded-xl px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-bright focus:shadow-[0_0_15px_rgba(97,125,255,0.3)] transition-all"
                    />
                    <label
                      htmlFor="form_name"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-accent-bright pointer-events-none"
                    >
                      Имя *
                    </label>
                  </div>

                  {/* Field: Contact with floating label */}
                  <div className="relative">
                    <input
                      type="text"
                      id="form_contact"
                      required
                      placeholder=" "
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="peer w-full bg-surface border border-line rounded-xl px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-bright focus:shadow-[0_0_15px_rgba(97,125,255,0.3)] transition-all"
                    />
                    <label
                      htmlFor="form_contact"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-1.5 peer-focus:text-accent-bright pointer-events-none"
                    >
                      Telegram-ник или телефон *
                    </label>
                  </div>

                  {/* Field: Business with floating label */}
                  <div className="relative">
                    <input
                      type="text"
                      id="form_business"
                      placeholder=" "
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      className="peer w-full bg-surface border border-line rounded-xl px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-accent-bright focus:shadow-[0_0_15px_rgba(97,125,255,0.3)] transition-all"
                    />
                    <label
                      htmlFor="form_business"
                      className="absolute left-4 top-2 text-[10px] font-mono uppercase text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-1.5 peer-focus:text-accent-bright pointer-events-none"
                    >
                      Чем занимаетесь (необязательно)
                    </label>
                  </div>

                  {/* Required Checkbox Consent */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="w-4 h-4 mt-1 rounded border-line bg-surface text-accent focus:ring-accent focus:ring-offset-ink cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 leading-normal">
                        Согласен на обработку персональных данных и{' '}
                        <a
                          href="/privacy"
                          className="text-accent-bright underline hover:text-white transition-colors"
                        >
                          политикой конфиденциальности
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button Morphing */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={loading || showCheck}
                      className={`relative inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-300 select-none cursor-pointer ${
                        loading || showCheck
                          ? 'w-14 h-14 p-0 bg-accent text-white shadow-glow-accent-lg'
                          : 'w-full py-4 px-8 text-base bg-accent text-white hover:bg-accent-bright shadow-glow-accent hover:shadow-glow-accent-lg'
                      }`}
                    >
                      {loading && (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}

                      {showCheck && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Check size={28} className="text-white" strokeWidth={3} />
                        </motion.div>
                      )}

                      {!loading && !showCheck && (
                        <div className="inline-flex items-center gap-2">
                          <Sparkles size={18} className="text-ice" />
                          <span>Получить гид</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success State with Instant Download Button */
                <div className="py-6 sm:py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-success mb-4 shadow-sm animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                    Спасибо!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-sm mb-6 leading-relaxed">
                    Гид готов к скачиванию. Нажмите кнопку ниже, чтобы сохранить PDF на ваше устройство.
                  </p>

                  <a
                    href="/guide.pdf"
                    download="guide-angrove.pdf"
                    data-cursor="download"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-bold text-base hover:bg-accent-bright hover:shadow-glow-accent-lg transition-all"
                  >
                    <Download size={18} />
                    <span>Скачать guide.pdf</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Leopard Accent Strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <LeopardDivider height={8} />
      </div>
    </section>
  );
};
