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
  updatePrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string | null>(null);

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

  const updatePrimaryColor = (color: string) => {
    if (color && color.startsWith('#')) {
      setCustomPrimaryColor(color);
    }
  };

  // Helper to darken/lighten hex colors for sophisticated gradients
  const adjustColor = (hex: string, amount: number) => {
    const clamp = (val: number) => Math.min(Math.max(val, 0), 255);
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = clamp(parseInt(cleanHex.slice(0, 2), 16) + amount);
    const g = clamp(parseInt(cleanHex.slice(2, 4), 16) + amount);
    const b = clamp(parseInt(cleanHex.slice(4, 6), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const theme = { ...themes[currentTheme] };
  
  // Only apply custom organization colors if we're in 'default' mode
  // This preserves holiday themes like Christmas and New Year
  useEffect(() => {
    const root = document.documentElement;
    if (customPrimaryColor && currentTheme === 'default') {
        const darker = adjustColor(customPrimaryColor, -40);
        const slightlyDarker = adjustColor(customPrimaryColor, -20);
        
        root.style.setProperty('--primary-color', customPrimaryColor);
        root.style.setProperty('--primary-darker', darker);
        root.style.setProperty('--primary-slightly-darker', slightlyDarker);
    } else {
        // Reset or set defaults for non-dynamic themes
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--primary-darker');
        root.style.removeProperty('--primary-slightly-darker');
    }
  }, [customPrimaryColor, currentTheme]);

  if (customPrimaryColor && currentTheme === 'default') {
    theme.colors.primary = customPrimaryColor;
    
    // Use CSS variables for gradients to ensure they work with Tailwind JIT
    theme.gradients.header = 'from-[var(--primary-color)] to-[var(--primary-darker)]';
    theme.gradients.button = 'from-[var(--primary-slightly-darker)] to-[var(--primary-darker)]';
    
    theme.colors.secondary = 'var(--primary-darker)';
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updatePrimaryColor }}>
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
