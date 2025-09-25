import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        await signIn(email)
        setMessage('Magic link sent to your email! Check your inbox and click the link to sign in.')
      } else {
        await signUp(email)
        setMessage('Magic link sent to your email! Check your inbox and click the link to complete signup.')
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} - Humanizer Pro</title>
        <meta name="description" content="Access your Humanizer Pro account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#10b981',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                📝
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                Humanizer Pro
              </span>
            </Link>

            {/* Centered Navigation */}
            <nav style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <Link href="/dashboard/humanizer" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Humanizer</Link>
              <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
              <Link href="/contact" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</Link>
              <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</Link>
            </nav>

            {/* User Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/auth">
                <button style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Auth Form Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          minHeight: 'calc(100vh - 80px)'
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
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {isLogin ? 'Sign in to continue to Humanizer Pro' : 'Sign up to get started with Humanizer Pro'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {isLoading ? 'Sending...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>

            {message && (
              <div style={{
                backgroundColor: message.includes('error') || message.includes('Error') ? '#fef2f2' : '#f0f9ff',
                border: `1px solid ${message.includes('error') || message.includes('Error') ? '#fecaca' : '#e0f2fe'}`,
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: message.includes('error') || message.includes('Error') ? '#dc2626' : '#0369a1'
              }}>
                {message}
              </div>
            )}

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #e0f2fe',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontSize: '1.2rem' }}>📧</div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0c4a6e' }}>
                  Magic Link Authentication
                </span>
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: '#0369a1',
                margin: 0,
                lineHeight: '1.4'
              }}>
                We'll send you a secure link to your email. Click the link to sign in instantly - no password required!
              </p>
            </div>

          </form>
        </div>
        </div>
      </div>
    </>
  )
}