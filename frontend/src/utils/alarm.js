let audioCtx = null;
let alarmInterval = null;
let alarmTimeout = null;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function unlockAudio() {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

function playBeep(ctx, frequency, startTime, duration = 0.18, volume = 0.22) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function playPattern(severity) {
  const ctx = getContext();
  if (ctx.state === 'suspended') return;

  const now = ctx.currentTime;

  if (severity === 'CRITICAL') {
    const tones = [880, 660, 880, 660, 990, 740];
    tones.forEach((freq, i) => playBeep(ctx, freq, now + i * 0.22, 0.2, 0.28));
  } else {
    playBeep(ctx, 740, now, 0.25, 0.2);
    playBeep(ctx, 740, now + 0.35, 0.25, 0.2);
    playBeep(ctx, 880, now + 0.7, 0.3, 0.22);
  }
}

export function startThreatAlarm(severity = 'HIGH') {
  stopThreatAlarm();
  unlockAudio();

  playPattern(severity);

  if (severity === 'CRITICAL') {
    alarmInterval = setInterval(() => playPattern('CRITICAL'), 2800);
  }
}

export function stopThreatAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }
}

export function isAlarmEnabled() {
  return localStorage.getItem('threat-alarm-enabled') !== 'false';
}

export function setAlarmEnabled(enabled) {
  localStorage.setItem('threat-alarm-enabled', enabled ? 'true' : 'false');
  if (!enabled) stopThreatAlarm();
}
