// Cinematic Web Audio API Sound Engine & Custom Audio Manager
// Provides 100% reliable synthesized romantic chords, heartbeats, chimes, and user audio uploads

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.synthInterval = null;
    this.analyser = null;
    this.dataArray = null;
    this.isPlayingMusic = false;
    this.volume = 0.65;
    this.isMuted = false;
    this.customAudio = null;
    this.customSource = null;
    this.trackName = 'Symphony of Forever';
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
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
    }
    this.notifyState();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
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

    // First thump "lub"
    playThump(now, 75, 0.14, 0.9);
    // Second thump "dub"
    playThump(now + 0.17, 65, 0.18, 0.7);
  }

  // Romantic Shimmer / Star Chime
  playChime(pitchMultiplier = 1.0) {
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51].map(f => f * pitchMultiplier);
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

  // Cinematic Whoosh
  playWhoosh() {
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.45;
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
    filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.25);
    filter.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.45);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25 * this.volume, this.ctx.currentTime + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  // Particle explosion / Heartburst sound
  playBurst() {
    this.playWhoosh();
    this.playChime(1.2);
    this.playHeartbeat(1.4);
  }

  // Generative Romantic Piano & Ambient Chords
  startRomanticAmbient() {
    this.resume();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Chord progressions in F Major / D Minor (Dreamy, Emotional)
    // Fmaj7, Am7, Dm9, Bbmaj9, Csus4
    const chords = [
      [174.61, 261.63, 329.63, 440.00, 523.25], // Fmaj7
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am7
      [146.83, 220.00, 261.63, 329.63, 440.00], // Dm9
      [116.54, 233.08, 293.66, 349.23, 440.00], // Bbmaj7
      [130.81, 196.00, 261.63, 349.23, 392.00], // Csus4
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

        // Warm analog-style filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650 + Math.random() * 250, now);

        osc.type = i === 0 ? 'sine' : (Math.random() > 0.4 ? 'triangle' : 'sine');
        osc.frequency.setValueAtTime(freq, now);

        // Staggered arpeggiated piano-like strike
        const strikeTime = now + (i * 0.14) + (Math.random() * 0.05);
        gain.gain.setValueAtTime(0.0001, strikeTime);
        gain.gain.linearRampToValueAtTime((0.12 - i * 0.015) * this.volume, strikeTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + 4.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(strikeTime);
        osc.stop(strikeTime + 5.0);
      });
    };

    playChord();
    this.synthInterval = setInterval(playChord, 3800);
    this.notifyState();
  }

  stopRomanticAmbient() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isPlayingMusic = false;
    this.notifyState();
  }

  toggleMusic() {
    if (this.customAudio) {
      if (this.customAudio.paused) {
        this.resume();
        this.customAudio.play();
        this.isPlayingMusic = true;
      } else {
        this.customAudio.pause();
        this.isPlayingMusic = false;
      }
      this.notifyState();
      return this.isPlayingMusic;
    }

    if (this.isPlayingMusic) {
      this.stopRomanticAmbient();
    } else {
      this.startRomanticAmbient();
    }
    return this.isPlayingMusic;
  }

  // Support for custom audio files (mp3, wav)
  loadCustomAudio(file) {
    this.resume();
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.stopRomanticAmbient();

    const objectUrl = URL.createObjectURL(file);
    this.customAudio = new Audio(objectUrl);
    this.customAudio.loop = true;
    this.customAudio.volume = this.isMuted ? 0 : this.volume;
    this.trackName = file.name.replace(/\.[^/.]+$/, '');

    try {
      this.customSource = this.ctx.createMediaElementSource(this.customAudio);
      this.customSource.connect(this.masterGain);
    } catch (e) {
      console.warn('Could not connect media element source, fallback to normal audio playback', e);
    }

    this.customAudio.play().then(() => {
      this.isPlayingMusic = true;
      this.notifyState();
    }).catch(err => {
      console.warn('Audio play request failed or was interrupted:', err);
    });
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
    this.onStateChangeCallbacks.forEach(cb => cb({
      isPlaying: this.isPlayingMusic,
      isMuted: this.isMuted,
      volume: this.volume,
      trackName: this.trackName,
    }));
  }
}

export const soundEngine = new RomanticAudioEngine();
export default soundEngine;
