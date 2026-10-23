import React, { CSSProperties, FormEvent, useEffect, useMemo, useState } from 'react';
import { config } from './config';

const Arrow = () => <span aria-hidden="true">↗</span>;

const LeopardLogo = ({ home = true }: { home?: boolean }) => (
  <a className="logo leopard-logo" href={home ? '#top' : undefined} aria-label="_angrove_ — на главную">
    {'_angrove_'.split('').map((letter, index) => (
      <span key={`${letter}-${index}`} style={{ '--letter': index } as CSSProperties}>{letter}</span>
    ))}
  </a>
);

const tasks = [
  'Отвечать на повторяющиеся сообщения',
  'Собирать и сортировать контент',
  'Переносить данные между сервисами',
  'Искать и проверять информацию',
  'Формировать документы и отчёты',
  'Следить за заявками и задачами',
];

const solutions = [
  ['01', 'Для автора или эксперта', 'Персональный AI-инструмент', 'Работает с вашим контентом, знаниями и привычным способом работы — без универсальных шаблонов.', 'База знаний · контент · ответы · исследования'],
  ['02', 'Для коммуникаций', 'Ассистент, который не теряет контекст', 'Отвечает, уточняет, квалифицирует запрос и передаёт человеку уже собранную задачу.', 'Telegram · WhatsApp · формы · календарь'],
  ['03', 'Для данных', 'Парсер и мониторинг', 'Сам находит, проверяет и приводит информацию к нужному формату — по расписанию или событию.', 'Сайты · каталоги · таблицы · уведомления'],
  ['04', 'Для команды и компании', 'Система из нескольких сервисов', 'Связывает заявки, CRM, документы и отчётность в один прозрачный процесс.', 'CRM · API · n8n · Python · внутренние сервисы'],
];

const faqs = [
  ['Сколько стоит разработка?', 'Небольшой скрипт или парсер — от 15 000 ₽. Интеграция или бот — от 30 000 ₽. Сложная система оценивается после короткого разбора. Стоимость фиксируется до старта.'],
  ['Сколько занимает запуск?', 'Первый работающий прототип обычно появляется за 3–5 рабочих дней. Срок всей системы зависит от количества сервисов, сценариев и требований к данным.'],
  ['Можно начать с небольшой задачи?', 'Да. Часто лучший старт — один повторяющийся процесс, на котором можно быстро проверить эффект и только потом расширять систему.'],
  ['Где будут храниться данные?', 'В ваших аккаунтах, облаке или на вашем сервере. Архитектура и доступы передаются вам — без привязки к закрытой платформе исполнителя.'],
];

