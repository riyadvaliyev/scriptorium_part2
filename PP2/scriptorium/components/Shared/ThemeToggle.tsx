import React, { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const ThemeToggle: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null; // Context should be provided by a ThemeProvider
  }

  const { isDarkMode, toggleTheme } = themeContext;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-800 text-white rounded"
      aria-label={isDarkMode ? "Activate light mode" : "Activate dark mode"}
    >
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
