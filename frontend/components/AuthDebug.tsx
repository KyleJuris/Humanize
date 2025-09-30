import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { getSupabase } from '../lib/supabaseClient';

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  const runDebug = async () => {
    const info: any = {};
    
    try {
      // Check localStorage token
      const token = localStorage.getItem('auth_token');
      info.localStorageToken = token ? `${token.substring(0, 20)}...` : 'No token';
      
      // Check Supabase session
      const supabase = getSupabase();
      const { data: { session }, error } = await supabase.auth.getSession();
      info.supabaseSession = session ? 'Found' : 'Not found';
      info.supabaseError = error?.message || 'None';
      
      if (session) {
        info.sessionUser = session.user.email;
        info.sessionExpires = new Date(session.expires_at * 1000).toISOString();
        info.sessionToken = session.access_token ? `${session.access_token.substring(0, 20)}...` : 'No token';
      }
      
      // Check API token
      const apiToken = api.getToken();
      info.apiToken = apiToken ? `${apiToken.substring(0, 20)}...` : 'No token';
      
      // Test API call
      try {
        const userData = await api.getCurrentUser();
        info.apiTest = 'Success';
        info.apiUser = userData.user.email;
      } catch (apiError: any) {
        info.apiTest = 'Failed';
        info.apiError = apiError.message;
      }
      
      setDebugInfo(info);
    } catch (error: any) {
      setDebugInfo({ error: error.message });
    }
  };

  const testProjectsAPI = async () => {
    try {
      setTestResult('Testing...');
      const projects = await api.getProjects();
      setTestResult(`Success: Found ${projects.projects?.length || 0} projects`);
    } catch (error: any) {
      setTestResult(`Failed: ${error.message}`);
    }
  };

  useEffect(() => {
    runDebug();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '400px',
      fontSize: '0.8rem',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Auth Debug</h4>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Auth Context:</strong><br />
        User: {user?.email || 'None'}<br />
        Authenticated: {isAuthenticated ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Tokens:</strong><br />
        LocalStorage: {debugInfo.localStorageToken || 'Loading...'}<br />
        API Token: {debugInfo.apiToken || 'Loading...'}<br />
        Supabase Token: {debugInfo.sessionToken || 'Loading...'}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Session:</strong><br />
        Supabase: {debugInfo.supabaseSession || 'Loading...'}<br />
        User: {debugInfo.sessionUser || 'None'}<br />
        Expires: {debugInfo.sessionExpires || 'None'}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>API Test:</strong><br />
        Status: {debugInfo.apiTest || 'Loading...'}<br />
        User: {debugInfo.apiUser || 'None'}<br />
        Error: {debugInfo.apiError || 'None'}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Projects API:</strong><br />
        <button 
          onClick={testProjectsAPI}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            cursor: 'pointer'
          }}
        >
          Test Projects API
        </button>
        <div style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
          {testResult}
        </div>
      </div>
      
      <button 
        onClick={runDebug}
        style={{
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          cursor: 'pointer'
        }}
      >
        Refresh Debug
      </button>
    </div>
  );
};

export default AuthDebug;