export const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Здравствуйте! Опишите процесс, который отнимает время — покажу, как его можно автоматизировать.' },
  ]);

  useEffect(() => {
    document.documentElement.classList.add('js');
    const reveal = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    );
    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--scroll-progress', String(progress));
        document.documentElement.style.setProperty('--hero-drift', `${Math.min(window.scrollY * 0.055, 34)}px`);
      });
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => { reveal.disconnect(); window.removeEventListener('scroll', updateScroll); cancelAnimationFrame(frame); };
  }, []);

  const telegramBrief = useMemo(() => {
    if (!selected.length) return config.telegramUrl;
    const list = selected.map(index => `— ${tasks[index]}`).join('\n');
    return `${config.telegramUrl}?text=${encodeURIComponent(`Андрей, хочу обсудить автоматизацию:\n${list}`)}`;
  }, [selected]);

  const toggleTask = (index: number) => {
    setSelected(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  };

  const answerChat = (value: string) => {
    const text = value.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    let answer = 'Похоже, здесь нужен короткий разбор процесса: откуда приходит информация, что происходит вручную и какой результат нужен. Обычно первый прототип можно показать за 3–5 дней.';
    if (lower.includes('сто') || lower.includes('цен') || lower.includes('бюдж')) answer = 'Небольшие скрипты и парсеры начинаются от 15 000 ₽, интеграции и боты — от 30 000 ₽. Точная смета фиксируется после разбора сценария.';
    else if (lower.includes('срок') || lower.includes('долго') || lower.includes('дней')) answer = 'Первый рабочий прототип обычно готов за 3–5 рабочих дней. Сложная система запускается по этапам, чтобы пользу можно было проверить раньше.';
    else if (lower.includes('контент') || lower.includes('блог') || lower.includes('автор')) answer = 'Можно собрать персональный инструмент: он будет работать с вашей базой материалов, сортировать идеи, готовить ответы и сохранять ваш контекст.';
    else if (lower.includes('crm') || lower.includes('заяв') || lower.includes('лид')) answer = 'Можно связать входящие заявки, проверку данных, CRM и уведомления в одну цепочку — без ручного копирования между сервисами.';
    setChatMessages(current => [...current, { role: 'user', text }, { role: 'assistant', text: answer }]);
    setChatInput('');
  };

  const submitChat = (event: FormEvent) => { event.preventDefault(); answerChat(chatInput); };

  return (
    <div className="site-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <header className="header">
        <LeopardLogo />
        <nav className={menuOpen ? 'nav is-open' : 'nav'} aria-label="Основная навигация">
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Решения</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Проекты</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>Процесс</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Обо мне</a>
        </nav>
        <a className="header-cta" href={config.telegramUrl} target="_blank" rel="noreferrer">Обсудить задачу <Arrow /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}><span /><span /></button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><i /> AI-инструменты · автоматизация · интеграции</p>
            <h1><span className="hero-line">Заменяю</span><span className="hero-line script">ручной труд</span><span className="hero-line leopard">КОДОМ</span></h1>
            <p className="hero-lead">Проектирую цифровые системы под ваши процессы — от персонального AI-инструмента до автоматизации работы команды.</p>
            <div className="hero-actions"><a className="button button-dark" href={config.telegramUrl} target="_blank" rel="noreferrer">Обсудить задачу <Arrow /></a><a className="text-link" href="#work">Посмотреть проекты <span>↓</span></a></div>
            <p className="hero-note">Опишите идею или процесс в двух предложениях — отвечу лично.</p>
          </div>
          <div className="portrait-wrap" aria-label="Андрей — разработчик систем автоматизации">
            <div className="portrait-index">01 / ANDREY</div>
            <div className="portrait-frame"><img src="/andrey.jpg" alt="Андрей — разработчик AI-инструментов и автоматизаций" width="824" height="1024" /><div className="portrait-cut leopard-surface" /></div>
            <p>5+ лет в разработке <span>Москва · работаю по всему миру</span></p>
          </div>
        </section>

        <section className="proof-strip" aria-label="Факты о работе">
          <div><strong>от 3 дней</strong><span>до первого прототипа</span></div><div><strong>фиксированная смета</strong><span>до начала разработки</span></div><div><strong>ваши аккаунты</strong><span>код и данные остаются у вас</span></div><div><strong>30 дней</strong><span>поддержки после запуска</span></div>
        </section>

        <section className="task-section section-pad" id="tasks">
          <div className="section-intro" data-reveal><p className="eyebrow"><i /> Начнём с вашей задачи</p><h2>Что вы хотите<br/><em>перестать делать вручную?</em></h2><p>Выберите знакомые процессы. Это не тест — выбор сразу соберётся в сообщение Андрею.</p></div>
          <div className="task-layout">
            <div className="task-list" role="group" aria-label="Повторяющиеся процессы">
              {tasks.map((task, index) => <button key={task} className={selected.includes(index) ? 'task is-selected' : 'task'} onClick={() => toggleTask(index)} aria-pressed={selected.includes(index)}><span className="task-number">0{index + 1}</span><span>{task}</span><b>{selected.includes(index) ? '✓' : '+'}</b></button>)}
            </div>
            <aside className="task-result" data-reveal><span className="result-count">{String(selected.length).padStart(2, '0')}</span><p>{selected.length ? 'процесса уже можно разобрать' : 'Выберите процессы слева'}</p><div className="route-line"><span /></div><p className="result-copy">{selected.length ? 'Я посмотрю, какие действия можно объединить в одну систему, и предложу архитектуру.' : 'Отметьте всё, что регулярно забирает ваше внимание.'}</p><a className={selected.length ? 'button button-blue' : 'button button-blue is-muted'} href={telegramBrief} target="_blank" rel="noreferrer">Отправить Андрею <Arrow /></a></aside>
          </div>
        </section>

        <section className="solutions section-pad" id="solutions">
          <div className="section-intro invert" data-reveal><p className="eyebrow"><i /> Масштаб решения</p><h2>От личного инструмента<br/><em>до системы для команды</em></h2></div>
          <div className="solution-list">
            {solutions.map((item, index) => <article className="solution" key={item[0]} data-reveal><span className="solution-no">{item[0]}</span><div><p className="solution-kicker">{item[1]}</p><h3>{item[2]}</h3></div><p>{item[3]}</p><span className="solution-example">{item[4]}</span><span className="solution-arrow">{index % 2 ? '↘' : '→'}</span></article>)}
          </div>
        </section>

        <section className="ai-demo section-pad" id="demo">
          <div className="demo-copy" data-reveal>
            <p className="eyebrow"><i /> Живая демонстрация</p>
            <h2>Не презентация.<br/><em>Попробуйте сами.</em></h2>
            <p>Это компактный пример диалога. Ассистент понимает тему вопроса, отвечает по сценарию и показывает, как может выглядеть первая линия коммуникации.</p>
            <div className="demo-chips" aria-label="Примеры вопросов">
              {['Сколько это стоит?', 'Какие сроки?', 'Нужен инструмент для контента', 'Можно связать с CRM?'].map(question => <button key={question} onClick={() => answerChat(question)}>{question}</button>)}
            </div>
          </div>
          <div className="chat" data-reveal>
            <div className="chat-head"><div><span className="chat-avatar">AI</span><p><strong>Ассистент _angrove_</strong><small>демонстрационный сценарий</small></p></div><span className="chat-online">на связи</span></div>
            <div className="chat-body" aria-live="polite">
              {chatMessages.slice(-5).map((message, index) => <div key={`${message.role}-${index}`} className={`message ${message.role}`}><span>{message.role === 'assistant' ? 'AI' : 'ВЫ'}</span><p>{message.text}</p></div>)}
            </div>
            <form className="chat-form" onSubmit={submitChat}><label className="sr-only" htmlFor="demo-question">Ваш вопрос</label><input id="demo-question" value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="Напишите вопрос или задачу…" autoComplete="off"/><button type="submit" disabled={!chatInput.trim()} aria-label="Отправить сообщение">→</button></form>
          </div>
        </section>

        <section className="flow section-pad" aria-label="Пример работы автоматизации">
          <div className="flow-title" data-reveal><p className="eyebrow"><i /> Как работает система</p><h2>Хаос на входе.<br/><em>Готовое действие на выходе.</em></h2></div>
          <div className="flow-stage" data-reveal><div className="flow-inputs"><span>сообщение</span><span>таблица</span><span>документ</span><span>форма</span><span>голос</span></div><div className="flow-core"><div className="core-ring"/><strong>СИСТЕМА</strong><small>проверяет · связывает · действует</small></div><div className="flow-output"><span>01</span><strong>Задача выполнена</strong><small>данные записаны, человек уведомлён</small></div><svg className="flow-svg" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true"><path d="M120 180 C330 180 330 180 510 180 S790 180 1040 180" /></svg></div>
        </section>

        <section className="work section-pad" id="work">
          <div className="section-intro" data-reveal><p className="eyebrow"><i /> Избранные проекты</p><h2>Не макеты.<br/><em>Рабочие системы.</em></h2></div>
          <article className="case case-primary" data-reveal><div className="case-meta"><span>01</span><span>Парсинг и мониторинг</span><span>Подтверждённый проект</span></div><div className="case-copy"><h3>База поставщиков за минуты вместо недель поиска</h3><p>Система сама обходит открытые источники, проверяет контакты, удаляет дубли и обновляет рабочую таблицу команды.</p></div><div className="case-facts"><div><strong>3 мин</strong><span>на готовую выгрузку</span></div><div><strong>~60 ч</strong><span>экономии в месяц</span></div><div><strong>3 дня</strong><span>до запуска</span></div></div><div className="case-visual" aria-label="Схема сбора данных"><span>КАТАЛОГИ</span><span>КАРТЫ</span><span>САЙТЫ</span><b>500+ проверенных компаний</b></div></article>
          <div className="scenario-grid"><article className="scenario" data-reveal><span>02 / СЦЕНАРИЙ</span><h3>AI-ассистент для эксперта</h3><p>Знает материалы автора, помогает с входящими вопросами и собирает запрос перед личным ответом.</p><small>Контент → контекст → подготовленный диалог</small></article><article className="scenario scenario-blue" data-reveal><span>03 / СЦЕНАРИЙ</span><h3>Единый процесс для команды</h3><p>Заявки, документы и статусы движутся между сервисами без ручного копирования и забытых действий.</p><small>Форма → проверка → CRM → уведомление</small></article></div>
        </section>

        <section className="process section-pad" id="process"><div className="section-intro" data-reveal><p className="eyebrow"><i /> Без чёрного ящика</p><h2>От идеи<br/><em>до работающей системы</em></h2></div><ol className="process-list">{[['01','Разбираем задачу','Находим повторяющиеся действия и определяем полезный результат.'],['02','Проектируем сценарий','Фиксирую логику, сервисы, сроки и стоимость до разработки.'],['03','Собираем прототип','Проверяем систему на реальных примерах и пограничных случаях.'],['04','Запускаем и передаём','Разворачиваю в ваших аккаунтах, документирую и остаюсь на поддержке.']].map(item => <li key={item[0]} data-reveal><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></li>)}</ol></section>

        <section className="about section-pad" id="about"><div className="about-photo" data-reveal><img src="/andrey.jpg" alt="Андрей" width="824" height="1024" /></div><div className="about-copy" data-reveal><p className="eyebrow"><i /> Обо мне</p><h2>Привет,<br/><em>я Андрей.</em></h2><p className="about-lead">Я не продаю готовую платформу. Я разбираюсь в вашем процессе и собираю инструмент именно под него.</p><p>Работаю с задачами разного масштаба: от персонального помощника для автора до системы, которая объединяет процессы команды. Проектирую архитектуру, пишу код, подключаю сервисы и лично отвечаю за запуск.</p><div className="about-facts"><span><b>5+</b> лет в разработке</span><span><b>50+</b> запущенных сценариев</span><span><b>100%</b> контроль у клиента</span></div></div></section>

        <section className="faq section-pad" id="faq"><div className="section-intro" data-reveal><p className="eyebrow"><i /> Коротко о главном</p><h2>Вопросы<br/><em>перед стартом</em></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>0{index + 1}</span>{question}<b>{openFaq === index ? '−' : '+'}</b></button><div className={openFaq === index ? 'faq-answer is-open' : 'faq-answer'}><p>{answer}</p></div></div>)}</div></section>

        <section className="contact section-pad" id="contact"><p className="eyebrow"><i /> Следующий шаг</p><h2>Есть идея или процесс,<br/><em>который пора упростить?</em></h2><p>Опишите его в двух предложениях. Я отвечу лично и скажу, что здесь действительно стоит автоматизировать.</p><a className="button button-light" href={config.telegramUrl} target="_blank" rel="noreferrer">Написать Андрею <Arrow /></a><div className="contact-pattern leopard-surface" aria-hidden="true" /></section>
      </main>

      <footer className="footer"><LeopardLogo /><p>AI-инструменты и автоматизация под конкретные процессы.</p><div><a href={config.telegramUrl} target="_blank" rel="noreferrer">Telegram</a><a href={config.instagramUrl} target="_blank" rel="noreferrer">Instagram*</a></div><small>© 2026 · *Meta признана экстремистской организацией на территории РФ.</small></footer>
    </div>
  );
};
