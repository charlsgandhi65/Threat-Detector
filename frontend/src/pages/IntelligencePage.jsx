import { HiOutlineShieldExclamation } from 'react-icons/hi2';
import { useAppData } from '../context/DataContext';
import IntelOverview from '../components/IntelOverview';
import PageError from '../components/PageError';
import PageLoader from '../components/PageLoader';
import { computePageIntel } from '../utils/helpers';

export default function IntelligencePage() {
  const { transactions, loading, error } = useAppData();
  const intel = computePageIntel(transactions);

  if (loading && transactions.length === 0) {
    return (
      <div className="page-container fade-in">
        <header className="page-header">
          <h2 className="page-title">Threat Intelligence</h2>
          <p className="page-desc">Summarized intelligence from transaction data</p>
        </header>
        <PageLoader message="Computing threat intelligence..." />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Threat Intelligence</h2>
        <p className="page-desc">
          Summarized intelligence derived from live transaction data — auto-refreshes every 2 seconds
        </p>
      </header>

      {error && <PageError message={error} />}

      <div className="section-header">
        <div>
          <h3 className="section-title"><HiOutlineShieldExclamation /> Intelligence Summary</h3>
          <p className="section-subtitle">Calculated from {transactions.length} transactions</p>
        </div>
      </div>

      <IntelOverview intel={intel} loading={loading && transactions.length === 0} />
    </div>
  );
}
