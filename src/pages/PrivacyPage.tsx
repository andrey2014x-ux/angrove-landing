import React from 'react';
import { LeopardDivider } from '../components/ui/LeopardDivider';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink text-white font-sans">
      {/* Top Header */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <LeopardDivider height={3} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-slate-300 hover:text-accent-bright transition-colors"
          >
            <ArrowLeft size={16} />
            <span>На главную</span>
          </a>
          <span className="font-mono text-xs text-accent-bright font-bold">
            _angrove_ · PRIVACY
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Notice to check with lawyer */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3.5 text-amber-200 text-sm">
          <ShieldAlert size={20} className="flex-shrink-0 mt-0.5 text-amber-400" />
          <div>
            <strong className="block font-semibold text-amber-300 mb-1">
              Пометка: Проверить у юриста
            </strong>
            Это типовой шаблон политики конфиденциальности для сайта личного бренда. Замените плейсхолдеры в скобках [ ] на ваши актуальные реквизиты (ФИО / ИП, ИНН, e-mail) перед боевым запуском.
          </div>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-8">
          Политика конфиденциальности
        </h1>

        <div className="space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              1. Общие положения
            </h2>
            <p>
              Настоящая Политика обработки персональных данных (далее — «Политика») определяет порядок сбора, хранения, защиты и обработки персональных данных пользователей сайта{' '}
              <strong className="text-white">angrove.ru</strong> (далее — «Сайт»).
            </p>
            <p className="mt-2">
              Оператором персональных данных является: <strong className="text-white">[ФИО / Наименование ИП / Самозанятый]</strong>, ИНН: <strong className="text-white">[Ваш ИНН]</strong>, e-mail для обращений: <strong className="text-accent-bright">[contact@angrove.ru]</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              2. Цели сбора и обработки данных
            </h2>
            <p>Оператор обрабатывает персональные данные исключительно в следующих целях:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
              <li>Предоставление пользователю бесплатного PDF-гида «Как заставить программы работать вместо вас».</li>
              <li>Установление обратной связи по запросу пользователя (обсуждение задач автоматизации бизнеса в Telegram или по телефону).</li>
              <li>Сбор обезличенной аналитики посещаемости Сайта с целью улучшения пользовательского опыта (при наличии согласия на cookie).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              3. Состав обрабатываемых данных
            </h2>
            <p>В формах обратной связи на Сайте могут запрашиваться следующие данные:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-300">
              <li>Имя пользователя;</li>
              <li>Контактные данные для связи (Telegram-аккаунт или номер телефона);</li>
              <li>Сфера деятельности компании (необязательное поле);</li>
              <li>Технические данные (IP-адрес, файлы cookie, источник перехода / UTM-метки).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              4. Сроки и порядок обработки
            </h2>
            <p>
              Обработка персональных данных осуществляется на законной и справедливой основе. Данные хранятся не дольше, чем этого требуют цели обработки, либо до момента отзыва согласия пользователем.
            </p>
            <p className="mt-2">
              Оператор не передает персональные данные третьим лицам без прямого согласия пользователя, за исключением случаев, предусмотренных действующим законодательством РФ.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              5. Права пользователя и отзыв согласия
            </h2>
            <p>
              Пользователь вправе в любой момент направить запрос на уточнение, блокирование или уничтожение своих персональных данных, направив письмо по адресу электронной почты: <strong className="text-accent-bright">[contact@angrove.ru]</strong> с пометкой «Отзыв согласия на обработку персональных данных».
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-white mb-3">
              6. Изменение политики
            </h2>
            <p>
              Оператор имеет право вносить изменения в настоящую Политику в одностороннем порядке. Новая редакция вступает в силу с момента ее размещения на Сайте.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-bright hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Вернуться на главную страницу
          </a>
        </div>
      </main>
    </div>
  );
};
