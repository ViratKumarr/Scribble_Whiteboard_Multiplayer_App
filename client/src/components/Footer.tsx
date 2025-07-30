import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Scribble.io</h3>
          <p className="footer-description">
            A real-time collaborative whiteboard application that allows multiple users 
            to draw and interact simultaneously on a shared canvas.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <p>Email: info@scribble.io</p>
          <p>GitHub: <a href="https://github.com/ViratKumarr" target="_blank" rel="noopener noreferrer">github.com/ViratKumarr</a></p>
          <p>Portfolio: <a href="https://virat-portfolio-personal.vercel.app/" target="_blank" rel="noopener noreferrer">virat-portfolio-personal.vercel.app</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Scribble.io by Virat Kumarr. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;