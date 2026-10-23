import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Global3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene, Camera, Safe WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported on this device/environment', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main 3D Container Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const isDesktop = width >= 1024;
    // Initial desktop placement: right flank (aligned with hero portrait, away from H1)
    mainGroup.position.set(isDesktop ? 2.3 : 0, isDesktop ? 0.05 : -0.3, 0);

    // 3. Elegant Geodesic Core (Refined line geometry, no opaque dark blobs)
    const coreGeom = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3D5CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    mainGroup.add(coreMesh);

    // Subtle glowing vertex nodes
    const vertexPositions = coreGeom.attributes.position.array;
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x617DFF,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
    });
    const vertexNodes = new THREE.Points(nodeGeom, nodeMat);
    coreMesh.add(vertexNodes);

    // Inner delicate wireframe (Dodecahedron) - counter-rotating
    const innerGeom = new THREE.DodecahedronGeometry(0.75, 0);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x7E99FF,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerWire = new THREE.Mesh(innerGeom, innerWireMat);
    mainGroup.add(innerWire);

    // 4. Harmonic Orbital Rings (Sized strictly to stay within the visual quadrant, radius <= 2.2)
    const ring1Geom = new THREE.TorusGeometry(1.65, 0.012, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3D5CFF, transparent: true, opacity: 0.38 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    mainGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(1.95, 0.01, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x617DFF, transparent: true, opacity: 0.28 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 3.8;
    mainGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(2.25, 0.007, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x9BB4FF, transparent: true, opacity: 0.2 });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = -Math.PI / 4.2;
    mainGroup.add(ring3);

    // 5. Restrained Ambient 3D Particle Constellation (Gentle background depth)
    const particleCount = 110;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = -1.5 - Math.random() * 6; // strictly behind main stage
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4D6CFF,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 6. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetMouseX = x * 1.5;
      targetMouseY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Scroll Tracking
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth dampening
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.05;

      const p = currentScrollProgress;
      const desktop = window.innerWidth >= 1024;

      // Dynamic Opacity Modulation:
      // When at top (Hero p < 0.1), 3D is a featured visual element.
      // When scrolling into reading sections (p > 0.12), smoothly fade to an ethereal watermark
      // so it never competes with text, case stats or interactive simulators!
      const contentDim = Math.max(0.3, 1 - Math.min(1, p * 4.5));
      coreMat.opacity = 0.5 * contentDim + 0.12;
      nodeMat.opacity = 0.65 * contentDim + 0.14;
      innerWireMat.opacity = 0.4 * contentDim + 0.1;
      ring1Mat.opacity = 0.38 * contentDim + 0.08;
      ring2Mat.opacity = 0.28 * contentDim + 0.06;
      ring3Mat.opacity = 0.2 * contentDim + 0.04;
      particleMat.opacity = 0.35 * contentDim + 0.12;

      // Spatial Trajectory Orchestration:
      // - Hero (p ~ 0): Desktop right flank (x: 2.3), frames Andrey's photo, completely clear of H1.
      // - Services (p ~ 0.2): Recedes into right whitespace margin (x: 2.8, z: -1.8), scale drops to 0.75.
      // - Cases (p ~ 0.45): Floats high in background (x: 1.2, y: 1.4, z: -2.5), leaves case cards pristine.
      // - Process & About (p ~ 0.7): Shifts gently to left margin (x: -2.6, y: -0.2, z: -1.6), frames timeline.
      // - Final CTA (p ~ 0.95): Converges toward lower center behind CTA glow (x: 0, y: -1.0, z: -1.2).
      let targetX = desktop ? 2.3 : 0;
      let targetY = desktop ? 0.05 : -0.3;
      let targetZ = 0;
      let targetScale = desktop ? 1.0 : 0.65;

      if (desktop) {
        if (p < 0.12) {
          // Hero zone
          targetX = 2.3 + mouseX * 0.3;
          targetY = 0.05 - mouseY * 0.3;
          targetZ = 0;
          targetScale = 1.0;
        } else if (p < 0.35) {
          // Services zone: push to far right periphery & deep Z
          const t = (p - 0.12) / 0.23;
          targetX = 2.3 + t * 0.6 + mouseX * 0.2;
          targetY = 0.05 - t * 0.3 - mouseY * 0.2;
          targetZ = -t * 2.0;
          targetScale = 1.0 - t * 0.25;
        } else if (p < 0.6) {
          // Cases zone: elevated background aura
          const t = (p - 0.35) / 0.25;
          targetX = 2.9 - t * 1.8 + mouseX * 0.2;
          targetY = -0.25 + t * 1.4 - mouseY * 0.2;
          targetZ = -2.0 - t * 0.8;
          targetScale = 0.75;
        } else if (p < 0.85) {
          // Process & About zone: subtle left margin framing
          const t = (p - 0.6) / 0.25;
          targetX = 1.1 - t * 3.7 + mouseX * 0.2;
          targetY = 1.15 - t * 1.3 - mouseY * 0.2;
          targetZ = -2.8 + t * 1.0;
          targetScale = 0.75 + t * 0.08;
        } else {
          // Final CTA & Footer: gentle grounding
          const t = (p - 0.85) / 0.15;
          targetX = -2.6 + t * 2.6 + mouseX * 0.2;
          targetY = -0.15 - t * 0.8 - mouseY * 0.2;
          targetZ = -1.8 + t * 0.6;
          targetScale = 0.83;
        }
      } else {
        // Mobile: keep scale compact and gently float in backdrop
        targetScale = 0.6;
        targetZ = -1.2;
        targetX = mouseX * 0.2;
        targetY = -0.3 + Math.sin(p * Math.PI * 2) * 0.4;
      }

      mainGroup.position.x += (targetX - mainGroup.position.x) * 0.05;
      mainGroup.position.y += (targetY - mainGroup.position.y) * 0.05;
      mainGroup.position.z += (targetZ - mainGroup.position.z) * 0.05;

      const currentScale = mainGroup.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      mainGroup.scale.set(newScale, newScale, newScale);

      // Smooth continuous rotational kinetics
      coreMesh.rotation.x = elapsed * 0.2 + mouseY * 0.4 + p * Math.PI * 2;
      coreMesh.rotation.y = elapsed * 0.25 + mouseX * 0.4 + p * Math.PI * 3;

      innerWire.rotation.x = -elapsed * 0.35 + mouseY * 0.3;
      innerWire.rotation.y = -elapsed * 0.4 + mouseX * 0.3;

      ring1.rotation.z = elapsed * 0.18 + p * Math.PI * 3;
      ring2.rotation.x = elapsed * -0.22 - p * Math.PI * 2.5;
      ring3.rotation.y = elapsed * 0.15 + p * Math.PI * 2;

      // Particle slow drift
      particles.rotation.y = elapsed * 0.03 + mouseX * 0.15;
      particles.rotation.x = elapsed * 0.02 - mouseY * 0.15;

      // Soft camera tilt
      camera.position.x = mouseX * 0.25;
      camera.position.y = -mouseY * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      innerGeom.dispose();
      innerWireMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};