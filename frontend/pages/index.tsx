import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context in real app
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
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255,255,255,0.95)',
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
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
            </Link>

            {/* Centered Navigation */}
            <nav style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <Link href="/dashboard/humanizer" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Humanizer</Link>
              <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
              <Link href="/contact" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Contact</Link>
              <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</Link>
            </nav>

            {/* User Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Sign Out
                  </button>
                  <Link href="/dashboard/profile">
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
                  </Link>
                </>
              ) : (
                <Link href="/auth">
                  <button style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}>
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </header>

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
              Humanize AI Writing in 3 Simple Steps
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '3rem'
            }}>
              Perfect for essays, assignments, blog posts and research papers
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
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '2rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                STEP 1
              </div>
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
              
              {/* Mock Input */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                minHeight: '120px'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Your Text
                </div>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  Paste your text here
                </div>
                <button style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📋 Paste Text
                </button>
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
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '2rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                STEP 2
              </div>
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
              
              {/* Mock Result */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Result
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.25rem'
                }}>
                  50%
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  HUMAN WRITTEN
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#fed7aa',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: '#f97316',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  <div style={{ marginBottom: '0.25rem' }}>✅ GPTZero ✅ OpenAI ✅ Writer</div>
                  <div>⚠️ Sapling ⚠️ Grammarly</div>
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
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '2rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                STEP 3
              </div>
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
              
              {/* Mock Button */}
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <button style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  ⭐ Humanize
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#1f2937',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white'
                  }}>
                    👆
                  </div>
                </button>
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
                Our rewriting engine is trained on over 1.2 million samples of academic writing, essays, and AI-generated text. Using advanced linguistic modeling, we analyze syntax, tone, and word patterns commonly flagged by detection systems.
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
                    99%
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

            {/* Right Side - Example Text */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              maxHeight: '400px',
              overflow: 'hidden'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Example: AI-Generated Text
              </h3>
              <div style={{
                fontSize: '0.95rem',
                color: '#374151',
                lineHeight: '1.6',
                maxHeight: '300px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <p style={{ marginBottom: '1rem' }}>
                  The rapid advancement of artificial intelligence (AI) has sparked a transformative shift across numerous domains, raising both unprecedented opportunities and complex ethical challenges. In particular, the integration of AI technologies into educational systems has altered the traditional dynamics of learning, assessment, and intellectual development.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  While AI-driven tools offer significant benefits—such as personalized learning, automated feedback, and data-driven instruction—they also introduce concerns regarding academic integrity, privacy, and the erosion of critical thinking skills. For instance, the use of AI text generators in student writing has prompted debates about authenticity and originality in academic work.
                </p>
                <p>
                  Educational institutions are now grappling with the challenge of maintaining academic standards while embracing technological innovation. This requires a delicate balance between leveraging AI's potential and preserving the fundamental values of education.
                </p>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50px',
                  background: 'linear-gradient(transparent, white)',
                  pointerEvents: 'none'
                }}></div>
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