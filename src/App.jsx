import React, { useState, useEffect } from 'react';
import IntroScene from './components/IntroScene';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import Heart3D from './components/Heart3D';
import StorySection from './components/StorySection';
import GallerySection from './components/GallerySection';
import ParticleHeart from './components/ParticleHeart';
import LoveLetter from './components/LoveLetter';
import InfinityScene from './components/InfinityScene';
import FinalScene from './components/FinalScene';
import MusicPlayer from './components/MusicPlayer';
import { initialStoryData } from './utils/storyData';
import soundEngine from './utils/audioEngine';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const { couple, chapters, gallery, letter } = initialStoryData;

  // Track active section on scroll
  useEffect(() => {
    if (showIntro) return;

    const sectionIds = [
      'hero',
      'heart-3d',
      'story',
      'gallery',
      'particle-vfx',
      'letter',
      'final-scene',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showIntro]);

  const handleEnterExperience = () => {
    setShowIntro(false);
  };

  const handleReplay = () => {
    soundEngine.stopRomanticAmbient();
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030106] text-white selection:bg-rose-neon selection:text-white relative font-inter overflow-x-hidden">
      {showIntro ? (
        <IntroScene onEnterExperience={handleEnterExperience} couple={couple} />
      ) : (
        <>
          {/* Floating Navigation Dock */}
          <Navigation
            couple={couple}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />

          {/* Main Experience Sections */}
          <main className="w-full">
            <HeroSection
              couple={couple}
              onScrollToSection={handleNavigate}
            />

            <Heart3D couple={couple} />

            <StorySection chapters={chapters} couple={couple} />

            <GallerySection initialGallery={gallery} />

            <ParticleHeart couple={couple} />

            <LoveLetter initialLetter={letter} couple={couple} />

            <InfinityScene couple={couple} />

            <FinalScene couple={couple} onReplay={handleReplay} />
          </main>

          {/* Floating Sound Studio Dock */}
          <MusicPlayer />
        </>
      )}
    </div>
  );
}
