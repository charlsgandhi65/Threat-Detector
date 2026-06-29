import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiOutlineBanknotes,
  HiOutlineShieldExclamation,
  HiOutlineChartBar,
  HiOutlineArrowsRightLeft,
  HiOutlineFlag,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';
import { formatCurrency } from '../utils/helpers';
import './IntelOverview.css';

const INTEL_ITEMS = [
  { key: 'highestRiskCustomer', label: 'Highest Risk Customer', icon: HiOutlineUser },
  { key: 'highestTransactionAmount', label: 'Highest Transaction Amount', icon: HiOutlineBanknotes, format: 'currency' },
  { key: 'mostDangerousLocation', label: 'Most Dangerous Location', icon: HiOutlineGlobeAlt },
  { key: 'mostCommonThreatReason', label: 'Most Common Threat Reason', icon: HiOutlineShieldExclamation },
  { key: 'averageRiskScore', label: 'Average Risk Score', icon: HiOutlineChartBar },
  { key: 'totalThreatsToday', label: 'Total Threats Today', icon: HiOutlineCalendarDays },
  { key: 'mostUsedTransactionType', label: 'Most Used Transaction Type', icon: HiOutlineArrowsRightLeft },
  { key: 'totalFlaggedTransactions', label: 'Total Flagged Transactions', icon: HiOutlineFlag },
];

export default function IntelOverview({ intel, loading }) {
  if (loading) {
    return (
      <div className="intel-overview">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="intel-overview__card glass-card skeleton" style={{ height: 100 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="intel-overview">
      {INTEL_ITEMS.map(({ key, label, icon: Icon, format }, i) => {
        let value = intel?.[key] ?? '—';
        if (format === 'currency') value = formatCurrency(value);

        return (
          <motion.div
            key={key}
            className="intel-overview__card glass-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
          >
            <div className="intel-overview__icon"><Icon /></div>
            <div className="intel-overview__content">
              <span className="intel-overview__label">{label}</span>
              <span className="intel-overview__value">{value}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
