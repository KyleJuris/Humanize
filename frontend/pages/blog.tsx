import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog - Humanizer Pro</title>
        <meta name="description" content="Latest insights on AI text humanization" />
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
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255,255,255,0.9)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/dashboard/humanizer" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Humanizer</Link>
              <Link href="/blog" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>Blog</Link>
              <Link href="/contact" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</Link>
              <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</Link>
            </nav>

            {/* User Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                Log In
              </button>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                🔄
              </div>
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
                K
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Blog
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Latest insights on AI text humanization and content creation
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map((post) => (
              <div key={post} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '1.1rem'
                }}>
                  Blog Image {post}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Blog Post Title {post}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  This is a placeholder for the blog post excerpt. It would contain a brief summary of the article content.
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    {post} days ago
                  </span>
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
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
