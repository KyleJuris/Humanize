import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import SubscribeButton from '../components/SubscribeButton'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error' | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string>('')

  const handleSubscribe = (plan: 'pro' | 'ultra') => {
    if (!isAuthenticated) {
      // Redirect to auth page
      window.location.href = '/auth'
      return
    }
    // The SubscribeButton component will handle the rest
  }


  // Handle return from Stripe checkout
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      setPaymentStatus('loading');
      
      api.getSessionStatus(sessionId)
        .then((data) => {
          if (data.status === 'complete') {
            setPaymentStatus('success');
            setCustomerEmail(data.customer_email || '');
            // Clear URL parameters
            window.history.replaceState({}, document.title, '/pricing');
          } else {
            setPaymentStatus('error');
          }
        })
        .catch((error) => {
          console.error('Error checking session status:', error);
          setPaymentStatus('error');
        });
    }
  }, []);

  const plans = {
    basic: {
      name: 'Basic',
      monthlyPrice: 6.99,
      annualPrice: 4.99,
      words: '5,000 words per month',
      features: [
        '500 words per request',
        'Bypass all AI detectors (incl. Turnitin & GPTZero)',
        'Basic Humanization Engine',
        'Plagiarism-free',
        'Error-free rewriting',
        'Undetectable results',
        'Unlimited AI detection'
      ]
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 19.99,
      annualPrice: 14.99,
      words: '15,000 words per month',
      features: [
        '1,500 words per request',
        'My Writing Style',
        'Bypass all AI detectors (incl. Turnitin & GPTZero)',
        'Advanced Humanization Engine',
        'Plagiarism-free',
        'Error-free rewriting',
        'Undetectable results',
        'Unlimited AI detection',
        'Advanced Turnitin Bypass Engine',
        'Human-like results',
        'Unlimited grammar checks',
        'Fast mode'
      ]
    },
    ultra: {
      name: 'Ultra',
      monthlyPrice: 39.99,
      annualPrice: 29.99,
      words: '30,000 words per month',
      features: [
        '3,000 words per request',
        'My Writing Style',
        'Bypass all AI detectors (incl. Turnitin & GPTZero)',
        'Advanced Humanization Engine',
        'Plagiarism-free',
        'Error-free rewriting',
        'Undetectable results',
        'Unlimited AI detection',
        'Advanced Turnitin Bypass Engine',
        'Human-like results',
        'Unlimited grammar checks',
        'Fast mode',
        'Ultra-human writing output',
        'Priority support'
      ]
    }
  }

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

        {/* Payment Status Messages */}
        {paymentStatus === 'success' && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '1rem 2rem',
            margin: '2rem auto',
            maxWidth: '1200px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#065f46', margin: '0 0 0.5rem 0' }}>
              ✅ Payment Successful!
            </h3>
            <p style={{ color: '#065f46', margin: 0 }}>
              Welcome to Humanizer Pro! A confirmation email will be sent to {customerEmail}.
            </p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '1rem 2rem',
            margin: '2rem auto',
            maxWidth: '1200px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#dc2626', margin: '0 0 0.5rem 0' }}>
              ❌ Payment Failed
            </h3>
            <p style={{ color: '#dc2626', margin: 0 }}>
              There was an issue processing your payment. Please try again.
            </p>
          </div>
        )}

        {/* Main Content */}
        <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Flexible pricing plans for you
            </h1>
          </div>

          {/* Billing Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <span style={{
              color: billingCycle === 'monthly' ? '#1f2937' : '#6b7280',
              fontWeight: billingCycle === 'monthly' ? '600' : '400'
            }}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              style={{
                width: '60px',
                height: '30px',
                backgroundColor: billingCycle === 'annual' ? '#10b981' : '#d1d5db',
                border: 'none',
                borderRadius: '15px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: billingCycle === 'annual' ? '32px' : '2px',
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
            <span style={{
              color: billingCycle === 'annual' ? '#1f2937' : '#6b7280',
              fontWeight: billingCycle === 'annual' ? '600' : '400'
            }}>
              Annual
            </span>
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              SAVE 50%
            </span>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Basic Plan */}
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
                {plans.basic.name}
              </h3>
              
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '0.5rem'
              }}>
                Free
              </div>

              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                {plans.basic.words}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
                {plans.basic.features.map((feature, index) => (
                  <li key={index} style={{ 
                    padding: '0.5rem 0', 
                    color: '#374151', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#10b981', marginTop: '0.1rem' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 'auto',
                boxSizing: 'border-box'
              }}>
                Free
              </div>
            </div>

            {/* Pro Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '2px solid #10b981',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              transform: 'scale(1.05)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                MOST POPULAR
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                {plans.pro.name}
              </h3>
              
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '0.5rem'
              }}>
                ${billingCycle === 'annual' ? plans.pro.annualPrice : plans.pro.monthlyPrice}
                <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
              </div>

              {billingCycle === 'annual' && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    textDecoration: 'line-through',
                    color: '#6b7280',
                    fontSize: '1rem'
                  }}>
                    ${plans.pro.monthlyPrice}
                  </span>
                </div>
              )}

              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                {plans.pro.words}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
                {plans.pro.features.map((feature, index) => (
                  <li key={index} style={{ 
                    padding: '0.5rem 0', 
                    color: '#374151', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#10b981', marginTop: '0.1rem' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <SubscribeButton
                priceId="price_1SBQPvIxRGF259ZE76mXrkA4"
                planName="Pro"
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
                  marginTop: 'auto'
                }}
              >
                Subscribe
              </SubscribeButton>
            </div>

            {/* Ultra Plan */}
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
                {plans.ultra.name}
              </h3>
              
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '0.5rem'
              }}>
                ${billingCycle === 'annual' ? plans.ultra.annualPrice : plans.ultra.monthlyPrice}
                <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
              </div>

              {billingCycle === 'annual' && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    textDecoration: 'line-through',
                    color: '#6b7280',
                    fontSize: '1rem'
                  }}>
                    ${plans.ultra.monthlyPrice}
                  </span>
                </div>
              )}

              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                {plans.ultra.words}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
                {plans.ultra.features.map((feature, index) => (
                  <li key={index} style={{ 
                    padding: '0.5rem 0', 
                    color: '#374151', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#10b981', marginTop: '0.1rem' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <SubscribeButton
                priceId="price_1SBQOpIxRGF259ZEXgH7kuYV"
                planName="Ultra"
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
                  marginTop: 'auto'
                }}
              >
                Subscribe
              </SubscribeButton>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '2rem',
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
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll be charged or credited the difference.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  What happens to unused words?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Unused words don't roll over to the next month. Each plan resets monthly with your full word allocation.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Is there a free trial?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Yes, all paid plans come with a 7-day free trial. No credit card required to start.
                </p>
              </div>
              
              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Do you offer refunds?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  How does the AI detection bypass work?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Our advanced algorithms rewrite content to appear more human-like, bypassing detection tools like Turnitin, GPTZero, and others.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  What languages are supported?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Basic plan supports 20 languages, while Pro and Ultra plans support 50+ languages including English, Spanish, French, German, and more.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Can I cancel anytime?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  Is my data secure?
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Absolutely. We use enterprise-grade encryption and never store your content permanently. Your privacy is our priority.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Need more? Contact Us
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Looking for custom solutions or enterprise features? We're here to help.
            </p>
            <button style={{
              backgroundColor: '#10b981',
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

          {/* Terms */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            By clicking the Subscribe button, you agree to our Terms of Service and Privacy Policy.
          </div>
        </main>

      </div>
    </>
  )
}