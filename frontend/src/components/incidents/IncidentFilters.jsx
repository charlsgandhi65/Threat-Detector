import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import './IncidentFilters.css';

const SEVERITY_OPTIONS = ['ALL', 'SAFE', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function IncidentFilters({ search, onSearchChange, severity, onSeverityChange }) {
  return (
    <div className="incident-filters glass-card">
      <div className="incident-filters__search">
        <HiOutlineMagnifyingGlass />
        <input
          type="text"
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="incident-filters__select">
        <HiOutlineFunnel />
        <select value={severity} onChange={(e) => onSeverityChange(e.target.value)}>
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All Severities' : s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
