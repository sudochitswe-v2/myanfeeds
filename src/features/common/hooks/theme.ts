/**
 * Theme utility functions for managing app theme colors
 */

// Define theme types
export type Theme = 'light' | 'dark';

/**
 * Updates the theme color meta tag which affects the status bar color on mobile devices
 * @param color - The hex color code to set as the theme color
 */
export const updateThemeColor = (color: string): void => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', color);
  } else {
    // Create the meta tag if it doesn't exist
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  }

  // Also update the CSS variable for consistent theming
  document.documentElement.style.setProperty('--theme-color', color);
};

/**
 * Gets the current theme color
 * @returns The current theme color as a string
 */
export const getCurrentThemeColor = (): string => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  return themeColorMeta?.getAttribute('content') || '#7B2CBF'; // Default to primary color
};

/**
 * Applies the default theme color to the status bar
 */
export const applyDefaultTheme = (): void => {
  updateThemeColor('#7B2CBF'); // Purple primary color
};

/**
 * Gets the user's preferred theme based on localStorage or system preference
 * @returns The preferred theme ('light' or 'dark')
 */
export const getPreferredTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

/**
 * Sets the theme for the application
 * @param theme - The theme to set ('light' or 'dark')
 */
export const setTheme = (theme: Theme): void => {
  // Save the theme preference to localStorage
  localStorage.setItem('theme', theme);

  // Apply the theme class to the document element
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update theme color based on the selected theme
  if (theme === 'dark') {
    updateThemeColor('#7B2CBF'); // Purple primary color for dark theme
  } else {
    updateThemeColor('#7B2CBF'); // Purple primary color for light theme
  }
};

/**
 * Toggles between light and dark themes
 */
export const toggleTheme = (): void => {
  const currentTheme = getPreferredTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
};

/**
 * Initializes the theme based on user preference or system setting
 */
export const initializeTheme = (): void => {
  const preferredTheme = getPreferredTheme();
  setTheme(preferredTheme);
};