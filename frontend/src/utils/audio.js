// Web Audio synthesized romantic ambient + sound effects (no external assets needed)
let ctx = null;
let masterGain = null;
let musicNodes = [];
let musicPlaying = false;

export function initAudio() {
  if (ctx) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(ctx.destination);
  } catch (e) {
    // AudioContext unavailable — gracefully degrade (no audio)
    if (typeof window !== "undefined" && window.__DEBUG_AUDIO__) {
      // eslint-disable-next-line no-console
      console.warn("AudioContext init failed", e);
    }
  }
}

function ensureCtx() {
  if (!ctx) initAudio();
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

// --- playMusic helpers ---
const BASE_FREQS = [220.0, 277.18, 329.63, 415.30]; // A3 warm chord (A, C#, E, G#)

function buildMusicBus() {
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.0;
  gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5);

  const delay = ctx.createDelay(2.0);
  delay.delayTime.value = 0.55;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  delay.connect(feedback);
  feedback.connect(delay);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;

  gainNode.connect(filter);
  filter.connect(delay);
  filter.connect(masterGain);
  delay.connect(masterGain);

  return { gainNode, delay, feedback, filter };
}

function buildVoice(freq, index, gainNode) {
  const o1 = ctx.createOscillator();
  o1.type = "sine";
  o1.frequency.value = freq;
  const o2 = ctx.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = freq * 2;
  const g = ctx.createGain();
  g.gain.value = 0.25 / (index + 1);
  o1.connect(g);
  o2.connect(g);
  g.connect(gainNode);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15 + index * 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 1.2;
  lfo.connect(lfoGain);
  lfoGain.connect(o1.frequency);

  o1.start();
  o2.start();
  lfo.start();
  return [o1, o2, lfo];
}

function scheduleFilterSweep(filter) {
  const startTime = ctx.currentTime;
  filter.frequency.setValueAtTime(900, startTime);
  filter.frequency.linearRampToValueAtTime(1500, startTime + 8);
  filter.frequency.linearRampToValueAtTime(900, startTime + 16);
}

// Romantic ambient pad: layered detuned sines + slow LFO + delay
export async function playMusic() {
  ensureCtx();
  if (!ctx || musicPlaying) return;
  musicPlaying = true;

  const { gainNode, delay, feedback, filter } = buildMusicBus();
  const oscs = BASE_FREQS.flatMap((f, i) => buildVoice(f, i, gainNode));
  scheduleFilterSweep(filter);

  musicNodes = [gainNode, ...oscs, filter, delay, feedback];
}

export function stopMusic() {
  if (!musicPlaying || !ctx) return;
  const fadeTime = ctx.currentTime + 1.2;
  try {
    musicNodes[0].gain.cancelScheduledValues(ctx.currentTime);
    musicNodes[0].gain.linearRampToValueAtTime(0, fadeTime);
  } catch (err) {
    // Node may already be disconnected — non-fatal
    void err;
  }
  setTimeout(() => {
    musicNodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (err) {
        // Node already stopped/disconnected — non-fatal
        void err;
      }
    });
    musicNodes = [];
    musicPlaying = false;
  }, 1400);
}

export function playSfx(type) {
  ensureCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  switch (type) {
    case "arrow": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(800, t); o.frequency.exponentialRampToValueAtTime(200, t + 0.4);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.55);
      break;
    }
    case "hit": {
      // Twinkly success
      [880, 1320, 1760, 2200].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        const start = t + i * 0.08;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
        o.connect(g); g.connect(masterGain); o.start(start); o.stop(start + 0.75);
      });
      break;
    }
    case "sparkle": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(3000, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.5);
      break;
    }
    case "chest": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(440, t + 1.2);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 1.6);
      // Shimmer
      setTimeout(() => playSfx("hit"), 600);
      break;
    }
    case "whoosh": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 600; f.Q.value = 0.8;
      o.type = "sawtooth"; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(80, t + 0.6);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.connect(f); f.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.75);
      break;
    }
    case "click": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.2);
      break;
    }
    case "wrong": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square"; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.45);
      break;
    }
    case "heart": {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(660, t); o.frequency.exponentialRampToValueAtTime(990, t + 0.2);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.4);
      break;
    }
    default: break;
  }
}
