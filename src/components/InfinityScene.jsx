import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Infinity as InfinityIcon, X } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function InfinityScene({ couple }) {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef(null);

  // Lemniscate of Bernoulli / 3D Infinity Canvas
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Parametric Infinity Symbol particles
    // x = a * sqrt(2) * cos(t) / (sin(t)^2 + 1)
    // y = a * sqrt(2) * cos(t) * sin(t) / (sin(t)^2 + 1)
    const particleCount = width < 768 ? 400 : 700;
    const particles = [];
    const scale = Math.min(width, height) * 0.28;

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2;
      particles.push({
        baseT: t,
        speed: 0.008 + Math.random() * 0.004,
        size: Math.random() * 3 + 1.5,
        color:
          i % 3 === 0
            ? '#ffd700'
            : i % 2 === 0
            ? '#ff2a85'
            : '#ffffff',
        zOffset: (Math.random() - 0.5) * 80,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      ctx.fillStyle = 'rgba(3, 1, 6, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Render 3D Infinity Particles
      particles.forEach((p) => {
        const curT = p.baseT + time * p.speed * 2;
        const sinT = Math.sin(curT);
        const cosT = Math.cos(curT);
        const denom = sinT * sinT + 1;

        const x = (scale * Math.SQRT2 * cosT) / denom;
        const y = (scale * Math.SQRT2 * cosT * sinT) / denom;
        const z = p.zOffset + Math.sin(curT * 2 + time) * 30;

        // Perspective 3D
        const fov = 400;
        const scale3D = fov / (fov + z);
        const screenX = x * scale3D;
        const screenY = y * scale3D;

        ctx.save();
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * scale3D, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = Math.max(0.2, Math.min(1, scale3D));
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  const handleTriggerLove = () => {
    soundEngine.playBurst();
    soundEngine.playChime(1.3);
    setIsActive(true);

    // Heart Fireworks Confetti
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ff2a85', '#ffd700', '#bd00ff', '#ffffff', '#e60039'],
    });
  };

  return (
    <section className="relative py-20 px-4 bg-[#030106] flex flex-col items-center justify-center overflow-hidden">
      {/* Trigger Button Card */}
      <div className="max-w-2xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-neon/40 shadow-neon-pink flex flex-col items-center justify-center space-y-6 group"
        >
          <div className="w-16 h-16 rounded-full bg-rose-neon/15 border border-rose-neon/40 flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-rose-neon fill-rose-neon" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-white">
            WONDER HOW MUCH I LOVE YOU?
          </h3>

          <p className="text-gray-300 font-inter text-sm sm:text-base max-w-md">
            Click the button below to witness the true magnitude of our universe.
          </p>

          <button
            onClick={handleTriggerLove}
            onMouseEnter={() => soundEngine.playChime(1.1)}
            className="group/btn relative px-8 py-4 sm:px-10 sm:py-5 rounded-full font-outfit font-black text-sm sm:text-base tracking-[0.25em] uppercase text-white shadow-neon-pink hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Shimmer gradient fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-neon via-rose-crimson to-gold-shimmer animate-shimmer" />
            <div className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold-shimmer animate-spin-slow" />
              <span>HOW MUCH DO I LOVE YOU? ❤️</span>
              <Sparkles className="w-5 h-5 text-rose-neon animate-spin-slow" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Fullscreen Infinity Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030106]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* 3D Infinity Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Exit Button */}
            <button
              onClick={() => setIsActive(false)}
              className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-rose-neon text-white flex items-center justify-center transition-colors shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Foreground Typography */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, type: 'spring' }}
              className="relative z-20 text-center max-w-3xl mx-auto space-y-6 px-4"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/60 border border-gold-shimmer/40 text-xs font-outfit uppercase tracking-[0.3em] metallic-gold-text">
                <InfinityIcon className="w-4 h-4 text-gold-shimmer" />
                Beyond Measure • Beyond Time
                <InfinityIcon className="w-4 h-4 text-gold-shimmer" />
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-tight glow-text-pink metallic-rose-text leading-tight">
                INFINITE... AND STILL GROWING.
              </h2>

              <p className="text-xl sm:text-3xl font-serif italic text-gold-shimmer drop-shadow-lg">
                "YOU + ME + EVERY BEAUTIFUL TOMORROW."
              </p>

              <p className="text-xs sm:text-sm font-inter text-gray-400 tracking-widest uppercase pt-4">
                {couple ? `${couple.partner1} & ${couple.partner2} — Eternal Constellation` : 'An Eternal Constellation'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
