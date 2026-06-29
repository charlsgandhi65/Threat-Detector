import { HiOutlineArrowPath } from 'react-icons/hi2';
import './PageLoader.css';

export default function PageLoader({ message = 'Loading data...' }) {
  return (
    <div className="page-loader glass-card">
      <HiOutlineArrowPath className="page-loader__icon" />
      <p>{message}</p>
    </div>
  );
}
