import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - Humanizer Pro</title>
        <meta name="description" content="Choose the perfect plan for your needs" />
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
              <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
              <Link href="/contact" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</Link>
              <Link href="/pricing" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>Pricing</Link>
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
              Simple, Transparent Pricing
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Choose the perfect plan for your content humanization needs
            </p>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Free Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Most Popular
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Free
              </h3>
              
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#10b981',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                $0
                <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ 1,000 words/month
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Basic humanization
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Standard tones
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Email support
                </li>
              </ul>
              
              <button style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Pro
              </h3>
              
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#10b981',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                $19
                <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ 50,000 words/month
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Advanced humanization
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ All tone options
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Priority support
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ API access
                </li>
              </ul>
              
              <button style={{
                width: '100%',
                backgroundColor: '#1f2937',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Choose Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                Enterprise
              </h3>
              
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#10b981',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                Custom
                <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Unlimited words
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Custom models
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ White-label solution
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ Dedicated support
                </li>
                <li style={{ padding: '0.5rem 0', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✅ On-premise deployment
                </li>
              </ul>
              
              <button style={{
                width: '100%',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Contact Sales
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Frequently Asked Questions
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Can I change plans anytime?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  What happens to unused words?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Unused words don't roll over to the next month. Each plan resets monthly.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Is there a free trial?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Yes, all paid plans come with a 7-day free trial. No credit card required.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Do you offer refunds?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  We offer a 30-day money-back guarantee for all paid plans.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
