import { HiOutlineShieldExclamation } from 'react-icons/hi2';
import './IncidentEmptyState.css';

export default function IncidentEmptyState() {
  return (
    <div className="incident-empty glass-card">
      <div className="incident-empty__icon">
        <HiOutlineShieldExclamation />
      </div>
      <h3>No Active Security Incidents</h3>
      <p>All systems are operating normally. No correlated threat incidents require investigation at this time.</p>
    </div>
  );
}
