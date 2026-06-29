import { motion } from 'framer-motion';
import {
  HiOutlinePlusCircle,
  HiOutlineShieldCheck,
  HiOutlineCalculator,
  HiOutlineBellAlert,
} from 'react-icons/hi2';
import { formatRelativeTime } from '../utils/helpers';
import './Timeline.css';

const ICONS = {
  transaction: HiOutlinePlusCircle,
  risk: HiOutlineCalculator,
  alert: HiOutlineBellAlert,
  analysed: HiOutlineShieldCheck,
};

export default function Timeline({ events = [], loading }) {
  if (loading) {
    return (
      <div className="timeline glass-card">
        <div className="skeleton" style={{ width: '100%', height: 360 }} />
      </div>
    );
  }

  return (
    <div className="timeline glass-card">
      <div className="timeline__track">
        {events.length === 0 ? (
          <div className="timeline__empty">No activity recorded yet</div>
        ) : (
          events.map((event, i) => {
            const Icon = ICONS[event.type] || HiOutlinePlusCircle;
            const sev = event.severity?.toLowerCase() || 'safe';

            return (
              <motion.div
                key={event.id}
                className="timeline__item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className={`timeline__dot timeline__dot--${sev}`}>
                  <Icon />
                </div>
                <div className="timeline__content">
                  <div className="timeline__header">
                    <span className="timeline__title">{event.title}</span>
                    <span className="timeline__time">{formatRelativeTime(event.time)}</span>
                  </div>
                  <p className="timeline__detail">{event.detail}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
