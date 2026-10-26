# Руководство по безопасности и настройке заголовков для angrove.ru

Данный документ содержит пошаговую инструкцию по закрытию замечаний аудита безопасности (securityheaders.com), защите почты от спуфинга, настройке DNS и безопасной схеме работы с формами.

---

## 1. Настройка Security Headers в Cloudflare (Transform Rules)

Так как GitHub Pages является статическим хостингом и не позволяет напрямую конфигурировать серверные HTTP-заголовки ответа, стандартный путь повышения рейтинга на **securityheaders.com** с оценки **F** до **A / A+** — проксирование через бесплатный Cloudflare и добавление заголовков через **Transform Rules**.

### Шаг 1.1. Подготовка домена в Cloudflare
1. В панели Cloudflare перейдите в раздел **DNS** ➔ **Records**.
2. Убедитесь, что для записей `A` (@) и `CNAME` (www) включено **оранжевое облако (Proxied)**.
3. В разделе **SSL/TLS**:
   * Выберите режим **Full (strict)** (сертификат Let's Encrypt на GitHub Pages уже валиден).
   * В подразделе **Edge Certificates** включите переключатель **Always Use HTTPS**.
   * Включите **Minimum TLS Version**: `TLS 1.2` или `TLS 1.3`.
   * Включите **Opportunistic Encryption** и **Automatic HTTPS Rewrites**.

### Шаг 1.2. Создание правила заголовков (Modify Response Header)
1. В левом меню Cloudflare перейдите в **Rules** ➔ **Transform Rules**.
2. Выберите вкладку **Modify Response Header** и нажмите **Create rule**.
3. Задайте имя правила: `Security Headers - Production`.
4. В блоке **If incoming requests match...** выберите:
   * **All incoming requests**
5. В блоке **Then...** добавьте 6 заголовков (тип: **Set static**):

| Header Name | Value | Назначение |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000` | Принудительный HTTPS на 1 год (HSTS). *Примечание: директивы `includeSubDomains` и `preload` включайте только после проверки работоспособности всех возможных поддоменов!* |
| `X-Content-Type-Options` | `nosniff` | Блокирует MIME-sniffing атак. |
| `X-Frame-Options` | `SAMEORIGIN` | Блокирует Clickjacking (встраивание сайта во враждебные iframe). |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Скрывает внутренние пути URL при переходе по внешним ссылкам. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Запрещает доступ браузера к камере, микрофону, геолокации и оборудованию. |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' https://mc.yandex.ru; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://mc.yandex.ru; media-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' https://mc.yandex.ru; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://t.me;` | Строгая политика источников ресурсов с поддержкой Yandex Metrika и Telegram CTA. |

6. Нажмите **Deploy** внизу страницы.

### Шаг 1.3. Проверка и очистка кэша
1. В разделе **Caching** ➔ **Configuration** нажмите **Purge Everything** (очистить кэш).
2. Откройте [securityheaders.com](https://securityheaders.com) и протестируйте `https://angrove.ru`.
   * **Ожидаемая оценка:** **A** (или **A+** при последующем добавлении `includeSubDomains; preload` в HSTS).

---

## 2. Безопасность почты и защита от спуфинга (SPF, DKIM, DMARC, CAA)

Злоумышленники могут рассылать спам или фишинговые письма от имени `info@angrove.ru` или `ceo@angrove.ru`, если в DNS отсутствуют записи аутентификации отправителя.

Настройки вносятся в панели DNS (Reg.ru или Cloudflare, если NS делегированы туда):

### 2.1. SPF (Sender Policy Framework)
* **Если с домена angrove.ru ВООБЩЕ НЕ отправляются письма:**  
  Добавьте TXT-запись, которая на 100% блокирует любые попытки отправки почты с этого домена:
  ```text
  Type: TXT
  Name: @
  Value: v=spf1 -all
  ```
* **Если вы используете Яндекс 360 (Почта для домена):**
  ```text
  Type: TXT
  Name: @
  Value: v=spf1 include:_spf.yandex.net ~all
  ```
* **Если вы используете VK WorkMail (Mail.ru для бизнеса):**
  ```text
  Type: TXT
  Name: @
  Value: v=spf1 include:_spf.mail.ru ~all
  ```
* **Если Google Workspace:**
  ```text
  Type: TXT
  Name: @
  Value: v=spf1 include:_netblocks.google.com include:_netblocks2.google.com include:_netblocks3.google.com ~all
  ```

### 2.2. DKIM (DomainKeys Identified Mail)
Цифровая подпись писем. Уникальный открытый ключ генерируется в панели вашего почтового сервиса:
1. Зайдите в панель управления почтой (Яндекс 360 / Mail.ru / Google).
2. Скопируйте предоставленную TXT-запись DKIM (обычно `mail._domainkey` или `yandex._domainkey`).
3. Добавьте её в DNS:
   ```text
   Type: TXT
   Name: mail._domainkey
   Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... [ваш публичный ключ из панели почты]
   ```

### 2.3. DMARC (Domain-based Message Authentication)
Указывает почтовым серверам мира (Gmail, Mail.ru, Яндекс), что делать с поддельными письмами:
```text
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:security@angrove.ru; pct=100; adkim=r; aspf=r;
```
> **Пояснения параметров:**
> * `p=quarantine` — помещать подозрительные письма в спам (для полной блокировки используйте `p=reject` после отладки DKIM).
> * `rua=mailto:security@angrove.ru` — адрес для получения агрегированных отчетов о попытках отправки от вашего имени (замените на ваш email).
> * `pct=100` — применять правило к 100% писем.

### 2.4. CAA (Certificate Authority Authorization)
Защита от выпуска поддельных SSL-сертификатов неавторизованными удостоверяющими центрами:
```text
Type: CAA
Name: @
Tag: issue
Value: "letsencrypt.org"

Type: CAA
Name: @
Tag: issuewild
Value: ";"
```
*(Разрешает выпуск сертификатов только Let's Encrypt и запрещает выпуск wildcard-сертификатов без явного указания).*

---

## 3. Защита учетных записей и регистратора
1. **GitHub:**
   * Включите 2FA (Two-Factor Authentication) через TOTP-приложение (1Password, Google Authenticator) или аппаратный ключ.
   * Настройте **GitHub Push Protection** и **Secret Scanning** в настройках репозитория (*Settings ➔ Code security and analysis*).
2. **Регистратор домена (Reg.ru):**
   * Включите двухфакторную аутентификацию (SMS/TOTP) для входа в личный кабинет.
   * Включите функцию **Блокировка трансфера (Registry Lock / Transfer Lock)**, чтобы предотвратить несанкционированный перенос домена.
   * Включите защиту контактных данных администратора (Whois Privacy / сокрытие персональных данных).
3. **Cloudflare:**
   * Включите 2FA.
   * Сохраните резервные коды восстановления (Backup codes) в безопасном менеджере паролей.

---

## 4. Архитектура безопасной отправки форм и лидов (Serverless-прокси)

### Почему нельзя отправлять данные в Telegram/n8n напрямую из браузера?
Если поместить `BOT_TOKEN` Telegram или секретный URL вебхука прямо в JavaScript-код фронтенда:
* Любой посетитель может открыть вкладку **Network** или **Sources** в DevTools и увидеть токен за 2 клика.
* Злоумышленник сможет спамить в вашего бота, читать входящие сообщения или остановить n8n-пайплайн.

### Рекомендуемая безопасная архитектура:
```
[ Браузер клиента ]
        │  (HTTPS POST без секретов)
        ▼
[ Cloudflare Worker (Serverless Proxy) ]
        │  • Проверка Origin: https://angrove.ru
        │  • Rate Limiting (не более 3 запросов в минуту с 1 IP)
        │  • Honeypot проверка (защита от ботов)
        │  • Секретный BOT_TOKEN / WEBHOOK хранится в Cloudflare Secrets
        ▼
[ Telegram Bot API / n8n Webhook ]
```

### Пример готового кода Cloudflare Worker (`worker.js`):
```javascript
export default {
  async fetch(request, env) {
    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://angrove.ru",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // 2. Проверка Origin
    const origin = request.headers.get("Origin");
    if (origin !== "https://angrove.ru") {
      return new Response("Forbidden: Invalid Origin", { status: 403 });
    }

    try {
      const data = await request.json();

      // 3. Honeypot проверка (скрытое поле, заполняемое только ботами)
      if (data._hp && data._hp.length > 0) {
        // Тихо возвращаем успех, но ничего не отправляем
        return new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://angrove.ru" },
        });
      }

      // 4. Валидация входных данных
      const contact = String(data.contact || "").trim().slice(0, 100);
      const message = String(data.message || "").trim().slice(0, 1000);

      if (!contact) {
        return new Response(JSON.stringify({ error: "Contact is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://angrove.ru" },
        });
      }

      // 5. Отправка в Telegram через скрытый env.TELEGRAM_BOT_TOKEN
      const text = `🔥 Новая заявка с angrove.ru:\n\nКонтакт: ${contact}\nСообщение: ${message}`;
      const tgUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: text,
        }),
      });

      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://angrove.ru" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Internal Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://angrove.ru" },
      });
    }
  },
};
```
