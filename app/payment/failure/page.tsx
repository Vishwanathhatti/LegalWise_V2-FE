"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react"

export default function PaymentFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Payment processing failed"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-900">Payment Failed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Transaction Unsuccessful</h3>
                <p className="text-red-800">We were unable to process your payment at this time.</p>
                <p className="text-red-700 text-sm mt-1">Error: {error}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Common Issues & Solutions</h4>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-700 font-medium">Insufficient funds</p>
                      <p className="text-gray-600 text-sm">
                        Check your account balance or try a different payment method
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-700 font-medium">Card declined</p>
                      <p className="text-gray-600 text-sm">Contact your bank or try a different card</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-700 font-medium">Incorrect card details</p>
                      <p className="text-gray-600 text-sm">Verify your card number, expiry date, and CVV</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/subscription")}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p>Still having trouble?</p>
                <p className="mt-1">
                  <a href="/support" className="text-blue-600 hover:underline inline-flex items-center">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Contact Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
