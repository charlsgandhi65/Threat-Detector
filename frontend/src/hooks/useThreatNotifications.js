import { useEffect, useRef, useState, useCallback } from 'react';
import { isAlarmEnabled, startThreatAlarm, stopThreatAlarm, unlockAudio } from '../utils/alarm';

const THREAT_LEVELS = new Set(['HIGH', 'CRITICAL']);

export default function useThreatNotifications(alerts, loading) {
  const seenIds = useRef(null);
  const [activeThreat, setActiveThreat] = useState(null);
  const [toastQueue, setToastQueue] = useState([]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    const unlock = () => setAudioUnlocked(true);
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (loading || !alerts) return;

    if (seenIds.current === null) {
      seenIds.current = new Set(alerts.map((a) => a.id));
      return;
    }

    const newThreats = alerts.filter(
      (a) => !seenIds.current.has(a.id) && THREAT_LEVELS.has(a.severity),
    );

    alerts.forEach((a) => seenIds.current.add(a.id));

    if (newThreats.length === 0) return;

    const latest = newThreats[0];
    setActiveThreat(latest);
    setToastQueue((prev) => [...newThreats, ...prev].slice(0, 5));

    if (audioUnlocked && isAlarmEnabled()) {
      startThreatAlarm(latest.severity);
    }
  }, [alerts, loading, audioUnlocked]);

  const dismissThreat = useCallback(() => {
    setActiveThreat(null);
    stopThreatAlarm();
  }, []);

  const dismissToast = useCallback((id) => {
    setToastQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const enableAudio = useCallback(() => {
    unlockAudio();
    setAudioUnlocked(true);
  }, []);

  return {
    activeThreat,
    toastQueue,
    audioUnlocked,
    dismissThreat,
    dismissToast,
    enableAudio,
  };
}
