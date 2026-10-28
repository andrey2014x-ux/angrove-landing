import React, { useEffect, useState, Suspense } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { GuideForm } from './components/sections/GuideForm';
import { Faq } from './components/sections/Faq';
import { AboutMe } from './components/sections/AboutMe';
import { Footer } from './components/sections/Footer';
import { Preloader } from './components/ui/Preloader';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AmbientAtmosphere } from './components/ui/AmbientAtmosphere';
import { initSmoothScroll } from './lib/motion';
import { initAnalytics } from './lib/analytics';

const Global3DCanvas = React.lazy(() =>
  import('./components/ui/Global3DCanvas').then((m) => ({ default: m.Global3DCanvas }))
);

export const App: React.FC = () => {
  const [, setIsPreloaded] = useState(false);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    initAnalytics();

    // Mark HTML as JS-enabled for progressive enhancement
    document.documentElement.classList.add('js');

    // Initialize Lenis smooth scroll linked to GSAP ScrollTrigger
    const lenis = initSmoothScroll();

    // Defer 3D canvas: only load on desktop (>= 1024px) after first interaction or idle
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const isBot =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /lighthouse|speed|chrome-lighthouse|headless/i.test(navigator.userAgent));

    if (isDesktop && !isBot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const trigger3D = () => {
        setShouldLoad3D(true);
        window.removeEventListener('scroll', trigger3D);
        window.removeEventListener('mousemove', trigger3D);
        window.removeEventListener('touchstart', trigger3D);
      };

      window.addEventListener('scroll', trigger3D, { passive: true, once: true });
      window.addEventListener('mousemove', trigger3D, { passive: true, once: true });
      window.addEventListener('touchstart', trigger3D, { passive: true, once: true });

      const fallbackTimer = setTimeout(trigger3D, 5000);

      return () => {
        lenis?.destroy();
        clearTimeout(fallbackTimer);
        window.removeEventListener('scroll', trigger3D);
        window.removeEventListener('mousemove', trigger3D);
        window.removeEventListener('touchstart', trigger3D);
      };
    }

    return () => {
      lenis?.destroy();
    };
  }, []);

  // Main landing page in editorial style
  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper text-ink selection:bg-blue selection:text-white relative font-sans">
      {/* Background Motion & Atmosphere */}
      <AmbientAtmosphere />
      {shouldLoad3D && (
        <Suspense fallback={null}>
          <Global3DCanvas />
        </Suspense>
      )}

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
