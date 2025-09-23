"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

interface Plan {
  id: string
  name: string
  description: string
  price: { monthly: number; annual: number }
  words: number
  features: string[]
  popular: boolean
}

interface PlanCardProps {
  plan: Plan
  billingPeriod: "monthly" | "annual"
}

export function PlanCard({ plan, billingPeriod }: PlanCardProps) {
  const price = plan.price[billingPeriod]
  const originalMonthlyPrice = billingPeriod === "annual" ? plan.price.monthly : null

  return (
    <Card className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="gap-1 px-3 py-1">
            <Star className="h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground">{plan.description}</p>

        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-muted-foreground">/{billingPeriod === "monthly" ? "mo" : "year"}</span>
          </div>
          {billingPeriod === "annual" && originalMonthlyPrice && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground line-through">${originalMonthlyPrice}/mo</span>
              <Badge variant="secondary" className="text-xs">
                Save ${(originalMonthlyPrice * 12 - price).toFixed(0)}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-lg font-semibold">{plan.words.toLocaleString()} words/month</div>
          <div className="text-sm text-muted-foreground">~{Math.round(plan.words / 250)} pages of content</div>
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
          {plan.id === "basic" ? "Start Free Trial" : "Upgrade Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
