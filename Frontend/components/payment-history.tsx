"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Download, Calendar } from "lucide-react"

export function PaymentHistory() {
  // Mock payment history data
  const payments = [
    {
      id: "1",
      date: "2024-01-01",
      amount: "$0.00",
      plan: "Free",
      status: "active",
      invoice: null,
    },
    // Add more mock payments as needed
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-2">No payment history</h3>
            <p className="text-sm text-muted-foreground">Your payment history will appear here once you upgrade.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(payment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{payment.amount}</span>
                    <Badge variant="outline">{payment.plan}</Badge>
                    <Badge variant={payment.status === "active" ? "default" : "secondary"}>{payment.status}</Badge>
                  </div>
                </div>

                {payment.invoice && (
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Invoice
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
