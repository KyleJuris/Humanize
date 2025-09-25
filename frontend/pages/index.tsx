import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
  const { user, signOut } = useAuth()
  return (
    <>
      <Head>
        <title>Humanizer Pro - AI Text Humanizer</title>
        <meta name="description" content="Humanize AI text instantly, bypass detectors with no risk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <Header currentPage="home" />

        {/* Main Content */}
        <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              Humanize AI Text, Start Free Today
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '3rem'
            }}>
              Bypass detectors instantly, no risk, no payment needed
            </p>
            <Link href="/dashboard/humanizer">
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '3rem',
                textDecoration: 'none'
              }}>
                Try for Free
              </button>
            </Link>
          </div>

          {/* Three-Step Process */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Step 1 */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                marginTop: '1rem'
              }}>
                Lightning Fast Processing
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Experience the power of our advanced AI engine that transforms your text in seconds, not minutes
              </p>
              
              {/* Lightning Speed Visual */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '8px',
                padding: '1.5rem',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '0.5rem'
                }}>
                  ⚡
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#0c4a6e',
                  marginBottom: '0.25rem'
                }}>
                  Instant Processing
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#0369a1'
                }}>
                  Transform text in seconds
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                marginTop: '1rem'
              }}>
                Undetectable Results
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Our cutting-edge technology ensures your content passes every AI detection tool with 99.9% success rate
              </p>
              
              {/* Undetectable Visual */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                padding: '1.5rem',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '0.5rem'
                }}>
                  🛡️
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#15803d',
                  marginBottom: '0.25rem'
                }}>
                  99.9% Undetectable
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#166534'
                }}>
                  Bypass all AI detectors
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              position: 'relative'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                marginTop: '1rem'
              }}>
                Professional Quality
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Get perfectly crafted content that maintains your original meaning while sounding completely natural and professional
              </p>
              
              {/* Professional Quality Visual */}
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '8px',
                padding: '1.5rem',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '0.5rem'
                }}>
                  ✨
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: '0.25rem'
                }}>
                  Professional Quality
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#a16207'
                }}>
                  Natural, human-like output
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Foundation Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            marginBottom: '4rem',
            alignItems: 'start'
          }}>
            {/* Left Side - Scientific Foundation */}
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                Built on Science, Powered by Precision
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#374151',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                Our advanced AI engine is trained on over 1.2 million samples of academic writing, essays, and AI-generated content. Using cutting-edge linguistic modeling, we analyze syntax patterns, tone variations, and word structures that are commonly flagged by modern detection systems.
              </p>
              <div style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    1.2M+
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Training Samples
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    99.9%
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Success Rate
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    50+
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Detection Tools
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - AI Detection Visual */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Tested Against All Major AI Detectors
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {['GPTZero', 'Turnitin', 'ZeroGPT', 'Copyleaks', 'QuillBot', 'Grammarly'].map((detector) => (
                  <div key={detector} style={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: '#0c4a6e'
                  }}>
                    ✅ {detector}
                  </div>
                ))}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                Our system is updated weekly to adapt to new detection methods
              </div>
            </div>
          </div>

          {/* Trusted by Users Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)',
            marginBottom: '4rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1.5rem'
            }}>
              Trusted by 350,000+ Writers Worldwide
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#374151',
              lineHeight: '1.7',
              marginBottom: '2rem',
              maxWidth: '800px',
              margin: '0 auto 2rem'
            }}>
              Students polish their writing to sound more natural, marketers improve content for better engagement and SEO, and businesses send emails that feel personal — not robotic. Humanizer Pro adapts to each use case, delivering clear, human-sounding text that reads like it was written by you.
            </p>
            
            {/* User Avatars */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {['👨‍💻', '👨‍🎨', '👩‍💼', '👨‍🎓', '👩‍🔬'].map((avatar, index) => (
                <div key={index} style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  border: '3px solid #10b981'
                }}>
                  {avatar}
                </div>
              ))}
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginLeft: '1rem'
              }}>
                350K+ Users
              </div>
            </div>

            {/* Use Cases */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Students</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Polish essays and assignments to sound more natural and academic</p>
              </div>
              <div style={{
                backgroundColor: '#f0fdf4',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #dcfce7'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Marketers</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Create engaging content that converts and ranks better in search</p>
              </div>
              <div style={{
                backgroundColor: '#fef3c7',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💼</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Businesses</h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Send emails and communications that feel personal and authentic</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          padding: '2rem 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            {/* Disclaimer */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Humanizer Pro is not a tool for academic dishonesty or cheating.{' '}
                <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>Read more</a>
              </p>
            </div>

            {/* Footer Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Product */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Product
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link href="/dashboard/humanizer" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Humanizer</Link>
                  <Link href="/pricing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</Link>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Earn with us</a>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>IP Checker</a>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>API</a>
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Resources
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link href="/blog" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</Link>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>FAQ</a>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Contact
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="mailto:hello.humanizerpro@gmail.com" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>
                    hello.humanizerpro@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                © 2025 Humanizer Pro
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
                <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Use</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}