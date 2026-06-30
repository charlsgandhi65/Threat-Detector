import { formatDate, formatTime } from '../../utils/helpers';
import './IncidentSections.css';

export default function AttackTimeline({ timeline = [] }) {
  const sorted = [...timeline].sort(
    (a, b) => new Date(a.time) - new Date(b.time),
  );

  return (
    <section className="incident-section">
      <h4 className="incident-section__title">Attack Timeline</h4>
      {sorted.length === 0 ? (
        <p className="incident-section__empty">No timeline events available</p>
      ) : (
        <div className="attack-timeline">
          {sorted.map((item, i) => (
            <div key={`${item.time}-${item.event}-${i}`} className="attack-timeline__node">
              <div className="attack-timeline__time mono">
                {formatDate(item.time)} {formatTime(item.time)}
              </div>
              <div className="attack-timeline__connector" />
              <div className="attack-timeline__event">{item.event}</div>
              {i < sorted.length - 1 && <div className="attack-timeline__arrow">↓</div>}
            </div>
          ))}
          <div className="attack-timeline__generated">
            🚨 Incident Generated
          </div>
        </div>
      )}
    </section>
  );
}
