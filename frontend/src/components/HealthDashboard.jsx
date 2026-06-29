import { motion } from 'framer-motion';
import {
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineCircleStack,
  HiOutlineShieldExclamation,
} from 'react-icons/hi2';
import SystemHealth from './SystemHealth';
import { formatTime, getMonitoringStatus } from '../utils/helpers';
import './HealthDashboard.css';

export default function HealthDashboard({
  health,
  loading,
  lastUpdated,
  requestCount,
  recordCount,
}) {
  const monitoringStatus = getMonitoringStatus(health);
  const statusClass = monitoringStatus === 'Active' ? 'online' : monitoringStatus === 'Offline' ? 'offline' : 'warning';

  const metrics = [
    {
      icon: HiOutlineClock,
      label: 'Last Refresh',
      value: lastUpdated ? formatTime(lastUpdated) : '—',
    },
    {
      icon: HiOutlineArrowPath,
      label: 'Total API Requests',
      value: requestCount?.toLocaleString() ?? '0',
    },
    {
      icon: HiOutlineCircleStack,
      label: 'Database Records',
      value: recordCount?.toLocaleString() ?? '0',
    },
    {
      icon: HiOutlineShieldExclamation,
      label: 'Monitoring Status',
      value: monitoringStatus,
      status: statusClass,
    },
  ];

  return (
    <div className="health-dashboard">
      <div className="health-dashboard__metrics">
        {metrics.map(({ icon: Icon, label, value, status }, i) => (
          <motion.div
            key={label}
            className="health-metric glass-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Icon className="health-metric__icon" />
            <div>
              <span className="health-metric__label">{label}</span>
              <span className={`health-metric__value ${status ? `health-metric__value--${status}` : ''}`}>
                {value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="health-dashboard__services">
        <SystemHealth
          health={health}
          loading={loading}
          variant="page"
        />
      </div>
    </div>
  );
}
