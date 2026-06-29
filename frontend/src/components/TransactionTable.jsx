import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import TransactionDetailModal from './TransactionDetailModal';
import './TransactionTable.css';

const STATUS_OPTIONS = ['ALL', 'SAFE', 'MEDIUM', 'HIGH', 'CRITICAL'];
const SORT_OPTIONS = [
  { value: 'timestamp', label: 'Timestamp' },
  { value: 'amount', label: 'Amount' },
  { value: 'risk_score', label: 'Risk Score' },
];

export default function TransactionTable({
  transactions = [],
  loading,
  compact,
  customerSearchOnly = false,
  pageSize = 10,
  onRowClick,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let rows = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((t) => {
        if (customerSearchOnly) {
          return t.user_name?.toLowerCase().includes(q);
        }
        return (
          t.user_name?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          t.transaction_type?.toLowerCase().includes(q) ||
          String(t.id).includes(q)
        );
      });
    }

    if (statusFilter !== 'ALL') {
      rows = rows.filter((t) => t.status === statusFilter);
    }

    rows.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'timestamp') {
        av = new Date(av).getTime() || 0;
        bv = new Date(bv).getTime() || 0;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [transactions, search, statusFilter, sortKey, sortDir, customerSearchOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = compact
    ? filtered.slice(0, 6)
    : filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleRowClick = (tx) => {
    if (onRowClick) onRowClick(tx);
    else if (!compact) setSelected(tx);
  };

  if (loading) {
    return (
      <div className="tx-table glass-card">
        <div className="skeleton" style={{ width: '100%', height: 300 }} />
      </div>
    );
  }

  return (
    <>
      <div className="tx-table glass-card">
        {!compact && (
          <div className="tx-table__toolbar">
            <div className="tx-table__search">
              <HiOutlineMagnifyingGlass />
              <input
                type="text"
                placeholder={customerSearchOnly ? 'Search by customer name...' : 'Search transactions...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <div className="tx-table__filters">
              <HiOutlineFunnel />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</option>
                ))}
              </select>
              <select
                value={sortKey}
                onChange={(e) => { setSortKey(e.target.value); setSortDir('desc'); }}
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>Sort: {o.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="tx-table__sort-btn"
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                title="Toggle sort direction"
              >
                {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
          </div>
        )}

        <div className="tx-table__wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Type</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {pageRows.map((t) => (
                  <motion.tr
                    key={t.id}
                    className={!compact ? 'tx-table__row--clickable' : ''}
                    onClick={() => handleRowClick(t)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    layout
                  >
                    <td className="mono">#{t.id}</td>
                    <td>{t.user_name}</td>
                    <td className="mono">{formatCurrency(t.amount)}</td>
                    <td>{t.location}</td>
                    <td><span className="tx-table__type">{t.transaction_type}</span></td>
                    <td className="mono tx-table__risk">{t.risk_score}</td>
                    <td>
                      <span className={`status-badge ${t.status?.toLowerCase()}`}>{t.status}</span>
                    </td>
                    <td className="tx-table__time">{formatRelativeTime(t.timestamp)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {pageRows.length === 0 && (
            <div className="tx-table__empty">No transactions match your filters.</div>
          )}
        </div>

        {!compact && (
          <div className="tx-table__pagination">
            <span>{filtered.length} transactions</span>
            <div className="tx-table__pages">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <span className="mono">{page + 1} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
