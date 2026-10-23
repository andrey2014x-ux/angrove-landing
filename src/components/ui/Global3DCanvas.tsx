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

    // 1. Safe WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig for rich physical depth & specular shine
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x617DFF, 3.5);
    dirLight1.position.set(5, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3D5CFF, 2.5);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    const coreLight = new THREE.PointLight(0x617DFF, 2.0, 8);
    scene.add(coreLight);

    // 3. Main 3D Container Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const isDesktop = width >= 1024;
    // Hero position: right side, large, solid and impressive
    mainGroup.position.set(isDesktop ? 2.45 : 0, isDesktop ? 0.05 : -0.2, 0);

    // 4. Volumetric Core: Translucent Frosted Crystal (Icosahedron)
    // Real geometry with lighting and depth, NOT just a flat wireframe
    const crystalGeom = new THREE.IcosahedronGeometry(1.5, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x3D5CFF,
      emissive: 0x1A2875,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65, // frosted glass depth
      thickness: 1.2,
      transparent: true,
      opacity: 0.75,
    });
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
    mainGroup.add(crystalMesh);

    // Outer Digital Lattice Cage (Subtle glowing architectural frame)
    const cageGeom = new THREE.IcosahedronGeometry(1.85, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x617DFF,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeom, cageMat);
    mainGroup.add(cageMesh);

    // Glowing Vertex Nodes on the lattice
    const cageVertices = cageGeom.attributes.position.array;
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(cageVertices, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x8EA5FF,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const vertexNodes = new THREE.Points(nodeGeom, nodeMat);
    cageMesh.add(vertexNodes);

    // Inner Glowing Core (Octahedron pulsating with energy)
    const innerCoreGeom = new THREE.OctahedronGeometry(0.8, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x11162B,
      emissive: 0x3D5CFF,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.8,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    mainGroup.add(innerCoreMesh);

    // 5. Majestic Gyroscopic Orbital Rings
    // Large and graceful, but smoothly oriented to frame the space
    const ring1Geom = new THREE.TorusGeometry(2.3, 0.02, 16, 140);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x3D5CFF,
      emissive: 0x243DB5,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.65,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.8, 0.016, 16, 140);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x617DFF,
      emissive: 0x3D5CFF,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(3.0, 0.011, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x8EA5FF,
      transparent: true,
      opacity: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = -Math.PI / 4.5;
    mainGroup.add(ring3);

    // 6. Ambient Floating Particle Constellation
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10 - 1.0;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x617DFF,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 7. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetMouseX = x * 2.0;
      targetMouseY = y * 2.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Scroll Scrubbing
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 9. Continuous Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth dampening
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.05;

      const p = currentScrollProgress;
      const desktop = window.innerWidth >= 1024;

      // Impressive scale that stays present and majestic throughout the page
      let targetScale = desktop ? 1.15 : 0.8;

      // Soft opacity adaptation so it remains rich without overpowering text:
      // In Hero: 1.0. In scroll sections: 0.7 (strong, handsome presence)
      const scrollFactor = Math.max(0.68, 1 - p * 0.4);
      crystalMat.opacity = 0.8 * scrollFactor;
      cageMat.opacity = 0.5 * scrollFactor;
      nodeMat.opacity = 0.9 * scrollFactor;
      ring1Mat.opacity = 0.7 * scrollFactor;
      ring2Mat.opacity = 0.55 * scrollFactor;
      ring3Mat.opacity = 0.38 * scrollFactor;

      // Intelligent Spatial Trajectory:
      // It stays large and flows organically through whitespace & margins:
      // - Hero (p ~ 0): Right side (x: 2.45), framing Andrey's photo, clear of H1
      // - Services (p ~ 0.25): Sits gracefully in right margin & depth (x: 2.7, y: 0.3, z: -1.2)
      // - Cases (p ~ 0.5): Glides to upper right margin (x: 2.3, y: 1.1, z: -1.5)
      // - Process (p ~ 0.75): Weaves to left margin (x: -2.4, y: 0, z: -1.2)
      // - Final CTA (p ~ 1.0): Emerges toward center-bottom (x: 0, y: -1.2, z: -0.8)
      let targetX = desktop ? 2.45 : 0;
      let targetY = desktop ? 0.05 : -0.2;
      let targetZ = 0;

      if (desktop) {
        if (p < 0.15) {
          // Hero
          targetX = 2.45 + mouseX * 0.3;
          targetY = 0.05 - mouseY * 0.3;
          targetZ = 0;
          targetScale = 1.18;
        } else if (p < 0.4) {
          // Services: right-flank presence
          const t = (p - 0.15) / 0.25;
          targetX = 2.45 + t * 0.3 + mouseX * 0.2;
          targetY = 0.05 + t * 0.35 - mouseY * 0.2;
          targetZ = -t * 1.4;
          targetScale = 1.08;
        } else if (p < 0.65) {
          // Cases: upper-right aura
          const t = (p - 0.4) / 0.25;
          targetX = 2.75 - t * 0.6 + mouseX * 0.2;
          targetY = 0.4 + t * 0.8 - mouseY * 0.2;
          targetZ = -1.4 - t * 0.4;
          targetScale = 1.05;
        } else if (p < 0.88) {
          // Process & About: left margin accent
          const t = (p - 0.65) / 0.23;
          targetX = 2.15 - t * 4.5 + mouseX * 0.2;
          targetY = 1.2 - t * 1.3 - mouseY * 0.2;
          targetZ = -1.8 + t * 0.5;
          targetScale = 1.05;
        } else {
          // Final CTA & Footer: grounded center glow
          const t = (p - 0.88) / 0.12;
          targetX = -2.35 + t * 2.35 + mouseX * 0.2;
          targetY = -0.1 - t * 1.0 - mouseY * 0.2;
          targetZ = -1.3 + t * 0.5;
          targetScale = 1.12;
        }
      } else {
        // Mobile
        targetScale = 0.78;
        targetX = mouseX * 0.2;
        targetY = -0.3 + Math.sin(p * Math.PI * 2) * 0.4;
        targetZ = -0.8;
      }

      mainGroup.position.x += (targetX - mainGroup.position.x) * 0.05;
      mainGroup.position.y += (targetY - mainGroup.position.y) * 0.05;
      mainGroup.position.z += (targetZ - mainGroup.position.z) * 0.05;

      const currentScale = mainGroup.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      mainGroup.scale.set(newScale, newScale, newScale);

      // Organic, mesmerizing rotations
      crystalMesh.rotation.x = elapsed * 0.25 + mouseY * 0.4 + p * Math.PI * 2;
      crystalMesh.rotation.y = elapsed * 0.35 + mouseX * 0.4 + p * Math.PI * 3;

      cageMesh.rotation.x = -elapsed * 0.2 + mouseY * 0.3;
      cageMesh.rotation.y = -elapsed * 0.25 + mouseX * 0.3;

      innerCoreMesh.rotation.x = elapsed * 0.5;
      innerCoreMesh.rotation.y = -elapsed * 0.6;

      ring1.rotation.z = elapsed * 0.2 + p * Math.PI * 2.5;
      ring2.rotation.x = elapsed * -0.25 - p * Math.PI * 2;
      ring3.rotation.y = elapsed * 0.15 + p * Math.PI * 1.8;

      // Dynamic light tracking
      coreLight.position.set(mainGroup.position.x, mainGroup.position.y, mainGroup.position.z + 1);

      // Particle slow drift
      particles.rotation.y = elapsed * 0.03 + mouseX * 0.1;
      particles.rotation.x = elapsed * 0.02 - mouseY * 0.1;

      // Soft camera tilt
      camera.position.x = mouseX * 0.3;
      camera.position.y = -mouseY * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize
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
      crystalGeom.dispose();
      crystalMat.dispose();
      cageGeom.dispose();
      cageMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      innerCoreGeom.dispose();
      innerCoreMat.dispose();
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