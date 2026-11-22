import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Delete, Lock, Sparkles, KeyRound } from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import config from '../data/config';
import HeartAnimation from './HeartAnimation';

export default function PasswordScreen({ onUnlock }) {
  const [inputPin, setInputPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const targetLength = config.passwordLength || 4;

  const handleKeyPress = (num) => {
    if (isSuccess || inputPin.length >= targetLength) return;
    soundEngine.playChime(1.2 + inputPin.length * 0.1);
    const nextPin = inputPin + num;
    setInputPin(nextPin);

    // Auto check if completed
    if (nextPin.length === targetLength) {
      verifyPassword(nextPin);
    }
  };

  const handleBackspace = () => {
    if (inputPin.length > 0) {
      soundEngine.playWhoosh();
      setInputPin(inputPin.slice(0, -1));
    }
  };

  const handleClear = () => {
    soundEngine.playWhoosh();
    setInputPin('');
  };

  const verifyPassword = (pinToCheck) => {
    if (pinToCheck === config.password) {
      // Success!
      setIsSuccess(true);
      soundEngine.playBurst();
      soundEngine.startRomanticAmbient();

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#B5122A', '#D8A657', '#F8D8E0', '#FFF6E9', '#FFFFFF'],
      });

      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      // Error
      soundEngine.playHeartbeat(1.2);
      setErrorShake(true);
      setTimeout(() => {
        setErrorShake(false);
        setInputPin('');
      }, 600);
    }
  };

  const keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heart-pattern overflow-hidden select-none">
      {/* Floating background hearts */}
      <HeartAnimation count={24} color="#B5122A" />

      {/* Screen flash on success unlock */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 bg-[#FFF6E9] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={
          isSuccess
            ? { scale: [1, 1.08, 0.8], opacity: [1, 1, 0] }
            : errorShake
            ? { x: [-10, 10, -10, 10, 0] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: isSuccess ? 1.0 : 0.4 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-romantic-red/30 text-center"
      >
        {/* Washi Tape at Top */}
        <div className="washi-tape-gold" />

        {/* Vintage Stamp / Lock Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-romantic-red/10 border-2 border-romantic-red flex items-center justify-center mb-4 shadow-inner">
          <Heart className="w-8 h-8 text-romantic-red fill-romantic-red animate-pulse" />
        </div>

        {/* Title & Romantic Subtitle */}
        <h1 className="font-playfair text-2xl sm:text-3xl font-black text-romantic-red tracking-wide">
          Our Special Day ❤️
        </h1>
        <p className="font-poppins text-xs sm:text-sm text-gray-600 mt-1.5 px-4 leading-relaxed">
          Enter our secret passcode to unlock our little universe
        </p>

        {/* Password Slots (Filled with Red Hearts) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-6">
          {Array.from({ length: targetLength }).map((_, idx) => {
            const isFilled = idx < inputPin.length;
            return (
              <motion.div
                key={idx}
                animate={isFilled ? { scale: [0.8, 1.25, 1] } : { scale: 1 }}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  isFilled
                    ? 'bg-romantic-red/10 border-romantic-red text-romantic-red'
                    : 'bg-white border-romantic-red/20 text-gray-300'
                }`}
              >
                {isFilled ? (
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-romantic-red text-romantic-red drop-shadow-sm" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-romantic-red/20" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[280px] sm:max-w-[310px] mx-auto">
          {keypadNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-romantic-red hover:text-white border border-romantic-red/20 text-romantic-red font-poppins font-bold text-lg sm:text-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-gray-100 border border-romantic-red/20 text-gray-500 font-poppins font-semibold text-xs sm:text-sm shadow-sm active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center uppercase tracking-wider"
          >
            Clear
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeyPress('0')}
            className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-romantic-red hover:text-white border border-romantic-red/20 text-romantic-red font-poppins font-bold text-lg sm:text-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-romantic-red/10 border border-romantic-red/20 text-romantic-red shadow-sm active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Passcode Hint Toggle */}
        <div className="mt-5 pt-3 border-t border-romantic-red/10">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] sm:text-xs font-poppins text-romantic-red hover:text-romantic-red-dark underline tracking-wide flex items-center justify-center gap-1.5 mx-auto"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{showHint ? config.passwordHint : 'Need a hint? Click here'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
