import React, { useRef, useEffect } from 'react';
import { DuotonePhoto } from '../ui/DuotonePhoto';
import { PillButton } from '../ui/PillButton';
import { LeopardDivider } from '../ui/LeopardDivider';
import { config } from '../../config';
import { trackGoal } from '../../lib/analytics';
import { gsap } from '../../lib/motion';
import { Instagram } from 'lucide-react';

export const AboutMe: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoMaskRef = useRef<HTMLDivElement>(null);

  const handleInstagramClick = () => {
    trackGoal('click_instagram');
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Photo curtain wipe reveal
      if (photoMaskRef.current) {
        gsap.fromTo(
          photoMaskRef.current,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // Word-by-word paint reveal on scroll scrub
      const words = textRef.current?.querySelectorAll('.paint-word');
      if (words && words.length) {
        gsap.fromTo(
          words,
          { color: '#94A3B8' },
          {
            color: '#0B0F1E',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              end: 'bottom 50%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const paragraph1 = 'Руковожу IT-разработкой и собираю системы, которые заменяют ручной труд кодом.'.split(' ');
  const paragraph2 = 'В блоге на реальных примерах показываю, как избавляться от рутины.'.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative bg-light text-text-dark py-20 sm:py-28 overflow-hidden"
      id="about"
    >
      {/* Top Leopard divider strip */}
      <div className="absolute top-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Left Column: Photo in Duotone with Curtain Reveal */}
          <div className="md:col-span-5 flex justify-center">
            <div
              ref={photoMaskRef}
              className="w-full max-w-[280px] sm:max-w-[320px] will-change-transform shadow-card-light rounded-card-lg"
              data-cursor="photo"
            >
              <DuotonePhoto
                src="/andrey.jpg"
                alt="Андрей (_angrove_)"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>

          {/* Right Column: Bio with word-by-word paint scrub */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="font-mono text-xs font-bold text-accent tracking-[0.2em] uppercase mb-2">
              ОБО МНЕ
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text-dark tracking-tight leading-[1.1] mb-6">
              Привет, я Андрей
            </h2>

            {/* Word-by-word painted paragraphs */}
            <div ref={textRef} className="space-y-4 mb-8">
              <p className="text-base sm:text-lg leading-relaxed font-medium">
                {paragraph1.map((w, i) => (
                  <span key={i} className="paint-word inline-block mr-1.5 transition-colors">
                    {w}
                  </span>
                ))}
              </p>

              <p className="text-base sm:text-lg leading-relaxed font-medium">
                {paragraph2.map((w, i) => (
                  <span key={i} className="paint-word inline-block mr-1.5 transition-colors">
                    {w}
                  </span>
                ))}
              </p>
            </div>

            <PillButton
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="dark"
              size="lg"
              onClick={handleInstagramClick}
            >
              <Instagram size={18} />
              <span>Блог в Instagram</span>
            </PillButton>
          </div>
        </div>
      </div>

      {/* Bottom Leopard divider strip */}
      <div className="absolute bottom-0 left-0 w-full">
        <LeopardDivider height={6} />
      </div>
    </section>
  );
};
