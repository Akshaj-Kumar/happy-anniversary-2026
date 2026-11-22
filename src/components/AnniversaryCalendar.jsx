import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Calendar, Clock, X, Eye } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import config from '../data/config';

export default function AnniversaryCalendar() {
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const { anniversaryDate } = config;

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Days in November 2022 (November starts on Tuesday = index 2)
  const totalDays = 30;
  const startDayOffset = 2; // Tuesday

  const handleDateClick = (day) => {
    if (day === anniversaryDate.day) {
      soundEngine.playBurst();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#B5122A', '#D8A657', '#F8D8E0', '#FFF6E9'],
      });
      setIsMemoryOpen(true);
    } else {
      soundEngine.playChime(0.9);
    }
  };

  return (
    <section id="calendar" className="relative py-24 px-4 bg-[#FFFBF5] overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Tag */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-romantic-red/10 border border-romantic-red/20 text-romantic-red font-poppins font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            The Day It Became Us
            <Sparkles className="w-3.5 h-3.5" />
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl font-black text-romantic-red mt-3">
            The Day It Became Us ❤️
          </h2>
          <p className="font-script text-2xl sm:text-3xl text-gray-700 mt-1">
            "The exact moment two paths merged into forever"
          </p>
        </div>

        {/* Vintage Scrapbook Calendar Card */}
        <div className="relative max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-romantic-red/20">
          {/* Washi Tape */}
          <div className="washi-tape-gold" />

          {/* Calendar Month Header */}
          <div className="bg-romantic-red text-white py-3 px-6 rounded-2xl mb-6 shadow-md flex items-center justify-between">
            <div className="text-left">
              <p className="font-playfair font-black text-lg tracking-wider uppercase">
                {anniversaryDate.month}
              </p>
              <p className="font-poppins text-xs opacity-90">
                {anniversaryDate.year}
              </p>
            </div>
            <Heart className="w-6 h-6 fill-white" />
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center font-poppins font-semibold text-xs text-romantic-red mb-3">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-poppins text-xs sm:text-sm">
            {/* Blank leading days */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-10 sm:h-12" />
            ))}

            {/* Days of the Month */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const day = idx + 1;
              const isSpecial = day === anniversaryDate.day;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`h-10 sm:h-12 rounded-xl flex items-center justify-center relative cursor-pointer transition-all duration-200 ${
                    isSpecial
                      ? 'bg-romantic-red text-white font-bold shadow-lg scale-105 group'
                      : 'hover:bg-romantic-red/10 text-gray-700'
                  }`}
                >
                  <span>{day}</span>

                  {/* Red Heart Sticker on Special Anniversary Date */}
                  {isSpecial && (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-2 -right-1.5 w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center shadow-md"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Hint */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-poppins text-romantic-red">
            <Heart className="w-4 h-4 fill-romantic-red animate-pulse" />
            <span>Tap on the heart to reveal our special memory!</span>
          </div>
        </div>
      </div>

      {/* Memory Reveal Lightbox Modal */}
      <AnimatePresence>
        {isMemoryOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMemoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-romantic-red/30 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsMemoryOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-romantic-red hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-5 border border-romantic-red/20 shadow-md">
                <img
                  src={anniversaryDate.photo}
                  alt="The Day It Became Us"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-romantic-red text-white text-[11px] font-poppins font-semibold px-3 py-1 rounded-full shadow-sm">
                  {anniversaryDate.formattedDate}
                </div>
              </div>

              {/* Title & Memory */}
              <h3 className="font-playfair text-2xl font-black text-romantic-red mb-2">
                The Day Our Forever Began ❤️
              </h3>
              <p className="font-poppins text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                {anniversaryDate.specialMessage}
              </p>

              {/* Milestone Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-romantic-red/5 border border-romantic-red/10 text-center">
                <div>
                  <p className="font-playfair text-xl font-black text-romantic-red">
                    {anniversaryDate.yearsCelebrated} Years
                  </p>
                  <p className="text-[10px] font-poppins uppercase tracking-wider text-gray-500">
                    Of Loving You
                  </p>
                </div>
                <div>
                  <p className="font-playfair text-xl font-black text-gold-dark">
                    1,461 Days
                  </p>
                  <p className="text-[10px] font-poppins uppercase tracking-wider text-gray-500">
                    And Counting
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
