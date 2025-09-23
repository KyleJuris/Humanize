"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar, Crown, Edit3, Save, X } from "lucide-react"

export function ProfileOverview() {
  const { user, setUser } = useAppStore()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleSave = async () => {
    if (!user) return

    try {
      await api.updateProfile(user.id, { name: editData.name, email: editData.email })

      setUser({
        ...user,
        name: editData.name,
        email: editData.email,
      })

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "free":
        return "secondary"
      case "basic":
        return "default"
      case "pro":
        return "default"
      case "ultra":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPlanIcon = (plan: string) => {
    return plan !== "free" ? <Crown className="h-3 w-3" /> : null
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{user.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Plan:</span>
              <Badge variant={getPlanBadgeVariant(user.plan)} className="gap-1">
                {getPlanIcon(user.plan)}
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </Badge>
            </div>
          </div>

          <Button variant="outline" size="sm">
            Manage Plan
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Member since January 2024</span>
        </div>
      </CardContent>
    </Card>
  )
}
