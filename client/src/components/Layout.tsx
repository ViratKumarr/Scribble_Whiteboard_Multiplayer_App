import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout component that wraps all pages with common elements
 */
const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;