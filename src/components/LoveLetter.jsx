import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Heart, Edit3, Check, Copy, X } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function LoveLetter({ initialLetter, couple }) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterData, setLetterData] = useState(initialLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Typewriter effect when letter unfolds
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      return;
    }

    const fullText = letterData.body;
    let currentIdx = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [isOpen, letterData.body]);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    soundEngine.playWhoosh();
    soundEngine.playChime(1.2);
    setIsOpen(true);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff2a85', '#ffd700', '#ffffff', '#e60039'],
    });
  };

  const handleCopy = () => {
    soundEngine.playChime(1.4);
    navigator.clipboard.writeText(
      `${letterData.recipient}\n\n${letterData.body}\n\n${letterData.closing}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="letter" className="relative py-28 px-4 bg-[#030106] overflow-hidden flex flex-col items-center justify-center min-h-[850px]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-neon/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
        {/* Section Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-shimmer/30 bg-gold-shimmer/5 text-gold-shimmer text-xs uppercase tracking-[0.3em] font-outfit"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            From The Deepest Corner Of My Heart
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight mt-4"
          >
            <span className="cosmic-gradient-text">THE UNWRITTEN VOW</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 font-serif italic text-base md:text-xl max-w-xl mx-auto mt-3"
          >
            "A sealed confession waiting to be unlocked by you."
          </motion.p>
        </div>

        {/* Closed Floating Envelope (When not open) */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04, y: -6 }}
            transition={{ duration: 0.5 }}
            onClick={handleOpenEnvelope}
            className="cursor-pointer mx-auto max-w-lg w-full relative p-1 group"
          >
            {/* Glowing Envelope Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-neon via-violet-neon to-gold-shimmer rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-glow" />

            {/* Envelope Body */}
            <div className="relative rounded-3xl bg-[#12071d] border-2 border-rose-neon/40 group-hover:border-gold-shimmer/80 p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
              {/* Envelope Flap Accent */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#1c0c2e] to-[#12071d] rounded-t-3xl border-b border-rose-neon/20 flex items-center justify-center">
                {/* Wax Seal Stamp */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-700 via-rose-crimson to-red-500 border-2 border-gold-shimmer shadow-neon-pink flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-gold-shimmer fill-gold-shimmer" />
                </div>
              </div>

              {/* Envelope Text Content */}
              <div className="mt-20 text-center space-y-2">
                <p className="font-serif italic text-xl sm:text-2xl text-rose-blush">
                  For My Beloved {couple?.partner2 || 'One'}
                </p>
                <p className="text-xs uppercase font-outfit tracking-[0.3em] text-gold-shimmer/90">
                  Tap To Break The Seal &amp; Open ✨
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Unfolded Letter Parchment Modal / Display */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.8, type: 'spring', damping: 20 }}
              className="relative mx-auto max-w-2xl w-full text-left"
            >
              {/* Parchment Box with Gold Foil Borders */}
              <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#14081f] via-[#0f0517] to-[#07020c] border border-gold-shimmer/50 shadow-neon-gold backdrop-blur-xl">
                {/* Top Corner Ornaments */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold-shimmer/20">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-neon fill-rose-neon" />
                    <span className="font-outfit uppercase tracking-[0.25em] text-xs text-gold-shimmer font-semibold">
                      Anniversary Letter • Sealed In Love
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-gold-shimmer transition-colors"
                      title={isEditing ? 'Done Editing' : 'Edit Letter'}
                    >
                      {isEditing ? <Check className="w-4 h-4 text-green-400" /> : <Edit3 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-gold-shimmer transition-colors"
                      title="Copy Letter Text"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-rose-neon transition-colors"
                      title="Fold Envelope"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Letter Body (Edit Mode or Read Mode) */}
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={letterData.recipient}
                      onChange={(e) => setLetterData({ ...letterData, recipient: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-rose-blush font-serif italic text-xl focus:border-gold-shimmer outline-none"
                    />
                    <textarea
                      rows={10}
                      value={letterData.body}
                      onChange={(e) => setLetterData({ ...letterData, body: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-gray-200 font-serif text-base sm:text-lg leading-relaxed focus:border-gold-shimmer outline-none"
                    />
                    <input
                      type="text"
                      value={letterData.closing}
                      onChange={(e) => setLetterData({ ...letterData, closing: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-rose-neon font-bold font-serif text-xl focus:border-gold-shimmer outline-none"
                    />
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 rounded-full bg-gold-shimmer text-black font-outfit font-bold text-xs uppercase tracking-widest hover:bg-gold-champagne transition-colors"
                    >
                      Save Letter ✨
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 font-serif">
                    {/* Salutation */}
                    <p className="text-xl sm:text-2xl text-rose-blush italic font-medium">
                      {letterData.recipient}
                    </p>

                    {/* Animated Text Body */}
                    <div className="text-base sm:text-xl text-gray-200 leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide">
                      {displayedText}
                      {displayedText.length < letterData.body.length && (
                        <span className="inline-block w-2 h-5 ml-1 bg-rose-neon animate-pulse" />
                      )}
                    </div>

                    {/* Closing */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-2xl sm:text-3xl font-black glow-text-pink metallic-rose-text">
                          {letterData.closing}
                        </p>
                        <p className="text-xs uppercase font-outfit tracking-widest text-gold-shimmer/80 mt-1">
                          {letterData.author}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playWhoosh();
                          setIsOpen(false);
                        }}
                        className="text-xs font-outfit uppercase tracking-widest text-gray-400 hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all"
                      >
                        Reseal Envelope ↺
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
