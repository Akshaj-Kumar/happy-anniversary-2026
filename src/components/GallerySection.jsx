import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Heart,
  ZoomIn,
  Trash2,
  RotateCw,
  Plus,
  X,
  Check,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function GallerySection({ initialGallery }) {
  const [gallery, setGallery] = useState(initialGallery);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoRotation, setPhotoRotation] = useState({});
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [replacingId, setReplacingId] = useState(null);

  // Handle Drag & Drop upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      addPhotos(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      addPhotos(files);
    }
    e.target.value = '';
  };

  const addPhotos = (files) => {
    soundEngine.playChime(1.2);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff2a85', '#ffd700', '#ffffff'],
    });

    const newItems = files.map((file, i) => ({
      id: `custom-${Date.now()}-${i}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      date: 'Personal Memory • Just Added',
      caption: 'A cherished moment captured in our eternal love universe.',
      image: URL.createObjectURL(file),
      aspect: 'square',
    }));

    setGallery((prev) => [...newItems, ...prev]);
  };

  // Replace existing photo
  const triggerReplace = (id, e) => {
    e.stopPropagation();
    setReplacingId(id);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFile = (e) => {
    const file = e.target.files[0];
    if (file && replacingId) {
      soundEngine.playChime(1.1);
      const newUrl = URL.createObjectURL(file);
      setGallery((prev) =>
        prev.map((item) =>
          item.id === replacingId
            ? {
                ...item,
                image: newUrl,
                title: file.name.replace(/\.[^/.]+$/, ''),
                date: 'Updated Memory',
              }
            : item
        )
      );
    }
    setReplacingId(null);
    e.target.value = '';
  };

  // Delete photo
  const deletePhoto = (id, e) => {
    e.stopPropagation();
    soundEngine.playWhoosh();
    setGallery((prev) => prev.filter((item) => item.id !== id));
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto(null);
    }
  };

  // Rotate photo in viewer
  const rotatePhoto = (id, e) => {
    e.stopPropagation();
    soundEngine.playChime(1.4);
    setPhotoRotation((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 90) % 360,
    }));
  };

  return (
    <section id="gallery" className="relative py-28 px-4 bg-[#030106] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-neon/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-rose-neon/30 bg-rose-neon/10 text-rose-blush text-xs uppercase tracking-[0.3em] font-outfit"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-shimmer animate-spin-slow" />
            Everlasting Moments
            <Sparkles className="w-3.5 h-3.5 text-rose-neon animate-spin-slow" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight mt-4"
          >
            <span className="cosmic-gradient-text">OUR TIME CAPSULE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 font-serif italic text-base md:text-xl max-w-xl mx-auto mt-3"
          >
            "Captured laughter, gentle whispers, and moments suspended in eternity."
          </motion.p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`mb-12 p-8 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center relative overflow-hidden group ${
            isDragging
              ? 'border-gold-shimmer bg-gold-shimmer/10 scale-[1.01]'
              : 'border-rose-neon/30 hover:border-gold-shimmer/60 bg-black/40 hover:bg-black/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleReplaceFile}
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-rose-neon/15 border border-rose-neon/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-neon-pink">
              <Upload className="w-6 h-6 text-rose-blush group-hover:text-gold-shimmer transition-colors" />
            </div>
            <p className="text-sm sm:text-base font-outfit text-white font-medium">
              Drag &amp; Drop Your Special Photos Here, or{' '}
              <span className="text-rose-neon underline">Browse Files</span>
            </p>
            <p className="text-xs text-gray-400 font-inter">
              Add personal memories with instant high-resolution preview • Supports JPG, PNG, WEBP
            </p>
          </div>
        </div>

        {/* 3D Floating Picture Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gallery.map((photo, index) => {
            const rot = photoRotation[photo.id] || 0;

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-rose-neon/50 transition-all duration-500 shadow-2xl flex flex-col cursor-pointer"
                onClick={() => {
                  soundEngine.playChime(1.1);
                  setSelectedPhoto(photo);
                }}
              >
                {/* Image Container with Hover Zoom & Tilt */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    style={{ transform: `rotate(${rot}deg)` }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-105"
                    loading="lazy"
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030106] via-transparent to-black/40 opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Quick Action Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={(e) => rotatePhoto(photo.id, e)}
                      title="Rotate Image"
                      className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-gold-shimmer hover:text-black transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => triggerReplace(photo.id, e)}
                      title="Replace with your own photo"
                      className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-rose-neon transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => deletePhoto(photo.id, e)}
                      title="Delete photo"
                      className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hover Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/60 border border-rose-neon/60 backdrop-blur-md flex items-center justify-center shadow-neon-pink">
                      <ZoomIn className="w-5 h-5 text-rose-blush" />
                    </div>
                  </div>
                </div>

                {/* Card Editorial Text */}
                <div className="p-5 flex flex-col justify-between flex-grow bg-[#09030e]/70">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-outfit uppercase tracking-widest text-gold-shimmer/90">
                        {photo.date}
                      </span>
                      <Heart className="w-3.5 h-3.5 text-rose-neon fill-rose-neon/40 group-hover:fill-rose-neon transition-colors" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold-champagne transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-inter line-clamp-2 mt-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-outfit text-gray-500">
                    <span>MEMORY #{index + 1}</span>
                    <span className="text-rose-neon hover:underline">Click to view full</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#0d0614] border border-rose-neon/40 rounded-3xl overflow-hidden shadow-neon-pink flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-shimmer" />
                  <span className="text-xs font-outfit uppercase tracking-widest text-gray-300">
                    {selectedPhoto.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => rotatePhoto(selectedPhoto.id, e)}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-gold-shimmer hover:text-black text-xs font-outfit flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> Rotate
                  </button>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-neon text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Photo View */}
              <div className="flex-grow flex items-center justify-center p-4 bg-black/70 overflow-hidden min-h-[350px]">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  style={{ transform: `rotate(${photoRotation[selectedPhoto.id] || 0}deg)` }}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-300"
                />
              </div>

              {/* Caption Footer */}
              <div className="p-6 bg-[#09030e] border-t border-white/10">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm font-inter text-gray-300 leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
