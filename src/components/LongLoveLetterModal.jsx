import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Copy, Check } from 'lucide-react';
import { loveLetterData } from '../data/letter';
import soundEngine from '../utils/audioEngine';

export default function LongLoveLetterModal({ isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);
  const { longLetter } = loveLetterData;

  if (!isOpen) return null;

  const handleCopy = () => {
    soundEngine.playChime(1.2);
    const fullText = `${longLetter.title}\n${longLetter.subtitle}\n\n${longLetter.content.join('\n\n')}\n\n${longLetter.closing}\n${longLetter.signature}\n\n${longLetter.postScript}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-3xl my-8 bg-[#FFFBF5] rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-double border-romantic-red text-left max-h-[90vh] overflow-y-auto"
        >
          {/* Washi Tape */}
          <div className="washi-tape-gold" />

          {/* Action Buttons (Copy, Close) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={handleCopy}
              className="p-2 rounded-full bg-romantic-red/10 hover:bg-romantic-red text-romantic-red hover:text-white transition-colors cursor-pointer"
              title="Copy Letter"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playWhoosh();
                onClose();
              }}
              className="p-2 rounded-full bg-romantic-red/10 hover:bg-romantic-red text-romantic-red hover:text-white transition-colors cursor-pointer"
              title="Close Letter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Letter Header */}
          <div className="text-center pb-6 border-b border-romantic-red/20 mb-8">
            <span className="text-xs font-poppins uppercase tracking-[0.25em] text-romantic-red font-semibold">
              {longLetter.date}
            </span>
            <h1 className="font-playfair text-2xl sm:text-4xl font-black text-romantic-red mt-2">
              {longLetter.title}
            </h1>
            <p className="font-script text-2xl sm:text-3xl text-gold-dark mt-1">
              {longLetter.subtitle}
            </p>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-6 font-poppins text-sm sm:text-base text-gray-800 leading-relaxed sm:leading-loose">
            {longLetter.content.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line first-letter:text-3xl first-letter:font-playfair first-letter:text-romantic-red first-letter:font-bold">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Letter Signature & PostScript */}
          <div className="mt-10 pt-6 border-t border-romantic-red/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-script text-2xl sm:text-3xl text-gray-700">
                {longLetter.closing}
              </p>
              <p className="font-playfair font-black text-xl sm:text-2xl text-romantic-red">
                {longLetter.signature}
              </p>
            </div>

            <div className="text-xs font-poppins italic text-romantic-red-dark bg-romantic-red/5 p-3 rounded-xl border border-romantic-red/15 max-w-xs">
              {longLetter.postScript}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
