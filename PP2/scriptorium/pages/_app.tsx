// src/pages/_app.tsx
import React from 'react';
import '../styles/globals.css';
import { ThemeProvider } from '../components/Shared/ThemeProvider';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;