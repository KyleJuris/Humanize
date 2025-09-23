"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

type AuthStep = "email" | "waiting" | "success"

export function OtpAuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, setAuthenticated } = useAppStore()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState<AuthStep>("email")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

    // Handle magic link completion
    useEffect(() => {
      if (!supabase) {
        console.log('No Supabase client available')
        return
      }

      const handleAuthSuccess = async (user: any) => {
        try {
          console.log('=== AUTH SUCCESS START ===')
          console.log('User:', { id: user.id, email: user.email, metadata: user.user_metadata })
          
          setCurrentStep('success')
          
          // Ensure profile exists
          console.log('Calling ensureProfile...')
          const profile = await api.ensureProfile({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            plan: 'free',
          })
          console.log('Profile response:', profile)

          // Set user in store
          const userData = {
            id: user.id,
            name: profile?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            plan: profile?.plan || 'free',
            usage: { wordsThisMonth: 0, limit: 5000 },
          }
          console.log('Setting user in store:', userData)
          setUser(userData)
          setAuthenticated(true)

          // Load projects
          try {
            console.log('Loading projects for user:', user.id)
            const projects = await api.getProjects(user.id)
            console.log('Projects loaded:', projects)
            useAppStore.getState().setProjects(projects as any)
          } catch (err) {
            console.error('Failed to load projects:', err)
          }

          console.log('=== AUTH SUCCESS COMPLETE ===')
          toast({
            title: 'Welcome!',
            description: 'You have been signed in successfully.'
          })
          
          setTimeout(() => {
            console.log('Redirecting to dashboard...')
            router.push('/dashboard')
          }, 1500)
        } catch (err) {
          console.error('=== AUTH SETUP FAILED ===', err)
          toast({
            title: 'Setup failed',
            description: `Failed to complete login: ${err}`,
            variant: 'destructive'
          })
        }
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('=== AUTH STATE CHANGE ===', { event, userId: session?.user?.id, hasSession: !!session })
        if (event === 'SIGNED_IN' && session?.user) {
          await handleAuthSuccess(session.user)
        }
      })

      // Handle initial auth check and code exchange
      const handleInitialAuth = async () => {
        console.log('=== INITIAL AUTH CHECK ===')
        
        // Check for existing session first
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          console.log('Session check:', { hasSession: !!session, userId: session?.user?.id, error: sessionError })
          
          if (session?.user) {
            console.log('Existing session found, handling auth success')
            await handleAuthSuccess(session.user)
            return
          }
        } catch (err) {
          console.error('Session check failed:', err)
        }

        // Handle magic link code
        const code = searchParams?.get('code')
        const errorDesc = searchParams?.get('error_description')
        
        console.log('URL params:', { code: !!code, errorDesc })
        
        if (errorDesc) {
          console.error('Auth error from URL:', errorDesc)
          toast({ title: 'Sign-in failed', description: errorDesc, variant: 'destructive' })
          return
        }

        if (code) {
          console.log('Found auth code, exchanging for session...')
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)
            console.log('Code exchange result:', { hasData: !!data, hasUser: !!data?.user, error })
            
            if (error) throw error
            
            if (data?.user) {
              console.log('Code exchange successful, user:', data.user.id)
              // Auth state change listener will handle the success
            }
          } catch (err: any) {
            console.error('Code exchange failed:', err)
            toast({ 
              title: 'Sign-in failed', 
              description: err?.message || 'Invalid or expired link', 
              variant: 'destructive' 
            })
          }
        } else {
          console.log('No auth code found in URL')
        }
      }

      handleInitialAuth()

      return () => {
        console.log('Cleaning up auth subscription')
        subscription?.unsubscribe()
      }
    }, [searchParams, router, setUser, setAuthenticated, toast])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      await api.sendOtp(email)
      setCurrentStep("waiting")
      setCountdown(60)
      toast({
        title: "Link Sent",
        description: `A sign-in link has been sent to ${email}`,
      })
    } catch (error) {
      console.error('Send link error:', error)
      toast({
        title: "Failed to send link",
        description: (error as any)?.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendLink = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      await api.sendOtp(email)
      setCountdown(60)
      toast({
        title: "Link Resent",
        description: "A new sign-in link has been sent",
      })
    } catch (error) {
      console.error('Resend link error:', error)
      toast({
        title: "Failed to resend link",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setCurrentStep("email")
    setEmail("")
  }

  const renderEmailStep = () => (
    <Card>
      <CardHeader>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Get Started</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address to receive a sign-in link
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !email}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending Link...
              </>
            ) : (
              "Send Sign-in Link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderWaitingStep = () => (
    <Card>
      <CardHeader>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a magic link to <strong>{email}</strong>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Click the link in your email to continue.
          </div>
          <Button type="button" variant="ghost" onClick={handleBackToEmail} disabled={isLoading} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Email
          </Button>
          <div className="text-sm text-muted-foreground">
            Didn't get the email?{" "}
            <Button 
              type="button" 
              variant="link" 
              onClick={handleResendLink} 
              disabled={isLoading || countdown > 0} 
              className="p-0 h-auto text-sm"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Link"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSuccessStep = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold">Welcome!</h2>
          <p className="text-sm text-muted-foreground">
            You've been signed in successfully. Redirecting to dashboard...
          </p>
          <div className="flex justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      {currentStep === "email" && renderEmailStep()}
      {currentStep === "waiting" && renderWaitingStep()}
      {currentStep === "success" && renderSuccessStep()}
    </>
  )
}