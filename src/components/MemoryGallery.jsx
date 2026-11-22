import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Upload,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import { memories as initialMemories } from '../data/memories';

export default function MemoryGallery() {
  const [memoryList, setMemoryList] = useState(initialMemories);
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const fileInputRef = useRef(null);

  const handleUploadPhoto = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      soundEngine.playChime(1.2);
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B5122A', '#F8D8E0', '#FFF6E9'],
      });

      const newMemories = files.map((file, i) => ({
        id: `custom-mem-${Date.now()}-${i}`,
        date: 'Today & Forever',
        title: file.name.replace(/\.[^/.]+$/, ''),
        location: 'In Our Scrapbook',
        caption: 'A precious personal memory added straight from your heart.',
        image: URL.createObjectURL(file),
        sticker: 'New Memory ❤️',
        rotation: (Math.random() - 0.5) * 5,
      }));

      setMemoryList((prev) => [...newMemories, ...prev]);
    }
    e.target.value = '';
  };

  const handleOpenPhoto = (idx) => {
    soundEngine.playChime(1.1);
    setActivePhotoIdx(idx);
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    soundEngine.playWhoosh();
    setActivePhotoIdx((prev) => (prev + 1) % memoryList.length);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    soundEngine.playWhoosh();
    setActivePhotoIdx((prev) => (prev - 1 + memoryList.length) % memoryList.length);
  };

  return (
    <section id="memories" className="relative py-24 px-4 bg-heart-pattern overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-romantic-red/10 border border-romantic-red/20 text-romantic-red font-poppins font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Our Little Scrapbook
            <Sparkles className="w-3.5 h-3.5" />
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-black text-romantic-red mt-3">
            Our Precious Memories 📸
          </h2>
          <p className="font-script text-2xl sm:text-3xl text-gray-700 mt-1">
            "Polaroids of moments that time could never steal"
          </p>

          {/* Upload Button */}
          <div className="mt-5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUploadPhoto}
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-6 py-2.5 rounded-full bg-[#FFFBF5] border-2 border-romantic-red text-romantic-red hover:bg-romantic-red hover:text-white font-poppins font-semibold text-xs tracking-wider uppercase shadow-sm transition-all flex items-center gap-2 mx-auto cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Add Your Own Photo 📷</span>
            </button>
          </div>
        </div>

        {/* Scrapbook Polaroid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {memoryList.map((mem, idx) => (
            <div
              key={mem.id}
              onClick={() => handleOpenPhoto(idx)}
              style={{ transform: `rotate(${mem.rotation || 0}deg)` }}
              className="polaroid-card rounded-2xl relative cursor-pointer group flex flex-col justify-between"
            >
              {/* Washi Tape */}
              <div className="washi-tape" />

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-inner">
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Sticker Badge */}
                <div className="absolute top-2.5 right-2.5 bg-romantic-red text-white text-[10px] font-poppins font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {mem.sticker}
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/80 text-romantic-red flex items-center justify-center shadow-md">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Caption & Location (Handwritten Polaroid Style) */}
              <div className="text-left px-1">
                <div className="flex items-center justify-between text-[11px] font-poppins text-gray-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-romantic-red" />
                    {mem.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-romantic-red" />
                    {mem.location}
                  </span>
                </div>

                <h3 className="font-playfair font-bold text-lg text-romantic-red">
                  {mem.title}
                </h3>
                <p className="font-poppins text-xs text-gray-700 leading-relaxed mt-1 line-clamp-2">
                  {mem.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Slideshow Modal */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActivePhotoIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-[#FFFBF5] rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-romantic-red/30 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-romantic-red text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Prev / Next Nav Buttons */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-romantic-red hover:text-white text-romantic-red shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-romantic-red hover:text-white text-romantic-red shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Large Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black/40 mb-4">
                <img
                  src={memoryList[activePhotoIdx].image}
                  alt={memoryList[activePhotoIdx].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata */}
              <div className="px-2">
                <div className="flex items-center justify-between text-xs font-poppins text-gray-500 mb-1">
                  <span>{memoryList[activePhotoIdx].date}</span>
                  <span>{memoryList[activePhotoIdx].location}</span>
                </div>
                <h3 className="font-playfair text-2xl font-black text-romantic-red">
                  {memoryList[activePhotoIdx].title}
                </h3>
                <p className="font-poppins text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
                  {memoryList[activePhotoIdx].caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
