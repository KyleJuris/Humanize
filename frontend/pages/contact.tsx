import React from 'react'
import Head from 'next/head'
import Header from '../components/Header'

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - Humanizer Pro</title>
        <meta name="description" content="Get in touch with our team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <Header currentPage="contact" />

        {/* Main Content */}
        <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Contact Us
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Get in touch with our team for support, questions, or feedback
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Contact Form */}
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
                marginBottom: '1.5rem'
              }}>
                Send us a message
              </h3>
              
              <form>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Subject
                  </label>
                  <select style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us how we can help..."
                    rows={5}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
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
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1.5rem'
                }}>
                  Get in touch
                </h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>📧</div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>Email</div>
                      <div style={{ color: '#6b7280' }}>support@naturalwrite.com</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>💬</div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>Live Chat</div>
                      <div style={{ color: '#6b7280' }}>Available 24/7</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>⏰</div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>Response Time</div>
                      <div style={{ color: '#6b7280' }}>Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>

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
                  marginBottom: '1.5rem'
                }}>
                  FAQ
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                    How accurate is the humanization?
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Our AI achieves 99% success rate in bypassing detection tools.
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                    What file formats do you support?
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    We support text input, Word documents, and PDF files.
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Is my content secure?
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Yes, we use end-to-end encryption and never store your content.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
