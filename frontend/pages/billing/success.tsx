import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import api from '../../lib/api';

const BillingSuccess: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Wait until Next.js has hydrated the router (very important)
    if (!router.isReady) return;

    if (typeof session_id === 'string' && session_id.length > 0) {
      // Validate the session status with Stripe
      const validateSession = async () => {
        try {
          setLoading(true);
          setError(null); // clear any earlier "No session ID" or transient errors
          console.log('Validating session:', session_id);
          const sessionData = await api.getSessionStatus(session_id as string);
          console.log('Session data received:', sessionData);

          // Accept either 'complete' (session) or 'paid' (payment status)
          const ok =
            sessionData?.status === 'complete' ||
            sessionData?.payment_status === 'paid';

          if (ok) {
            setSessionData(sessionData);
            setIsComplete(true);
          } else {
            console.log('Payment not complete, status:', sessionData.status);
            setError(`Payment status: ${sessionData.status}`);
          }
        } catch (error: any) {
          console.error('Error validating session:', error);
          setError(error.message || 'Failed to validate payment');
        } finally {
          setLoading(false);
        }
      };

      validateSession();
    } else {
      // Router is ready but no session id in URL
      setLoading(false);
      setError('No session ID provided');
    }
  }, [router.isReady, session_id]);

  // Auto-redirect to humanizer after 5 seconds
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        router.push('/dashboard/humanizer');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isComplete, router]);

  return (
    <>
      <Head>
        <title>Payment Successful - Humanizer Pro</title>
        <meta name="description" content="Your payment has been processed successfully" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            backgroundColor: loading ? '#fbbf24' : error ? '#ef4444' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {loading && '⏳'}
            {!loading && !error && '✅'}
            {error && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            {loading && 'Processing Payment...'}
            {!loading && !error && 'Payment Successful!'}
            {error && 'Payment Failed'}
          </h1>

          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            {loading && 'Please wait while we confirm your payment...'}
            {!loading && !error && `Thank you for subscribing! Your payment has been processed successfully and your subscription is now active.${sessionData?.customer_email ? ` A confirmation email will be sent to ${sessionData.customer_email}.` : ''}`}
            {error && 'There was an issue processing your payment. Please contact support if this continues.'}
          </p>

          {loading && (
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          )}

          {!loading && !error && (
            <div style={{ marginTop: '2rem' }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                Redirecting to humanizer in 5 seconds...
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link 
                  href="/dashboard/humanizer"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  Go to Humanizer
                </Link>
                
                <Link 
                  href="/pricing"
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  View Plans
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '2rem' }}>
              <Link 
                href="/pricing"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center'
                }}
              >
                Try Again
              </Link>
            </div>
          )}

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default BillingSuccess;