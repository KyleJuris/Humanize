import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { handleAuthCallback } = useAuth()
  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get the token from URL hash or query params
        const hash = window.location.hash
        const urlParams = new URLSearchParams(window.location.search)
        
        let token = null
        
        // Check URL hash first (Supabase typically puts token in hash)
        if (hash.includes('access_token=')) {
          const hashParams = new URLSearchParams(hash.substring(1))
          token = hashParams.get('access_token')
        }
        
        // Check query params as fallback
        if (!token) {
          token = urlParams.get('access_token')
        }

        if (!token) {
          throw new Error('No authentication token found in URL')
        }

        setStatus('processing')
        setMessage('Completing authentication...')

        // Handle the auth callback
        const user = await handleAuthCallback(token)
        
        if (user) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          // Redirect to dashboard after successful auth
          setTimeout(() => {
            router.push('/dashboard/humanizer')
          }, 1500)
        } else {
          throw new Error('Failed to authenticate user')
        }

      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Authentication failed. Please try again.')
        
        // Redirect to auth page after error
        setTimeout(() => {
          router.push('/auth')
        }, 3000)
      }
    }

    handleAuth()
  }, [handleAuthCallback, router])

  return (
    <>
      <Head>
        <title>Authentication - Humanizer Pro</title>
        <meta name="description" content="Completing your authentication" />
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
            backgroundColor: status === 'processing' ? '#fbbf24' : status === 'success' ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            {status === 'processing' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h1>

          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          {status === 'processing' && (
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

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  )
}
