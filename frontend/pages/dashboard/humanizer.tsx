import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../lib/api'

export default function HumanizerPage() {
  const { user, isAuthenticated } = useAuth()
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [intensity, setIntensity] = useState(50)
  const [tone, setTone] = useState('neutral')
  const [activeTab, setActiveTab] = useState('output')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Fetch user projects on component mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects()
    }
  }, [isAuthenticated, user])

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true)
      const response = await api.getProjects()
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Fallback to empty array if API fails
      setProjects([])
    } finally {
      setLoadingProjects(false)
    }
  }

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

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      try {
        const projectData = {
          title: newProjectName.trim(),
          input_text: inputText,
          output_text: outputText,
          intensity: intensity,
          tone: tone
        }
        const response = await api.createProject(projectData)
        setProjects([response.project, ...projects])
        setNewProjectName('')
      } catch (error) {
        console.error('Error creating project:', error)
        // Fallback to local state if API fails
        const newProject = {
          id: Date.now(),
          title: newProjectName.trim(),
          created_at: new Date().toISOString(),
          category: 'general'
        }
        setProjects([newProject, ...projects])
        setNewProjectName('')
      }
    }
  }

  const handleRenameProject = async (id: number, newName: string) => {
    try {
      await api.updateProject(id, { title: newName })
      setProjects(projects.map(p => p.id === id ? { ...p, title: newName } : p))
      setEditingProject(null)
    } catch (error) {
      console.error('Error renaming project:', error)
      // Fallback to local state if API fails
      setProjects(projects.map(p => p.id === id ? { ...p, title: newName } : p))
      setEditingProject(null)
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await api.deleteProject(id)
      setProjects(projects.filter(p => p.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      // Fallback to local state if API fails
      setProjects(projects.filter(p => p.id !== id))
      setShowDeleteConfirm(null)
    }
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
      
      <ProtectedRoute>
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <Header currentPage="humanizer" />

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
                      defaultValue={project.title}
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
                      {project.title}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Recently'}
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
                        Delete "{project.title}"?
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
              border: '2px solid rgba(0,0,0,0.1)',
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
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                alignItems: 'center',
                maxWidth: '500px'
              }}>
                <div style={{ width: '120px' }}>
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

                <div style={{ flex: 1, minWidth: '200px' }}>
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
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${intensity}%, #e5e7eb ${intensity}%, #e5e7eb 100%)`,
                      outline: 'none',
                      cursor: 'pointer',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                  <style jsx>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #10b981;
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input[type="range"]::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #10b981;
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                  `}</style>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
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
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    backgroundColor: inputText ? 'white' : '#f9fafb',
                    boxSizing: 'border-box'
                  }}
                />
                
                {!inputText && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100%'
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
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb'
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
      </ProtectedRoute>
    </>
  )
}
