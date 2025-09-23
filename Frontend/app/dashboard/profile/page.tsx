"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { ProfileOverview } from "@/components/profile-overview"
import { UsageMeter } from "@/components/usage-meter"
import { PaymentHistory } from "@/components/payment-history"
import { api } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const { user } = useAppStore()

  useEffect(() => {
    ;(async () => {
      if (!user) {
        const profile = await api.getProfile()
        if (profile) {
          useAppStore.getState().setUser(profile)
          useAppStore.getState().setAuthenticated(true)
        }
      }
    })()
  }, [user])

  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and view your usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileOverview />
            <PaymentHistory />
          </div>

          <div className="space-y-6">
            <UsageMeter />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
