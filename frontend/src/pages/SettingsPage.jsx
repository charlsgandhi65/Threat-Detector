import { useState } from 'react';
import { HiOutlineCog6Tooth, HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import { isAlarmEnabled, setAlarmEnabled } from '../utils/alarm';
import './SettingsPage.css';

export default function SettingsPage() {
  const [alarmOn, setAlarmOn] = useState(isAlarmEnabled);

  const toggleAlarm = () => {
    const next = !alarmOn;
    setAlarmOn(next);
    setAlarmEnabled(next);
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-desc">Platform configuration and preferences</p>
      </header>

      <div className="settings-grid">
        <div className="settings-card glass-card">
          <HiOutlineCog6Tooth className="settings-card__icon" />
          <h3>API Configuration</h3>
          <p>Backend endpoint: <code className="mono">/api</code> (proxied to Flask on port 5000)</p>
        </div>
        <div className="settings-card glass-card">
          <h3>Polling Interval</h3>
          <p>Live data refreshes every <strong>2 seconds</strong></p>
        </div>
        <div className="settings-card glass-card">
          <h3>Theme</h3>
          <p>Dark SOC theme with cyan accent — enterprise cybersecurity mode</p>
        </div>
        <div className="settings-card glass-card settings-card--alarm">
          <div className="settings-card__alarm-header">
            {alarmOn ? <HiOutlineSpeakerWave className="settings-card__icon" /> : <HiOutlineSpeakerXMark className="settings-card__icon settings-card__icon--muted" />}
            <h3>Threat Alarm</h3>
          </div>
          <p>Play an audible alarm when a new HIGH or CRITICAL threat is detected.</p>
          <label className="settings-toggle">
            <input type="checkbox" checked={alarmOn} onChange={toggleAlarm} />
            <span className="settings-toggle__track" />
            <span className="settings-toggle__label">{alarmOn ? 'Alarm enabled' : 'Alarm muted'}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
