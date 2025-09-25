import React from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage = '' }: HeaderProps) {
  const { user, isAuthenticated, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
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

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link 
            href="/dashboard/humanizer" 
            style={{ 
              color: currentPage === 'humanizer' ? '#10b981' : '#374151', 
              textDecoration: 'none', 
              fontSize: '0.95rem', 
              fontWeight: currentPage === 'humanizer' ? '600' : '500'
            }}
          >
            Humanizer
          </Link>
          <Link 
            href="/blog" 
            style={{ 
              color: currentPage === 'blog' ? '#10b981' : '#374151', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: currentPage === 'blog' ? '600' : '500'
            }}
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            style={{ 
              color: currentPage === 'contact' ? '#10b981' : '#374151', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: currentPage === 'contact' ? '600' : '500'
            }}
          >
            Contact
          </Link>
          <Link 
            href="/pricing" 
            style={{ 
              color: currentPage === 'pricing' ? '#10b981' : '#374151', 
              textDecoration: 'none', 
              fontSize: '0.95rem',
              fontWeight: currentPage === 'pricing' ? '600' : '500'
            }}
          >
            Pricing
          </Link>
        </nav>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
              <Link href="/dashboard/profile">
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
