# Спецификация Motion-дизайна (Motion Spec)

Данный документ описывает архитектуру, технологии и спецификацию анимаций лендинга личного бренда **«_angrove_»**.

---

## 🏛 1. Архитектурные принципы и производительность

1. **Целевой фреймрейт**: 60 FPS на средних мобильных устройствах и десктопах.
2. **Анимируемые свойства**: строго композитные свойства GPU (`transform`, `opacity`, `clip-path`). Полный отказ от анимаций `width`, `height`, `top`, `left` в цикле рендеринга.
3. **Бюджет бандла (Code Splitting)**:
   - Стартовый JS: **~161 КБ gzip** (в рамках лимита 180 КБ).
   - WebGL шейдер: вынесен в отдельный отложенный чанк `NeonLinesWebGL-*.js` (~14.9 КБ gzip), подгружается через `React.lazy` во время `requestIdleCallback`.
4. **Прогрессивное улучшение (Progressive Enhancement)**:
   - При старте добавляется класс `html.js`.
   - Если JS отключен или произошла ошибка загрузки, весь контент остается полностью видимым, читаемым и доступным.
   - `CLS = 0` (Cumulative Layout Shift): под все интерактивные блоки зарезервированы геометрические размеры.
5. **Доступность (Accessibility)**:
   - Нативная поддержка клавиатуры (Tab-навигация, Enter, Пробел).
   - Полноценная поддержка якорей (`#services`, `#how-it-works`, `#faq`, `#guide`) через перехватчик `lenis.scrollTo(..., { offset: -80 })`.
   - Поддержка системного поиска по странице (Ctrl/Cmd + F).

---

## 🌐 2. Глобальные эффекты

| Эффект | Файл компонента / логики | Где включается | Как отключается / Фолбэк |
|---|---|---|---|
| **Плавный скролл Lenis** | [`src/lib/motion.ts`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/lib/motion.ts) | Десктоп и мобильные | Автоматически отключается при `prefers-reduced-motion` |
| **Прелоадер (0→100%, 1.2 с)** | [`src/components/ui/Preloader.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/Preloader.tsx) | 1 раз за сессию (`sessionStorage`) | Пропускается сразу при повторном визите или `prefers-reduced-motion` |
| **Кастомный курсор** | [`src/components/ui/CustomCursor.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/CustomCursor.tsx) | Только Desktop (`pointer: fine`, $\ge 768$ px) | Отключен на touch/mobile; не скрывает системный курсор в полях ввода |
| **Магнитные кнопки (80 px)** | [`src/components/ui/PillButton.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/PillButton.tsx) | Кнопки CTA на Desktop | Отключен на touch/mobile, стандартная кнопка |
| **Волновой Hover (снизу вверх)** | [`src/components/ui/PillButton.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/PillButton.tsx) | Кнопки-пилюли | Аппаратный CSS `translate-y` |
| **Spotlight + 3D Tilt (6°)** | [`src/components/ui/CardSpotlight.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/CardSpotlight.tsx) | Карточки услуг и блоков | Отключен на mobile; плавный возврат при выходе курсора |
| **Полоса прогресса прокрутки** | [`src/components/ui/ScrollProgress.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/ScrollProgress.tsx) | Верх экрана (все экраны) | Легкий градиент `from-accent to-ice` |
| **Боковой индикатор «01 / 11»** | [`src/components/ui/SideSectionTracker.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/SideSectionTracker.tsx) | Правый край (Desktop $\ge 1024$ px) | Скрыт на экранах $< 1024$ px |
| **Зернистость (SVG шум 0.045)** | [`src/components/ui/NoiseGrain.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/NoiseGrain.tsx) | Глобальный оверлей | `pointer-events: none`, нулевая нагрузка на GPU |
| **Подчеркивание ссылок** | [`src/index.css`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/index.css) (`.hover-link-line`) | Ссылки в меню и подвале | CSS `scaleX(0) → scaleX(1)` |

