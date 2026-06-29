import { motion } from 'framer-motion';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { FiMapPin, FiUser, FiClock } from 'react-icons/fi';
import { formatRelativeTime } from '../utils/helpers';
import './AlertsPanel.css';

export default function AlertsPanel({ alerts = [], transactions = [], loading, limit }) {
  const rows = limit ? alerts.slice(0, limit) : alerts;

  const getTx = (alert) => transactions.find((t) => t.id === alert.transaction_id);

  if (loading) {
    return (
      <div className="alerts-panel glass-card">
        <div className="skeleton" style={{ width: '100%', height: 280 }} />
      </div>
    );
  }

  return (
    <div className="alerts-panel glass-card">
      <div className="alerts-panel__list">
        {rows.length === 0 ? (
          <div className="alerts-panel__empty">
            <HiOutlineBellAlert />
            <p>No threat alerts at this time</p>
          </div>
        ) : (
          rows.map((alert, i) => {
            const tx = getTx(alert);
            const sev = alert.severity?.toLowerCase() || 'high';

            return (
              <motion.div
                key={alert.id}
                className={`alert-card alert-card--${sev}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <div className="alert-card__header">
                  <span className={`status-badge ${sev}`}>{alert.severity}</span>
                  <span className="alert-card__time">
                    <FiClock /> {formatRelativeTime(alert.created_at)}
                  </span>
                </div>
                <p className="alert-card__reason">{alert.message}</p>
                {tx && (
                  <div className="alert-card__meta">
                    <span><FiUser /> {tx.user_name}</span>
                    <span><FiMapPin /> {tx.location}</span>
                    <span className="mono">Risk: {tx.risk_score}</span>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
