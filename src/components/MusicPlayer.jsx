import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Heart,
  Music,
  Sliders,
  Sparkles,
} from 'lucide-react';
import soundEngine from '../utils/audioEngine';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [trackName, setTrackName] = useState('Symphony of Forever');
  const [isExpanded, setIsExpanded] = useState(false);
  const [freqBars, setFreqBars] = useState([30, 60, 45, 80, 50, 70, 40]);
  const fileInputRef = useRef(null);

  // Sync state with soundEngine
  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
      setVolume(state.volume);
      setTrackName(state.trackName);
    });

    // Animate visualizer frequency bars
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
            Math.random() * 60 + 20,
            Math.random() * 80 + 20,
            Math.random() * 50 + 20,
            Math.random() * 90 + 20,
            Math.random() * 70 + 20,
            Math.random() * 80 + 20,
            Math.random() * 40 + 20,
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
    }
  };

  const handleHeartbeatClick = () => {
    soundEngine.playHeartbeat(1.2);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Expanded Audio Settings Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 p-5 rounded-3xl glass-panel border border-rose-neon/40 shadow-neon-pink w-72 text-left"
          >
            {/* Title & Track */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-[11px] font-outfit uppercase tracking-widest text-gold-shimmer font-semibold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-rose-neon" />
                Sound Studio
              </span>
              <button
                onClick={handleHeartbeatClick}
                className="px-2.5 py-1 rounded-full bg-rose-neon/20 hover:bg-rose-neon/40 text-[10px] text-rose-blush font-outfit uppercase tracking-wider flex items-center gap-1 transition-colors"
                title="Play heartbeat thump"
              >
                <Heart className="w-3 h-3 text-rose-neon fill-rose-neon" /> Lub-Dub
              </button>
            </div>

            {/* Currently Playing Track */}
            <p className="text-xs font-inter font-medium text-white truncate mb-1">
              {trackName}
            </p>
            <p className="text-[10px] text-gray-400 font-inter mb-4">
              {trackName === 'Symphony of Forever'
                ? 'Synthesized Ambient Piano & Chords'
                : 'Custom Audio Track'}
            </p>

            {/* Volume Slider */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-[11px] text-gray-300 font-inter">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-rose-neon cursor-pointer h-1.5 bg-black/60 rounded-lg"
              />
            </div>

            {/* Upload Custom Music */}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-black/50 hover:bg-rose-neon/20 border border-white/15 text-xs font-outfit uppercase tracking-wider text-gray-200 flex items-center justify-center gap-2 transition-all hover:border-gold-shimmer/60"
            >
              <Upload className="w-3.5 h-3.5 text-gold-shimmer" />
              <span>Upload Custom Song 🎵</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Compact Dock */}
      <div className="flex items-center gap-2 p-2 rounded-full glass-panel border border-rose-neon/30 shadow-neon-pink backdrop-blur-xl">
        {/* Equalizer Waveform Bars */}
        <div
          onClick={handleTogglePlay}
          className="flex items-end gap-1 px-2.5 h-6 cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {freqBars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className="w-1 bg-gradient-to-t from-rose-neon to-gold-shimmer rounded-full transition-all duration-100"
            />
          ))}
        </div>

        {/* Play / Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-neon to-rose-crimson text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          title={isPlaying ? 'Pause Symphony' : 'Play Romantic Symphony'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Mute / Unmute Button */}
        <button
          onClick={handleToggleMute}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-rose-blush" />}
        </button>

        {/* Settings Expander */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-9 h-9 rounded-full text-gray-300 flex items-center justify-center transition-colors border border-white/10 ${
            isExpanded ? 'bg-gold-shimmer text-black' : 'bg-black/60 hover:bg-black/80'
          }`}
          title="Audio Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
