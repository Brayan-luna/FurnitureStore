import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';
import { BusinessConfig } from '../types';

export interface BusinessContextValue {
  business: BusinessConfig;
  updateBusiness: (updatedConfig: BusinessConfig) => void;
  resetBusiness: () => void;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<BusinessConfig>(() => storageService.getBusinessConfig());

  const updateBusiness = (updatedConfig: BusinessConfig) => {
    setBusiness(updatedConfig);
    storageService.saveBusinessConfig(updatedConfig);
  };

  const resetBusiness = () => {
    storageService.resetToDefaults();
    setBusiness(storageService.getBusinessConfig());
  };

  return (
    <BusinessContext.Provider value={{ business, updateBusiness, resetBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
