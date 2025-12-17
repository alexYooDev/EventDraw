/**
 * ThemeContext
 * Global theme management using React Context
 */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'
import { themes } from '../types/theme';
import type { Theme, ThemeType } from '../types/theme'

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeType: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const setTheme = (themeType: ThemeType) => {
    setCurrentTheme(themeType);
    localStorage.setItem('app_theme', themeType);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[currentTheme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
