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

    // 1. Safe WebGL Renderer with Tone Mapping
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
    camera.position.set(0, 0, 8.5);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x617DFF, 3.5);
    dirLight1.position.set(6, 7, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3D5CFF, 2.5);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pulseLight = new THREE.PointLight(0x3D5CFF, 2.5, 12);
    scene.add(pulseLight);

    // 3. Master Spatial Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const isDesktop = width >= 1024;
    masterGroup.position.set(isDesktop ? 2.4 : 0, 0.05, 0);

    // -------------------------------------------------------------
    // MODULE A: Hero Core (Translucent Crystal + Gyro Rings)
    // -------------------------------------------------------------
    const heroCoreGroup = new THREE.Group();
    masterGroup.add(heroCoreGroup);

    // A1. Translucent Physical Crystal
    const crystalGeom = new THREE.IcosahedronGeometry(1.4, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x3D5CFF,
      emissive: 0x1A2875,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
    });
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
    heroCoreGroup.add(crystalMesh);

    // A2. Outer Geodesic Wireframe Cage
    const cageGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x617DFF,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const cageMesh = new THREE.Mesh(cageGeom, cageMat);
    heroCoreGroup.add(cageMesh);

    // A3. Glowing Vertex Nodes
    const cageVertices = cageGeom.attributes.position.array;
    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(cageVertices, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x8EA5FF,
      size: 0.075,
      transparent: true,
      opacity: 0.9,
    });
    const vertexNodes = new THREE.Points(nodeGeom, nodeMat);
    cageMesh.add(vertexNodes);

    // A4. Inner Glowing Octahedron
    const innerCoreGeom = new THREE.OctahedronGeometry(0.75, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x11162B,
      emissive: 0x3D5CFF,
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.8,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    heroCoreGroup.add(innerCoreMesh);

    // A5. Gyroscopic Orbital Rings (Tightly contained to prevent screen text occlusion)
    const ring1Geom = new THREE.TorusGeometry(1.75, 0.016, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x3D5CFF,
      emissive: 0x243DB5,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    heroCoreGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.05, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x617DFF,
      emissive: 0x3D5CFF,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.55,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    heroCoreGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(2.35, 0.009, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x8EA5FF,
      transparent: true,
      opacity: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.x = -Math.PI / 4.2;
    heroCoreGroup.add(ring3);

    // -------------------------------------------------------------
    // MODULE B: The n8n / AI Automation Pipeline (Nodes & Flow Curves)
    // Plays animated computational scenarios as visitor scrolls!
    // -------------------------------------------------------------
    const pipelineGroup = new THREE.Group();
    masterGroup.add(pipelineGroup);

    // 4 Pipeline Nodes (Workflow hubs: Webhook -> AI Logic -> CRM -> Dispatch)
    const nodeCoords = [
      new THREE.Vector3(-1.35, 0.75, 0),     // 0: Webhook / Lead
      new THREE.Vector3(-0.35, 0.15, 0.4),   // 1: Claude AI Core
      new THREE.Vector3(0.55, -0.4, -0.1),   // 2: amoCRM Sync
      new THREE.Vector3(1.45, 0.55, 0.2),    // 3: Telegram Alert
    ];

    const nodeColors = [0x3D5CFF, 0x617DFF, 0x3D5CFF, 0x00E676];
    const nodeLabels = ['Webhook / Lead', 'Claude AI Core', 'amoCRM Sync', 'Telegram Alert'];
    const nodeHexes = ['#3D5CFF', '#617DFF', '#3D5CFF', '#00E676'];

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeTags: { sprite: THREE.Sprite; mat: THREE.SpriteMaterial }[] = [];

    // Helper: Create high-DPI canvas text sprites for real n8n node labeling
    const createNodeTagSprite = (text: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Pill background
        ctx.fillStyle = 'rgba(10, 14, 28, 0.92)';
        if (ctx.roundRect) {
          ctx.roundRect(8, 12, 344, 66, 18);
        } else {
          ctx.rect(8, 12, 344, 66);
        }
        ctx.fill();

        // Border
        ctx.lineWidth = 3;
        ctx.strokeStyle = colorHex;
        ctx.stroke();

        // Glowing status dot
        ctx.fillStyle = colorHex;
        ctx.beginPath();
        ctx.arc(44, 45, 7, 0, Math.PI * 2);
        ctx.fill();

        // Label text
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 68, 45);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.92, 0.23, 1);
      return { sprite, mat };
    };

    nodeCoords.forEach((pos, idx) => {
      const hubGeom = new THREE.IcosahedronGeometry(0.32, 0);
      const hubMat = new THREE.MeshStandardMaterial({
        color: nodeColors[idx],
        emissive: nodeColors[idx],
        emissiveIntensity: 1.1,
        roughness: 0.2,
        metalness: 0.7,
      });
      const hubMesh = new THREE.Mesh(hubGeom, hubMat);
      hubMesh.position.copy(pos);

      // Orbital halo around each node
      const haloGeom = new THREE.TorusGeometry(0.48, 0.012, 12, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColors[idx],
        transparent: true,
        opacity: 0.75,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.rotation.x = Math.PI / 2.5;
      hubMesh.add(halo);

      // Node label pill
      const tag = createNodeTagSprite(nodeLabels[idx], nodeHexes[idx]);
      tag.sprite.position.set(pos.x, pos.y + 0.48, pos.z);
      pipelineGroup.add(tag.sprite);
      nodeTags.push(tag);

      pipelineGroup.add(hubMesh);
      nodeMeshes.push(hubMesh);
    });

    // Spline curve connecting the workflow pipeline (smooth bezier flow)
    const pipelineCurve = new THREE.CatmullRomCurve3(nodeCoords);
    const tubeGeom = new THREE.TubeGeometry(pipelineCurve, 64, 0.026, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x3D5CFF,
      emissive: 0x3050FF,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6,
    });
    const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
    pipelineGroup.add(tubeMesh);

    // Moving Data Pulses (Glowing data packets traveling along the n8n pipeline)
    const packetCount = 8;
    const packetMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < packetCount; i++) {
      const pGeom = new THREE.SphereGeometry(0.09, 14, 14);
      const pMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00FF88 : 0xA5C0FF,
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      pipelineGroup.add(pMesh);
      packetMeshes.push(pMesh);
    }

    // -------------------------------------------------------------
    // MODULE C: Ambient Constellation (Deep Space Dust)
    // -------------------------------------------------------------
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 10 - 1.2;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4D6CFF,
      size: 0.045,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // INTERACTION & SCROLL CONTROLS
    // -------------------------------------------------------------
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

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------
    // ANIMATION & SCENARIO ENGINE
    // -------------------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

      const p = currentScrollProgress;
      const desktop = window.innerWidth >= 1024;

      // 1. DATA PULSE PROPAGATION (n8n scenario simulation):
      // Packets continuously loop through the nodes, pulsing energy
      packetMeshes.forEach((mesh, idx) => {
        const offset = idx / packetCount;
        const progress = (elapsed * 0.22 + offset) % 1;
        const pt = pipelineCurve.getPointAt(progress);
        mesh.position.copy(pt);
      });

      // Node subtle breathing animation
      nodeMeshes.forEach((hub, idx) => {
        const pulse = 1 + Math.sin(elapsed * 3 + idx * 1.5) * 0.15;
        hub.scale.set(pulse, pulse, pulse);
        hub.rotation.y = elapsed * 0.5 + idx;
      });

      // 2. SCROLL CHOREOGRAPHY FROM HEADER TO FOOTER:
      // - Hero (p < 0.12): Master Hero Core is featured on right flank (x: 2.35), pipeline is nested inside.
      // - Transition Screen 1 -> Screen 2 (Services, p: 0.12 -> 0.35):
      //   The 3D scene smoothly expands into the n8n pipeline with glowing data packets & hub tags!
      // - Cases (p: 0.35 -> 0.6): Drifts to upper right flank (x: 2.95, y: 0.35).
      // - Process (p: 0.6 -> 0.82): Shifts along left margin (x: -2.95, y: -0.1), framing workflow steps.
      // - FAQ & Guide (p: 0.82 -> 0.92): Stays securely in right margin whitespace (x: 2.95, y: -0.1).
      // - Final CTA & Footer (p: 0.92 -> 1.0): Converges behind the CTA button like a power reactor!
      let targetX = desktop ? 2.35 : 0;
      let targetY = desktop ? 0.05 : -0.2;
      let targetZ = 0;
      let targetScale = desktop ? 1.15 : 0.75;

      // Cross-fade between Hero Core and n8n Pipeline:
      // In Hero: Hero Core is 100%, Pipeline is subtle preview.
      // In Services & Cases: Pipeline activates (0.12 -> 0.70).
      // In Process, FAQ & Footer: Pipeline dissolves back into a clean cosmic gyroscopic reactor!
      const heroWeight = p < 0.12 
        ? Math.max(0, 1 - p * 8.0) 
        : p > 0.82 
          ? Math.min(1, (p - 0.82) / 0.12)
          : 0;

      const pipelineActivation = p < 0.12 
        ? (p / 0.12) 
        : p < 0.70 
          ? 1.0 
          : Math.max(0, 1 - (p - 0.70) / 0.14);

      // Node label pills: strictly active during Services / n8n workflow transition (p: 0.12 -> 0.44)
      // They gracefully fade in as user scrolls to Services, and completely fade out before Cases
      let tagOpacity = 0;
      if (p >= 0.12 && p <= 0.46) {
        if (p < 0.20) {
          tagOpacity = (p - 0.12) / 0.08;
        } else if (p > 0.38) {
          tagOpacity = Math.max(0, 1 - (p - 0.38) / 0.08);
        } else {
          tagOpacity = 0.95;
        }
      }
      nodeTags.forEach((tag) => {
        tag.mat.opacity = tagOpacity;
      });

      pipelineGroup.visible = pipelineActivation > 0.01;
      if (pipelineGroup.visible) {
        pipelineGroup.scale.setScalar((0.75 + pipelineActivation * 0.4) * pipelineActivation);
        pipelineGroup.rotation.y = elapsed * 0.15 + p * Math.PI * 3;
        pipelineGroup.rotation.x = 0.15 + Math.sin(elapsed * 0.3) * 0.08;
      }

      heroCoreGroup.scale.setScalar(0.85 + (heroWeight > 0 ? heroWeight * 0.35 : 0.15));

      // Dim contrast in text sections so reading is effortlessly crisp
      const footerFade = p > 0.88 ? Math.max(0.35, 1 - (p - 0.88) / 0.12 * 0.3) : 1.0;
      const globalContrastDim = (desktop ? 0.85 : 0.65) * footerFade;
      crystalMat.opacity = (0.75 * heroWeight + 0.32 * (1 - heroWeight)) * globalContrastDim;
      cageMat.opacity = (0.5 * heroWeight + 0.22 * (1 - heroWeight)) * globalContrastDim;
      nodeMat.opacity = (0.85 * heroWeight + 0.35 * (1 - heroWeight)) * globalContrastDim;
      ring1Mat.opacity = (0.65 * heroWeight + 0.25 * (1 - heroWeight)) * globalContrastDim;
      ring2Mat.opacity = (0.5 * heroWeight + 0.18 * (1 - heroWeight)) * globalContrastDim;
      ring3Mat.opacity = (0.35 * heroWeight + 0.12 * (1 - heroWeight)) * globalContrastDim;
      tubeMat.opacity = (0.2 + 0.45 * pipelineActivation) * globalContrastDim * pipelineActivation;

      if (desktop) {
        if (p < 0.12) {
          // 1. Hero screen: centered behind Andrey's photo card (x: 2.35)
          targetX = 2.35 + mouseX * 0.3;
          targetY = 0.05 - mouseY * 0.3;
          targetZ = 0;
          targetScale = 1.15;
        } else if (p < 0.28) {
          // 2. Services screen & n8n workflow transition (p: 0.12 -> 0.28)
          // Scales up prominently and bridges between scenario card and Telegram simulator
          const t = (p - 0.12) / 0.16;
          targetX = 2.35 - t * 0.75 + mouseX * 0.2; // 2.35 -> 1.60
          targetY = 0.05 - t * 0.15 - mouseY * 0.2;
          targetZ = 0.2 - t * 0.4;
          targetScale = 1.45;
        } else if (p < 0.40) {
          // 3. Cases showcase (p: 0.28 -> 0.40): right flank whitespace
          targetX = 3.1 + mouseX * 0.2;
          targetY = 0.05 - mouseY * 0.2;
          targetZ = -0.9;
          targetScale = 1.2;
        } else if (p < 0.54) {
          // 4. Process stages (p: 0.40 -> 0.54): smoothly flows to left margin whitespace
          const t = (p - 0.40) / 0.14;
          targetX = 3.1 - t * 5.9 + mouseX * 0.2; // 3.1 -> -2.8
          targetY = 0.1 - t * 0.3 - mouseY * 0.2;
          targetZ = -1.4;
          targetScale = 1.05;
        } else if (p < 0.68) {
          // 5. Guide & About Me (p: 0.54 -> 0.68): stays in open left margin
          targetX = -2.8 + mouseX * 0.2;
          targetY = 0.0 - mouseY * 0.2;
          targetZ = -1.4;
          targetScale = 1.05;
        } else if (p < 0.88) {
          // 6. FAQ Section (p: 0.68 -> 0.88): MOVES FIRMLY TO THE RIGHT FLANK!
          // Accordion cards occupy the left 65% of the screen; 3D core centers at 85% in open whitespace
          const t = Math.min(1, Math.max(0, (p - 0.68) / 0.05));
          targetX = -2.8 + t * 7.1 + mouseX * 0.15; // flows from -2.8 all the way to +4.30 (completely clear of cards!)
          targetY = -0.05 - mouseY * 0.15;
          targetZ = -0.9;                           // crisp and luminous in the open right margin
          targetScale = 1.12;                       // calibrated so outer orbital rings stay in right whitespace
        } else {
          // 7. Final CTA & Footer (p >= 0.88): converges into the bottom reactor behind _ANGROVE_
          const t = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
          targetX = 4.30 * (1 - t) + mouseX * 0.15; // smoothly centers at x=0
          targetY = 0.05 - t * 3.6 - mouseY * 0.15; // drops down behind _ANGROVE_ at bottom
          targetZ = -3.5;                           // deep behind text layer, zero occlusion
          targetScale = 1.6;
        }
      } else {
        // Mobile responsive spatial tuning
        targetScale = 0.7;
        targetX = mouseX * 0.15;
        targetY = -0.2 + Math.sin(p * Math.PI * 2) * 0.35;
        targetZ = -0.9;
      }

      masterGroup.position.x += (targetX - masterGroup.position.x) * 0.05;
      masterGroup.position.y += (targetY - masterGroup.position.y) * 0.05;
      masterGroup.position.z += (targetZ - masterGroup.position.z) * 0.05;

      const currentScale = masterGroup.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      masterGroup.scale.set(newScale, newScale, newScale);

      // Hero core rotations
      crystalMesh.rotation.x = elapsed * 0.25 + mouseY * 0.4 + p * Math.PI * 2;
      crystalMesh.rotation.y = elapsed * 0.35 + mouseX * 0.4 + p * Math.PI * 3;
      cageMesh.rotation.x = -elapsed * 0.2 + mouseY * 0.3;
      cageMesh.rotation.y = -elapsed * 0.25 + mouseX * 0.3;
      innerCoreMesh.rotation.x = elapsed * 0.5;
      innerCoreMesh.rotation.y = -elapsed * 0.6;
      ring1.rotation.z = elapsed * 0.2 + p * Math.PI * 2.5;
      ring2.rotation.x = elapsed * -0.25 - p * Math.PI * 2;
      ring3.rotation.y = elapsed * 0.15 + p * Math.PI * 1.8;

      // Point light tracking
      pulseLight.position.set(masterGroup.position.x, masterGroup.position.y, masterGroup.position.z + 1.2);

      // Ambient particle drift
      particles.rotation.y = elapsed * 0.025 + mouseX * 0.1;
      particles.rotation.x = elapsed * 0.015 - mouseY * 0.1;

      // Soft camera tilt
      camera.position.x = mouseX * 0.25;
      camera.position.y = -mouseY * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize
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
      tubeGeom.dispose();
      tubeMat.dispose();
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
