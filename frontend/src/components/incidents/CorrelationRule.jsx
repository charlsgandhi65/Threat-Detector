import { getCorrelationRule } from '../../utils/incidentHelpers';
import './IncidentSections.css';

export default function CorrelationRule({ rootCause }) {
  const steps = getCorrelationRule(rootCause);

  return (
    <section className="incident-section">
      <h4 className="incident-section__title">Correlation Rule</h4>
      <div className="correlation-rule">
        <div className="correlation-rule__cause">{rootCause}</div>
        <div className="correlation-rule__arrow">↓</div>
        <div className="correlation-rule__chain">
          {steps.map((step, i) => (
            <span key={step} className="correlation-rule__step">
              {i > 0 && <span className="correlation-rule__plus">+</span>}
              {step}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
