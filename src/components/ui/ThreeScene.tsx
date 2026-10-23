import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ScrollTrigger } from '../../lib/motion';

export const ThreeScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Geometric 3D Lattice: Wireframe Icosahedron
    const coreGeom = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3D5CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // Vertex Nodes (Glowing Blue Spheres at vertices)
    const vertexPositions = coreGeom.attributes.position.array;
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x617DFF,
      size: 0.08,
      transparent: true,
      opacity: 0.95,
    });
    const vertexNodes = new THREE.Points(nodeGeom, nodeMat);
    coreMesh.add(vertexNodes);

    // Inner Solid Geometric Core
    const innerGeom = new THREE.OctahedronGeometry(0.75, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0A0C16,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerMesh);

    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x96B0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerWire = new THREE.Mesh(innerGeom, innerWireMat);
    scene.add(innerWire);

    // 3. Orbital Data Rings
    const ring1Geom = new THREE.TorusGeometry(1.9, 0.02, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3D5CFF, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.2, 0.018, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x617DFF, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(2.5, 0.012, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x96B0FF, transparent: true, opacity: 0.4 });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = -Math.PI / 6;
    scene.add(ring3);

    // 4. Floating Data Particles Field
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3D5CFF,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Mouse Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Scroll-Scrubbed Camera Rotation via GSAP ScrollTrigger
    let scrollProgress = 0;
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // 3D Core rotation
      coreMesh.rotation.x = elapsed * 0.25 + mouseY + scrollProgress * Math.PI;
      coreMesh.rotation.y = elapsed * 0.35 + mouseX + scrollProgress * Math.PI * 1.5;

      innerMesh.rotation.x = -elapsed * 0.35 + mouseY;
      innerMesh.rotation.y = -elapsed * 0.45 + mouseX;
      innerWire.rotation.copy(innerMesh.rotation);

      ring1.rotation.z = elapsed * 0.2 + scrollProgress * 2.5;
      ring2.rotation.x = elapsed * -0.25 - scrollProgress * 2;
      ring3.rotation.y = elapsed * 0.15 + scrollProgress * 1.5;

      particles.rotation.y = elapsed * 0.08 + mouseX * 0.4;
      particles.rotation.x = elapsed * 0.04 - mouseY * 0.4;

      // Camera tilt
      camera.position.x = mouseX * 0.6;
      camera.position.y = -mouseY * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      st.kill();
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
      className={`w-full h-full relative pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
