import { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineCog6Tooth } from 'react-icons/hi2';
import { IoShieldCheckmark } from 'react-icons/io5';
import { formatDate } from '../utils/helpers';
import './Navbar.css';

export default function Navbar({ apiStatus, alertCount, sidebarCollapsed }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const statusLabel = apiStatus === 'online' ? 'Live' : apiStatus === 'warning' ? 'Degraded' : 'Offline';
  const statusClass = apiStatus === 'online' ? 'online' : apiStatus === 'warning' ? 'warning' : 'offline';

  return (
    <header className={`navbar ${sidebarCollapsed ? 'navbar--collapsed-pad' : ''}`}>
      <div className="navbar__left">
        <div className="navbar__logo">
          <IoShieldCheckmark />
        </div>
        <div className="navbar__brand">
          <h1>Threat Detector</h1>
          <span>Real-Time Transaction Monitoring</span>
        </div>
      </div>

      <div className="navbar__center">
        <div className={`navbar__status navbar__status--${statusClass}`}>
          <span className="navbar__status-dot" />
          System {statusLabel}
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__datetime">
          <span className="navbar__date">{formatDate(now)}</span>
          <span className="navbar__time mono">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        <button type="button" className="navbar__icon-btn" aria-label="Notifications">
          <HiOutlineBell />
          {alertCount > 0 && <span className="navbar__badge">{alertCount > 99 ? '99+' : alertCount}</span>}
        </button>

        <button type="button" className="navbar__icon-btn" aria-label="Settings">
          <HiOutlineCog6Tooth />
        </button>

        <div className="navbar__avatar" title="SOC Analyst">
          <span>SA</span>
        </div>
      </div>
    </header>
  );
}
