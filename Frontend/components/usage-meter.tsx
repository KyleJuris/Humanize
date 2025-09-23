"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { BarChart3, TrendingUp, Calendar } from "lucide-react"

export function UsageMeter() {
  const { user } = useAppStore()

  if (!user) return null

  const wordsThisMonth = typeof user.usage?.wordsThisMonth === "number" ? user.usage.wordsThisMonth : 0
  const limit = typeof user.usage?.limit === "number" && user.usage.limit > 0 ? user.usage.limit : 0
  const usagePercentage = limit > 0 ? (wordsThisMonth / limit) * 100 : 0
  const remainingWords = Math.max(0, limit - wordsThisMonth)

  const getUsageColor = () => {
    if (usagePercentage >= 90) return "text-red-600"
    if (usagePercentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = () => {
    if (usagePercentage >= 90) return "bg-red-500"
    if (usagePercentage >= 75) return "bg-yellow-500"
    return "bg-primary"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage This Month
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Words Used</span>
            <Badge variant="outline" className={getUsageColor()}>
              {Math.round(usagePercentage)}%
            </Badge>
          </div>

          <Progress value={usagePercentage} className="h-3" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{wordsThisMonth.toLocaleString()} used</span>
            <span>{limit.toLocaleString()} limit</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Remaining</span>
            </div>
            <span className="text-sm font-bold">{remainingWords.toLocaleString()} words</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Resets</span>
            </div>
            <span className="text-sm">Jan 1, 2025</span>
          </div>
        </div>

        {usagePercentage >= 90 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              You're running low on words. Consider upgrading your plan to continue using HumanizePro.
            </p>
          </div>
        )}

        {usagePercentage >= 75 && usagePercentage < 90 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You've used {Math.round(usagePercentage)}% of your monthly limit.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
