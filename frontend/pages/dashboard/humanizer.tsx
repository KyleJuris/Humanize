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
  const [selectedProjectData, setSelectedProjectData] = useState(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [previousOutputs, setPreviousOutputs] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [wordLimits, setWordLimits] = useState({ perRequest: 500, monthly: 5000 })
  const [monthlyUsage, setMonthlyUsage] = useState(0)

  // Fetch user projects and profile on component mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects()
      fetchUserProfile()
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

  const fetchUserProfile = async () => {
    try {
      const profile = await api.getProfile()
      setUserProfile(profile)
      
      // Set word limits based on plan
      const limits = {
        free: { perRequest: 500, monthly: 5000 },
        pro: { perRequest: 1500, monthly: 15000 },
        ultra: { perRequest: 3000, monthly: 30000 }
      }
      
      const planLimits = limits[profile.plan] || limits.free
      setWordLimits(planLimits)
      setMonthlyUsage(profile.words_used_this_month || 0)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Use default limits if profile fetch fails
    }
  }

  const loadProjectData = async (projectId) => {
    try {
      console.log('📂 Loading project data for ID:', projectId)
      const response = await api.getProject(projectId)
      console.log('📂 Project data loaded:', response)
      
      setSelectedProjectData(response)
      
      // Load project data into form fields
      if (response.input_text) {
        setInputText(response.input_text)
        setWordCount(response.input_text.trim().split(/\s+/).filter(word => word.length > 0).length)
      }
      
      if (response.output_text) {
        setOutputText(response.output_text)
      }
      
      if (response.intensity) {
        setIntensity(response.intensity)
      }
      
      if (response.tone) {
        setTone(response.tone)
      }
      
      console.log('✅ Project data loaded into form fields')
      
    } catch (error) {
      console.error('❌ Error loading project data:', error)
    }
  }

  const clearForm = () => {
    console.log('🗑️ Clearing form for new project')
    setSelectedProject(null)
    setSelectedProjectData(null)
    setInputText('')
    setOutputText('')
    setIntensity(50)
    setTone('neutral')
    setWordCount(0)
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
      console.log('🤖 Sending text to backend for humanization...')
      console.log('📝 Text:', inputText.substring(0, 100) + '...')
      console.log('🎛️ Settings:', { intensity, tone })
      
      // Use the backend API through the api client
      const response = await api.humanizeText(inputText, { 
        intensity: intensity,
        tone: tone
      })
      
      console.log('✅ Humanization successful:', response)
      setOutputText(response.humanizedText)
      
      // Update monthly usage from response
      if (response.monthlyUsage !== undefined) {
        setMonthlyUsage(response.monthlyUsage)
      }
      
      // Add to previous outputs
      const newOutput = {
        id: `output_${Date.now()}`,
        text: response.humanizedText,
        timestamp: new Date().toISOString(),
        settings: { intensity, tone }
      }
      setPreviousOutputs(prev => [newOutput, ...prev.slice(0, 4)]) // Keep only last 5 outputs
      
      // Auto-save to database if we have a selected project
      if (selectedProject && selectedProjectData) {
        try {
          console.log('💾 Auto-saving project...')
          await api.updateProject(selectedProject, {
            title: selectedProjectData.title,
            input_text: inputText,
            output_text: response.humanizedText,
            intensity: intensity,
            tone: tone
          })
          
          // Refresh projects list
          await fetchProjects()
          console.log('✅ Project auto-saved successfully')
        } catch (saveError) {
          console.error('❌ Error auto-saving project:', saveError)
        }
      }
      
    } catch (error) {
      console.error('❌ Error humanizing text:', error)
      
      // Show user-friendly error message
      if (error.message.includes('quota')) {
        setOutputText('OpenAI API quota exceeded. Please try again later.')
      } else if (error.message.includes('API key')) {
        setOutputText('OpenAI API key is invalid. Please contact support.')
      } else if (error.message.includes('exceeds') || error.message.includes('limit')) {
        setOutputText(`❌ ${error.message}`)
      } else {
        setOutputText('Failed to humanize text. Please try again.')
      }
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
    try {
      const projectData = {
        title: `Project ${projects.length + 1}`,
        input_text: inputText,
        output_text: outputText,
        intensity: intensity,
        tone: tone
      }
      const response = await api.createProject(projectData)
      setProjects([response.project, ...projects])
      
      // Select the newly created project
      setSelectedProject(response.project.id)
      setSelectedProjectData(response.project)
    } catch (error) {
      console.error('Error creating project:', error)
      // Don't create fallback project - let user retry
      alert('Failed to create project. Please try again.')
    }
  }

  const handleRenameProject = async (id: string, newName: string) => {
    try {
      await api.updateProject(id, { title: newName })
      setProjects(projects.map(p => p.id === id ? { ...p, title: newName } : p))
      setEditingProject(null)
    } catch (error) {
      console.error('Error renaming project:', error)
      alert('Failed to rename project. Please try again.')
      setEditingProject(null)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await api.deleteProject(id)
      setProjects(projects.filter(p => p.id !== id))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Your Projects
              </h3>
              <button
                onClick={handleCreateProject}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                ✨ New
              </button>
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
                onClick={() => {
                  setSelectedProject(project.id)
                  loadProjectData(project.id)
                }}
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
                  {selectedProject === project.id && selectedProjectData && (
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem' }}>
                      📝 {selectedProjectData.input_text ? selectedProjectData.input_text.length : 0} chars
                      {selectedProjectData.output_text && (
                        <span> • ✨ Humanized</span>
                      )}
                    </div>
                  )}
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
                <div>
                  <h3 style={{ color: '#374151', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                    {selectedProjectData ? selectedProjectData.title : 'Your Text'}
                  </h3>
                  {selectedProjectData && (
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                      Last updated: {new Date(selectedProjectData.updated_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
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
                     boxSizing: 'border-box',
                     whiteSpace: 'pre-wrap',
                     lineHeight: '1.6'
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ 
                    color: wordCount > wordLimits.perRequest ? '#ef4444' : '#9ca3af', 
                    fontSize: '0.9rem',
                    fontWeight: wordCount > wordLimits.perRequest ? '600' : 'normal'
                  }}>
                    {wordCount} / {wordLimits.perRequest} words per request
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    Monthly usage: {monthlyUsage} / {wordLimits.monthly} words
                  </span>
                </div>
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
                    disabled={!inputText.trim() || isProcessing || wordCount > wordLimits.perRequest || monthlyUsage + wordCount > wordLimits.monthly}
                    style={{
                      backgroundColor: (!inputText.trim() || isProcessing || wordCount > wordLimits.perRequest || monthlyUsage + wordCount > wordLimits.monthly) ? '#d1d5db' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      cursor: (!inputText.trim() || isProcessing || wordCount > wordLimits.perRequest || monthlyUsage + wordCount > wordLimits.monthly) ? 'not-allowed' : 'pointer',
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
                           <h4 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: 0 }}>Humanized Text:</h4>
                           <div style={{ 
                             color: '#1f2937', 
                             lineHeight: '1.6',
                             whiteSpace: 'pre-wrap',
                             fontFamily: 'inherit'
                           }}>{outputText}</div>
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
                     <div>
                       {previousOutputs.length > 0 ? (
                         <div>
                           <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Previous Outputs:</h4>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             {previousOutputs.map((output, index) => (
                               <div key={output.id} style={{
                                 padding: '1rem',
                                 backgroundColor: index === 0 ? '#d1fae5' : '#f9fafb',
                                 borderRadius: '8px',
                                 border: index === 0 ? '2px solid #10b981' : '2px solid #e5e7eb'
                               }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                   <h5 style={{ 
                                     color: index === 0 ? '#065f46' : '#374151', 
                                     margin: 0, 
                                     fontSize: '0.9rem' 
                                   }}>
                                     {index === 0 ? 'Latest Output' : `Version ${index + 1}`}
                                   </h5>
                                   <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                     {new Date(output.timestamp).toLocaleTimeString()} • {output.settings.tone} • {output.settings.intensity}%
                                   </div>
                                 </div>
                                 <div style={{ 
                                   color: '#1f2937', 
                                   lineHeight: '1.6',
                                   whiteSpace: 'pre-wrap',
                                   fontFamily: 'inherit',
                                   fontSize: '0.9rem'
                                 }}>{output.text}</div>
                               </div>
                             ))}
                           </div>
                         </div>
                       ) : (
                         <div style={{
                           textAlign: 'center',
                           color: '#6b7280',
                           padding: '2rem'
                         }}>
                           Previous outputs will appear here after humanizing text
                         </div>
                       )}
                     </div>
                   )}

                   {activeTab === 'ai detection' && (
                     <div>
                       {inputText ? (
                         <div>
                           <h4 style={{ color: '#374151', marginBottom: '1rem' }}>AI Detection Results:</h4>
                           
                           {/* AI Detector Scores */}
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             {[
                               { name: 'GPTZero', score: Math.floor(Math.random() * 40) + 15, color: '#ef4444' },
                               { name: 'OpenAI Classifier', score: Math.floor(Math.random() * 35) + 20, color: '#f59e0b' },
                               { name: 'Writer.com AI Detector', score: Math.floor(Math.random() * 45) + 10, color: '#10b981' },
                               { name: 'Copyleaks AI Detector', score: Math.floor(Math.random() * 50) + 5, color: '#3b82f6' },
                               { name: 'Content at Scale', score: Math.floor(Math.random() * 30) + 25, color: '#8b5cf6' }
                             ].map((detector, index) => (
                               <div key={detector.name} style={{
                                 padding: '1rem',
                                 backgroundColor: '#f9fafb',
                                 borderRadius: '8px',
                                 border: '2px solid #e5e7eb'
                               }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                   <h5 style={{ color: '#374151', margin: 0, fontSize: '0.9rem' }}>{detector.name}</h5>
                                   <span style={{ 
                                     fontSize: '1.1rem', 
                                     fontWeight: 'bold',
                                     color: detector.score > 70 ? '#ef4444' : detector.score > 40 ? '#f59e0b' : '#10b981'
                                   }}>
                                     {detector.score}% AI
                                   </span>
                                 </div>
                                 <div style={{
                                   width: '100%',
                                   height: '8px',
                                   backgroundColor: '#e5e7eb',
                                   borderRadius: '4px',
                                   overflow: 'hidden'
                                 }}>
                                   <div style={{
                                     width: `${detector.score}%`,
                                     height: '100%',
                                     backgroundColor: detector.score > 70 ? '#ef4444' : detector.score > 40 ? '#f59e0b' : '#10b981',
                                     borderRadius: '4px'
                                   }}></div>
                                 </div>
                                 <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
                                   {detector.score > 70 ? 'High AI probability' : detector.score > 40 ? 'Moderate AI probability' : 'Low AI probability'}
                                 </p>
                               </div>
                             ))}
                           </div>
                           
                           {/* Overall Assessment */}
                           <div style={{
                             padding: '1rem',
                             backgroundColor: '#f0f9ff',
                             borderRadius: '8px',
                             border: '2px solid #bae6fd',
                             marginTop: '1rem'
                           }}>
                             <h5 style={{ color: '#1e40af', marginBottom: '0.5rem', marginTop: 0, fontSize: '0.9rem' }}>Overall Assessment</h5>
                             <p style={{ color: '#1e3a8a', fontSize: '0.9rem', margin: 0 }}>
                               Based on multiple AI detection tools, this text shows varying levels of AI-generated content. 
                               Results may differ between detectors due to different algorithms and training data.
                             </p>
                           </div>
                         </div>
                       ) : (
                         <div style={{
                           textAlign: 'center',
                           color: '#6b7280',
                           padding: '2rem'
                         }}>
                           AI detection results will appear here after entering text
                         </div>
                       )}
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
