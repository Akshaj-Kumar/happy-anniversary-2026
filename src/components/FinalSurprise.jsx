import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift, RotateCcw, X } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import config from '../data/config';

export default function FinalSurprise({ onReplay }) {
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const { couple } = config;

  const handleSurpriseClick = () => {
    soundEngine.playBurst();
    soundEngine.playChime(1.3);

    // Heart Fireworks
    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.6 },
      colors: ['#B5122A', '#D8A657', '#F8D8E0', '#FFF6E9', '#FFFFFF'],
    });

    setShowSurpriseModal(true);
  };

  return (
    <section id="surprise" className="relative py-28 px-4 bg-red-pattern text-white text-center overflow-hidden">
      {/* Background Ambience */}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center">
        {/* Animated Giant Heart */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1, 1.22, 1],
            filter: [
              'drop-shadow(0 0 15px rgba(255,246,233,0.4))',
              'drop-shadow(0 0 35px rgba(255,246,233,0.8))',
              'drop-shadow(0 0 15px rgba(255,246,233,0.4))',
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FFFBF5] text-romantic-red flex items-center justify-center shadow-2xl mb-8"
        >
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-romantic-red" />
        </motion.div>

        {/* Emotion Typography */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFF6E9] font-poppins font-semibold text-xs uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Final Chapter
          <Sparkles className="w-3.5 h-3.5" />
        </span>

        <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-black text-[#FFF6E9] leading-tight max-w-3xl">
          "You're my favorite story, my favorite person and my forever."
        </h2>

        <p className="font-script text-3xl sm:text-4xl text-gold-light mt-3">
          Happy Anniversary, {couple?.partner2 || 'My Love'} ❤️
        </p>

        {/* Final Surprise Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSurpriseClick}
            className="px-8 py-4 rounded-full bg-[#FFFBF5] text-romantic-red hover:bg-white font-poppins font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Gift className="w-5 h-5 text-romantic-red" />
            <span>One More Surprise ❤️</span>
          </button>

          <button
            onClick={onReplay}
            className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF6E9] font-poppins font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Relive From Start ↺</span>
          </button>
        </div>
      </div>

      {/* Surprise Popup Modal */}
      <AnimatePresence>
        {showSurpriseModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSurpriseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-md w-full bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-gold text-center text-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSurpriseModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-romantic-red hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Gift Icon / Ring Badge */}
              <div className="w-20 h-20 mx-auto rounded-full bg-romantic-red/10 border-2 border-gold flex items-center justify-center mb-4">
                <span className="text-4xl animate-bounce">💍</span>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-black text-romantic-red mb-2">
                My Eternal Promise To You
              </h3>

              <p className="font-script text-2xl text-gold-dark mb-4">
                "Wherever you go, my heart follows"
              </p>

              <div className="bg-romantic-red/5 p-4 rounded-2xl border border-romantic-red/15 text-xs sm:text-sm font-poppins text-gray-700 leading-relaxed mb-6">
                "No matter how many years pass, I will always choose you, cherish you, laugh with you, and love you more with every sunrise. Happy Anniversary, my love."
              </div>

              <button
                onClick={() => setShowSurpriseModal(false)}
                className="w-full py-3 rounded-full bg-romantic-red text-white font-poppins font-bold text-xs uppercase tracking-widest hover:bg-romantic-red-dark transition-colors shadow-md"
              >
                I Love You More Than Words ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
