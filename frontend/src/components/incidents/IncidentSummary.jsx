import { formatDate, formatTime } from '../../utils/helpers';
import './IncidentSections.css';

export default function IncidentSummary({ incident }) {
  const severity = incident.severity?.toLowerCase() || 'high';

  return (
    <section className="incident-section">
      <h4 className="incident-section__title">Incident Summary</h4>
      <div className="incident-summary__grid">
        <div className="incident-summary__field">
          <label>Incident ID</label>
          <span className="mono">#{incident.id}</span>
        </div>
        <div className="incident-summary__field">
          <label>User Name</label>
          <span>{incident.user_name}</span>
        </div>
        <div className="incident-summary__field">
          <label>Severity</label>
          <span className={`status-badge ${severity}`}>{incident.severity}</span>
        </div>
        <div className="incident-summary__field">
          <label>Confidence</label>
          <span className="mono incident-summary__confidence">{incident.confidence}%</span>
        </div>
        <div className="incident-summary__field incident-summary__field--wide">
          <label>Root Cause</label>
          <span>{incident.root_cause}</span>
        </div>
        <div className="incident-summary__field">
          <label>Created Time</label>
          <span>{formatDate(incident.created_at)} {formatTime(incident.created_at)}</span>
        </div>
      </div>
    </section>
  );
}
