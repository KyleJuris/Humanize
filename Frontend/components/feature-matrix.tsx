"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface Plan {
  id: string
  name: string
  price: { monthly: number; annual: number }
  words: number
}

interface FeatureMatrixProps {
  plans: Plan[]
}

export function FeatureMatrix({ plans }: FeatureMatrixProps) {
  const features = [
    { name: "Words per month", basic: "50,000", pro: "150,000", ultra: "500,000" },
    { name: "Humanization quality", basic: "Basic", pro: "Advanced", ultra: "Premium" },
    { name: "AI detection bypass", basic: true, pro: true, ultra: true },
    { name: "Version history", basic: true, pro: true, ultra: true },
    { name: "Export formats", basic: "TXT, MD", pro: "TXT, MD", ultra: "TXT, MD, DOCX" },
    { name: "Email support", basic: true, pro: true, ultra: true },
    { name: "Priority support", basic: false, pro: true, ultra: true },
    { name: "24/7 support", basic: false, pro: false, ultra: true },
    { name: "API access", basic: false, pro: true, ultra: true },
    { name: "Custom tone settings", basic: false, pro: true, ultra: true },
    { name: "Team collaboration", basic: false, pro: false, ultra: true },
    { name: "White-label options", basic: false, pro: false, ultra: true },
    { name: "Custom integrations", basic: false, pro: false, ultra: true },
  ]

  const renderFeatureValue = (value: any) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-4 w-4 text-green-600 mx-auto" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground mx-auto" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Features</th>
                <th className="text-center p-4 font-medium">Basic</th>
                <th className="text-center p-4 font-medium">Pro</th>
                <th className="text-center p-4 font-medium">Ultra</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center">{renderFeatureValue(feature.basic)}</td>
                  <td className="p-4 text-center">{renderFeatureValue(feature.pro)}</td>
                  <td className="p-4 text-center">{renderFeatureValue(feature.ultra)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
