import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import WhiteboardPage from './pages/Whiteboard';
import RoomsPage from './pages/Rooms';

// Pages (continued)
import NotFoundPage from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="rooms" element={
          <ProtectedRoute>
            <RoomsPage />
          </ProtectedRoute>
        } />
        <Route path="whiteboard/:roomId" element={
          <ProtectedRoute>
            <WhiteboardPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default App;