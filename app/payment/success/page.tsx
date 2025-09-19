"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "49"
  const plan = searchParams.get("plan") || "Pro"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Subscription Activated</h3>
                <p className="text-green-800">Your {plan} plan subscription has been successfully activated.</p>
                <p className="text-green-700 text-sm mt-1">Amount charged: ${amount}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What's Next?</h4>
                <div className="text-left space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Your profile has been upgraded with verification badge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">You now have priority listing in search results</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Access to advanced client management tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Enhanced messaging features are now available</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/dashboard")}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push("/subscription")}>
                  <Download className="w-4 h-4 mr-2" />
                  View Invoice
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p className="mt-1">
                  Need help?{" "}
                  <a href="/support" className="text-blue-600 hover:underline">
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
