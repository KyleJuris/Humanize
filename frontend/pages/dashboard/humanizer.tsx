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
  const [isLoggedIn, setIsLoggedIn] = useState(true) // This would come from auth context in real app
  const [projects, setProjects] = useState([
    { id: 1, name: 'Academic Paper', lastModified: '2 hours ago', category: 'academic' },
    { id: 2, name: 'Marketing Copy', lastModified: '1 day ago', category: 'marketing' },
    { id: 3, name: 'Blog Post', lastModified: '3 days ago', category: 'blog' },
    { id: 4, name: 'Email Campaign', lastModified: '1 week ago', category: 'marketing' },
  ])
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [newProjectName, setNewProjectName] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

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

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName,
        lastModified: 'Just now',
        category: 'general'
      }
      setProjects([newProject, ...projects])
      setNewProjectName('')
    }
  }

  const handleRenameProject = (id: string, newName: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, name: newName } : p))
    setEditingProject(null)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id))
    setShowDeleteConfirm(null)
  }

  const filteredProjects = filterCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === filterCategory)

  return (
    <>
      <Head>
        <title>Humanizer - Humanizer Pro</title>
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

            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <Link href="/dashboard/humanizer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>Humanizer</Link>
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
                    cursor: 'pointer'
                  }}>
                    Sign In
                  </button>
                </Link>
              )}
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
            
            {/* New Project */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="New project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  style={{
                    backgroundColor: newProjectName.trim() ? '#10b981' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: newProjectName.trim() ? 'pointer' : 'not-allowed',
                    minWidth: '40px'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Filter by Category
              </label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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
                <option value="all">All Projects</option>
                <option value="academic">Academic</option>
                <option value="marketing">Marketing</option>
                <option value="blog">Blog</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Projects List */}
            <div style={{ marginBottom: '2rem' }}>
              {filteredProjects.map((project) => (
                <div key={project.id} style={{
                  padding: '0.75rem',
                  backgroundColor: selectedProject === project.id ? '#f0f9ff' : '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  border: selectedProject === project.id ? '1px solid #10b981' : '1px solid #e5e7eb',
                  position: 'relative'
                }}
                onClick={() => setSelectedProject(project.id)}
                >
                  {editingProject === project.id ? (
                    <input
                      type="text"
                      defaultValue={project.name}
                      onBlur={(e) => handleRenameProject(project.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameProject(project.id, e.currentTarget.value)
                        }
                      }}
                      style={{
                        width: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: '#1f2937',
                        outline: 'none',
                        marginBottom: '0.25rem'
                      }}
                      autoFocus
                    />
                  ) : (
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {project.name}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {project.lastModified}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.25rem'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingProject(project.id)
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '0.25rem'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteConfirm(project.id)
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '0.25rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === project.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 10
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '0.5rem' }}>
                        Delete "{project.name}"?
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProject(project.id)
                          }}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDeleteConfirm(null)
                          }}
                          style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
              </div>

              {/* Settings */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
                    Tone
                  </label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '0.4rem',
                      fontSize: '0.8rem',
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

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.25rem', color: '#374151' }}>
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
                      height: '4px',
                      borderRadius: '2px',
                      background: '#e5e7eb',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginTop: '0.2rem' }}>
                    <span>Subtle</span>
                    <span>Strong</span>
                  </div>
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
