import { HiOutlineArrowsRightLeft } from 'react-icons/hi2';
import { useAppData } from '../context/DataContext';
import TransactionTable from '../components/TransactionTable';
import PageError from '../components/PageError';
import PageLoader from '../components/PageLoader';

export default function TransactionsPage() {
  const { transactions, loading, error } = useAppData();

  if (loading && transactions.length === 0) {
    return (
      <div className="page-container fade-in">
        <header className="page-header">
          <h2 className="page-title">Transactions</h2>
          <p className="page-desc">Complete registry of all monitored transactions</p>
        </header>
        <PageLoader message="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Transactions</h2>
        <p className="page-desc">Complete registry of all monitored transactions — auto-refreshes every 2 seconds</p>
      </header>

      {error && <PageError message={error} />}

      <div className="section-header">
        <div>
          <h3 className="section-title"><HiOutlineArrowsRightLeft /> All Transactions</h3>
          <p className="section-subtitle">{transactions.length} total records</p>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        loading={loading && transactions.length === 0}
        customerSearchOnly
        pageSize={10}
      />
    </div>
  );
}
