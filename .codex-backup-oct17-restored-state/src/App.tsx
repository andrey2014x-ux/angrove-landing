import React, { useEffect, useState } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { PainChecklist } from './components/sections/PainChecklist';
import { Services } from './components/sections/Services';
import { PipelineDemo } from './components/sections/PipelineDemo';
import { Comparison } from './components/sections/Comparison';
import { Process } from './components/sections/Process';
import { GuideForm } from './components/sections/GuideForm';
import { Faq } from './components/sections/Faq';
import { AboutMe } from './components/sections/AboutMe';
import { FinalCta } from './components/sections/FinalCta';
import { Footer } from './components/sections/Footer';
import { PrivacyPage } from './pages/PrivacyPage';
import { Preloader } from './components/ui/Preloader';
import { NoiseGrain } from './components/ui/NoiseGrain';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { SideSectionTracker } from './components/ui/SideSectionTracker';
import { CustomCursor } from './components/ui/CustomCursor';
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

  // Main 11-section landing page with complete motion suite
  return (
    <div className="min-h-screen flex flex-col bg-ink text-white selection:bg-accent selection:text-white relative">
      {/* Preloader (< 1.2s, once per session) */}
      <Preloader onComplete={() => setIsPreloaded(true)} />

      {/* Global Grain Texture Overlay */}
      <NoiseGrain />

      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      {/* Custom Desktop Cursor with Difference Blending & Inertia Ring */}
      <CustomCursor />

      {/* Desktop Side Section Tracker (01 / 11) */}
      <SideSectionTracker />

      {/* 0. Header (Sticky) */}
      <Header />

      <main className="flex-1">
        {/* 1. Hero */}
        <Hero />

        {/* 2. «Знакомо?» (Светлая секция) */}
        <PainChecklist />

        {/* 3. Услуги (Тёмная секция, Desktop Pinned Horizontal Scrub) */}
        <Services />

        {/* 4. «Как это выглядит на деле» (Светлая секция, Scroll-scrubbed Pipeline) */}
        <PipelineDemo />

        {/* 5. Сравнение (Тёмная секция, Interactive Before/After Slider) */}
        <Comparison />

        {/* 6. Процесс (Светлая секция, Timeline Scrub) */}
        <Process />

        {/* 7. Гид и форма (Акцентная синяя секция с morphing submit) */}
        <GuideForm />

        {/* 8. FAQ (Тёмная секция, Spring Accordion) */}
        <Faq />

        {/* 9. Обо мне (Светлая секция, Word-by-word scrub paint) */}
        <AboutMe />

        {/* 10. Финальный призыв (Тёмная секция, Scroll velocity reactive marquee) */}
        <FinalCta />
      </main>

      {/* 11. Подвал (Wave letter wordmark) */}
      <Footer />
    </div>
  );
};
