import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function IntroScene({ onEnterExperience, couple }) {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0); // 0: initial, 1: text reveal, 2: heart beat, 3: button ready
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Background Particles and Starlight Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = Math.min(width < 768 ? 60 : 130, 150);
    const particles = [];
    const colors = ['#ff2a85', '#ff758c', '#ffd700', '#bd00ff', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        decay: Math.random() * 0.005 + 0.002,
      });
    }

    // Fog gradient drifting
    let fogOffset = 0;

    const render = () => {
      ctx.fillStyle = '#030106';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric colored glows
      fogOffset += 0.003;
      const g1 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(fogOffset) * 60,
        height * 0.45 + Math.cos(fogOffset) * 40,
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.55
      );
      g1.addColorStop(0, 'rgba(255, 42, 133, 0.12)');
      g1.addColorStop(0.35, 'rgba(189, 0, 255, 0.06)');
      g1.addColorStop(0.7, 'rgba(212, 175, 55, 0.03)');
      g1.addColorStop(1, 'rgba(3, 1, 6, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Render floating stars & particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.alpha += Math.sin(Date.now() * 0.002 + p.x) * 0.01;
        p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Timed progression of cinematic intro
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => {
      setStage(2);
      soundEngine.playHeartbeat(0.8);
    }, 2200);
    const t3 = setTimeout(() => {
      setStage(3);
      soundEngine.playChime(1.1);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleEnter = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Audio transition
    soundEngine.playBurst();
    soundEngine.startRomanticAmbient();

    setTimeout(() => {
      onEnterExperience();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#030106] select-none flex flex-col items-center justify-center">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Screen flash on transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.2, 0] }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={
          isTransitioning
            ? { scale: [1, 2.5, 4], opacity: [1, 0.8, 0], filter: 'blur(12px)' }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto"
      >
        {/* ECG Heartbeat Line */}
        <div className="w-64 sm:w-80 md:w-96 h-16 relative mb-4 flex items-center justify-center">
          <svg
            viewBox="0 0 500 120"
            className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(255,42,133,0.8)]"
          >
            <path
              d="M 10 60 L 140 60 L 160 30 L 180 90 L 205 10 L 230 110 L 250 50 L 270 70 L 290 60 L 490 60"
              fill="none"
              stroke="url(#ecgGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ecg-path"
            />
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff2a85" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ff2a85" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Central Beating Heart Icon */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, type: 'spring' }}
              className="relative my-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.18, 1, 1.25, 1],
                  filter: [
                    'drop-shadow(0 0 15px rgba(255,42,133,0.6))',
                    'drop-shadow(0 0 35px rgba(255,42,133,0.95))',
                    'drop-shadow(0 0 15px rgba(255,42,133,0.6))',
                    'drop-shadow(0 0 45px rgba(255,215,0,0.9))',
                    'drop-shadow(0 0 15px rgba(255,42,133,0.6))',
                  ],
                }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-rose-crimson via-rose-neon to-gold-shimmer flex items-center justify-center p-[2px] shadow-neon-pink"
              >
                <div className="w-full h-full rounded-full bg-[#09030e] flex items-center justify-center">
                  <Heart className="w-10 h-10 md:w-12 md:h-12 text-rose-neon fill-rose-neon" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elegant Teaser Subtitles */}
        <div className="min-h-[90px] flex flex-col justify-center items-center">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-serif italic text-lg md:text-2xl text-rose-blush tracking-wider drop-shadow-md mb-2"
              >
                "Something beautiful is about to begin..."
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-1"
              >
                <h3 className="text-xs md:text-sm font-outfit uppercase tracking-[0.35em] text-gold-shimmer/90 font-medium">
                  FOR SOMEONE SPECIAL ❤️
                </h3>
                {couple && (
                  <p className="text-sm md:text-base font-cormorant italic text-gray-300">
                    {couple.partner1} &amp; {couple.partner2}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Glowing CTA Button */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mt-6"
            >
              <button
                onClick={handleEnter}
                disabled={isTransitioning}
                onMouseEnter={() => soundEngine.playChime(1.3)}
                className="group relative px-8 py-4 md:px-10 md:py-4 rounded-full font-outfit font-semibold text-sm md:text-base tracking-[0.2em] uppercase overflow-hidden cursor-pointer active:scale-95 transition-all duration-300 focus:outline-none"
              >
                {/* Glowing neon aura background */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-neon via-violet-neon to-gold-shimmer rounded-full blur-md opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 animate-pulse-glow" />

                {/* Inner button surface */}
                <div className="relative z-10 bg-[#09030e]/90 hover:bg-[#09030e]/70 px-8 py-3.5 rounded-full border border-rose-neon/40 flex items-center justify-center gap-3 text-white group-hover:border-gold-shimmer/80 shadow-2xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-gold-shimmer animate-spin-slow" />
                  <span className="cosmic-gradient-text font-bold">ENTER OUR WORLD ✨</span>
                  <Sparkles className="w-5 h-5 text-rose-neon animate-spin-slow" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-5 text-[11px] font-inter text-gray-500 tracking-widest uppercase"
      >
        Best experienced with sound enabled 🎧
      </motion.p>
    </div>
  );
}
