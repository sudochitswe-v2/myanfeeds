import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '../utils/theme';
import { getPreferredTheme, setTheme } from '../utils/theme';

// Define the context type
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeValue: (theme: Theme) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setCurrentTheme(initialTheme);

    // Apply the theme to the document
    setTheme(initialTheme);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  // Set theme directly
  const setThemeHandler = (theme: Theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  // Provide the context value
  const value: ThemeContextType = {
    theme: currentTheme,
    toggleTheme,
    setThemeValue: setThemeHandler,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};