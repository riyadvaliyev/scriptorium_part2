// src/pages/TestTheme.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../components/Shared/ThemeProvider';

const TestTheme: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return <p>Error: ThemeContext not found. Make sure ThemeProvider is wrapping the app.</p>;
  }

  const { isDarkMode, toggleTheme } = themeContext;

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
      }`}
    >
      <h1 className="text-3xl font-bold">Test Theme Toggle</h1>
      <p className="mt-4">The current theme is {isDarkMode ? 'Dark' : 'Light'}.</p>
      <button
        onClick={toggleTheme}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default TestTheme;