/* ==========================================================================
   UI Store
   Theme and language state with localStorage persistence.
   Keys: ne.theme, ne.lang. Consumed by ThemeProvider, I18nProvider, Settings.
   ========================================================================== */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ThemeMode, SettingsLanguage } from '../../features/settings/types';

const THEME_KEY = 'ne.theme';
const LANG_KEY = 'ne.lang';

const THEME_DEFAULT: ThemeMode = 'system';
const LANG_DEFAULT: SettingsLanguage = 'en';

function readTheme(): ThemeMode {
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === 'light' || s === 'dark' || s === 'system') return s;
  } catch {
    // ignore
  }
  return THEME_DEFAULT;
}

function readLanguage(): SettingsLanguage {
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'en' || s === 'ru' || s === 'kk') return s;
  } catch {
    // ignore
  }
  return LANG_DEFAULT;
}

export interface UiSettingsState {
  theme: ThemeMode;
  language: SettingsLanguage;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: SettingsLanguage) => void;
}

const UiSettingsContext = createContext<UiSettingsState | null>(null);

export function UiSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(readTheme);
  const [language, setLanguageState] = useState<SettingsLanguage>(readLanguage);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback((next: SettingsLanguage) => {
    setLanguageState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<UiSettingsState>(
    () => ({ theme, language, setTheme, setLanguage }),
    [theme, language, setTheme, setLanguage]
  );

  return (
    <UiSettingsContext.Provider value={value}>
      {children}
    </UiSettingsContext.Provider>
  );
}

export function useUiSettings(): UiSettingsState {
  const ctx = useContext(UiSettingsContext);
  if (ctx == null) {
    throw new Error('useUiSettings must be used within UiSettingsProvider');
  }
  return ctx;
}
