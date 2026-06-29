import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShieldExclamation, HiOutlineXMark, HiOutlineSpeakerWave } from 'react-icons/hi2';
import { FiMapPin, FiUser, FiDollarSign } from 'react-icons/fi';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import './ThreatAlertNotifier.css';

function ThreatOverlay({ threat, transaction, onDismiss, onViewAlerts }) {
  if (!threat) return null;

  const severity = threat.severity?.toLowerCase() || 'high';

  return (
    <motion.div
      className="threat-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="threat-overlay__backdrop" onClick={onDismiss} />
      <motion.div
        className={`threat-overlay__card threat-overlay__card--${severity}`}
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      >
        <div className="threat-overlay__pulse-ring" />
        <div className="threat-overlay__header">
          <div className="threat-overlay__icon">
            <HiOutlineShieldExclamation />
          </div>
          <div>
            <span className="threat-overlay__eyebrow">Threat Detected</span>
            <h2 className="threat-overlay__title">
              {threat.severity} Security Alert
            </h2>
          </div>
          <button type="button" className="threat-overlay__close" onClick={onDismiss} aria-label="Dismiss">
            <HiOutlineXMark />
          </button>
        </div>

        <p className="threat-overlay__message">{threat.message}</p>

        {transaction && (
          <div className="threat-overlay__details">
            <div className="threat-overlay__detail">
              <FiUser /><span>{transaction.user_name}</span>
            </div>
            <div className="threat-overlay__detail">
              <FiMapPin /><span>{transaction.location}</span>
            </div>
            <div className="threat-overlay__detail">
              <FiDollarSign /><span>{formatCurrency(transaction.amount)}</span>
            </div>
            <div className="threat-overlay__detail threat-overlay__detail--score">
              <span className="mono">Risk {transaction.risk_score}</span>
            </div>
          </div>
        )}

        <div className="threat-overlay__actions">
          <button type="button" className="threat-overlay__btn threat-overlay__btn--primary" onClick={onViewAlerts}>
            View Threat Alerts
          </button>
          <button type="button" className="threat-overlay__btn threat-overlay__btn--ghost" onClick={onDismiss}>
            Dismiss &amp; Silence Alarm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ThreatToast({ threat, transaction, onDismiss }) {
  const severity = threat.severity?.toLowerCase() || 'high';

  return (
    <motion.div
      className={`threat-toast threat-toast--${severity}`}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      layout
    >
      <HiOutlineShieldExclamation className="threat-toast__icon" />
      <div className="threat-toast__body">
        <span className="threat-toast__severity">{threat.severity}</span>
        <p className="threat-toast__text">
          {transaction ? `${transaction.user_name} — ${transaction.location}` : threat.message}
        </p>
        <span className="threat-toast__time">{formatRelativeTime(threat.created_at)}</span>
      </div>
      <button type="button" className="threat-toast__close" onClick={onDismiss} aria-label="Dismiss">
        <HiOutlineXMark />
      </button>
    </motion.div>
  );
}

export default function ThreatAlertNotifier({
  activeThreat,
  toastQueue,
  transactions,
  audioUnlocked,
  onDismiss,
  onDismissToast,
  onEnableAudio,
  onViewAlerts,
}) {
  const tx = activeThreat
    ? transactions.find((t) => t.id === activeThreat.transaction_id)
    : null;

  return (
    <>
      {!audioUnlocked && (
        <button type="button" className="audio-unlock-banner" onClick={onEnableAudio}>
          <HiOutlineSpeakerWave />
          Click to enable threat alarm sounds
        </button>
      )}

      <div className={`threat-screen-pulse ${activeThreat ? 'threat-screen-pulse--active' : ''}`} />

      <AnimatePresence>
        {activeThreat && (
          <ThreatOverlay
            threat={activeThreat}
            transaction={tx}
            onDismiss={onDismiss}
            onViewAlerts={onViewAlerts}
          />
        )}
      </AnimatePresence>

      <div className="threat-toast-stack">
        <AnimatePresence>
          {toastQueue.map((threat) => (
            <ThreatToast
              key={threat.id}
              threat={threat}
              transaction={transactions.find((t) => t.id === threat.transaction_id)}
              onDismiss={() => onDismissToast(threat.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
