import { createContext, useContext } from 'react';
import useLiveData from '../hooks/useLiveData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const data = useLiveData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used within DataProvider');
  return ctx;
}
