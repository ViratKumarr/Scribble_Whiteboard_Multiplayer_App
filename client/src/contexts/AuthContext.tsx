import React, { createContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Get current user
          const response = await api.get('/api/auth/me');
          
          if (response.data.success) {
            setUser(response.data.data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear storage on error
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/api/auth/register', {
        username,
        email,
        password
      });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Clear axios headers
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};