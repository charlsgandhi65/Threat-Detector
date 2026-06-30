import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineShieldExclamation } from 'react-icons/hi2';
import { formatDate, formatTime } from '../../utils/helpers';
import IncidentSummary from './IncidentSummary';
import CorrelationRule from './CorrelationRule';
import CorrelatedEvents from './CorrelatedEvents';
import AttackTimeline from './AttackTimeline';
import RecommendedActions from './RecommendedActions';
import './IncidentCard.css';

export default function IncidentCard({ incident, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const severity = incident.severity?.toLowerCase() || 'high';

  return (
    <article className={`incident-card glass-card incident-card--${severity}`}>
      <button
        type="button"
        className="incident-card__header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="incident-card__header-left">
          <div className="incident-card__icon">
            <HiOutlineShieldExclamation />
          </div>
          <div className="incident-card__meta">
            <div className="incident-card__top-row">
              <span className="incident-card__id mono">INC-{incident.id}</span>
              <span className={`status-badge ${severity}`}>{incident.severity}</span>
            </div>
            <h3 className="incident-card__user">{incident.user_name}</h3>
            <p className="incident-card__cause">{incident.root_cause}</p>
          </div>
        </div>
        <div className="incident-card__header-right">
          <div className="incident-card__confidence">
            <span className="incident-card__confidence-value mono">{incident.confidence}%</span>
            <span className="incident-card__confidence-label">Confidence</span>
          </div>
          <div className="incident-card__time">
            {formatDate(incident.created_at)}<br />
            <span className="mono">{formatTime(incident.created_at)}</span>
          </div>
          <span className="incident-card__toggle">
            {expanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="incident-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IncidentSummary incident={incident} />
            <CorrelationRule rootCause={incident.root_cause} />
            <CorrelatedEvents timeline={incident.timeline} />
            <AttackTimeline timeline={incident.timeline} />
            <RecommendedActions rootCause={incident.root_cause} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
