import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Upload,
  Heart,
  Music,
  ListMusic,
  ChevronDown,
  X,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [freqBars, setFreqBars] = useState([30, 65, 45, 80, 50, 70, 40]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
      setVolume(state.volume);
      setCurrentTrack(state.currentTrack);
      setPlaylist(state.playlist);
    });

    // Animate equalizer bars
    let animId;
    const updateVisualizer = () => {
      if (soundEngine.isPlayingMusic && !soundEngine.isMuted) {
        const freqData = soundEngine.getFrequencyData();
        if (freqData && freqData.length > 0) {
          const bars = [];
          for (let i = 0; i < 7; i++) {
            const val = freqData[i * 2] || Math.random() * 80 + 20;
            bars.push(Math.max(15, Math.min(100, (val / 255) * 100)));
          }
          setFreqBars(bars);
        } else {
          setFreqBars([
            Math.random() * 60 + 25,
            Math.random() * 80 + 20,
            Math.random() * 50 + 25,
            Math.random() * 90 + 15,
            Math.random() * 70 + 20,
            Math.random() * 85 + 15,
            Math.random() * 45 + 25,
          ]);
        }
      } else {
        setFreqBars([15, 15, 15, 15, 15, 15, 15]);
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTogglePlay = () => {
    soundEngine.playChime(1.1);
    soundEngine.toggleMusic();
  };

  const handleNext = () => {
    soundEngine.playChime(1.2);
    soundEngine.nextTrack();
  };

  const handlePrev = () => {
    soundEngine.playChime(1.0);
    soundEngine.prevTrack();
  };

  const handleSelectTrack = (index) => {
    soundEngine.playChime(1.2);
    soundEngine.playTrack(index);
    setIsMenuOpen(false);
  };

  const handleToggleMute = () => {
    soundEngine.toggleMute();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    soundEngine.setVolume(val);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      soundEngine.loadCustomAudio(file);
      setIsMenuOpen(false);
    }
  };

  const trackTitle = currentTrack?.title || 'Tum Mile ❤️ (Romantic Hindi Melody)';

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none flex flex-col items-end">
      {/* Expanded Playlist / Track Changer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 sm:w-88 bg-[#FFFBF5] rounded-3xl p-5 shadow-2xl border-2 border-romantic-red/30 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-romantic-red/15 mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-romantic-red" />
                <span className="font-poppins font-bold text-xs uppercase tracking-wider text-romantic-red">
                  Change Romantic Song
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-romantic-red"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Song List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {playlist.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'bg-romantic-red text-white shadow-sm font-semibold'
                        : 'hover:bg-romantic-red/10 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        {isCurrent && isPlaying ? (
                          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                        ) : (
                          <Music className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs truncate">{track.title}</p>
                        <p className={`text-[10px] ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>
                          {track.subtitle}
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-poppins tracking-wider shrink-0 px-2 py-0.5 rounded-full bg-white/20">
                        Playing
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upload Custom Song Button */}
            <div className="mt-3 pt-3 border-t border-romantic-red/15">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="w-full py-2.5 px-3 rounded-2xl bg-white border border-romantic-red/30 hover:border-romantic-red hover:bg-romantic-red/5 text-xs font-poppins font-medium text-romantic-red flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Your Own Song (.mp3) 🎵</span>
              </button>
            </div>

            {/* Volume Control */}
            <div className="mt-3 pt-2 flex items-center gap-2.5 text-xs font-poppins text-gray-600">
              <button onClick={handleToggleMute} className="text-romantic-red">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-romantic-red cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
              <span className="text-[11px] w-8 text-right font-medium">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compact Player Dock */}
      <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-[#FFFBF5] border-2 border-romantic-red/30 shadow-2xl backdrop-blur-md">
        {/* Equalizer Frequency Bars */}
        <div
          onClick={handleTogglePlay}
          className="flex items-end gap-1 px-2 h-6 cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {freqBars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="w-1 bg-romantic-red rounded-full transition-all duration-100"
            />
          ))}
        </div>

        {/* Previous Track Button */}
        <button
          onClick={handlePrev}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-romantic-red/10 text-romantic-red flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title="Previous Song"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause Main Button */}
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-romantic-red text-white flex items-center justify-center hover:bg-romantic-red-dark transition-transform active:scale-95 shadow-md cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Romantic Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Next Track Button */}
        <button
          onClick={handleNext}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-romantic-red/10 text-romantic-red flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title="Next Song"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Song Title Pill & Track Changer Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-poppins transition-colors cursor-pointer max-w-[130px] sm:max-w-[210px] ${
            isMenuOpen
              ? 'bg-romantic-red text-white'
              : 'bg-white hover:bg-romantic-red/10 text-romantic-red border border-romantic-red/20'
          }`}
          title="Click to change song or choose from playlist"
        >
          <Music className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate font-medium text-[11px] sm:text-xs">
            {trackTitle}
          </span>
          <ListMusic className="w-3.5 h-3.5 shrink-0 ml-1" />
        </button>
      </div>
    </div>
  );
}
