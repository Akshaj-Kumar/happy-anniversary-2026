import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ChevronDown, Calendar, Star, Compass } from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function HeroSection({ couple, onScrollToSection }) {
  const canvasRef = useRef(null);
  const [daysTogether, setDaysTogether] = useState(1461);

  // Calculate live days counter
  useEffect(() => {
    if (!couple?.startDate) return;
    const start = new Date(couple.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysTogether(diffDays || 1461);
  }, [couple]);

  // Shooting stars & rose petals canvas
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

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        color: Math.random() > 0.4 ? '#ffd700' : '#ff2a85',
      });
    };

    let lastSpawn = 0;

    // Rose petals
    const petals = [];
    const petalCount = width < 768 ? 16 : 32;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 6,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Spawn shooting star every 3-5 seconds
      if (time - lastSpawn > 3200 && Math.random() > 0.3) {
        spawnShootingStar();
        lastSpawn = time;
      }

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.025;

        if (star.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = star.opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = star.color;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();
        ctx.restore();
      }

      // Render Petals
      petals.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * 0.001 + p.y * 0.01) * 0.4;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ff2a85';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff2a85';

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const titleWords = ['HAPPY', 'ANNIVERSARY', '❤️'];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden bg-[#030106]"
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Ambient Radial Fog & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[850px] h-[350px] md:h-[550px] bg-gradient-to-r from-rose-neon/15 via-violet-neon/10 to-gold-shimmer/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center space-y-6">
        {/* Top Tag: Couple & Anniversary Date */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full border border-gold-shimmer/30 bg-black/60 backdrop-blur-xl shadow-glass-rose"
        >
          <Sparkles className="w-4 h-4 text-gold-shimmer animate-spin-slow" />
          <span className="text-xs sm:text-sm font-outfit uppercase tracking-[0.25em] metallic-gold-text font-semibold">
            {couple?.partner1} &amp; {couple?.partner2} • FOREVER &amp; BEYOND
          </span>
          <Heart className="w-4 h-4 text-rose-neon fill-rose-neon animate-pulse" />
        </motion.div>

        {/* Cinematic Main Heading (Letter-by-Letter Entrance) */}
        <div className="relative py-2">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-tight leading-tight flex flex-wrap justify-center gap-3 md:gap-6">
            {titleWords.map((word, wordIdx) => (
              <span key={wordIdx} className="inline-flex overflow-hidden">
                {word.split('').map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    initial={{ y: 90, opacity: 0, rotateZ: 8 }}
                    animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + wordIdx * 0.2 + charIdx * 0.04,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className={
                      word === 'ANNIVERSARY'
                        ? 'glow-text-pink metallic-rose-text'
                        : word === '❤️'
                        ? 'text-rose-neon filter drop-shadow-[0_0_25px_#ff2a85]'
                        : 'glow-text-gold metallic-gold-text'
                    }
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="text-base sm:text-xl md:text-2xl font-serif italic text-gray-200 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4"
        >
          "Every moment with you becomes a memory worth keeping forever."
        </motion.p>

        {/* Live Days & Love Metric Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl glass-panel border border-rose-neon/25 shadow-neon-pink max-w-3xl w-full mx-auto"
        >
          <div className="text-center p-2 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xl sm:text-3xl font-outfit font-black metallic-gold-text">{daysTogether}+</p>
            <p className="text-[10px] sm:text-xs font-inter uppercase tracking-widest text-gray-400 mt-1">Days Together</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xl sm:text-3xl font-outfit font-black metallic-rose-text">{(daysTogether * 24).toLocaleString()}+</p>
            <p className="text-[10px] sm:text-xs font-inter uppercase tracking-widest text-gray-400 mt-1">Hours of Smiles</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xl sm:text-3xl font-outfit font-black metallic-gold-text">∞ Million</p>
            <p className="text-[10px] sm:text-xs font-inter uppercase tracking-widest text-gray-400 mt-1">Heartbeats Shared</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-black/40 border border-white/5">
            <p className="text-xl sm:text-3xl font-outfit font-black text-rose-neon">1 In All</p>
            <p className="text-[10px] sm:text-xs font-inter uppercase tracking-widest text-gray-400 mt-1">Universes</p>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => {
              soundEngine.playChime(1.2);
              onScrollToSection('heart-3d');
            }}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-rose-neon via-rose-crimson to-gold-shimmer text-white font-outfit font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-neon-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Feel Our Heart 3D</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playChime(0.9);
              onScrollToSection('story');
            }}
            className="px-7 py-3 rounded-full bg-black/60 hover:bg-white/10 border border-white/20 text-gray-200 font-outfit font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-gold-shimmer" />
            <span>Read Our Chapters</span>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          onClick={() => onScrollToSection('heart-3d')}
          className="pt-10 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-[11px] font-outfit uppercase tracking-[0.3em] text-gray-400 group-hover:text-rose-neon transition-colors duration-300">
            SCROLL TO FEEL THE STORY ↓
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-rose-neon" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
