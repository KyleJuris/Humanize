import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = api.getToken();
      if (token) {
        const userData = await api.getCurrentUser();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email) => {
    try {
      console.log('Attempting signup for:', email);
      const result = await api.signUp(email);
      console.log('Signup result:', result);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email) => {
    try {
      console.log('Attempting signin for:', email);
      const result = await api.signIn(email);
      console.log('Signin result:', result);
      return result;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      // Still clear local state even if API call fails
      setUser(null);
    }
  };

  const handleAuthCallback = async (token) => {
    try {
      api.setToken(token);
      const userData = await api.getCurrentUser();
      setUser(userData.user);
      return userData.user;
    } catch (error) {
      console.error('Auth callback failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    handleAuthCallback,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