---

## ⚡ 3. Эффекты по секциям

### 1. Первый экран (Hero) — [`Hero.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Hero.tsx)
- **Раскрытие H1**: Заголовок разбит по словам (`.hero-word`) с поворотом $3^\circ$ и смещением по оси Y (`stagger: 0.12s`).
- **Слово «кодом»**: Живая градиентная заливка (`background-clip: text`) с непрерывным мягким дрейфом блика (6 сек).
- **Duotone-фото**:
  - Параллакс по скроллу `yPercent: -12%`.
  - 3D-наклон за курсором до $8^\circ$ с мягким эластичным возвратом (`elastic.out`).
- **Плавающие интерфейсные карточки**:
  - Разные плоскости глубины: карточка 1 (`yPercent: -28%`), карточка 2 (`yPercent: -16%`).
  - Терминал парсера: циклический вывод живых строк лога с зеленым пульсирующим статусом.
  - Уведомление CRM: интерактивная плашка сделки `+120 000 ₽`.
- **Фон (Aurora + WebGL OGL)**:
  - Фоновый синий радиальный градиент с дыханием `opacity`.
  - Отложенный WebGL шейдер [`NeonLinesWebGL.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/ui/NeonLinesWebGL.tsx): отрисовывает горизонтальные неоновые линии (отсылка к полосам на фото). Авто-пауза при скролле за экран через `IntersectionObserver`. Встроен **Watchdog**: если фрейм длится $> 24$ мс более 10 раз, шейдер автоматически отключается в пользу 60 FPS.
- **Уход Hero**: Легкое масштабирование (`scale: 0.96`) и затухание (`opacity: 0.45`) при скролле вниз.

### 2. «Знакомо?» — [`PainChecklist.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/PainChecklist.tsx)
- **Кольцевой прогресс-бар**: SVG-окружность с динамическим `strokeDashoffset`, показывающая долю выбранных пунктов ($0/5 \to 5/5$).
- **Пружинные чекбоксы**: галочка рисуется с пружинной физикой Framer Motion (`stiffness: 450, damping: 20`).
- **Алерт-баннер**: при $\ge 2$ выбранных пунктах выезжает с акцентным неоновым свечением и мягкой подсветкой.

### 3. Услуги — [`Services.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Services.tsx)
- **Desktop ($\ge 1024$ px)**: Секция фиксируется (`pin: true`) и карточки прокручиваются горизонтально по мере вертикального скролла (`scrub: 0.8`).
- **Mobile ($< 1024$ px)**: Вертикальная адаптивная сетка.
- **Живые миниатюры в каждой карточке**:
  1. *AI-агенты*: динамически печатающийся ответ в чате.
  2. *AI-обзвон*: пульсирующий 4-полосный аудио-эквалайзер.
  3. *Парсеры*: анимированный прогресс-бар и растущий счетчик найденных сайтов ($120 \to 500$).
  4. *Автоматизации*: пульсирующие узлы схемы передачи данных (Сайт → CRM → Telegram).

### 4. «Как это выглядит на деле» — [`PipelineDemo.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/PipelineDemo.tsx)
- **Скролл-скраб**: По мере прокрутки 4 узла последовательно активируются (0.0 → 0.5 с), подсвечиваются неоновым акцентом, внутри загораются зеленые галочки.
- **Живой счетчик времени**: В правом верхнем углу отображается бейдж: `Время обработки: X.X с`.
- **Кнопка «Запустить»**: Позволяет воспроизвести прохождение данных программно через таймлайн GSAP без необходимости скроллинга.

### 5. Сравнение «Вручную или кодом» — [`Comparison.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Comparison.tsx)
- **Интерактивный сплит-слайдер**: перетаскиваемая разделительная ручка `◀▶` с динамическим `clip-path: inset(0 0 0 X%)`.
- Плавный просмотр разницы: слева «Вручную» (2 недели, 30 000 руб., ошибки), справа «Парсер» (2 минуты, 500 номеров, чистая база).

