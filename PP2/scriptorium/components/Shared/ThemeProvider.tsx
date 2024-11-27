// src/themes/ThemeProvider.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the window object is available (client-side)
    if (typeof window !== 'undefined') {
      // Read the theme from localStorage if available
      const storedTheme = localStorage.getItem('isDarkMode');
      const initialTheme = storedTheme ? JSON.parse(storedTheme) : false;
      setIsDarkMode(initialTheme);

      // Sync the body background color with the theme
      document.body.style.backgroundColor = initialTheme ? '#1a202c' : '#ffffff';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (typeof window !== 'undefined') {
      // Save the theme preference to localStorage
      localStorage.setItem('isDarkMode', JSON.stringify(newTheme));
    }

    // Update the body background color based on the theme
    document.body.style.backgroundColor = newTheme ? '#1a202c' : '#ffffff';
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
