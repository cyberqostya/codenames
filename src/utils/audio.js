const COUNTDOWN_VOLUME = 0.025;
const COUNTDOWN_TICK_DURATION = 0.12;
const COUNTDOWN_FREQUENCIES = {
  3: 440,
  2: 520,
  1: 620,
};

let audioContext;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  audioContext ??= new AudioContext();
  return audioContext;
}

export function unlockCountdownSound() {
  const context = getAudioContext();
  context?.resume?.();
}

export function playCountdownTick(number) {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequency = COUNTDOWN_FREQUENCIES[number] ?? 500;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(COUNTDOWN_VOLUME, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + COUNTDOWN_TICK_DURATION);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + COUNTDOWN_TICK_DURATION);
}
