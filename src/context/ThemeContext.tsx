import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = {
  name: string;
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
};

const THEMES: Record<string, Theme> = {
  zinc: {
    name: 'Zinc',
    primary: '#18181b', // zinc-900
    background: '#09090b', // zinc-950
    card: '#09090b',
    text: '#fafafa',
    border: '#27272a',
  },
  emerald: {
    name: 'Emerald',
    primary: '#10b981',
    background: '#064e3b',
    card: '#065f46',
    text: '#ecfdf5',
    border: '#047857',
  },
  slate: {
    name: 'Slate',
    primary: '#0f172a',
    background: '#020617',
    card: '#0f172a',
    text: '#f8fafc',
    border: '#1e293b',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    background: '#082f49',
    card: '#0c4a6e',
    text: '#f0f9ff',
    border: '#075985',
  }
};

const ThemeContext = createContext<{
  currentTheme: Theme;
  setTheme: (name: string) => void;
  themes: Record<string, Theme>;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.zinc);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--background', currentTheme.background);
    root.style.setProperty('--foreground', currentTheme.text);
    root.style.setProperty('--primary', currentTheme.primary);
    root.style.setProperty('--card', currentTheme.card);
    root.style.setProperty('--border', currentTheme.border);
  }, [currentTheme]);

  const setTheme = (name: string) => {
    if (THEMES[name]) setCurrentTheme(THEMES[name]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
