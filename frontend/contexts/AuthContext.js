import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { getSupabase } from '../lib/supabaseClient';

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
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const maxRefreshAttempts = 3;

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen for auth state changes

    // Listen for cross-tab session broadcasts
    const handleStorageChange = (e) => {
      if (e.key === 'supabase-auth-broadcast') {
        try {
          const data = JSON.parse(e.newValue)
          if (data.type === 'SIGNED_IN' && data.session) {
            console.log('🔄 Received session broadcast from another tab')
            api.setToken(data.session.access_token)
            setUser({
              id: data.session.user.id,
              email: data.session.user.email,
              ...data.session.user.user_metadata
            })
          }
        } catch (error) {
          console.error('Failed to parse session broadcast:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        console.log('🔄 Session details:', session ? {
          user: session.user?.email,
          expires_at: session.expires_at,
          refresh_token: session.refresh_token ? 'Present' : 'Missing'
        } : 'No session');
        
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
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed for:', session.user.email);
          api.setToken(session.access_token);
          setRefreshAttempts(0); // Reset refresh attempts on successful refresh
        } else if (event === 'INITIAL_SESSION') {
          console.log('🔄 Initial session event:', session ? 'Session found' : 'No session');
          if (session) {
            console.log('✅ Initial session for user:', session.user.email);
            api.setToken(session.access_token);
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...session.user.user_metadata
            });
            setRefreshAttempts(0); // Reset refresh attempts
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setUser(null);
          api.removeToken();
          setRefreshAttempts(0); // Reset refresh attempts
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔍 Initializing auth...');
      

      // Skip URL processing if not on callback page to prevent PKCE errors
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/callback')) {
        console.log('🔍 Not on callback page, checking for existing session...');
      }
      
      // Check if we have a persisted Supabase session
      const { data: { session }, error } = await getSupabase().auth.getSession();
      
      if (error) {
        console.error('Supabase session error:', error);
        // Don't remove token immediately, might be a temporary error
        console.warn('⚠️ Session error, but continuing...');
      }

      if (session) {
        console.log('✅ Supabase session found for user:', session.user.email);
        console.log('🔍 Session details:', {
          expires_at: session.expires_at,
          refresh_token: session.refresh_token ? 'Present' : 'Missing',
          access_token: session.access_token ? 'Present' : 'Missing'
        });
        
        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          console.warn('⚠️ Session expired, attempting refresh...');
          if (refreshAttempts < maxRefreshAttempts) {
            setRefreshAttempts(prev => prev + 1);
            try {
              const { data: refreshData, error: refreshError } = await getSupabase().auth.refreshSession();
              if (refreshError) {
                console.error('❌ Session refresh failed:', refreshError);
                api.removeToken();
                setUser(null);
                return;
              }
              if (refreshData.session) {
                console.log('✅ Session refreshed successfully');
                api.setToken(refreshData.session.access_token);
                setUser({
                  id: refreshData.session.user.id,
                  email: refreshData.session.user.email,
                  ...refreshData.session.user.user_metadata
                });
                setRefreshAttempts(0);
                return;
              }
            } catch (refreshError) {
              console.error('❌ Session refresh error:', refreshError);
            }
          } else {
            console.error('❌ Max refresh attempts reached, signing out');
            api.removeToken();
            setUser(null);
            return;
          }
        }
        
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
        } else {
          // Check for guest session in Supabase storage
          const { data: guestSession } = await getSupabase().auth.getSession()
          
          if (guestSession.session && guestSession.session.user?.user_metadata?.isGuest) {
            console.log('✅ Guest session found, setting guest user')
            setUser({
              id: guestSession.session.user.id,
              email: guestSession.session.user.email,
              isGuest: true,
              ...guestSession.session.user.user_metadata
            })
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Don't remove token on initialization failure
      console.warn('⚠️ Auth initialization failed, but continuing...');
    } finally {
      setLoading(false);
    }
  };


  const signUp = async (email) => {
    try {
      console.log('Attempting signup for:', email);
      const { data, error } = await getSupabase().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup result:', data);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email) => {
    try {
      console.log('Attempting signin for:', email);
      const { data, error } = await getSupabase().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Signin error:', error);
        throw error;
      }
      
      console.log('Signin result:', data);
      return data;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      
      // Sign out from Supabase
      const { error } = await getSupabase().auth.signOut();
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
