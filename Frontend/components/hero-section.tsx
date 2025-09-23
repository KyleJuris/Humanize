"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-100 to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6 text-slate-900">
              Humanize AI Text <span className="text-green-600">& Outsmart AI Detectors</span>
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-xl text-slate-600 text-balance mb-8 max-w-3xl mx-auto">
              Humanize Pro converts your AI-generated content into fully humanized, undetectable writing—ensuring it passes every AI detection tool
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex justify-center">
              <Link href="/auth">
                <Button size="lg" className="gap-2 group hover:scale-105 transition-transform duration-200 bg-green-700 hover:bg-green-800 text-white">
                  Try for free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
