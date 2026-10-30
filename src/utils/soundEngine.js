// Web Audio API Procedural Switch Sound Synthesizer
// Generates accurate mechanical keyboard acoustic profiles without external assets.

let audioCtx = null;
let analyserNode = null;
let sharedMasterGain = null;
let cachedNoiseBuffer = null;
const listeners = new Set();

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;
      analyserNode.smoothingTimeConstant = 0.8;

      sharedMasterGain = audioCtx.createGain();
      sharedMasterGain.gain.setValueAtTime(0.75, audioCtx.currentTime);
      sharedMasterGain.connect(audioCtx.destination);
      sharedMasterGain.connect(analyserNode);

      // Pre-allocate a 0.05s reusable noise buffer to eliminate GC allocations during typing
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.05);
      cachedNoiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = cachedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Global user gesture listeners for eager Web Audio unlocking
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // safe fallback
    }
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

export function subscribeAudioWave(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyWaveformTrigger(type) {
  listeners.forEach(cb => {
    try {
      cb(type);
    } catch {
      // safe fallback
    }
  });
}

/**
 * Procedural mechanical switch sound synthesis
 * @param {'lineal' | 'tactil' | 'clicky'} switchType 
 * @param {number} pitchMod optional small pitch variation for realism
 */
export function playSwitchSound(switchType = 'tactil', pitchMod = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    notifyWaveformTrigger(switchType);

    const masterGain = sharedMasterGain || ctx.destination;

    if (switchType === 'lineal') {
      // LINEAL: Smooth low-pass filter (400Hz) + damped deep mechanical thock
      // 1. Noise transient for keycap hit (reusing pre-allocated noise buffer)
      const noise = ctx.createBufferSource();
      noise.buffer = cachedNoiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(450 * pitchMod, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);

      // 2. Deep body resonance (thock)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160 * pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(70 * pitchMod, now + 0.07);

      oscGain.gain.setValueAtTime(0.9, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.08);

    } else if (switchType === 'tactil') {
      // TÁCTIL: Resonant mid-hit (800Hz) + double micro-envelope simulating tactile bump & bottom out
      // Bump 1: Tactile pre-travel bump
      const bumpOsc = ctx.createOscillator();
      const bumpGain = ctx.createGain();
      bumpOsc.type = 'triangle';
      bumpOsc.frequency.setValueAtTime(420 * pitchMod, now);
      bumpOsc.frequency.exponentialRampToValueAtTime(260 * pitchMod, now + 0.02);

      bumpGain.gain.setValueAtTime(0.45, now);
      bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      bumpOsc.connect(bumpGain);
      bumpGain.connect(masterGain);
      bumpOsc.start(now);
      bumpOsc.stop(now + 0.025);

      // Bump 2: Crisp bottom-out at 800Hz
      const bottomTime = now + 0.012;
      const bottomOsc = ctx.createOscillator();
      const bottomGain = ctx.createGain();
      bottomOsc.type = 'sine';
      bottomOsc.frequency.setValueAtTime(780 * pitchMod, bottomTime);
      bottomOsc.frequency.exponentialRampToValueAtTime(140 * pitchMod, bottomTime + 0.05);

      bottomGain.gain.setValueAtTime(0.85, bottomTime);
      bottomGain.gain.exponentialRampToValueAtTime(0.001, bottomTime + 0.05);

      bottomOsc.connect(bottomGain);
      bottomGain.connect(masterGain);
      bottomOsc.start(bottomTime);
      bottomOsc.stop(bottomTime + 0.06);

      // Noise body with bandpass at 800Hz (reusing pre-allocated noise buffer)
      const noise = ctx.createBufferSource();
      noise.buffer = cachedNoiseBuffer;

      const bpFilter = ctx.createBiquadFilter();
      bpFilter.type = 'bandpass';
      bpFilter.frequency.setValueAtTime(800 * pitchMod, bottomTime);
      bpFilter.Q.setValueAtTime(2.2, bottomTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, bottomTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, bottomTime + 0.035);

      noise.connect(bpFilter);
      bpFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(bottomTime);

    } else if (switchType === 'clicky') {
      // CLICKY: High frequency snappy click (2800Hz) + bright mechanical collar snap
      // 1. Sharp click transient
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(2850 * pitchMod, now);
      clickOsc.frequency.exponentialRampToValueAtTime(1200 * pitchMod, now + 0.015);

      clickGain.gain.setValueAtTime(0.75, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(1600, now);

      clickOsc.connect(hpf);
      hpf.connect(clickGain);
      clickGain.connect(masterGain);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      // 2. Metallic collar snap & bottom hit
      const bottomTime = now + 0.008;
      const botOsc = ctx.createOscillator();
      const botGain = ctx.createGain();
      botOsc.type = 'triangle';
      botOsc.frequency.setValueAtTime(520 * pitchMod, bottomTime);
      botOsc.frequency.exponentialRampToValueAtTime(180 * pitchMod, bottomTime + 0.04);

      botGain.gain.setValueAtTime(0.65, bottomTime);
      botGain.gain.exponentialRampToValueAtTime(0.001, bottomTime + 0.04);

      botOsc.connect(botGain);
      botGain.connect(masterGain);
      botOsc.start(bottomTime);
      botOsc.stop(bottomTime + 0.045);
    }
  } catch (err) {
    console.warn('Audio synthesis note:', err);
  }
}

