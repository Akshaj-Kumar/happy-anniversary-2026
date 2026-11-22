import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function ParticleHeart({ couple }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [phase, setPhase] = useState('forming'); // 'intro', 'forming', 'formed', 'scattered'
  const [isScattered, setIsScattered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 750;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    const isMobile = width < 768;
    const count = isMobile ? 450 : 850;
    const particles = [];

    // Text tags to stamp on special particles
    const textStamps = ['I LOVE YOU', 'FOREVER', 'YOU & ME', 'ALWAYS', 'MY HEART', '❤️', 'MY WORLD'];

    for (let i = 0; i < count; i++) {
      // Parametric heart formula
      const t = Math.PI * 2 * Math.random();
      const sinT = Math.sin(t);
      const x0 = 16 * Math.pow(sinT, 3);
      const y0 = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      // Scaling and interior filling
      const fillFactor = Math.pow(Math.random(), 0.65);
      const scale = (isMobile ? 12 : 18) * (0.2 + 0.8 * fillFactor);

      const targetX = x0 * scale;
      const targetY = y0 * scale;
      const targetZ = (Math.random() - 0.5) * 160;

      // Start clustered in center or scattered
      const startX = (Math.random() - 0.5) * 60;
      const startY = (Math.random() - 0.5) * 60;

      const isText = i % 14 === 0;
      const text = isText ? textStamps[Math.floor(Math.random() * textStamps.length)] : null;

      particles.push({
        x: startX,
        y: startY,
        z: targetZ,
        targetX,
        targetY,
        targetZ,
        vx: 0,
        vy: 0,
        vz: 0,
        size: isText ? (isMobile ? 9 : 11) : Math.random() * 2.8 + 1.2,
        color:
          i % 4 === 0
            ? '#ffd700'
            : i % 3 === 0
            ? '#ffffff'
            : i % 2 === 0
            ? '#ff2a85'
            : '#e60039',
        alpha: Math.random() * 0.6 + 0.4,
        isText,
        text,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Floating Rose Petals
    const petalsCount = isMobile ? 15 : 30;
    const petals = [];
    for (let i = 0; i < petalsCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        vy: Math.random() * 0.8 + 0.5,
        vx: Math.sin(Math.random() * Math.PI) * 0.5,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // Mouse interactive force
    let mouse = { x: -9999, y: -9999, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - width / 2;
      mouse.y = e.clientY - rect.top - height / 2;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let startTime = Date.now();
    let lastHeartbeat = 0;

    const render = () => {
      const now = (Date.now() - startTime) * 0.001;

      // Dark background with trailing glow
      ctx.fillStyle = 'rgba(3, 1, 6, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Centered coordinate system
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Heartbeat pulse calculation
      const pulseTime = now * 3.4;
      const beat1 = Math.pow(Math.sin(pulseTime), 16) * 0.18;
      const beat2 = Math.pow(Math.sin(pulseTime - 0.45), 10) * 0.1;
      const pulseScale = 1.0 + beat1 + beat2;

      // Trigger heartbeat sound at top of beat
      if (beat1 > 0.15 && Date.now() - lastHeartbeat > 750) {
        lastHeartbeat = Date.now();
        soundEngine.playHeartbeat(0.35);
      }

      // 3D rotation angle
      const rotY = Math.sin(now * 0.4) * 0.35;
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      // Draw background ambient glow
      const radial = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.45);
      radial.addColorStop(0, 'rgba(255, 42, 133, 0.14)');
      radial.addColorStop(0.4, 'rgba(230, 0, 57, 0.06)');
      radial.addColorStop(0.8, 'rgba(189, 0, 255, 0.02)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        // Target calculation with 3D rotation and beating scale
        let tx = p.targetX * pulseScale;
        let ty = p.targetY * pulseScale;
        let tz = p.targetZ;

        // Apply 3D rotation along Y axis
        const rotX = tx * cosR - tz * sinR;
        const rotZ = tx * sinR + tz * cosR;

        // Perspective projection
        const fov = 450;
        const scale3D = fov / (fov + rotZ);
        const screenX = rotX * scale3D;
        const screenY = ty * scale3D;

        // Mouse repelling physics
        if (mouse.active) {
          const dx = screenX - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.vx += (dx / dist) * force * 4.5;
            p.vy += (dy / dist) * force * 4.5;
          }
        }

        // Spring force towards target
        const spring = 0.05;
        const damping = 0.88;
        p.vx += (screenX - p.x) * spring;
        p.vy += (screenY - p.y) * spring;

        p.vx *= damping;
        p.vy *= damping;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.save();
        ctx.globalAlpha = Math.max(0.15, Math.min(1, p.alpha * scale3D));

        if (p.isText && p.text) {
          // Render miniature glowing words
          ctx.font = `600 ${Math.max(7, p.size * scale3D)}px 'Outfit', sans-serif`;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.x, p.y);
        } else {
          // Render glowing dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.8, p.size * scale3D), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.restore(); // end centered coordinate system

      // Render floating rose petals
      petals.forEach((petal) => {
        petal.y += petal.vy;
        petal.x += petal.vx + Math.sin(now + petal.y * 0.01) * 0.4;
        petal.rotation += petal.rotSpeed;

        if (petal.y > height + 20) {
          petal.y = -20;
          petal.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.globalAlpha = petal.alpha;
        ctx.fillStyle = '#ff2a85';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#e60039';

        // Petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size * 0.5, petal.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const triggerScatter = () => {
    soundEngine.playBurst();
    setIsScattered(true);
    setTimeout(() => setIsScattered(false), 2400);
  };

  return (
    <section
      id="particle-vfx"
      ref={containerRef}
      className="relative w-full min-h-[750px] md:min-h-[820px] bg-[#030106] flex flex-col items-center justify-center overflow-hidden py-16"
    >
      {/* Background VFX Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" />

      {/* Foreground Romantic Overlay Typography */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pointer-events-none mt-auto mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-rose-neon/40 bg-black/60 backdrop-blur-md text-xs font-outfit uppercase tracking-[0.3em] text-rose-blush shadow-neon-pink">
            <Heart className="w-3.5 h-3.5 text-rose-neon fill-rose-neon animate-pulse" />
            Particle Formation VFX
            <Heart className="w-3.5 h-3.5 text-rose-neon fill-rose-neon animate-pulse" />
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-wider drop-shadow-2xl">
            <span className="glow-text-pink metallic-rose-text">I LOVE YOU ❤️</span>
          </h2>

          <p className="text-base sm:text-xl md:text-2xl font-serif italic text-gold-shimmer/90 tracking-wide">
            "More than words could ever explain."
          </p>

          <p className="text-xs sm:text-sm font-inter text-gray-400 max-w-lg mx-auto tracking-widest uppercase opacity-80 pt-2">
            Thousands of starlit particles assembling into our eternal heartbeat
          </p>
        </motion.div>
      </div>

      {/* Interactive Controls (Scatter / Pulse) */}
      <div className="relative z-10 mb-4 flex items-center justify-center gap-4">
        <button
          onClick={triggerScatter}
          onMouseEnter={() => soundEngine.playChime(1.2)}
          className="pointer-events-auto px-5 py-2.5 rounded-full border border-rose-neon/40 bg-black/70 hover:bg-rose-neon/20 backdrop-blur-md text-xs md:text-sm font-outfit uppercase tracking-[0.2em] text-white flex items-center gap-2 transition-all duration-300 shadow-glass-rose hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-gold-shimmer animate-spin-slow" />
          <span>Touch The Constellation ✨</span>
        </button>
      </div>
    </section>
  );
}
