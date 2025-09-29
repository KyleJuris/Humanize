import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../../components/Header'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../lib/api'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wordLimits, setWordLimits] = useState({ monthly: 5000 })
  const [fetchingProfile, setFetchingProfile] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user && !fetchingProfile) {
      fetchProfile()
    }
  }, [isAuthenticated, user])

  const fetchProfile = async () => {
    if (fetchingProfile) return // Prevent multiple simultaneous calls
    
    try {
      setFetchingProfile(true)
      console.log('🔍 Fetching user profile...')
      const profileData = await api.getProfile()
      console.log('✅ Profile data received:', profileData)
      setProfile(profileData)
      
      // Set word limits based on plan
      const limits = {
        free: { monthly: 5000 },
        pro: { monthly: 15000 },
        ultra: { monthly: 30000 }
      }
      
      const planLimits = limits[profileData.plan] || limits.free
      setWordLimits(planLimits)
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
    } finally {
      setLoading(false)
      setFetchingProfile(false)
    }
  }
  return (
    <>
      <Head>
        <title>Profile - Humanizer Pro</title>
        <meta name="description" content="Manage your account and settings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ProtectedRoute>
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fefce8 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <Header currentPage="profile" />

          {/* Main Content */}
          <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Profile Settings
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Manage your account information and preferences
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Profile Information */}
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
                Personal Information
              </h3>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem'
                }}>
                  {profile?.user_name ? profile.user_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Change Avatar
                </button>
              </div>
              
              <form>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={profile?.user_name || ''}
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
                    defaultValue={profile?.email || user?.email || ''}
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
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    defaultValue="Acme Corp"
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
                  Save Changes
                </button>
              </form>
            </div>

            {/* Account Settings */}
            <div>
              {/* Subscription Info */}
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
                  Subscription
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : 'Free'} Plan
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      {wordLimits.monthly.toLocaleString()} words/month
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#10b981' }}>
                    {profile?.plan === 'free' ? 'Free' : profile?.plan === 'pro' ? '$19/month' : profile?.plan === 'ultra' ? '$39/month' : 'Free'}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
                    Words Used This Month
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                    {loading ? 'Loading...' : `${(profile?.words_used_this_month || 0).toLocaleString()} / ${wordLimits.monthly.toLocaleString()}`}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    marginTop: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${loading ? '0' : Math.min(((profile?.words_used_this_month || 0) / wordLimits.monthly) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: ((profile?.words_used_this_month || 0) / wordLimits.monthly) > 0.8 ? '#ef4444' : '#10b981',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
                
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
                  Manage Subscription
                </button>
              </div>

              {/* Security Settings */}
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
                  Security
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Password
                  </div>
                  <button style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Change Password
                  </button>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%'
                    }}></div>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Enabled</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  )
}