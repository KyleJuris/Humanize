"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Zap, Shield } from "lucide-react"
import { useEffect, useState } from "react"

export function TrustSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({ users: 0, success: 0, words: 0, privacy: 0 })

  const stats = [
    { icon: Users, value: 50000, suffix: "+", label: "Happy Users", key: "users" as const },
    { icon: Award, value: 99.9, suffix: "%", label: "Success Rate", key: "success" as const },
    { icon: Zap, value: 2000000, suffix: "+", label: "Words Processed", key: "words" as const },
    { icon: Shield, value: 100, suffix: "%", label: "Privacy Protected", key: "privacy" as const },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.getElementById("trust-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setAnimatedValues({
          users: Math.round(50000 * easeOut),
          success: Math.round(99.9 * easeOut * 10) / 10,
          words: Math.round(2000000 * easeOut),
          privacy: Math.round(100 * easeOut),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedValues({ users: 50000, success: 99.9, words: 2000000, privacy: 100 })
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [isVisible])

  const formatValue = (key: string, value: number) => {
    if (key === "words") return `${(value / 1000000).toFixed(1)}M`
    if (key === "users") return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  return (
    <section id="trust-section" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Professionals</h2>
          <p className="text-lg text-muted-foreground">Join thousands of content creators who trust HumanizePro</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 hover:bg-primary/20 transition-colors duration-300">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatValue(stat.key, animatedValues[stat.key])}
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
