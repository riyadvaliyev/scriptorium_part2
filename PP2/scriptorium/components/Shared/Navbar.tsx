import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle'; // Import the ThemeToggle component
import { ThemeContext } from './ThemeProvider'; // Import ThemeContext to conditionally style the Navbar

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control hamburger menu visibility

  // Access the theme context
  const { isDarkMode } = useContext(ThemeContext) || {};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole'); // Assuming the role is stored locally after login
    console.log("role:", userRole);
    setIsLoggedIn(!!token);
    setIsAdmin(userRole === 'ADMIN');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav
      id="navbar"
      className={`py-4 px-6 flex justify-between items-center ${
        isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
      }`} // Conditionally style Navbar based on theme
    >
      {/* Logo on the left */}
      <div className="text-xl font-bold">
        <Link href="/" className="hover:underline">
          Scriptorium
        </Link>
      </div>

      {/* Hamburger Menu on small screens */}
      <div className="md:hidden flex items-center">
        <button
          id="hamburger-menu"
          className="text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div
        id="nav-links"
        className="space-x-4 flex items-center hidden md:flex"
      >
        <Link href="/blog" className="hover:underline">
          Blog Posts
        </Link>
        <Link href="/templates" className="hover:underline">
          Code Templates
        </Link>
        <Link href="/editor" className="hover:underline">
          Code Editor
        </Link>
        {isAdmin && (
          <Link href="/admin/reports" className="hover:underline">
            Admin Panel
          </Link>
        )}
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
        {/* Add the ThemeToggle button */}
        <ThemeToggle />
      </div>

      {/* Navigation Links for Small Screens */}
      <div
        id="nav-links-sm"
        className={`flex flex-col space-y-4 absolute top-0 right-0 w-full bg-blue-600 p-4 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <Link href="/blog" className="hover:underline">
          Blog Posts
        </Link>
        <Link href="/templates" className="hover:underline">
          Code Templates
        </Link>
        <Link href="/editor" className="hover:underline">
          Code Editor
        </Link>
        {isAdmin && (
          <Link href="/admin/reports" className="hover:underline">
            Admin Panel
          </Link>
        )}
        <button className="hover:underline text-left" onClick={handleDashboardClick}>
          Dashboard
        </button>
        {isLoggedIn ? (
          <button className="hover:underline text-left" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="hover:underline text-left">
              Login
            </Link>
            <Link href="/signup" className="hover:underline text-left">
              Signup
            </Link>
          </>
        )}
        {/* Add the ThemeToggle button */}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;





// // src/components/Navbar.tsx
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// const Navbar: React.FC = () => {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if the user is logged in based on the accessToken
//     const token = localStorage.getItem('accessToken');
//     setIsLoggedIn(!!token); // If token exists, the user is logged in
//   }, []);

//   const handleLogout = () => {
//     // Clear tokens and redirect to home
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userId');
//     setIsLoggedIn(false);
//     router.push('/'); // Redirect to home after logout
//   };

//   const handleDashboardClick = () => {
//     if (isLoggedIn) {
//       router.push('/dashboard'); // Redirect to Dashboard if logged in
//     } else {
//       router.push('/login'); // Redirect to Login if not logged in
//     }
//   };

//   return (
//     <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
//       <div className="text-xl font-bold">
//         <Link href="/" className="hover:underline">
//           Scriptorium
//         </Link>
//       </div>
//       <div className="space-x-4">
//         <Link href="/blog" className="hover:underline">
//           Blog Posts
//         </Link>
//         <Link href="/templates" className="hover:underline">
//           Code Templates
//         </Link>
//         <Link href="/editor" className="hover:underline">
//           Code Editor
//         </Link>
//         <button className="hover:underline" onClick={handleDashboardClick}>
//           Dashboard
//         </button>
//         {isLoggedIn ? (
//           <button className="hover:underline" onClick={handleLogout}>
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link href="/login" className="hover:underline">
//               Login
//             </Link>
//             <Link href="/signup" className="hover:underline">
//               Signup
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




