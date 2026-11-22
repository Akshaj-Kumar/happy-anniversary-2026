import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, CheckCircle, RotateCw } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import { reasons } from '../data/reasons';

export default function ReasonsSection() {
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardClick = (id) => {
    soundEngine.playChime(1.1 + (id % 5) * 0.1);
    setFlippedCards((prev) => {
      const isCurrentlyFlipped = !!prev[id];
      const next = { ...prev, [id]: !isCurrentlyFlipped };

      // Check if all 21 reasons are revealed
      const totalRevealed = Object.values(next).filter(Boolean).length;
      if (totalRevealed === 21 && !isCurrentlyFlipped) {
        soundEngine.playBurst();
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#B5122A', '#D8A657', '#F8D8E0', '#FFF6E9', '#FFFFFF'],
        });
      }

      return next;
    });
  };

  const revealedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <section id="reasons" className="relative py-24 px-4 bg-red-pattern text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#FFF6E9] to-transparent opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFF6E9] font-poppins font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            21 Pieces Of My Heart
            <Sparkles className="w-3.5 h-3.5" />
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-black text-[#FFF6E9] mt-3">
            21 Reasons Why I Love You ❤️
          </h2>
          <p className="font-script text-2xl sm:text-3xl text-gold-light mt-1">
            "Click each card to uncover a reason my heart beats for you"
          </p>

          {/* Progress Tracker */}
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-poppins font-semibold text-[#FFF6E9]">
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>
              Uncovered: {revealedCount} / {reasons.length}
            </span>
          </div>
        </div>

        {/* 21 Flip Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {reasons.map((item) => {
            const isFlipped = !!flippedCards[item.number];

            return (
              <div
                key={item.number}
                onClick={() => handleCardClick(item.number)}
                className="perspective-1000 h-64 sm:h-72 w-full cursor-pointer select-none"
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: 'spring', damping: 18 }}
                  className="w-full h-full relative transform-style-3d shadow-xl rounded-3xl"
                >
                  {/* Card Front (Closed) */}
                  <div className="absolute inset-0 backface-hidden bg-[#FFFBF5] rounded-3xl p-6 flex flex-col items-center justify-between border-2 border-gold/40 text-romantic-red shadow-lg">
                    {/* Washi Tape */}
                    <div className="washi-tape-gold" />

                    <div className="w-full flex items-center justify-between text-xs font-poppins font-bold text-romantic-red/60 pt-2">
                      <span>REASON</span>
                      <Heart className="w-4 h-4 fill-romantic-red text-romantic-red" />
                    </div>

                    <div className="flex flex-col items-center justify-center my-auto">
                      <span className="font-playfair text-5xl font-black text-romantic-red mb-2">
                        #{String(item.number).padStart(2, '0')}
                      </span>
                      <span className="text-3xl">{item.emoji}</span>
                    </div>

                    <div className="w-full py-2 px-4 rounded-full bg-romantic-red/10 border border-romantic-red/20 text-center text-xs font-poppins font-medium text-romantic-red flex items-center justify-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" /> Tap to reveal
                    </div>
                  </div>

                  {/* Card Back (Flipped Reveal) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FFFBF5] rounded-3xl p-5 flex flex-col justify-between border-2 border-romantic-red text-gray-800 shadow-xl text-left">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-romantic-red/15 mb-3">
                        <span className="font-poppins text-xs font-bold text-romantic-red">
                          Reason #{item.number}
                        </span>
                        <span className="text-xl">{item.emoji}</span>
                      </div>

                      <h3 className="font-playfair font-bold text-base sm:text-lg text-romantic-red mb-2">
                        {item.title}
                      </h3>

                      <p className="font-poppins text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-romantic-red/10 text-[11px] font-script text-2xl text-romantic-red-dark">
                      "{item.note}"
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
