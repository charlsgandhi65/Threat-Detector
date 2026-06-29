import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiOutlineBanknotes,
  HiOutlineShieldExclamation,
  HiOutlineChartBar,
  HiOutlineArrowsRightLeft,
  HiOutlineBellAlert,
} from 'react-icons/hi2';
import { formatCurrency } from '../utils/helpers';
import './ThreatIntel.css';

const INTEL_ITEMS = [
  { key: 'highestRiskUser', label: 'Highest Risk User', icon: HiOutlineUser },
  { key: 'mostDangerousLocation', label: 'Most Dangerous Location', icon: HiOutlineGlobeAlt },
  { key: 'highestTransaction', label: 'Highest Transaction', icon: HiOutlineBanknotes, format: 'currency' },
  { key: 'mostCommonThreat', label: 'Most Common Threat', icon: HiOutlineShieldExclamation },
  { key: 'averageRiskScore', label: 'Average Risk Score', icon: HiOutlineChartBar },
  { key: 'mostUsedType', label: 'Most Used Transaction Type', icon: HiOutlineArrowsRightLeft },
  { key: 'topAlertCategory', label: 'Top Alert Category', icon: HiOutlineBellAlert },
];

export default function ThreatIntel({ intel, loading }) {
  if (loading) {
    return (
      <div className="threat-intel glass-card">
        <div className="skeleton" style={{ width: '100%', height: 320 }} />
      </div>
    );
  }

  return (
    <div className="threat-intel glass-card">
      <div className="threat-intel__grid">
        {INTEL_ITEMS.map(({ key, label, icon: Icon, format }, i) => {
          let value = intel?.[key] ?? '—';
          if (format === 'currency') value = formatCurrency(value);

          return (
            <motion.div
              key={key}
              className="intel-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="intel-card__icon">
                <Icon />
              </div>
              <div className="intel-card__content">
                <span className="intel-card__label">{label}</span>
                <span className="intel-card__value">{value}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
