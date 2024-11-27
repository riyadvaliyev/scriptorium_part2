import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle'; // Import the ThemeToggle component
import { ThemeContext } from './ThemeProvider'; // Import ThemeContext to conditionally style the Navbar

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      className={`py-4 px-6 flex justify-between items-center ${
        isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
      }`} // Conditionally style Navbar based on theme
    >
      <div className="text-xl font-bold">
        <Link href="/" className="hover:underline">
          Scriptorium
        </Link>
      </div>
      <div className="space-x-4 flex items-center">
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




