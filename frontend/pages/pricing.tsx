import React from 'react'
import Head from 'next/head'
import Header from '../components/Header'

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
        <Header currentPage="pricing" />

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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
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
                cursor: 'pointer',
                marginTop: 'auto'
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
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
                cursor: 'pointer',
                marginTop: 'auto'
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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
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
                cursor: 'pointer',
                marginTop: 'auto'
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
