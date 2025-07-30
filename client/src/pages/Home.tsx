import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Home page component
 */
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Scribble.io</h1>
          <p className="hero-description">
            A real-time collaborative whiteboard application that allows multiple users 
            to draw and interact simultaneously on a shared canvas.
          </p>
          {isAuthenticated ? (
            <Link to="/rooms" className="hero-button primary-button">
              Join a Room
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/login" className="hero-button primary-button">
                Login
              </Link>
              <Link to="/register" className="hero-button secondary-button">
                Register
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          {/* Placeholder for an illustration of the whiteboard app */}
          <div className="placeholder-image">Whiteboard Illustration</div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🖌️</div>
            <h3 className="feature-title">Real-time Collaboration</h3>
            <p className="feature-description">
              Draw and interact with others in real-time on a shared canvas.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Private Rooms</h3>
            <p className="feature-description">
              Create password-protected rooms for private collaboration.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Chat Functionality</h3>
            <p className="feature-description">
              Communicate with other users while collaborating on the whiteboard.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3 className="feature-title">Save & Share</h3>
            <p className="feature-description">
              Save your whiteboard sessions and share them with others.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="section-title">Ready to Start Collaborating?</h2>
        <p className="cta-description">
          Join Scribble.io today and experience the power of real-time collaboration.
        </p>
        {isAuthenticated ? (
          <Link to="/rooms" className="cta-button primary-button">
            Explore Rooms
          </Link>
        ) : (
          <Link to="/register" className="cta-button primary-button">
            Sign Up Now
          </Link>
        )}
      </section>

      <section className="creator-section">
        <h2 className="section-title">About the Creator</h2>
        <div className="creator-content">
          <p className="creator-description">
            Scribble.io was created by <strong>Virat Kumarr</strong>, a passionate developer focused on building collaborative web applications.
          </p>
          <div className="creator-links">
            <a href="https://github.com/ViratKumarr" target="_blank" rel="noopener noreferrer" className="creator-link">
              GitHub Profile
            </a>
            <a href="https://virat-portfolio-personal.vercel.app/" target="_blank" rel="noopener noreferrer" className="creator-link">
              Portfolio Website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;