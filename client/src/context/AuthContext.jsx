import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getAuthToken, setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setAuthToken(null);
        }
      } catch (err) {
        console.warn('Auth token expired or invalid:', err.message);
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        setAuthToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const data = await api.post('/auth/register', formData);
      if (data.success) {
        setAuthToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
