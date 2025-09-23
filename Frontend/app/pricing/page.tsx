"use client"

import { useState } from "react"
import { PlanCard } from "@/components/plan-card"
import { PlanToggle } from "@/components/plan-toggle"
import { FeatureMatrix } from "@/components/feature-matrix"
import { PricingFAQ } from "@/components/pricing-faq"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for individuals getting started",
      price: { monthly: 9, annual: 90 },
      words: 50000,
      features: ["50,000 words/month", "Basic humanization", "Email support", "Export to TXT/MD", "Version history"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Best for content creators and professionals",
      price: { monthly: 19, annual: 190 },
      words: 150000,
      features: [
        "150,000 words/month",
        "Advanced humanization",
        "Priority support",
        "API access",
        "Advanced detection bypass",
        "Custom tone settings",
      ],
      popular: true,
    },
    {
      id: "ultra",
      name: "Ultra",
      description: "For teams and heavy users",
      price: { monthly: 39, annual: 390 },
      words: 500000,
      features: [
        "500,000 words/month",
        "Premium humanization",
        "24/7 support",
        "API access",
        "Custom integrations",
        "Team collaboration",
        "White-label options",
      ],
      popular: false,
    },
  ]

  const savings = billingPeriod === "annual" ? 17 : 0

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-100 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              Choose Your <span className="text-green-600">Perfect Plan</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Transform unlimited AI text with our powerful humanization technology. Start free, upgrade anytime.
            </p>

            <PlanToggle billingPeriod={billingPeriod} onToggle={setBillingPeriod} savings={savings} />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billingPeriod={billingPeriod} />
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Compare All Features</h2>
              <p className="text-lg text-muted-foreground">See what's included in each plan</p>
            </div>

            <FeatureMatrix plans={plans} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Everything you need to know about our pricing</p>
            </div>

            <PricingFAQ />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of content creators who trust HumanizePro for their text humanization needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Zap className="h-4 w-4" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> HumanizePro is designed for legitimate content improvement and should not be
            used for academic dishonesty. Please follow your institution's guidelines.
          </p>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Need more? </span>
            <Button variant="link" className="p-0 h-auto text-sm">
              Contact us for enterprise solutions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
