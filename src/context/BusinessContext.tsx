import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialBusinessConfig } from '../config/initialBusiness';
import { supabaseDbService } from '../services/supabaseDbService';
import { BusinessConfig } from '../types';

export interface BusinessContextValue {
  business: BusinessConfig;
  updateBusiness: (updatedConfig: BusinessConfig) => void;
  resetBusiness: () => void;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<BusinessConfig>(initialBusinessConfig);

  useEffect(() => {
    let isMounted = true;
    async function syncBusiness() {
      try {
        const cloudBusiness = await supabaseDbService.getBusinessConfig();
        if (!isMounted) return;
        if (cloudBusiness) {
          setBusiness({
            ...initialBusinessConfig,
            ...cloudBusiness
          });
        } else {
          // Inicializar en Supabase si aún no está guardado
          supabaseDbService.saveBusinessConfig(initialBusinessConfig);
        }
      } catch (e) {
        console.warn('Error syncing business config from Supabase:', e);
      }
    }
    syncBusiness();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateBusiness = (updatedConfig: BusinessConfig) => {
    setBusiness(updatedConfig);
    supabaseDbService.saveBusinessConfig(updatedConfig);
  };

  const resetBusiness = () => {
    setBusiness(initialBusinessConfig);
    supabaseDbService.saveBusinessConfig(initialBusinessConfig);
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
