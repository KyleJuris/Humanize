import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HumanizerPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [intensity, setIntensity] = useState(50)
  const [tone, setTone] = useState('neutral')
  const [activeTab, setActiveTab] = useState('output')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
  }

  const handleHumanize = async () => {
    if (!inputText.trim()) return
    
    setIsProcessing(true)
    try {
      // TODO: Connect to backend API
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText,
          intensity: intensity,
          tone: tone
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setOutputText(data.humanizedText)
      } else {
        // Fallback for now
        setOutputText(inputText + ' (Humanized by AI)')
      }
    } catch (error) {
      console.error('Error humanizing text:', error)
      setOutputText(inputText + ' (Humanized by AI)')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
    } catch (error) {
      console.error('Failed to paste text:', error)
    }
  }

  const projects = [
    { id: 1, name: 'Academic Paper', lastModified: '2 hours ago' },
    { id: 2, name: 'Marketing Copy', lastModified: '1 day ago' },
    { id: 3, name: 'Blog Post', lastModified: '3 days ago' },
    { id: 4, name: 'Email Campaign', lastModified: '1 week ago' },
  ]

  return (
    <>
      <Head>
        <title>Humanizer - Natural Write</title>
        <meta name="description" content="Humanize AI text with advanced settings" />
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
                Natural Write
              </span>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/humanizer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>Humanizer</Link>
              <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontSize: '0.95rem' }}>Blog</Link>
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
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <div style={{
            width: '280px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRight: '1px solid rgba(0,0,0,0.1)',
            padding: '2rem 1rem',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
              Your Projects
            </h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <button style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}>
                + New Project
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              {projects.map((project) => (
                <div key={project.id} style={{
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {project.lastModified}
                  </div>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Settings
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Tone
                </label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="casual">Casual</option>
                  <option value="neutral">Neutral</option>
                  <option value="marketing">Marketing</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                  Intensity: {intensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e5e7eb',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  <span>Subtle</span>
                  <span>Strong</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, padding: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              minHeight: '600px'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#374151', fontSize: '1.1rem', fontWeight: '600' }}>
                  Your Text
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>✨</span>
                  <select style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#374151',
                    backgroundColor: 'white'
                  }}>
                    <option>Default</option>
                    <option>Academic</option>
                    <option>Creative</option>
                    <option>Professional</option>
                  </select>
                </div>
              </div>

              {/* Text Area */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <textarea
                  value={inputText}
                  onChange={handleTextChange}
                  placeholder="Paste your text here..."
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    backgroundColor: inputText ? 'white' : '#f9fafb'
                  }}
                />
                
                {!inputText && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={handlePasteText}
                      style={{
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      📋 Paste Text
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  {wordCount} / 500 words
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ✨ Check for AI
                  </button>
                  <button
                    onClick={handleHumanize}
                    disabled={!inputText.trim() || isProcessing}
                    style={{
                      backgroundColor: inputText.trim() ? '#10b981' : '#d1d5db',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isProcessing ? '⏳ Processing...' : '✨ Humanize'}
                  </button>
                </div>
              </div>

              {/* Output Tabs */}
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  {['Output', 'Versions', 'AI Detection'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      style={{
                        padding: '0.75rem 1rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: activeTab === tab.toLowerCase() ? '#10b981' : '#6b7280',
                        fontWeight: activeTab === tab.toLowerCase() ? '600' : '500',
                        cursor: 'pointer',
                        borderBottom: activeTab === tab.toLowerCase() ? '2px solid #10b981' : '2px solid transparent'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ minHeight: '200px' }}>
                  {activeTab === 'output' && (
                    <div>
                      {outputText ? (
                        <div style={{
                          padding: '1rem',
                          backgroundColor: '#f0f9ff',
                          borderRadius: '8px',
                          border: '1px solid #e0f2fe'
                        }}>
                          <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Humanized Text:</h4>
                          <p style={{ color: '#1f2937', lineHeight: '1.6' }}>{outputText}</p>
                        </div>
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          color: '#6b7280',
                          padding: '2rem'
                        }}>
                          Your humanized text will appear here
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'versions' && (
                    <div style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      padding: '2rem'
                    }}>
                      Different versions of your text will be shown here
                    </div>
                  )}

                  {activeTab === 'ai detection' && (
                    <div style={{
                      textAlign: 'center',
                      color: '#6b7280',
                      padding: '2rem'
                    }}>
                      AI detection results will be displayed here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
