import { motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import { FiUser, FiMapPin, FiDollarSign, FiClock, FiHash } from 'react-icons/fi';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import './TransactionDetailModal.css';

export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  const severity = transaction.status?.toLowerCase() || 'safe';

  return (
    <div className="tx-modal" role="dialog" aria-modal="true">
      <div className="tx-modal__backdrop" onClick={onClose} />
      <motion.div
        className="tx-modal__card glass-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="tx-modal__header">
          <div>
            <span className="tx-modal__eyebrow">Transaction Details</span>
            <h2 className="mono">#{transaction.id}</h2>
          </div>
          <span className={`status-badge ${severity}`}>{transaction.status}</span>
          <button type="button" className="tx-modal__close" onClick={onClose} aria-label="Close">
            <HiOutlineXMark />
          </button>
        </div>

        <div className="tx-modal__grid">
          <div className="tx-modal__field">
            <FiUser /><div><label>Customer</label><span>{transaction.user_name}</span></div>
          </div>
          <div className="tx-modal__field">
            <FiDollarSign /><div><label>Amount</label><span className="mono">{formatCurrency(transaction.amount)}</span></div>
          </div>
          <div className="tx-modal__field">
            <FiMapPin /><div><label>Location</label><span>{transaction.location}</span></div>
          </div>
          <div className="tx-modal__field">
            <FiHash /><div><label>Type</label><span>{transaction.transaction_type}</span></div>
          </div>
          <div className="tx-modal__field">
            <FiClock /><div><label>Timestamp</label><span>{formatDate(transaction.timestamp)} {formatTime(transaction.timestamp)}</span></div>
          </div>
          <div className="tx-modal__field tx-modal__field--risk">
            <div><label>Risk Score</label><span className="mono tx-modal__risk">{transaction.risk_score}</span></div>
          </div>
        </div>

        {transaction.risk_reason && (
          <div className="tx-modal__reason">
            <label>Threat Reason</label>
            <p>{transaction.risk_reason}</p>
          </div>
        )}

        <div className="tx-modal__footer">
          <span>Flagged: <strong>{transaction.is_flagged ? 'Yes' : 'No'}</strong></span>
          <button type="button" className="tx-modal__btn" onClick={onClose}>Close</button>
        </div>
      </motion.div>
    </div>
  );
}
