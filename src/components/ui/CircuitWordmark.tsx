import React, { useEffect, useRef } from 'react';

interface Waypoint {
  t: number;       // normalized loop progress [0..1]
  x: number;       // precise SVG x coordinate
  y: number;       // precise SVG y coordinate
  opacity: number; // overall pulse luminance [0..1]
  spark: number;   // spark scale factor [0..1.5]
}

// Exactly calibrated against Onest 900 letter bounding boxes:
// Left Underscore: x ≈ 252..287, y = 100
// Letters A-N-G-R-O-V-E:
//   A: x ≈ 318 | N: x ≈ 382 | G: x ≈ 445 | R: x ≈ 506
//   O: x ≈ 567 | V: x ≈ 630 | E: x ≈ 686
// Right Underscore: x ≈ 712..748, y = 100
// Upper contour roof: y ≈ 35
// Lower contour baseline / feet: y ≈ 98
const PRECISE_CIRCUIT_WAYPOINTS: Waypoint[] = [
  // --- 1. Ignition at Left Underscore Node ---
  { t: 0.00, x: 252, y: 100, opacity: 0, spark: 0 },
  { t: 0.03, x: 270, y: 100, opacity: 1, spark: 1 },
  { t: 0.07, x: 285, y: 100, opacity: 1, spark: 1 },

  // --- 2. Climb up the leading slant of 'A' ---
  { t: 0.12, x: 318, y: 35, opacity: 1, spark: 1.1 },

  // --- 3. UPPER CONTOUR SWEEP (Roof of Letters, Left-to-Right) ---
  { t: 0.17, x: 382, y: 35, opacity: 1, spark: 1 },   // 'N' top
  { t: 0.22, x: 445, y: 35, opacity: 1, spark: 1 },   // 'G' top
  { t: 0.27, x: 506, y: 35, opacity: 1, spark: 1 },   // 'R' top
  { t: 0.32, x: 567, y: 35, opacity: 1, spark: 1 },   // 'O' top
  { t: 0.37, x: 630, y: 35, opacity: 1, spark: 1 },   // 'V' top
  { t: 0.42, x: 686, y: 35, opacity: 1, spark: 1 },   // 'E' top

  // --- 4. Descend down trailing edge of 'E' to Right Underscore ---
  { t: 0.46, x: 712, y: 70, opacity: 1, spark: 1 },
  { t: 0.50, x: 745, y: 100, opacity: 1, spark: 1.5 }, // Right node terminal ping!
  { t: 0.53, x: 730, y: 98, opacity: 1, spark: 1 },    // Arcs smoothly to baseline

  // --- 5. LOWER CONTOUR SWEEP (Baseline & Letter Feet, Right-to-Left) ---
  { t: 0.58, x: 686, y: 98, opacity: 1, spark: 1 },   // 'E' baseline
  { t: 0.63, x: 630, y: 98, opacity: 1, spark: 1 },   // 'V' apex
  { t: 0.68, x: 567, y: 98, opacity: 1, spark: 1 },   // 'O' baseline
  { t: 0.73, x: 506, y: 98, opacity: 1, spark: 1 },   // 'R' feet
  { t: 0.78, x: 445, y: 98, opacity: 1, spark: 1 },   // 'G' baseline
  { t: 0.83, x: 382, y: 98, opacity: 1, spark: 1 },   // 'N' feet
  { t: 0.88, x: 318, y: 98, opacity: 1, spark: 1 },   // 'A' feet
  { t: 0.91, x: 270, y: 100, opacity: 1, spark: 1 },  // Left underscore entry

  // --- 6. Terminal Ping & Loop Reset ---
  { t: 0.94, x: 252, y: 100, opacity: 1, spark: 1.5 }, // Left node discharge ping!
  { t: 0.97, x: 250, y: 100, opacity: 0, spark: 0 },
  { t: 1.00, x: 250, y: 100, opacity: 0, spark: 0 },   // Reset gap
];

const DURATION_MS = 3800;

