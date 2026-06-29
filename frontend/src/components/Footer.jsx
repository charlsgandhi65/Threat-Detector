import { IoShieldCheckmark } from 'react-icons/io5';
import './Footer.css';

const VERSION = '1.0.0';
const BUILD = '2026.06.29';

export default function Footer({ collapsed }) {
  return (
    <footer className={`footer ${collapsed ? 'footer--collapsed' : ''}`}>
      <div className="footer__inner">
        <div className="footer__brand">
          <IoShieldCheckmark />
          <span>Threat Detector</span>
          <span className="footer__version mono">v{VERSION}</span>
        </div>
        <div className="footer__meta">
          <span>Frontend <strong>React + Vite</strong></span>
          <span className="footer__sep">·</span>
          <span>Backend <strong>Flask</strong></span>
          <span className="footer__sep">·</span>
          <span>Database <strong>SQLite</strong></span>
          <span className="footer__sep">·</span>
          <span>Build <strong className="mono">{BUILD}</strong></span>
        </div>
      </div>
    </footer>
  );
}
