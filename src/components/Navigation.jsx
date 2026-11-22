import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function Navigation({ couple, activeSection, onNavigate }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFullscreen = () => {
    soundEngine.playChime(1.2);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: Compass },
    { id: 'heart-3d', label: '3D Heart', icon: Heart },
    { id: 'story', label: 'Chapters', icon: BookOpen },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'particle-vfx', label: 'I Love You VFX', icon: Sparkles },
    { id: 'letter', label: 'Love Letter', icon: Mail },
    { id: 'final-scene', label: 'Eternity', icon: Heart },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-4 left-0 right-0 z-40 flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${
        scrolled ? 'top-3' : 'top-5'
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full glass-panel border border-rose-neon/30 shadow-neon-pink backdrop-blur-2xl">
        {/* Brand / Couple Initials */}
        <button
          onClick={() => {
            soundEngine.playChime(1.0);
            onNavigate('hero');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-rose-neon/15 transition-colors mr-1"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-neon to-gold-shimmer flex items-center justify-center shadow-md">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="hidden md:inline font-serif font-bold text-xs metallic-gold-text tracking-widest uppercase">
            {couple?.partner1?.[0]} &amp; {couple?.partner2?.[0]}
          </span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playChime(1.1);
                  onNavigate(item.id);
                }}
                className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-outfit uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-rose-neon/30 border border-rose-neon/60 shadow-neon-pink'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-rose-neon fill-rose-neon' : 'text-gray-400'
                  }`}
                />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-gold-shimmer transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.header>
  );
}
