import { motion } from 'framer-motion';
import {
  HiOutlineServer,
  HiOutlineCircleStack,
  HiOutlineCog,
  HiOutlineShieldCheck,
  HiOutlineSignal,
} from 'react-icons/hi2';
import './SystemHealth.css';

const SERVICES_DEFAULT = [
  { key: 'backend', label: 'Backend', icon: HiOutlineServer },
  { key: 'database', label: 'Database', icon: HiOutlineCircleStack },
  { key: 'generator', label: 'Generator', icon: HiOutlineCog },
  { key: 'monitor', label: 'Threat Monitor', icon: HiOutlineShieldCheck },
  { key: 'api', label: 'API', icon: HiOutlineSignal },
];

const SERVICES_PAGE = [
  { key: 'backend', label: 'Flask Backend', icon: HiOutlineServer },
  { key: 'database', label: 'SQLite Database', icon: HiOutlineCircleStack },
  { key: 'generator', label: 'Transaction Generator', icon: HiOutlineCog },
  { key: 'monitor', label: 'Background Monitor', icon: HiOutlineShieldCheck },
  { key: 'api', label: 'REST API', icon: HiOutlineSignal },
];

const STATUS_LABELS = { online: 'Online', warning: 'Warning', offline: 'Offline' };

export default function SystemHealth({ health, loading, variant }) {
  const services = variant === 'page' ? SERVICES_PAGE : SERVICES_DEFAULT;
  if (loading) {
    return (
      <div className="system-health glass-card">
        <div className="skeleton" style={{ width: '100%', height: 280 }} />
      </div>
    );
  }

  return (
    <div className="system-health glass-card">
      <div className="system-health__list">
        {services.map(({ key, label, icon: Icon }, i) => {
          const status = health?.[key] ?? 'warning';
          return (
            <motion.div
              key={key}
              className="health-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="health-item__left">
                <Icon className="health-item__icon" />
                <span className="health-item__label">{label}</span>
              </div>
              <div className="health-item__right">
                <span className={`health-dot ${status}`} />
                <span className={`health-item__status health-item__status--${status}`}>
                  {STATUS_LABELS[status]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
