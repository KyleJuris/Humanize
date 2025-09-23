"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, AlertTriangle, CheckCircle, HelpCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface DetectionMeterProps {
  scores?: {
    detectorA: number
    detectorB: number
    overall: number
  }
  isLoading?: boolean
  onCheck: () => void
}

export function DetectionMeter({ scores, isLoading, onCheck }: DetectionMeterProps) {
  const [animatedScores, setAnimatedScores] = useState({ detectorA: 0, detectorB: 0, overall: 0 })

  useEffect(() => {
    if (scores) {
      // Animate progress bars
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setAnimatedScores({
          detectorA: Math.round(scores.detectorA * easeOut),
          detectorB: Math.round(scores.detectorB * easeOut),
          overall: Math.round(scores.overall * easeOut),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setAnimatedScores(scores)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [scores])

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low", color: "text-green-600", variant: "default" as const }
    if (score < 70) return { level: "Medium", color: "text-yellow-600", variant: "secondary" as const }
    return { level: "High", color: "text-red-600", variant: "destructive" as const }
  }

  const getRiskIcon = (score: number) => {
    if (score < 30) return CheckCircle
    if (score < 70) return AlertTriangle
    return Shield
  }

  return (
    <div className="h-full p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">AI Detection Analysis</h3>
          <p className="text-sm text-muted-foreground">Check how likely your text is to be detected as AI-generated</p>
        </div>

        {!scores && !isLoading && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 hover:bg-muted/80 transition-colors duration-300">
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No analysis yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Run an AI detection check on your humanized text</p>
              <Button onClick={onCheck} className="gap-2 hover:scale-105 transition-transform duration-200">
                <Shield className="h-4 w-4" />
                Run Detection Check
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
              </div>
              <h3 className="font-medium mb-2">Analyzing text...</h3>
              <p className="text-sm text-muted-foreground">Running detection algorithms on your content</p>
              <div className="flex justify-center mt-4 space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {scores && (
          <div className="space-y-4">
            {/* Overall Score */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Overall AI Probability
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average score across multiple AI detection models</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const risk = getRiskLevel(animatedScores.overall)
                      const Icon = getRiskIcon(animatedScores.overall)
                      return (
                        <>
                          <Icon className={`h-5 w-5 ${risk.color} transition-colors duration-500`} />
                          <span className="text-2xl font-bold transition-all duration-500">
                            {animatedScores.overall}%
                          </span>
                          <Badge variant={risk.variant} className="transition-all duration-500">
                            {risk.level} Risk
                          </Badge>
                        </>
                      )
                    })()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCheck}
                    disabled={isLoading}
                    className="hover:scale-105 transition-transform duration-200 bg-transparent"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recheck
                  </Button>
                </div>
                <Progress value={animatedScores.overall} className="h-2 transition-all duration-1000" />
              </CardContent>
            </Card>

            {/* Individual Detector Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Detector A</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold transition-all duration-500">
                      {animatedScores.detectorA}%
                    </span>
                    <Badge
                      variant={getRiskLevel(animatedScores.detectorA).variant}
                      className="text-xs transition-all duration-500"
                    >
                      {getRiskLevel(animatedScores.detectorA).level}
                    </Badge>
                  </div>
                  <Progress value={animatedScores.detectorA} className="h-1.5 transition-all duration-1000" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Detector B</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold transition-all duration-500">
                      {animatedScores.detectorB}%
                    </span>
                    <Badge
                      variant={getRiskLevel(animatedScores.detectorB).variant}
                      className="text-xs transition-all duration-500"
                    >
                      {getRiskLevel(animatedScores.detectorB).level}
                    </Badge>
                  </div>
                  <Progress value={animatedScores.detectorB} className="h-1.5 transition-all duration-1000" />
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-sm">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {animatedScores.overall > 70 && (
                    <div className="flex items-start gap-2 text-red-600 animate-pulse">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>High AI probability detected. Consider adjusting intensity settings and re-humanizing.</p>
                    </div>
                  )}
                  {animatedScores.overall > 30 && animatedScores.overall <= 70 && (
                    <div className="flex items-start gap-2 text-yellow-600">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>Moderate AI probability. You may want to make additional manual edits.</p>
                    </div>
                  )}
                  {animatedScores.overall <= 30 && (
                    <div className="flex items-start gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>Low AI probability. Your text appears naturally human-written.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
