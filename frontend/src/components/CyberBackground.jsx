import './CyberBackground.css';

export default function CyberBackground() {
  return (
    <div className="cyber-bg" aria-hidden="true">
      <div className="cyber-bg__gradient" />
      <div className="cyber-bg__radial cyber-bg__radial--1" />
      <div className="cyber-bg__radial cyber-bg__radial--2" />
      <div className="cyber-bg__grid" />
      <div className="cyber-bg__map" />
      <div className="cyber-bg__circuit" />
      <div className="cyber-bg__particles">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="cyber-bg__particle" style={{ '--i': i }} />
        ))}
      </div>
      <div className="cyber-bg__connections">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,212,255,0)" />
              <stop offset="50%" stopColor="rgba(0,212,255,0.15)" />
              <stop offset="100%" stopColor="rgba(0,212,255,0)" />
            </linearGradient>
          </defs>
          <line x1="100" y1="200" x2="400" y2="350" stroke="url(#lineGrad)" strokeWidth="1" className="cyber-line" />
          <line x1="400" y1="350" x2="700" y2="250" stroke="url(#lineGrad)" strokeWidth="1" className="cyber-line cyber-line--delay" />
          <line x1="700" y1="250" x2="1000" y2="400" stroke="url(#lineGrad)" strokeWidth="1" className="cyber-line cyber-line--delay2" />
          <line x1="200" y1="500" x2="550" y2="600" stroke="url(#lineGrad)" strokeWidth="1" className="cyber-line" />
          <line x1="550" y1="600" x2="900" y2="500" stroke="url(#lineGrad)" strokeWidth="1" className="cyber-line cyber-line--delay" />
          <circle cx="100" cy="200" r="3" fill="rgba(0,212,255,0.4)" className="cyber-node" />
          <circle cx="400" cy="350" r="4" fill="rgba(0,212,255,0.5)" className="cyber-node" />
          <circle cx="700" cy="250" r="3" fill="rgba(0,212,255,0.4)" className="cyber-node" />
          <circle cx="1000" cy="400" r="3" fill="rgba(0,212,255,0.3)" className="cyber-node" />
        </svg>
      </div>
    </div>
  );
}
