/* ==========================================================================
   I18nProvider
   Provides locale from UI store (ne.lang) to the tree. Consumers use useI18n().
   Sets document.documentElement.lang for a11y and future i18n. Inside UiSettingsProvider.
   ========================================================================== */

import React, { createContext, useContext, useEffect } from 'react';
import { useUiSettings } from '../store/ui.store';
import type { SettingsLanguage } from '../../features/settings/types';

const LANG_MAP: Record<SettingsLanguage, string> = {
  en: 'en',
  ru: 'ru',
  kk: 'kk',
};

export interface I18nContextValue {
  locale: SettingsLanguage;
  setLocale: (locale: SettingsLanguage) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useUiSettings();
  const value: I18nContextValue = { locale: language, setLocale: setLanguage };

  useEffect(() => {
    document.documentElement.setAttribute('lang', LANG_MAP[language]);
  }, [language]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx == null) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
