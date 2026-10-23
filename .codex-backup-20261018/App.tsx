import React, { useEffect, useState } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { TrustBar } from './components/sections/TrustBar';
import { PainChecklist } from './components/sections/PainChecklist';
import { Services } from './components/sections/Services';
import { WorkflowScene } from './components/sections/WorkflowScene';
import { Cases } from './components/sections/Cases';
import { AboutMe } from './components/sections/AboutMe';
import { Process } from './components/sections/Process';
import { GuideForm } from './components/sections/GuideForm';
import { Faq } from './components/sections/Faq';
import { FinalCta } from './components/sections/FinalCta';
import { Footer } from './components/sections/Footer';
import { PrivacyPage } from './pages/PrivacyPage';
import { Preloader } from './components/ui/Preloader';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { AmbientAtmosphere } from './components/ui/AmbientAtmosphere';
import { MobileStickyCta } from './components/ui/MobileStickyCta';
import { initSmoothScroll } from './lib/motion';
import { initAnalytics } from './lib/analytics';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [, setIsPreloaded] = useState(false);

  useEffect(() => {
    initAnalytics();

    // Mark HTML as JS-enabled for progressive enhancement
    document.documentElement.classList.add('js');

    // Initialize Lenis smooth scroll linked to GSAP ScrollTrigger
    const lenis = initSmoothScroll();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      lenis?.destroy();
    };
  }, []);

  // Show standalone /privacy page
  if (currentPath === '/privacy' || currentPath === '/privacy/') {
    return <PrivacyPage />;
  }

  // Main landing page in editorial craft style
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-blue selection:text-white relative font-sans">
      {/* Background Motion & Atmosphere (flickering tech runes + ambient light) */}
      <AmbientAtmosphere />

      {/* Preloader (< 0.4s on first desktop visit, bypassed otherwise) */}
      <Preloader onComplete={() => setIsPreloaded(true)} />

      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      {/* 0. Header (Sticky) */}
      <Header />

      <main className="flex-1">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Trust Bar (Factual trust signals) */}
        <TrustBar />

        {/* 3. Task Selector («Что вы хотите перестать делать вручную?») */}
        <PainChecklist />

        {/* 4. Спектр решений (Services) */}
        <Services />

        {/* 5. Архитектура потока данных (WorkflowScene) */}
        <WorkflowScene />

        {/* 6. Реальные кейсы и сценарии (Cases) */}
        <Cases />

        {/* 7. Обо мне и принципы разработки (AboutMe) */}
        <AboutMe />

        {/* 8. Процесс работы (Process) */}
        <Process />

        {/* 9. Практический гид (GuideForm) */}
        <GuideForm />

        {/* 10. FAQ (Частые вопросы) */}
        <Faq />

        {/* 11. Финальный призыв к диалогу (FinalCta) */}
        <FinalCta />
      </main>

      {/* 12. Подвал */}
      <Footer />

      {/* 13. Мобильный плавающий CTA (MobileStickyCta) */}
      <MobileStickyCta />
    </div>
  );
};
