import React, { useEffect, useState } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { GuideForm } from './components/sections/GuideForm';
import { Faq } from './components/sections/Faq';
import { AboutMe } from './components/sections/AboutMe';
import { Footer } from './components/sections/Footer';
import { PrivacyPage } from './pages/PrivacyPage';
import { Preloader } from './components/ui/Preloader';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AmbientAtmosphere } from './components/ui/AmbientAtmosphere';
import { Global3DCanvas } from './components/ui/Global3DCanvas';
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

  // Main landing page in editorial style
  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper text-ink selection:bg-blue selection:text-white relative font-sans">
      {/* Background Motion & Atmosphere */}
      <AmbientAtmosphere />
      <Global3DCanvas />

      {/* Preloader (< 1.2s, once per session) */}
      <Preloader onComplete={() => setIsPreloaded(true)} />

      {/* Top Scroll Progress Bar */}
      <ScrollProgress />

      {/* 0. Header (Sticky) */}
      <Header />

      <main className="flex-1 relative z-10">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Услуги (Bento Grid) */}
        <Services />

        {/* 3. Процесс */}
        <Process />

        {/* 6. Гид и форма */}
        <GuideForm />

        {/* 7. Обо мне */}
        <AboutMe />

        {/* 8. FAQ */}
        <Faq />
      </main>

      {/* 9. Монолитный финал: Призыв к действию + Подвал */}
      <Footer />

      {/* Floating Scroll-to-Top Control Node */}
      <ScrollToTop />
    </div>
  );
};
