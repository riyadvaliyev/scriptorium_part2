// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in based on the accessToken
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // If token exists, the user is logged in
  }, []);

  const handleLogout = () => {
    // Clear tokens and redirect to home
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home after logout
  };

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard'); // Redirect to Dashboard if logged in
    } else {
      router.push('/login'); // Redirect to Login if not logged in
    }
  };

  return (
    <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/" className="hover:underline">
          Scriptorium
        </Link>
      </div>
      <div className="space-x-4">
        <Link href="/blog" className="hover:underline">
          Blog Posts
        </Link>
        <Link href="/templates" className="hover:underline">
          Code Templates
        </Link>
        <Link href="/editor" className="hover:underline">
          Code Editor
        </Link>
        <button className="hover:underline" onClick={handleDashboardClick}>
          Dashboard
        </button>
        {isLoggedIn ? (
          <button className="hover:underline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




