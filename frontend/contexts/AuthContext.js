import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { supabase } from '../lib/supabase';

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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in:', session.user.email);
          api.setToken(session.access_token);
          
          try {
            const userData = await api.getCurrentUser();
            setUser(userData.user);
          } catch (error) {
            console.error('Failed to get user data:', error);
            // Fallback to Supabase user data
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...session.user.user_metadata
            });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setUser(null);
          api.removeToken();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed for:', session.user.email);
          api.setToken(session.access_token);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      
      // First check if we have a Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Supabase session error:', error);
        api.removeToken();
        setLoading(false);
        return;
      }

      if (session) {
        console.log('✅ Supabase session found for user:', session.user.email);
        // Set the token in our API client
        api.setToken(session.access_token);
        
        // Get user data from our backend
        try {
          const userData = await api.getCurrentUser();
          setUser(userData.user);
          console.log('✅ User data loaded:', userData.user);
        } catch (apiError) {
          console.error('API user data error:', apiError);
          // Fallback to Supabase user data
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          });
        }
      } else {
        console.log('❌ No Supabase session found');
        // Check if we have a token in localStorage as fallback
        const token = api.getToken();
        if (token) {
          try {
            const userData = await api.getCurrentUser();
            setUser(userData.user);
            console.log('✅ User data loaded from token:', userData.user);
          } catch (error) {
            console.error('Token-based auth failed:', error);
            api.removeToken();
          }
        }
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
      console.log('🚪 Signing out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
      }
      
      // Sign out from our API
      await api.signOut();
      
      // Clear local state
      setUser(null);
      api.removeToken();
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Still clear local state even if API call fails
      setUser(null);
      api.removeToken();
    }
  };

  const handleAuthCallback = async (token) => {
    try {
      console.log('🔐 Setting token:', token ? 'Token received' : 'No token');
      api.setToken(token);
      
      console.log('👤 Getting current user...');
      const userData = await api.getCurrentUser();
      console.log('👤 User data received:', userData);
      
      if (userData && userData.user) {
        setUser(userData.user);
        console.log('✅ User set in context:', userData.user);
        return userData.user;
      } else {
        throw new Error('No user data received from API');
      }
    } catch (error) {
      console.error('❌ Auth callback failed:', error);
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
