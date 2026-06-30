import { getUniqueTimelineEvents } from '../../utils/incidentHelpers';
import './IncidentSections.css';

export default function CorrelatedEvents({ timeline }) {
  const events = getUniqueTimelineEvents(timeline);

  return (
    <section className="incident-section">
      <h4 className="incident-section__title">Correlated Security Events</h4>
      {events.length === 0 ? (
        <p className="incident-section__empty">No correlated events recorded</p>
      ) : (
        <div className="correlated-events">
          {events.map((event) => (
            <span key={event} className="correlated-events__badge">{event}</span>
          ))}
        </div>
      )}
    </section>
  );
}
