import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '../types/database';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, priceCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
  GBP: '£',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    if (saved && ['PLN', 'EUR', 'USD', 'GBP'].includes(saved)) {
      return saved as Currency;
    }
    return 'PLN';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatPrice = (price: number, priceCurrency?: Currency): string => {
    const curr = priceCurrency || currency;
    const symbol = currencySymbols[curr];
    return `${price.toFixed(2)} ${symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyState, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
