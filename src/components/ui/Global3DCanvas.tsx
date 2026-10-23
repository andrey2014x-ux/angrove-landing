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

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main 3D Container Group (Moved and rotated dynamically on scroll)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Base position for desktop: offset to the right where hero photo lives
    const isDesktop = width >= 1024;
    mainGroup.position.set(isDesktop ? 1.8 : 0, 0, 0);

    // 3. Central Geometric Core: Icosahedron
    const coreGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3D5CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    mainGroup.add(coreMesh);

    // Vertex Nodes (Glowing Blue Spheres at vertices)
    const vertexPositions = coreGeom.attributes.position.array;
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x617DFF,
      size: 0.09,
      transparent: true,
      opacity: 0.95,
    });
    const vertexNodes = new THREE.Points(nodeGeom, nodeMat);
    coreMesh.add(vertexNodes);

    // Inner Solid Geometric Core
    const innerGeom = new THREE.OctahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0A0C16,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    mainGroup.add(innerMesh);

    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x96B0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const innerWire = new THREE.Mesh(innerGeom, innerWireMat);
    mainGroup.add(innerWire);

    // 4. Large Orbital Data Rings (Gracefully spreading across the screen)
    const ring1Geom = new THREE.TorusGeometry(2.4, 0.022, 16, 140);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3D5CFF, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.9, 0.018, 16, 140);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x617DFF, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(3.5, 0.014, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x96B0FF, transparent: true, opacity: 0.35 });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = -Math.PI / 5;
    mainGroup.add(ring3);

    // 5. Ambient 3D Particle Cloud (Floats across entire screen depth)
    const particleCount = 200;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3D5CFF,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 6. Mouse Interactive Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetX = x * 2.5;
      targetY = y * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Scroll-Scrubbed Global Motion Tracking
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 8. Animation Render Loop (Continuous 60FPS)
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth interpolation for mouse and scroll
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

      // Dynamic repositioning through the page journey:
      // Hero (progress ~0): right side (x: 1.8, y: 0)
      // Services (progress ~0.25): center-left (x: -1.2, y: -0.3)
      // Cases (progress ~0.5): center-right (x: 1.4, y: 0.2)
      // Process (progress ~0.75): center (x: 0, y: -0.5)
      // Final CTA (progress ~1): center (x: 0, y: 0)
      const p = currentScrollProgress;
      const baseDesktopX = window.innerWidth >= 1024 ? 1.8 : 0;
      
      const targetGroupX = baseDesktopX * Math.cos(p * Math.PI * 2) + mouseX * 0.4;
      const targetGroupY = Math.sin(p * Math.PI * 3) * 0.8 - mouseY * 0.4;
      const targetGroupZ = -p * 2.0;

      mainGroup.position.x += (targetGroupX - mainGroup.position.x) * 0.05;
      mainGroup.position.y += (targetGroupY - mainGroup.position.y) * 0.05;
      mainGroup.position.z += (targetGroupZ - mainGroup.position.z) * 0.05;

      // 3D Core continuous and scroll-driven rotation
      coreMesh.rotation.x = elapsed * 0.25 + mouseY + p * Math.PI * 2.5;
      coreMesh.rotation.y = elapsed * 0.35 + mouseX + p * Math.PI * 3.5;

      innerMesh.rotation.x = -elapsed * 0.4 + mouseY;
      innerMesh.rotation.y = -elapsed * 0.5 + mouseX;
      innerWire.rotation.copy(innerMesh.rotation);

      ring1.rotation.z = elapsed * 0.2 + p * Math.PI * 4;
      ring2.rotation.x = elapsed * -0.25 - p * Math.PI * 3;
      ring3.rotation.y = elapsed * 0.15 + p * Math.PI * 2;

      // Particles gentle drift
      particles.rotation.y = elapsed * 0.05 + mouseX * 0.2;
      particles.rotation.x = elapsed * 0.03 - mouseY * 0.2;

      // Gentle camera parallax
      camera.position.x = mouseX * 0.4;
      camera.position.y = -mouseY * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
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
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
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
