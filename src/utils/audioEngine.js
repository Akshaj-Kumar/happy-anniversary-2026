// Romantic Sound Engine & Multi-Track Music Player
// Supports MP3 playback, track changing, Web Audio API synthesizer, and custom uploads

export const romanticPlaylist = [
  {
    id: 'tum-mile',
    title: 'Tum Mile ❤️ (Romantic Hindi Melody)',
    subtitle: 'Soulful Love Anthem',
    url: '/audio/tum-mile.mp3',
    type: 'audio',
  },
  {
    id: 'ordinary',
    title: 'Ordinary / Extraordinary Love (Ballad)',
    subtitle: 'Gentle Acoustic Romance',
    url: '/audio/ordinary.mp3',
    type: 'audio',
  },
  {
    id: 'piano-synth',
    title: "Can't Help Falling in Love (Dream Piano)",
    subtitle: 'Synthesized Ambient Chords',
    type: 'synth',
  },
];

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.synthInterval = null;
    this.analyser = null;
    this.dataArray = null;
    this.isPlayingMusic = false;
    this.volume = 0.7;
    this.isMuted = false;
    this.audioElement = null;
    this.audioSource = null;
    this.currentTrackIndex = 0;
    this.playlist = [...romanticPlaylist];
    this.onStateChangeCallbacks = new Set();
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notifyState();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    this.notifyState();
    return this.isMuted;
  }

  // Realistic Lub-Dub Heartbeat Synthesizer
  playHeartbeat(volumeMultiplier = 1.0) {
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const playThump = (time, freq, duration, gainVal) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + duration);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainVal * this.volume * volumeMultiplier, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration);
    };

    playThump(now, 75, 0.14, 0.9);
    playThump(now + 0.17, 65, 0.18, 0.7);
  }

  playChime(pitchMultiplier = 1.0) {
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51].map((f) => f * pitchMultiplier);
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.2 * this.volume, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 1.3);
    });
  }

  playWhoosh() {
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2 * this.volume, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  playBurst() {
    this.playWhoosh();
    this.playChime(1.2);
    this.playHeartbeat(1.4);
  }

  // Synthesizer ambient chords fallback
  startRomanticAmbient() {
    this.resume();
    this.stopAudioElement();
    if (this.synthInterval) return;

    const chords = [
      [174.61, 261.63, 329.63, 440.0, 523.25], // Fmaj7
      [220.0, 261.63, 329.63, 392.0, 493.88],  // Am7
      [146.83, 220.0, 261.63, 329.63, 440.0],  // Dm9
      [116.54, 233.08, 293.66, 349.23, 440.0], // Bbmaj7
      [130.81, 196.0, 261.63, 349.23, 392.0],  // Csus4
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isPlayingMusic || !this.ctx || this.isMuted) return;

      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now);

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const strikeTime = now + i * 0.12;
        gain.gain.setValueAtTime(0.0001, strikeTime);
        gain.gain.linearRampToValueAtTime(0.1 * this.volume, strikeTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 4.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(strikeTime);
        osc.stop(strikeTime + 4.6);
      });
    };

    this.isPlayingMusic = true;
    playChord();
    this.synthInterval = setInterval(playChord, 3800);
    this.notifyState();
  }

  stopRomanticAmbient() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  stopAudioElement() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  // Play a specific track from playlist by index
  playTrack(index) {
    this.resume();
    if (index < 0 || index >= this.playlist.length) return;

    this.currentTrackIndex = index;
    const track = this.playlist[index];

    if (track.type === 'synth') {
      this.stopAudioElement();
      this.startRomanticAmbient();
    } else {
      this.stopRomanticAmbient();
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
      }

      this.audioElement.src = track.url;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;

      try {
        if (!this.audioSource && this.ctx) {
          this.audioSource = this.ctx.createMediaElementSource(this.audioElement);
          this.audioSource.connect(this.masterGain);
        }
      } catch (e) {
        // Source might already be connected
      }

      this.audioElement
        .play()
        .then(() => {
          this.isPlayingMusic = true;
          this.notifyState();
        })
        .catch((err) => {
          console.warn('Audio play request failed or autoplay was blocked:', err);
          // Fallback to ambient chords if audio file fails
          this.startRomanticAmbient();
        });
    }

    this.isPlayingMusic = true;
    this.notifyState();
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.pause();
    } else {
      this.playTrack(this.currentTrackIndex);
    }
    return this.isPlayingMusic;
  }

  pause() {
    this.isPlayingMusic = false;
    this.stopRomanticAmbient();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.notifyState();
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.playlist.length;
    this.playTrack(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.playTrack(prevIdx);
  }

  // Upload custom song
  loadCustomAudio(file) {
    this.resume();
    const objectUrl = URL.createObjectURL(file);
    const newTrack = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      subtitle: 'Your Uploaded Song 🎵',
      url: objectUrl,
      type: 'audio',
    };

    this.playlist.unshift(newTrack);
    this.playTrack(0);
  }

  getFrequencyData() {
    if (!this.analyser || !this.dataArray) {
      return new Uint8Array(16);
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.add(callback);
    return () => this.onStateChangeCallbacks.delete(callback);
  }

  notifyState() {
    const curTrack = this.playlist[this.currentTrackIndex] || this.playlist[0];
    this.onStateChangeCallbacks.forEach((cb) =>
      cb({
        isPlaying: this.isPlayingMusic,
        isMuted: this.isMuted,
        volume: this.volume,
        currentTrackIndex: this.currentTrackIndex,
        currentTrack: curTrack,
        playlist: this.playlist,
      })
    );
  }
}

export const soundEngine = new RomanticAudioEngine();
export default soundEngine;
