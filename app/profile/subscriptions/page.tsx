"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { CreditCard, ArrowLeft, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionStatus {
  success: boolean
  isActive: boolean
  subscription: {
    _id: string
    planName: string
    amount: number
    startDate: string
    endDate: string
    features: string[]
  }
}

export default function SubscriptionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (user?.role === "lawyer") {
        try {
          setLoading(true)
          const response = await api.checkSubscriptionStatus()
          setSubscriptionStatus(response)
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to load subscription status",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    if (user) {
      loadSubscriptionStatus()
    }
  }, [user, toast])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-gray-600">Manage your subscription and billing</p>
            </div>
          </div>

          {/* Subscription Content */}
          <div className="space-y-6">
            {user?.role === "lawyer" ? (
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : subscriptionStatus?.success ? (
                  <>
                    {/* Current Plan */}
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="flex items-center text-blue-900">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Current Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-blue-900">
                              {subscriptionStatus.subscription.planName}
                            </h3>
                            <p className="text-blue-700">
                              ${subscriptionStatus.subscription.amount.toFixed(2)} per month
                            </p>
                            <p className="text-sm text-blue-600">
                              Next billing: {new Date(subscriptionStatus.subscription.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 self-start sm:self-center mt-2 sm:mt-0">
                            {subscriptionStatus.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2 text-sm text-blue-800">
                            {subscriptionStatus.subscription.features.slice(0, 3).map((feature, index) => (
                              <p key={index}>✓ {feature}</p>
                            ))}
                          </div>
                          <div className="space-y-2 text-sm text-blue-800">
                            {subscriptionStatus.subscription.features.slice(3).map((feature, index) => (
                              <p key={index + 3}>✓ {feature}</p>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button asChild>
                            <Link href="/subscription">Manage Plan</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href="/payment/invoice">View Invoice</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Usage Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">32</div>
                            <div className="text-sm text-gray-600">Consultations</div>
                            <div className="text-xs text-gray-500">18 remaining</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">18</div>
                            <div className="text-sm text-gray-600">Active Clients</div>
                            <div className="text-xs text-gray-500">+3 this week</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">4.9</div>
                            <div className="text-sm text-gray-600">Rating</div>
                            <div className="text-xs text-gray-500">47 reviews</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Billing History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">
                                {subscriptionStatus.subscription.planName} - {new Date(subscriptionStatus.subscription.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </p>
                              <p className="text-sm text-gray-600">
                                Paid on {new Date(subscriptionStatus.subscription.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${subscriptionStatus.subscription.amount.toFixed(2)}</p>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/payment/invoice">View</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                      <p className="text-gray-600 mb-4">
                        You don't have an active subscription. Subscribe to access premium features.
                      </p>
                      <Button asChild>
                        <Link href="/subscription">Choose a Plan</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Client Free Access */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Free Client Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Access</h3>
                    <p className="text-gray-600 mb-6">
                      As a client, you have unlimited access to all LegalWise features at no cost!
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Unlimited AI consultations
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Full community access
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Lawyer matching & booking
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Document summarization
                        </p>
                      </div>
                    </div>

                    <Button asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
