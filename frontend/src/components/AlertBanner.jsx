import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';
import { FiMapPin, FiUser, FiDollarSign } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';
import './AlertBanner.css';

export default function AlertBanner({ transactions, alerts, loading }) {
  const criticalAlert = alerts.find((a) => a.severity === 'CRITICAL') || alerts[0];
  const tx = criticalAlert
    ? transactions.find((t) => t.id === criticalAlert.transaction_id)
    : transactions.find((t) => t.status === 'CRITICAL' || t.status === 'HIGH');

  if (loading) {
    return (
      <div className="alert-banner glass-card alert-banner--loading">
        <div className="skeleton" style={{ width: '100%', height: 100 }} />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="alert-banner glass-card alert-banner--clear">
        <HiOutlineShieldExclamation className="alert-banner__icon-clear" />
        <div>
          <h3>All Systems Clear</h3>
          <p>No active critical threats detected. Monitoring continues.</p>
        </div>
      </div>
    );
  }

  const severity = tx.status?.toLowerCase() || 'high';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tx.id}
        className={`alert-banner glass-card alert-banner--${severity}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="alert-banner__pulse" />
        <div className="alert-banner__content">
          <div className="alert-banner__header">
            <div className="alert-banner__icon-wrap">
              <HiOutlineShieldExclamation />
            </div>
            <div>
              <span className="alert-banner__label">Active Threat Detected</span>
              <span className={`status-badge ${severity}`}>{tx.status}</span>
            </div>
          </div>

          <div className="alert-banner__grid">
            <div className="alert-banner__field">
              <FiUser />
              <div>
                <span className="alert-banner__field-label">Customer</span>
                <span className="alert-banner__field-value">{tx.user_name}</span>
              </div>
            </div>
            <div className="alert-banner__field">
              <FiMapPin />
              <div>
                <span className="alert-banner__field-label">Location</span>
                <span className="alert-banner__field-value">{tx.location}</span>
              </div>
            </div>
            <div className="alert-banner__field">
              <FiDollarSign />
              <div>
                <span className="alert-banner__field-label">Amount</span>
                <span className="alert-banner__field-value">{formatCurrency(tx.amount)}</span>
              </div>
            </div>
            <div className="alert-banner__field alert-banner__field--score">
              <span className="alert-banner__score mono">{tx.risk_score}</span>
              <div>
                <span className="alert-banner__field-label">Risk Score</span>
                <span className="alert-banner__field-value alert-banner__reason">{tx.risk_reason || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
