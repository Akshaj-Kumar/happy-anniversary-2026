import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Calendar, Bookmark, Eye, X } from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function StorySection({ chapters, couple }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="story" className="relative py-28 px-4 bg-[#030106] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-rose-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-neon/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-shimmer/30 bg-gold-shimmer/5 text-gold-shimmer text-xs uppercase tracking-[0.3em] font-outfit"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Cinematic Chronicle
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight mt-4"
          >
            <span className="cosmic-gradient-text">OUR LITTLE UNIVERSE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 font-serif italic text-base md:text-xl max-w-xl mx-auto mt-3"
          >
            "A constellation of moments, written across space and time."
          </motion.p>
        </div>

        {/* Chapters Spine / Timeline */}
        <div className="relative">
          {/* Vertical glowing center line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-rose-neon via-gold-shimmer to-rose-neon opacity-30 shadow-[0_0_15px_#ff2a85]" />

          <div className="space-y-24 md:space-y-36">
            {chapters.map((ch, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={ch.id}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 md:gap-14 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Central Node on Timeline */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0a0512] border-2 border-gold-shimmer shadow-neon-gold items-center justify-center z-20 group">
                    <Heart className="w-5 h-5 text-rose-neon fill-rose-neon group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Text Editorial Column */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="w-full lg:w-1/2 text-left"
                  >
                    <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden group hover:border-gold-shimmer/40 transition-all duration-500 shadow-2xl">
                      {/* Ambient Gradient Background Glow */}
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${ch.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none`}
                      />

                      {/* Chapter Badge */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-xs font-outfit uppercase tracking-[0.3em] text-rose-blush font-semibold flex items-center gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-rose-neon" />
                          CHAPTER {ch.number} — {ch.tag}
                        </span>
                        <span className="text-[11px] font-inter uppercase tracking-widest text-gray-500">
                          {ch.date}
                        </span>
                      </div>

                      {/* Chapter Title */}
                      <h3 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-white group-hover:text-gold-champagne transition-colors">
                        {ch.title}
                      </h3>

                      {/* Romantic Quote */}
                      <blockquote className="my-4 pl-4 border-l-2 border-rose-neon font-serif italic text-lg sm:text-xl text-rose-blush leading-relaxed">
                        "{ch.quote}"
                      </blockquote>

                      {/* Story Narrative */}
                      <p className="text-gray-300 font-inter text-sm sm:text-base leading-relaxed mt-4">
                        {ch.story}
                      </p>

                      {/* Bottom Footer Accent */}
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-outfit text-gray-400">
                        <span className="tracking-widest uppercase">
                          {couple ? `${couple.partner1} & ${couple.partner2}` : 'Forever Us'}
                        </span>
                        <span className="flex items-center gap-1 text-rose-neon">
                          <Heart className="w-3.5 h-3.5 fill-rose-neon" /> Infinite Memory
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Image Column */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="w-full lg:w-1/2"
                  >
                    <div
                      onClick={() => {
                        soundEngine.playChime(1.1);
                        setActiveImage(ch);
                      }}
                      className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 group cursor-pointer aspect-[4/3] shadow-2xl"
                    >
                      <img
                        src={ch.image}
                        alt={ch.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-90 group-hover:brightness-105"
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {/* Floating View Icon on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-black/60 border border-gold-shimmer/60 backdrop-blur-md flex items-center justify-center shadow-neon-gold transform scale-75 group-hover:scale-100 transition-transform">
                          <Eye className="w-6 h-6 text-gold-shimmer" />
                        </div>
                      </div>

                      {/* Image Caption Bar */}
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-outfit">
                        <span className="metallic-gold-text font-semibold tracking-wide">
                          CHAPTER {ch.number} • VISUAL MEMORY
                        </span>
                        <span className="text-gray-400 font-inter text-[11px]">Click to expand</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Story Images */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#0d0614] border border-rose-neon/40 rounded-3xl overflow-hidden shadow-neon-pink"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-rose-neon transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full max-h-[70vh] object-contain bg-black/40"
              />

              <div className="p-6 text-left">
                <span className="text-xs font-outfit uppercase tracking-[0.25em] text-rose-neon font-bold">
                  CHAPTER {activeImage.number} — {activeImage.title}
                </span>
                <p className="font-serif italic text-xl text-gold-shimmer mt-2">
                  "{activeImage.quote}"
                </p>
                <p className="text-gray-300 text-sm font-inter mt-2">
                  {activeImage.story}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
