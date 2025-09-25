import React from 'react'
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Humanize Pro</title>
        <meta name="description" content="AI-powered content humanization tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem' 
          }}>
            Welcome to Humanize Pro
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#4b5563', 
            marginBottom: '2rem' 
          }}>
            Transform AI-generated content into natural, human-like text
          </p>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            padding: '1.5rem', 
            maxWidth: '42rem', 
            margin: '0 auto' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '1rem' 
            }}>
              ✅ Success! Pages Router Working
            </h2>
            <p style={{ color: '#4b5563' }}>
              Your Next.js application is now running successfully with the Pages Router!
              The build error has been resolved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}