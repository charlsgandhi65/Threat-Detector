import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import './PageError.css';

export default function PageError({ message }) {
  return (
    <div className="page-error glass-card">
      <HiOutlineExclamationCircle />
      <div>
        <h3>Unable to load data</h3>
        <p>{message || 'The backend API is unreachable. Ensure Flask is running on port 5000.'}</p>
      </div>
    </div>
  );
}
