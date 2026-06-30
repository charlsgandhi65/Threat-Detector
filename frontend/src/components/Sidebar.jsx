import { NavLink } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineArrowsRightLeft,
  HiOutlineBellAlert,
  HiOutlineShieldExclamation,
  HiOutlineChartBar,
  HiOutlineHeart,
  HiOutlineCog6Tooth,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: HiOutlineSquares2X2, end: true },
  { path: '/transactions', label: 'Transactions', icon: HiOutlineArrowsRightLeft },
  { path: '/alerts', label: 'Threat Alerts', icon: HiOutlineBellAlert },
  { path: '/intelligence', label: 'Threat Intelligence', icon: HiOutlineShieldExclamation },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { path: '/incidents', label: 'Incident Investigation', icon: HiOutlineDocumentMagnifyingGlass },
  { path: '/health', label: 'System Health', icon: HiOutlineHeart },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
            title={label}
          >
            <span className="sidebar__indicator" />
            <Icon className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
      </button>
    </aside>
  );
}
