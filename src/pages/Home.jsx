import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Mail,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Gift,
  ChevronDown,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import config from '../data/config';
import HeartAnimation from '../components/HeartAnimation';
import Navigation from '../components/Navigation';
import LoveLetter from '../components/LoveLetter';
import LongLoveLetterModal from '../components/LongLoveLetterModal';
import AnniversaryCalendar from '../components/AnniversaryCalendar';
import MemoryGallery from '../components/MemoryGallery';
import ReasonsSection from '../components/ReasonsSection';
import FinalSurprise from '../components/FinalSurprise';

export default function Home({ onLock }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isLongLetterOpen, setIsLongLetterOpen] = useState(false);
  const { couple } = config;

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navCards = [
    { id: 'calendar', title: 'The Day It Became Us', icon: Calendar, color: 'bg-white' },
    { id: 'letter', title: 'Our Love Letter', icon: Mail, color: 'bg-white' },
    { id: 'memories', title: 'Our Memories', icon: ImageIcon, color: 'bg-white' },
    { id: 'reasons', title: '21 Reasons Why', icon: Sparkles, color: 'bg-white' },
    { id: 'surprise', title: 'My Surprise For You', icon: Gift, color: 'bg-white' },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFF6E9] text-gray-800 font-poppins selection:bg-romantic-red selection:text-white">
      {/* Background Subtle Floating Hearts */}
      <HeartAnimation count={16} color="#B5122A" />

      {/* Floating Navbar */}
      <Navigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onLock={onLock}
      />

      {/* MAIN HERO SECTION */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center overflow-hidden bg-heart-pattern"
      >
        <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          {/* Top Stamp Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-romantic-red/30 text-romantic-red text-xs font-semibold uppercase tracking-widest shadow-sm mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrating Us • {couple.partner1} &amp; {couple.partner2}</span>
            <Heart className="w-3.5 h-3.5 fill-romantic-red" />
          </motion.div>

          {/* Main Anniversary Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-black text-romantic-red leading-tight tracking-tight"
          >
            {couple.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-script text-2xl sm:text-4xl text-gray-700 mt-2 max-w-2xl"
          >
            "{couple.subtitle}"
          </motion.p>

          {/* Centerpiece Scrapbook Polaroid Photo */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative mt-8 max-w-xs sm:max-w-sm w-full cursor-pointer group"
            onClick={() => soundEngine.playBurst()}
          >
            {/* Washi Tape */}
            <div className="washi-tape-gold" />

            <div className="polaroid-card rounded-2xl bg-white p-3 sm:p-4 pb-6 shadow-2xl border border-romantic-red/20">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-3 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80"
                  alt="Us Together"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
              </div>
              <p className="font-script text-2xl sm:text-3xl text-romantic-red font-bold">
                Forever Starts With You ❤️
              </p>
            </div>
          </motion.div>

          {/* Quick Navigation Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-10 max-w-3xl w-full"
          >
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    soundEngine.playChime(1.1);
                    scrollToSection(card.id);
                  }}
                  className="p-3 sm:p-4 rounded-2xl bg-white hover:bg-romantic-red hover:text-white border border-romantic-red/20 text-romantic-red text-center shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95"
                >
                  <Icon className="w-5 h-5 text-romantic-red group-hover:text-white transition-colors" />
                  <span className="font-poppins font-semibold text-xs leading-tight">
                    {card.title}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Scroll Down Hint */}
          <div
            onClick={() => scrollToSection('calendar')}
            className="mt-12 flex flex-col items-center gap-1 text-xs font-poppins text-romantic-red cursor-pointer group"
          >
            <span>Scroll To Read Our Story</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION 1: THE DAY IT BECAME US (CALENDAR) */}
      <AnniversaryCalendar />

      {/* SECTION 2: OUR LOVE LETTER (ENVELOPE) */}
      <LoveLetter onOpenLongLetter={() => setIsLongLetterOpen(true)} />

      {/* SECTION 3: OUR MEMORIES (POLAROID GALLERY) */}
      <MemoryGallery />

      {/* SECTION 4: 21 REASONS WHY I LOVE YOU */}
      <ReasonsSection />

      {/* SECTION 5: FINAL SURPRISE */}
      <FinalSurprise onReplay={() => onLock()} />

      {/* DEDICATED LONG LOVE LETTER MODAL */}
      <LongLoveLetterModal
        isOpen={isLongLetterOpen}
        onClose={() => setIsLongLetterOpen(false)}
      />
    </div>
  );
}
