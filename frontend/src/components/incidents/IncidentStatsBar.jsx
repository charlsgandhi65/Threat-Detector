import { HiOutlineDocumentMagnifyingGlass, HiOutlineFire, HiOutlineChartBar } from 'react-icons/hi2';
import './IncidentStatsBar.css';

export default function IncidentStatsBar({ total, critical, averageConfidence }) {
  return (
    <div className="incident-stats">
      <div className="incident-stats__card glass-card">
        <HiOutlineDocumentMagnifyingGlass />
        <div>
          <span className="incident-stats__value">{total}</span>
          <span className="incident-stats__label">Total Incidents</span>
        </div>
      </div>
      <div className="incident-stats__card glass-card incident-stats__card--critical">
        <HiOutlineFire />
        <div>
          <span className="incident-stats__value">{critical}</span>
          <span className="incident-stats__label">Critical Incidents</span>
        </div>
      </div>
      <div className="incident-stats__card glass-card">
        <HiOutlineChartBar />
        <div>
          <span className="incident-stats__value">{averageConfidence}%</span>
          <span className="incident-stats__label">Avg Confidence</span>
        </div>
      </div>
    </div>
  );
}
