"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PlanToggleProps {
  billingPeriod: "monthly" | "annual"
  onToggle: (period: "monthly" | "annual") => void
  savings: number
}

export function PlanToggle({ billingPeriod, onToggle, savings }: PlanToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <div className="flex items-center bg-muted rounded-lg p-1">
        <Button
          variant={billingPeriod === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToggle("monthly")}
          className="rounded-md"
        >
          Monthly
        </Button>
        <Button
          variant={billingPeriod === "annual" ? "default" : "ghost"}
          size="sm"
          onClick={() => onToggle("annual")}
          className="rounded-md"
        >
          Annual
        </Button>
      </div>
      {savings > 0 && (
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Save {savings}%
        </Badge>
      )}
    </div>
  )
}
