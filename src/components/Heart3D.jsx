import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart as HeartIcon } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function Heart3D({ couple }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isExploded, setIsExploded] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 520;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xff2a85, 0.8);
    scene.add(ambientLight);

    const pinkLight = new THREE.PointLight(0xff2a85, 3.5, 50);
    pinkLight.position.set(10, 10, 15);
    scene.add(pinkLight);

    const goldLight = new THREE.PointLight(0xffd700, 3.0, 50);
    goldLight.position.set(-10, -8, 15);
    scene.add(goldLight);

    const redLight = new THREE.PointLight(0xe60039, 4.0, 50);
    redLight.position.set(0, 0, 18);
    scene.add(redLight);

    // Parametric 3D Heart Geometry using Points
    // Heart 3D formula:
    // x = 16 * sin^3(t)
    // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
    // z = depth variation
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    const particleCount = window.innerWidth < 768 ? 2200 : 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPink = new THREE.Color('#ff2a85');
    const colorGold = new THREE.Color('#ffd700');
    const colorRed = new THREE.Color('#e60039');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount; i++) {
      // Sample t along heart perimeter and interior
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      // Heart curve 2D base
      const sinT = Math.sin(t);
      const x0 = 16 * Math.pow(sinT, 3);
      const y0 = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

      // Volume & 3D thickness with smooth falloff
      const scaleFactor = 0.42 * (0.3 + 0.7 * Math.pow(Math.random(), 0.5));
      const z0 = (Math.random() - 0.5) * 8 * (1 - Math.abs(y0) / 18);

      const jitter = (Math.random() - 0.5) * 0.4;
      const x = (x0 + jitter) * scaleFactor;
      const y = (y0 + jitter) * scaleFactor;
      const z = z0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Color variation
      const mix = Math.random();
      let pColor;
      if (mix < 0.55) {
        pColor = colorPink.clone().lerp(colorRed, Math.random());
      } else if (mix < 0.88) {
        pColor = colorGold.clone().lerp(colorPink, Math.random());
      } else {
        pColor = colorWhite;
      }

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;

      sizes[i] = Math.random() * 3.5 + 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom circle particle texture
    const createCircleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,42,133,0.8)');
      grad.addColorStop(0.7, 'rgba(255,42,133,0.2)');
      grad.addColorStop(1, 'rgba(255,42,133,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const heartPoints = new THREE.Points(geometry, particleMaterial);
    heartGroup.add(heartPoints);

    // Mouse & Touch interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || width / 2;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || height / 2;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
      targetRotationY = mouseX * 0.7;
      targetRotationX = mouseY * 0.5;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 520;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;
    let exploding = false;
    let explodeProgress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse follow rotation
      heartGroup.rotation.y += (targetRotationY - heartGroup.rotation.y) * 0.05;
      heartGroup.rotation.x += (targetRotationX - heartGroup.rotation.x) * 0.05;

      // Subtle base rotation
      heartGroup.rotation.y += Math.sin(time * 0.8) * 0.003;

      // Realistic Heartbeat Scaling
      const beatCycle = time * 3.8;
      const beat =
        Math.pow(Math.sin(beatCycle), 12) * 0.16 +
        Math.pow(Math.sin(beatCycle - 0.4), 8) * 0.08;
      const baseScale = 1.0 + beat;

      // Dynamic light orbits
      pinkLight.position.x = Math.sin(time * 1.5) * 12;
      pinkLight.position.y = Math.cos(time * 1.2) * 10;
      goldLight.position.x = Math.cos(time * 1.8) * 12;
      goldLight.position.z = Math.sin(time * 1.3) * 10 + 10;

      // Handle Particle Position Updates (Explosion or Beating)
      const posArr = geometry.attributes.position.array;

      if (container.dataset.exploding === 'true') {
        explodeProgress += 0.035;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          posArr[idx] += velocities[idx] * (1 + explodeProgress * 2.5);
          posArr[idx + 1] += velocities[idx + 1] * (1 + explodeProgress * 2.5);
          posArr[idx + 2] += velocities[idx + 2] * (1 + explodeProgress * 2.5);
        }
        geometry.attributes.position.needsUpdate = true;

        if (explodeProgress > 2.8) {
          // Reassemble back gently
          container.dataset.exploding = 'false';
          explodeProgress = 0;
        }
      } else {
        // Return back to original shape or pulse with heartbeat
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const origX = originalPositions[idx] * baseScale;
          const origY = originalPositions[idx + 1] * baseScale;
          const origZ = originalPositions[idx + 2] * baseScale;

          posArr[idx] += (origX - posArr[idx]) * 0.09;
          posArr[idx + 1] += (origY - posArr[idx + 1]) * 0.09;
          posArr[idx + 2] += (origZ - posArr[idx + 2]) * 0.09;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const triggerExplosion = () => {
    soundEngine.playBurst();
    soundEngine.playHeartbeat(1.3);

    const container = containerRef.current;
    if (container) {
      container.dataset.exploding = 'true';
    }

    setIsExploded(true);
    setMessageVisible(true);
    setClickCount((prev) => prev + 1);

    // Multi-color Confetti Burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff2a85', '#ffd700', '#bd00ff', '#ffffff', '#e60039'],
      shapes: ['circle'],
    });

    setTimeout(() => {
      setIsExploded(false);
    }, 2800);
  };

  return (
    <section
      id="heart-3d"
      className="relative w-full py-20 px-4 min-h-[750px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-tr from-rose-neon/20 via-violet-neon/15 to-gold-shimmer/10 blur-[90px] pointer-events-none" />

      {/* Header Tag */}
      <div className="text-center z-10 mb-2">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-neon/30 bg-rose-neon/10 text-rose-blush text-xs uppercase tracking-[0.25em] font-outfit"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-shimmer" />
          Interactive 3D Heart Universe
          <Sparkles className="w-3.5 h-3.5 text-rose-neon" />
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif font-bold mt-3 tracking-wide"
        >
          <span className="cosmic-gradient-text">TOUCH THE HEART</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm md:text-base font-inter max-w-md mx-auto mt-2"
        >
          Click or tap the heart to feel the pulse of our love explode across the galaxy.
        </motion.p>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        onClick={triggerExplosion}
        className="relative w-full max-w-4xl h-[460px] md:h-[540px] flex items-center justify-center cursor-pointer group"
        title="Click to explode heart particles!"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Hover Hint Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-outfit tracking-widest uppercase text-rose-blush bg-black/50 px-4 py-2 rounded-full border border-rose-neon/20 backdrop-blur-md">
          <HeartIcon className="w-4 h-4 text-rose-neon fill-rose-neon animate-pulse" />
          <span>Click to ignite fireworks</span>
        </div>
      </div>

      {/* Heart Explosion Reveal Message */}
      <AnimatePresence>
        {messageVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', damping: 15 }}
            className="z-20 text-center px-6 py-4 mt-2 max-w-xl mx-auto glass-panel rounded-2xl border border-gold-shimmer/40 shadow-neon-pink"
          >
            <p className="text-lg md:text-2xl font-serif font-bold metallic-gold-text tracking-wide mb-1">
              "YOU ARE MY FAVORITE PART OF EVERY STORY ❤️"
            </p>
            <p className="text-xs md:text-sm font-cormorant italic text-rose-blush">
              {couple ? `${couple.partner1} & ${couple.partner2} — Forever & Always` : 'Forever In Every Universe'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
