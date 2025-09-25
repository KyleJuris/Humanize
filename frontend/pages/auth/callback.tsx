import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { createClient } from '@supabase/supabase-js'

export default function AuthCallback() {
  const router = useRouter()
  const { handleAuthCallback } = useAuth()
  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus('processing')
        setMessage('Completing authentication...')

        // Create Supabase client
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxibkxddlgxufvqceqtn.supabase.co',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWJreGRkbGd4dWZ2cWNlcXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzgzNjMsImV4cCI6MjA3MzgxNDM2M30.placeholder'
        )

        // Handle the auth callback by processing the URL hash
        console.log('🔍 Current URL:', window.location.href)
        console.log('🔍 URL Hash:', window.location.hash)
        console.log('🔍 URL Search:', window.location.search)
        
        const { data, error } = await supabase.auth.getSession()
        console.log('🔍 Session data:', data)
        console.log('🔍 Session error:', error)

        if (error) {
          console.error('Session error:', error)
          throw new Error(`Session error: ${error.message}`)
        }

        if (!data.session) {
          // Try to get session from URL hash if no session exists
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          console.log('🔍 Hash params:', Object.fromEntries(hashParams))
          console.log('🔍 Access token:', accessToken ? 'Found' : 'Not found')
          console.log('🔍 Refresh token:', refreshToken ? 'Found' : 'Not found')
          
          if (accessToken && refreshToken) {
            // Set the session manually
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (sessionError) {
              throw new Error(`Session setup error: ${sessionError.message}`)
            }
            
            if (!sessionData.session) {
              throw new Error('Failed to establish session')
            }
            
            // Now handle the auth callback
            const user = await handleAuthCallback(sessionData.session.access_token)
            
            if (user) {
              setStatus('success')
              setMessage('Authentication successful! Redirecting to dashboard...')
              
              // Clear the URL hash
              window.history.replaceState({}, document.title, window.location.pathname)
              
              // Redirect to dashboard after successful auth
              setTimeout(() => {
                router.push('/dashboard/humanizer')
              }, 1500)
            } else {
              throw new Error('Failed to authenticate user')
            }
          } else {
            throw new Error('No active session found')
          }
        } else {
          // Session already exists, handle the auth callback
          const user = await handleAuthCallback(data.session.access_token)
          
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
