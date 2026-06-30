import { useState, useMemo } from 'react';
import { HiOutlineDocumentMagnifyingGlass } from 'react-icons/hi2';
import useIncidents from '../hooks/useIncidents';
import PageLoader from '../components/PageLoader';
import PageError from '../components/PageError';
import IncidentStatsBar from '../components/incidents/IncidentStatsBar';
import IncidentFilters from '../components/incidents/IncidentFilters';
import IncidentCard from '../components/incidents/IncidentCard';
import IncidentEmptyState from '../components/incidents/IncidentEmptyState';
import {
  computeIncidentStats,
  filterIncidents,
  sortIncidentsNewestFirst,
} from '../utils/incidentHelpers';
import './IncidentInvestigationPage.css';

export default function IncidentInvestigationPage() {
  const { incidents, loading, error } = useIncidents();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('ALL');

  const stats = useMemo(() => computeIncidentStats(incidents), [incidents]);
  const filtered = useMemo(
    () => filterIncidents(incidents, search, severity),
    [incidents, search, severity],
  );
  const sorted = useMemo(() => sortIncidentsNewestFirst(filtered), [filtered]);

  const initialLoad = loading && incidents.length === 0;

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Incident Investigation</h2>
        <p className="page-desc">
          Correlated security incident analysis and forensic investigation — refreshes every 5 seconds
        </p>
      </header>

      {error && <PageError message={error} />}

      {initialLoad ? (
        <PageLoader message="Loading security incidents..." />
      ) : (
        <div className="incident-page">
          <IncidentStatsBar
            total={stats.total}
            critical={stats.critical}
            averageConfidence={stats.averageConfidence}
          />

          <IncidentFilters
            search={search}
            onSearchChange={setSearch}
            severity={severity}
            onSeverityChange={setSeverity}
          />

          {incidents.length === 0 ? (
            <IncidentEmptyState />
          ) : sorted.length === 0 ? (
            <div className="incident-page__no-match glass-card">
              <HiOutlineDocumentMagnifyingGlass />
              <p>No incidents match your search or filter criteria.</p>
            </div>
          ) : (
            <div className="incident-page__list">
              {sorted.map((incident, i) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  defaultExpanded={i === 0}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
