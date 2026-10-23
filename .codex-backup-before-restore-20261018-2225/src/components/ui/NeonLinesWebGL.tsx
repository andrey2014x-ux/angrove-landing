import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

export const NeonLinesWebGL: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load on desktop with fine pointer, and not reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || isReduced || !containerRef.current) return;

    let renderer: Renderer | null = null;
    let animId = 0;
    let isVisible = true;
    let lastTime = performance.now();
    let slowFrameCount = 0;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(1.5, window.devicePixelRatio || 1),
      });

      const gl = renderer.gl;
      containerRef.current.appendChild(gl.canvas);
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.pointerEvents = 'none';

      const camera = new Camera(gl);
      camera.position.z = 1;

      const scene = new Transform();

      // Vertex shader
      const vertex = /* glsl */ `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment shader for smooth neon beams referencing photo
      const fragment = /* glsl */ `
        precision mediump float;
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
          
          float line1 = 0.015 / abs(uv.y - 0.25 + sin(uv.x * 2.5 + uTime * 0.8) * 0.08);
          float line2 = 0.012 / abs(uv.y - 0.10 + sin(uv.x * 2.0 - uTime * 0.6) * 0.06);
          float line3 = 0.018 / abs(uv.y + 0.15 + cos(uv.x * 3.0 + uTime * 0.5) * 0.09);

          vec3 blueColor = vec3(0.239, 0.361, 1.0); // #3D5CFF
          vec3 brightColor = vec3(0.380, 0.490, 1.0); // #617DFF
          vec3 iceColor = vec3(0.749, 0.831, 1.0); // #BFD4FF

          vec3 finalColor = line1 * brightColor + line2 * blueColor + line3 * iceColor;
          
          // Soft edge masking
          float alpha = clamp((line1 + line2 + line3) * 0.35, 0.0, 0.5) * smoothstep(1.5, 0.2, length(uv));

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
      });

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      const resize = () => {
        if (!renderer || !containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };

      window.addEventListener('resize', resize, { passive: true });
      resize();

      // Intersection Observer to stop render loop when scrolled offscreen
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            isVisible = e.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);

      // Animation loop with performance watchdog
      const update = (t: number) => {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;

        // Watchdog: If frame time exceeds 24ms repeatedly, auto-disable to guarantee 60fps
        if (delta > 24) {
          slowFrameCount++;
          if (slowFrameCount > 10) {
            console.warn('[WebGL] Auto-disabled to prioritize 60fps responsiveness.');
            if (renderer) renderer.gl.canvas.remove();
            return;
          }
        }

        if (isVisible && renderer) {
          program.uniforms.uTime.value = t * 0.001;
          renderer.render({ scene, camera });
        }
        animId = requestAnimationFrame(update);
      };

      animId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        observer.disconnect();
        if (renderer && renderer.gl && renderer.gl.canvas) {
          renderer.gl.canvas.remove();
        }
      };
    } catch (err) {
      console.warn('[WebGL] Initialization failed, falling back to CSS aurora gradient.', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
};
