import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log('Form submitted:', formData)
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Log In' : 'Sign Up'} - Humanizer Pro</title>
        <meta name="description" content="Access your Humanizer Pro account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
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

            {/* Back to Home */}
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ← Back to Home
            </Link>
          </div>
        </header>

        {/* Auth Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '400px',
          marginTop: '4rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem'
            }}>
              {isLogin ? 'Sign in to your account' : 'Get started with Humanizer Pro'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
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
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
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

            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
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
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#10b981',
                  border: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              Or continue with
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{
                flex: 1,
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                🔍 Google
              </button>
              <button style={{
                flex: 1,
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                📘 Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