### 6. Процесс — [`Process.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Process.tsx)
- **Вертикальный таймлайн**: соединительная линия дорисовывается по мере скролла (`scaleY: 0 → 1`, `transform-origin: top`).
- Активный шаг подсвечивается и слегка увеличивается, остальные шаги мягко приглушены (`opacity: 0.45 → 1`).

### 7. Гид и форма — [`GuideForm.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/GuideForm.tsx)
- **Плавающие лейблы (Floating Labels)**: подписи полей плавно уменьшаются и уходят вверх при фокусе (`peer-focus:top-1.5`).
- **Свечение рамок**: неоновый контур `border-accent-bright` и мягкая тень при активном поле ввода.
- **Морфинг кнопки**:
  1. Нажатие «Получить гид» $\to$ кнопка сжимается в круглый спиннер.
  2. Завершение запроса $\to$ внутри круга рисуется белая галочка `Check`.
  3. Переход в экран благодарности $\to$ появление кнопки прямого скачивания `guide.pdf`.

### 8. FAQ — [`Faq.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Faq.tsx)
- Пружинный аккордеон с автоматическим расчетом высоты (`height: 0 → auto`).
- Иконка `+` плавно поворачивается на $45^\circ$, превращаясь в `✕`.
- Раскрытый элемент плавно увеличивается (`scale: 1.01`, `y: -2px`), деликатно сдвигая соседние пункты.

### 9. Обо мне — [`AboutMe.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/AboutMe.tsx)
- **Шторка фото**: портрет Андрея раскрывается вертикальной маской `clip-path: inset(100% 0 0 0) → inset(0% 0 0 0)`.
- **Закрашивание текста по словам**: абзацы разбиты по словам (`.paint-word`), цвет которых при скролле плавно интерполируется от приглушенного серого (`#94A3B8`) к насыщенному темному (`#0B0F1E`).

### 10. Финальный призыв — [`FinalCta.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/FinalCta.tsx)
- **Бегущая строка, реагирующая на скорость скролла**: гигантский текст `ЕСТЬ ЗАДАЧА?` непрерывно бежит на фоне. При быстром скролле `ScrollTrigger.getVelocity()` ускоряет `timeScale` до 4x с последующим плавным торможением до 1x.

### 11. Подвал — [`Footer.tsx`](file:///Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/components/sections/Footer.tsx)
- **Волна букв вордмарка**: при наведении на слово `_angrove_` буквы поочередно совершают волнообразный прыжок (`y: -5px`, `stagger: 0.04s`) с изменением цвета на неоновый синий.
- **Плавный переход на `/privacy`**: анимация затухания страницы `opacity: 0` перед переходом.

---

## 📱 4. Адаптивность и сценарии окружения

### Мобильные устройства ($< 768$ px)
- ❌ **Отключено**:
  - Кастомный курсор
  - WebGL шейдер (заменен легким CSS-градиентом)
  - Горизонтальный pin секции услуг (заменен вертикальной сеткой)
  - 3D-наклон карточек и фото
  - Магнитное притяжение кнопок
- ✅ **Активно**:
  - Плавное появление элементов
  - Живые виджеты (печатающийся чат, эквалайзер, счетчик парсера)
  - Сплит-слайдер «Вручную / Кодом» с touch-перетаскиванием
  - Скролл-пайплайн данных и таймер
  - Кольцевой прогресс в чек-листе
  - Морфинг кнопки отправки формы

### Режим `prefers-reduced-motion`
Если у пользователя в операционной системе включено уменьшение движения:
1. Lenis не инициализируется (нативный скролл без инерции).
2. WebGL, параллаксы и 3D-наклоны полностью отключаются.
3. Бегущие строки останавливаются (`animation: none`).
4. Все GSAP анимации переключаются на прямое отображение контента.
