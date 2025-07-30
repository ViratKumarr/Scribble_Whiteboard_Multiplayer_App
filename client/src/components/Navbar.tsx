import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar component for site navigation
 */
const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Scribble.io</span>
          <span className="logo-creator">by Virat Kumarr</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/rooms" className="nav-link" onClick={() => setMenuOpen(false)}>Rooms</Link>
              </li>
              <li className="nav-item">
                <span className="nav-user">Hello, {user?.username}</span>
              </li>
              <li className="nav-item">
                <button onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }} className="nav-button logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-button register-button" onClick={() => setMenuOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;