import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from 'react-icons/hi2';
import './StatCard.css';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = display;
    const diff = target - start;
    if (diff === 0) return;

    const duration = 1000;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, accent, loading }) {
  if (loading) {
    return (
      <div className="stat-card glass-card stat-card--loading">
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
        <div className="skeleton" style={{ width: '60%', height: 28, marginTop: 12 }} />
        <div className="skeleton" style={{ width: '40%', height: 14, marginTop: 8 }} />
      </div>
    );
  }

  return (
    <motion.div
      className={`stat-card glass-card stat-card--${accent}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="stat-card__glow" />
      <div className="stat-card__top">
        <div className="stat-card__icon">
          <Icon />
        </div>
        {trend && (
          <span className={`stat-card__trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? <HiOutlineArrowTrendingUp /> : <HiOutlineArrowTrendingDown />}
            {trend}
          </span>
        )}
      </div>
      <div className="stat-card__value">
        <AnimatedNumber value={value} />
      </div>
      <div className="stat-card__title">{title}</div>
    </motion.div>
  );
}
