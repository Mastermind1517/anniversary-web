// SoundEngine.ts - High-fidelity Web Audio API Procedural Audio Synthesizer
// Zero external audio asset dependencies - 100% reliable, zero latency, runs offline.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private ambientOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isAmbientPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // 1. Wax Crack Sound Effect
  public playWaxCrack() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Brittle snapping noise
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.1);

    const snapGain = this.ctx.createGain();
    snapGain.gain.setValueAtTime(0.8, t);
    snapGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    // Deep resonant thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.15);

    oscGain.gain.setValueAtTime(0.9, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(snapGain);
    snapGain.connect(this.masterGain);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noise.start(t);
    osc.start(t);
    noise.stop(t + 0.15);
    osc.stop(t + 0.16);
  }

  // 2. Paper Rustle Sound Effect
  public playPaperRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const dur = 0.35;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * (0.8 + 0.2 * Math.random());
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.frequency.linearRampToValueAtTime(1800, t + 0.2);
    filter.Q.value = 1.4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + dur);
  }

  // 3. Celestial Romantic Chime
  public playChime(freq = 587.33) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const harmonics = [1, 2, 2.76, 4.05];
    const decays = [1.8, 1.2, 0.8, 0.5];

    harmonics.forEach((h, index) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * h, t);

      const amp = (0.28 / (index + 1));
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decays[index]);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + decays[index] + 0.05);
    });
  }

  // 4. Soft Heartbeat Thud (for Press & Hold)
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // 5. Analog Mixtape Reel Click
  public playTapeClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 6. Lush Ambient Romantic Pad (Procedural Chords)
  public startAmbientSoundscape() {
    if (this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isAmbientPlaying = true;
    const t = this.ctx.currentTime;

    // Frequencies for a warm celestial Fmaj9 / Cmaj9 chord
    const chordNotes = [174.61, 220.00, 261.63, 329.63, 392.00]; // F3, A3, C4, E4, G4

    this.ambientOscillators = chordNotes.map((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Low pass filter for warm, dreamy warmth
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 3.0); // Slow gentle fade-in

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      return { osc, gain };
    });
  }

  public stopAmbientSoundscape() {
    if (!this.isAmbientPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.ambientOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.setTargetAtTime(0.0001, t, 1.0);
        setTimeout(() => {
          try {
            osc.stop();
          } catch {
            // Already stopped
          }
        }, 1500);
      } catch {
        // Safe catch
      }
    });
    this.ambientOscillators = [];
    this.isAmbientPlaying = false;
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(5);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public setAmbientHarmonics(rootFreq: number) {
    if (!this.isAmbientPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;
    const ratios = [1, 1.25, 1.5, 1.875, 2.25];
    this.ambientOscillators.forEach(({ osc }, index) => {
      const targetFreq = rootFreq * (ratios[index] || 1);
      osc.frequency.setTargetAtTime(targetFreq, t, 0.4);
    });
  }

  public playChord(rootFreq: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const intervals = [1, 1.25, 1.5, 1.875];
    intervals.forEach((ratio, i) => {
      setTimeout(() => {
        this.playChime(rootFreq * ratio);
      }, i * 130);
    });
  }
}

export const sound = new SoundEngine();
