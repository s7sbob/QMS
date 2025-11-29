// src/context/StorageContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

export type StorageType = 'aws' | 'vps';

interface StorageContextType {
  defaultStorage: StorageType;
  setDefaultStorage: (type: StorageType) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'aws'
  const [defaultStorage, setDefaultStorageState] = useState<StorageType>(() => {
    const saved = localStorage.getItem('defaultStorageType');
    return (saved as StorageType) || 'aws';
  });

  // Persist to localStorage when changed
  const setDefaultStorage = (type: StorageType) => {
    setDefaultStorageState(type);
    localStorage.setItem('defaultStorageType', type);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('defaultStorageType');
    if (saved === 'aws' || saved === 'vps') {
      setDefaultStorageState(saved);
    }
  }, []);

  return (
    <StorageContext.Provider value={{ defaultStorage, setDefaultStorage }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export default StorageContext;
