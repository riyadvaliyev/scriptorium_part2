// src/pages/index.tsx
import React from 'react';
import Navbar from '../components/Shared/Navbar';
import SearchBar from '../components/Landing Page/SearchBar';
import FeaturedSection from '../components/Landing Page/FeaturedSection';

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <SearchBar />
        <FeaturedSection />
      </div>
    </div>
  );
};

export default LandingPage;


