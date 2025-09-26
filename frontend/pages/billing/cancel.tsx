import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

export default function BillingCancelPage() {
  return (
    <>
      <Head>
        <title>Payment Cancelled - Humanizer Pro</title>
        <meta name="description" content="Your payment was cancelled" />
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
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              border: '2px solid #f59e0b'
            }}>
              <span style={{ fontSize: '2rem', color: '#f59e0b' }}>⚠️</span>
            </div>
            
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Payment Cancelled
            </h1>
            
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              No worries! Your payment was cancelled and no charges have been made. You can try again anytime or explore our free features.
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
                💡 You can still use our basic humanization features for free, or upgrade anytime to unlock premium features.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing">
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
                  Try Again
                </button>
              </Link>
              
              <Link href="/dashboard/humanizer">
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
                  Continue Free
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