function interpolateWaypoint(progress: number): { x: number; y: number; opacity: number; spark: number } {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < PRECISE_CIRCUIT_WAYPOINTS.length - 1; i++) {
    const w0 = PRECISE_CIRCUIT_WAYPOINTS[i];
    const w1 = PRECISE_CIRCUIT_WAYPOINTS[i + 1];
    if (p >= w0.t && p <= w1.t) {
      const u = (p - w0.t) / (w1.t - w0.t);
      const smoothU = u * u * (3 - 2 * u);
      return {
        x: w0.x + (w1.x - w0.x) * smoothU,
        y: w0.y + (w1.y - w0.y) * smoothU,
        opacity: w0.opacity + (w1.opacity - w0.opacity) * u,
        spark: w0.spark + (w1.spark - w0.spark) * u,
      };
    }
  }
  const last = PRECISE_CIRCUIT_WAYPOINTS[PRECISE_CIRCUIT_WAYPOINTS.length - 1];
  return { x: last.x, y: last.y, opacity: last.opacity, spark: last.spark };
}

export const CircuitWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradRef = useRef<SVGRadialGradientElement>(null);
  const sparkRef = useRef<SVGGElement>(null);
  const pulseGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isVisible = true;
    let animId: number;
    let startTime: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    const tick = (now: number) => {
      if (startTime === null) startTime = now;

      if (isVisible) {
        const elapsed = (now - startTime) % DURATION_MS;
        const progress = elapsed / DURATION_MS;
        const { x, y, opacity, spark } = interpolateWaypoint(progress);

        if (gradRef.current) {
          gradRef.current.setAttribute('cx', x.toFixed(1));
          gradRef.current.setAttribute('cy', y.toFixed(1));
        }

        if (pulseGroupRef.current) {
          pulseGroupRef.current.setAttribute('opacity', opacity.toFixed(3));
        }

        if (sparkRef.current) {
          sparkRef.current.setAttribute(
            'transform',
            `translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(${spark.toFixed(2)})`
          );
          sparkRef.current.setAttribute('opacity', (opacity * 0.95).toFixed(3));
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox="235 10 530 115"
        className="w-full max-w-[840px] h-auto overflow-visible select-none"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="_ANGROVE_"
      >
        <defs>
          {/* 2D Moving Radial Gradient for upper & lower contour masking */}
          <radialGradient
            id="circuitPulseGrad"
            ref={gradRef}
            cx="252"
            cy="100"
            r="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <mask id="circuitPulseMask">
            <rect x="200" y="0" width="600" height="130" fill="url(#circuitPulseGrad)" />
          </mask>

          {/* Spark Glow Filter */}
          <filter id="sparkGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base architectural wireframe contour */}
        <text
          x="500"
          y="98"
          textAnchor="middle"
          fill="none"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="1.5"
          className="font-display font-black"
          style={{
            fontSize: '86px',
            letterSpacing: '-0.02em',
          }}
        >
          _ANGROVE_
        </text>

        {/* 2. Masked Glowing Circuit Pulses (Follows 2D Upper & Lower Trajectory) */}
        <g ref={pulseGroupRef} mask="url(#circuitPulseMask)" opacity="0">
          {/* Layer A: Broad Neon Aura */}
          <text
            x="500"
            y="98"
            textAnchor="middle"
            fill="none"
            stroke="#3D5CFF"
            strokeWidth="3.5"
            className="font-display font-black"
            style={{
              fontSize: '86px',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 16px rgba(61, 92, 255, 0.95)) drop-shadow(0 0 32px rgba(0, 240, 255, 0.8))',
            }}
          >
            _ANGROVE_
          </text>

          {/* Layer B: Cyan Electric Core */}
          <text
            x="500"
            y="98"
            textAnchor="middle"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            className="font-display font-black"
            style={{
              fontSize: '86px',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 6px #00F0FF) drop-shadow(0 0 12px #3D5CFF)',
            }}
          >
            _ANGROVE_
          </text>

          {/* Layer C: White-Hot Center Stroke */}
          <text
            x="500"
            y="98"
            textAnchor="middle"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            className="font-display font-black"
            style={{
              fontSize: '86px',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 3px #FFFFFF)',
            }}
          >
            _ANGROVE_
          </text>
        </g>

        {/* 3. Physical High-Voltage Spark Particle Riding the Wire */}
        <g ref={sparkRef} opacity="0" filter="url(#sparkGlow)" pointerEvents="none">
          {/* Outer electric corona */}
          <circle cx="0" cy="0" r="14" fill="#3D5CFF" opacity="0.4" />
          {/* Inner cyan pulse */}
          <circle cx="0" cy="0" r="6" fill="#00F0FF" opacity="0.9" />
          {/* White-hot center spark */}
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
