import React, { createContext, useContext } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const currencySymbol = '₹';
  const currencyCode = 'INR';
  const timeZone = 'Asia/Kolkata';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const formatDateTimeIST = (dateString) => {
    if (!dateString) return '';
    return formatInTimeZone(new Date(dateString), timeZone, 'dd/MM/yyyy hh:mm a');
  };

  return (
    <LocaleContext.Provider value={{ currencySymbol, currencyCode, formatCurrency, formatDate, formatDateTimeIST }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
