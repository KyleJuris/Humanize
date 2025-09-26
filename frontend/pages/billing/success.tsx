import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import api from '../../lib/api';

export default function BillingSuccessPage() {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // You could fetch session details here if needed
      // For now, we'll just show success
      setLoading(false);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Payment Successful - Humanizer Pro</title>
        <meta name="description" content="Your subscription has been successfully activated" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <Header currentPage="billing" />

        <main style={{ 
          padding: '3rem 2rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem 2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            {error ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  border: '2px solid #fecaca'
                }}>
                  <span style={{ fontSize: '2rem', color: '#dc2626' }}>❌</span>
                </div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  marginBottom: '1rem'
                }}>
                  Payment Error
                </h1>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}>
                  {error}
                </p>
              </>
            ) : (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  border: '2px solid #10b981'
                }}>
                  <span style={{ fontSize: '2rem', color: '#10b981' }}>✅</span>
                </div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Payment Successful!
                </h1>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}>
                  Welcome to Humanizer Pro! Your subscription has been activated and you now have access to all premium features.
                </p>
                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '2rem'
                }}>
                  <p style={{
                    color: '#1e40af',
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    💡 A confirmation email has been sent to your registered email address with your subscription details.
                  </p>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard/humanizer">
                <button style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}>
                  Start Humanizing
                </button>
              </Link>
              
              <Link href="/pricing">
                <button style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}>
                  View Plans
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
