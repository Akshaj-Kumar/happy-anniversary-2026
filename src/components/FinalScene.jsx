import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Volume2 } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function FinalScene({ couple, onReplay }) {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(0);

  // Timed progression of final scene texts
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2400),
      setTimeout(() => setStage(3), 4000),
      setTimeout(() => {
        setStage(4);
        soundEngine.playBurst();
      }, 5800),
      setTimeout(() => {
        setStage(5);
        soundEngine.playChime(1.2);
        // Fireworks blast
        confetti({
          particleCount: 150,
          spread: 140,
          origin: { y: 0.6 },
          colors: ['#ff2a85', '#ffd700', '#bd00ff', '#ffffff', '#e60039'],
        });
      }, 7600),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Heart Fireworks & Sparkles Canvas
  useEffect(() => {
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

    const fireworks = [];
    const colors = ['#ff2a85', '#ffd700', '#ff758c', '#ffffff', '#bd00ff'];

    const spawnFirework = () => {
      const centerX = Math.random() * width * 0.8 + width * 0.1;
      const centerY = Math.random() * height * 0.5 + height * 0.1;
      const pCount = 55;

      for (let i = 0; i < pCount; i++) {
        // Heart shape trajectory
        const t = (i / pCount) * Math.PI * 2;
        const sinT = Math.sin(t);
        const vx = 16 * Math.pow(sinT, 3) * 0.14;
        const vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.14;

        fireworks.push({
          x: centerX,
          y: centerY,
          vx: vx + (Math.random() - 0.5) * 0.5,
          vy: vy + (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015,
          size: Math.random() * 3 + 1.5,
        });
      }
    };

    let lastFirework = 0;

    const render = (time) => {
      ctx.fillStyle = 'rgba(3, 1, 6, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Periodically trigger fireworks after stage 4
      if (stage >= 4 && time - lastFirework > 2200) {
        spawnFirework();
        lastFirework = time;
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // soft gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [stage]);

  const handleReplayClick = () => {
    soundEngine.playBurst();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      onReplay();
    }, 600);
  };

  return (
    <section
      id="final-scene"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 overflow-hidden bg-[#030106] text-center"
    >
      {/* Fireworks Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Center Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[800px] h-[550px] md:h-[800px] bg-gradient-to-r from-rose-neon/15 via-rose-crimson/10 to-gold-shimmer/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
        {/* Giant Pulsating Heart */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1, 1.22, 1],
            filter: [
              'drop-shadow(0 0 20px rgba(255,42,133,0.5))',
              'drop-shadow(0 0 50px rgba(255,42,133,0.9))',
              'drop-shadow(0 0 20px rgba(255,42,133,0.5))',
              'drop-shadow(0 0 60px rgba(255,215,0,0.8))',
              'drop-shadow(0 0 20px rgba(255,42,133,0.5))',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-rose-crimson via-rose-neon to-gold-shimmer flex items-center justify-center p-[3px] shadow-neon-pink my-4"
        >
          <div className="w-full h-full rounded-full bg-[#0a0312] flex items-center justify-center">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-neon fill-rose-neon" />
          </div>
        </motion.div>

        {/* Staggered Cinematic Text Reveals */}
        <div className="min-h-[220px] flex flex-col items-center justify-center space-y-4">
          <AnimatePresence>
            {stage >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-base sm:text-2xl font-serif italic text-gray-400 tracking-wider"
              >
                "IN EVERY UNIVERSE..."
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg sm:text-3xl font-serif italic text-rose-blush tracking-wider"
              >
                "IN EVERY LIFETIME..."
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 3 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9 }}
                className="text-2xl sm:text-4xl md:text-5xl font-serif font-black metallic-gold-text tracking-wide"
              >
                "IT WILL ALWAYS BE YOU."
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 4 && (
              <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, type: 'spring' }}
                className="text-4xl sm:text-6xl md:text-8xl font-serif font-black glow-text-pink metallic-rose-text pt-2"
              >
                HAPPY ANNIVERSARY ❤️
              </motion.h2>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 5 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-widest uppercase"
              >
                I LOVE YOU
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Replay Button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 7.8, duration: 0.8 }}
          className="pt-8"
        >
          <button
            onClick={handleReplayClick}
            onMouseEnter={() => soundEngine.playChime(1.3)}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-rose-neon via-rose-crimson to-gold-shimmer text-white font-outfit font-black text-xs sm:text-sm uppercase tracking-[0.25em] shadow-neon-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span>REPLAY OUR STORY ↺</span>
          </button>
        </motion.div>

        {/* Footer Signature */}
        <div className="pt-12 text-xs font-inter text-gray-500 tracking-widest uppercase">
          {couple?.partner1} &amp; {couple?.partner2} • Forever Together • Cinematic Experience 2026
        </div>
      </div>
    </section>
  );
}
