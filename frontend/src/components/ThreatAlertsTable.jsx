import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineFunnel, HiOutlineBellAlert } from 'react-icons/hi2';
import { FiMapPin, FiUser, FiClock } from 'react-icons/fi';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import PageLoader from './PageLoader';
import './ThreatAlertsTable.css';

const SEVERITY_OPTIONS = ['ALL', 'HIGH', 'CRITICAL'];

export default function ThreatAlertsTable({ transactions = [], loading }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const threats = useMemo(() => {
    let rows = transactions.filter((t) => t.status === 'HIGH' || t.status === 'CRITICAL');

    if (severityFilter !== 'ALL') {
      rows = rows.filter((t) => t.status === severityFilter);
    }

    return rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [transactions, severityFilter]);

  if (loading) return <PageLoader message="Loading threat alerts..." />;

  return (
    <div className="threat-alerts-table">
      <div className="threat-alerts-table__toolbar glass-card">
        <div className="threat-alerts-table__count">
          <HiOutlineBellAlert />
          <span><strong>{threats.length}</strong> suspicious transactions</span>
        </div>
        <div className="threat-alerts-table__filter">
          <HiOutlineFunnel />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Severities' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {threats.length === 0 ? (
        <div className="threat-alerts-table__empty glass-card">
          <HiOutlineBellAlert />
          <p>No suspicious transactions detected</p>
        </div>
      ) : (
        <div className="threat-alerts-table__grid">
          {threats.map((t, i) => {
            const sev = t.status?.toLowerCase() || 'high';
            return (
              <motion.article
                key={t.id}
                className={`threat-alert-card glass-card threat-alert-card--${sev}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="threat-alert-card__header">
                  <span className={`status-badge ${sev}`}>{t.status}</span>
                  <span className="threat-alert-card__score mono">Risk {t.risk_score}</span>
                </div>

                <div className="threat-alert-card__customer">
                  <FiUser />
                  <span>{t.user_name}</span>
                </div>

                <div className="threat-alert-card__amount mono">
                  {formatCurrency(t.amount)}
                </div>

                <p className="threat-alert-card__reason">{t.risk_reason || 'No reason provided'}</p>

                <div className="threat-alert-card__meta">
                  <span><FiMapPin /> {t.location}</span>
                  <span>{t.transaction_type}</span>
                  <span><FiClock /> {formatDate(t.timestamp)} {formatTime(t.timestamp)}</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
