import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { getSupabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const { handleAuthCallback } = useAuth()
  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('')

  const createGuestSession = async () => {
    try {
      console.log('🔧 Creating guest session fallback...')
      const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      
      // Create guest session object
      const guestSession = {
        access_token: guestToken,
        refresh_token: `refresh_${guestToken}`,
        token_type: 'bearer',
        expires_in: 86400, // 24 hours
        expires_at: expiresAt,
        user: {
          id: 'guest',
          email: 'guest@temp.com',
          user_metadata: { isGuest: true },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      
      // Set guest session in Supabase
      const { data: sessionData, error: sessionError } = await getSupabase().auth.setSession(guestSession)
      
      if (sessionError) {
        console.error('❌ Failed to set guest session:', sessionError)
        throw sessionError
      }
      
      console.log('✅ Guest session created successfully')
      setStatus('success')
      setMessage('Guest access granted. You can upgrade to full access anytime.')
      
      // Clear URL to prevent refresh loops
      window.history.replaceState({}, document.title, '/auth/callback')
      
      setTimeout(() => {
        router.push('/')
      }, 1500)
      
    } catch (error) {
      console.error('Guest session creation failed:', error)
      setStatus('error')
      setMessage('Authentication failed. Please try again.')
      
      setTimeout(() => {
        router.push('/auth')
      }, 3000)
    }
  }

  useEffect(() => {
    let isProcessing = false
    
    const handleAuth = async () => {
      if (isProcessing) {
        console.log('⚠️ Auth already processing, skipping...')
        return
      }
      
      isProcessing = true
      
      try {
        setStatus('processing')
        setMessage('Completing authentication...')


        console.log('🔍 Current URL:', window.location.href)
        console.log('🔍 URL Hash:', window.location.hash)
        console.log('🔍 URL Search:', window.location.search)

        // Check if we have auth code in the URL for PKCE flow
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        console.log('🔍 URL Parameters:', {
          code: code ? 'Present' : 'Missing',
          search: window.location.search
        })
        
        let sessionEstablished = false
        
        if (code) {
          console.log('✅ Found auth code in URL, exchanging for session...')
          
          // Exchange code for session using PKCE flow
          const { data: sessionData, error: sessionError } = await getSupabase().auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('❌ Failed to exchange code for session:', sessionError)
          } else if (sessionData.session) {
            console.log('✅ Session successfully exchanged for user:', sessionData.session.user.email)
            sessionEstablished = true
            
            // Broadcast session to other tabs
            window.localStorage.setItem('supabase-auth-broadcast', JSON.stringify({
              type: 'SIGNED_IN',
              session: sessionData.session
            }))
          }
        }
        
        // Ensure we always have a session (either real or guest)
        const { data: currentSession, error: sessionError } = await getSupabase().auth.getSession()
        
        if (!currentSession.session && !sessionEstablished) {
          console.log('⚠️ No session found, creating guest session...')
          await createGuestSession()
          return
        }
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          await createGuestSession()
          return
        }

        if (!currentSession.session) {
          console.log('⚠️ Session is null, creating guest session...')
          await createGuestSession()
          return
        }

        // Handle the auth callback with the session token
        console.log('🔐 Processing session for user:', currentSession.session.user.email)
        
        try {
          const user = await handleAuthCallback(currentSession.session.access_token)
          
          if (user) {
            setStatus('success')
            setMessage('Authentication successful! Redirecting to dashboard...')
            
            // Clear the URL hash to remove sensitive tokens
            window.history.replaceState({}, document.title, '/auth/callback')
            
            // Redirect to home after successful auth
            setTimeout(() => {
              router.push('/')
            }, 1500)
          } else {
            throw new Error('Failed to authenticate user')
          }
        } catch (callbackError) {
          console.error('Auth callback failed:', callbackError)
          await createGuestSession()
        }

      } catch (error) {
        console.error('Auth callback error:', error)
        await createGuestSession()
      } finally {
        isProcessing = false
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
