import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Mail,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Gift,
  Volume2,
  VolumeX,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function Navigation({ onNavigate, onLock, activeSection }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsub = soundEngine.subscribe((state) => {
      setIsMuted(state.isMuted);
      setIsPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  const toggleSound = () => {
    soundEngine.playChime(1.1);
    if (!isPlaying) {
      soundEngine.playTrack(soundEngine.currentTrackIndex || 0);
    } else {
      soundEngine.toggleMute();
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'calendar', label: 'The Day', icon: Calendar },
    { id: 'letter', label: 'Love Letter', icon: Mail },
    { id: 'memories', label: 'Memories', icon: ImageIcon },
    { id: 'reasons', label: '21 Reasons', icon: Sparkles },
    { id: 'surprise', label: 'Surprise', icon: Gift },
  ];

  const handleNavClick = (id) => {
    soundEngine.playChime(1.1);
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-2.5 bg-[#FFF6E9]/90 backdrop-blur-md shadow-sm border-b border-romantic-red/10' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo / Scrapbook Heart Badge */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-romantic-red text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-script text-2xl sm:text-3xl font-bold text-romantic-red tracking-wide">
            Our Love Story
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#FFFBF5] px-4 py-1.5 rounded-full border border-romantic-red/20 shadow-sm">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-poppins font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-romantic-red text-white shadow-sm'
                    : 'text-romantic-red-dark hover:bg-romantic-red/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-white' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Music, Lock, Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Music Toggle */}
          <button
            onClick={toggleSound}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
              isPlaying && !isMuted
                ? 'bg-romantic-red text-white'
                : 'bg-[#FFFBF5] border border-romantic-red/20 text-romantic-red hover:bg-romantic-red/10'
            }`}
            title={isPlaying && !isMuted ? 'Mute Music' : 'Play Romantic Music'}
          >
            {isMuted || !isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Lock Screen Button */}
          <button
            onClick={() => {
              soundEngine.playWhoosh();
              onLock();
            }}
            className="w-9 h-9 rounded-full bg-[#FFFBF5] border border-romantic-red/20 text-romantic-red hover:bg-romantic-red/10 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
            title="Lock Page"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-romantic-red text-white flex items-center justify-center shadow-sm cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#FFFBF5] border-b border-romantic-red/20 px-6 py-5 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-poppins font-medium flex items-center gap-3 text-left ${
                      isActive
                        ? 'bg-romantic-red text-white'
                        : 'text-romantic-red hover:bg-romantic-red/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
