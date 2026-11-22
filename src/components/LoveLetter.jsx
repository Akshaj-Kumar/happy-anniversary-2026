import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, BookOpen } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import { loveLetterData } from '../data/letter';

export default function LoveLetter({ onOpenLongLetter }) {
  const [isOpen, setIsOpen] = useState(false);
  const { envelope } = loveLetterData;

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      soundEngine.playWhoosh();
      soundEngine.playChime(1.2);
      setIsOpen(true);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B5122A', '#F8D8E0', '#FFF6E9', '#D8A657'],
      });
    }
  };

  return (
    <section id="letter" className="relative py-20 px-4 bg-heart-pattern overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-romantic-red/10 border border-romantic-red/20 text-romantic-red font-poppins font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Special Delivery
            <Sparkles className="w-3.5 h-3.5" />
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl font-black text-romantic-red mt-3">
            Our Love Letter ❤️
          </h2>
          <p className="font-script text-2xl sm:text-3xl text-gray-700 mt-1">
            "A message straight from my heart to yours"
          </p>
        </div>

        {/* Vintage Interactive Envelope */}
        <div className="relative max-w-lg mx-auto cursor-pointer" onClick={handleOpenEnvelope}>
          {/* Closed Envelope */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-[#FFFBF5] border-2 border-romantic-red/30 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden"
          >
            {/* Washi Tape */}
            <div className="washi-tape" />

            {/* Envelope Flap Animation */}
            <div className="relative w-full aspect-[16/10] bg-[#FFF2DF] rounded-2xl border-2 border-dashed border-romantic-red/40 flex flex-col items-center justify-center p-6 text-center">
              {/* Wax Seal */}
              <motion.div
                animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-romantic-red border-2 border-gold text-white flex items-center justify-center shadow-md mb-3"
              >
                <Heart className="w-8 h-8 fill-white" />
              </motion.div>

              {!isOpen ? (
                <>
                  <p className="font-playfair font-bold text-lg sm:text-xl text-romantic-red">
                    {envelope.recipient}
                  </p>
                  <p className="font-poppins text-xs text-gray-600 mt-1">
                    {envelope.sender}
                  </p>
                  <span className="mt-4 px-4 py-1.5 rounded-full bg-romantic-red text-white text-xs font-poppins font-medium tracking-wide flex items-center gap-1.5 shadow-sm">
                    <Mail className="w-3.5 h-3.5" /> Tap To Open Letter
                  </span>
                </>
              ) : (
                /* Letter Sliding Out */
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full text-left"
                >
                  <div className="border-b border-romantic-red/20 pb-2 mb-3 flex items-center justify-between">
                    <span className="font-script text-2xl text-romantic-red font-bold">
                      {envelope.recipient}
                    </span>
                    <Heart className="w-4 h-4 fill-romantic-red text-romantic-red" />
                  </div>

                  <p className="font-poppins text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line italic">
                    {envelope.shortNote}
                  </p>

                  <div className="mt-5 pt-3 border-t border-romantic-red/10 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playChime(1.2);
                        onOpenLongLetter();
                      }}
                      className="px-5 py-2.5 rounded-full bg-romantic-red text-white font-poppins font-semibold text-xs tracking-wider uppercase hover:bg-romantic-red-dark transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read My Full Letter ❤️</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="text-xs font-poppins text-gray-500 hover:text-romantic-red underline"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
