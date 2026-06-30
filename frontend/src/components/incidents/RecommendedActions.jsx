import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { getRecommendedActions } from '../../utils/incidentHelpers';
import './IncidentSections.css';

export default function RecommendedActions({ rootCause }) {
  const actions = getRecommendedActions(rootCause);

  return (
    <section className="incident-section">
      <h4 className="incident-section__title">Recommended Actions</h4>
      <ul className="recommended-actions">
        {actions.map((action) => (
          <li key={action}>
            <HiOutlineCheckCircle />
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
