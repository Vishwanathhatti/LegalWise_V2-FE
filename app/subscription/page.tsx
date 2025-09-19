"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Check, X, CreditCard, Shield, Users, Star, Zap } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: "month" | "year"
  features: string[]
  limitations: string[]
  popular?: boolean
  current?: boolean
}

const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    features: [
      "Basic profile listing",
      "5 client consultations per month",
      "Community forum access",
      "Basic messaging",
    ],
    limitations: ["Limited visibility in search", "No priority support", "Basic analytics only"],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "month",
    features: [
      "Enhanced profile with verification badge",
      "50 client consultations per month",
      "Priority listing in search results",
      "Advanced messaging features",
      "Client management tools",
      "Basic analytics dashboard",
      "Email support",
    ],
    limitations: ["Limited to 50 consultations", "Basic customization options"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 99,
    period: "month",
    features: [
      "Premium profile with elite badge",
      "Unlimited client consultations",
      "Top placement in search results",
      "Advanced messaging & video calls",
      "Complete client management suite",
      "Advanced analytics & reporting",
      "Priority support (24/7)",
      "Custom branding options",
      "API access for integrations",
    ],
    limitations: [],
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: user?.email || "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      toast({
        title: "Already on Free Plan",
        description: "You're currently on the free plan.",
      })
      return
    }

    setSelectedPlan(plan)
    setShowPaymentDialog(true)
  }

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment successful!",
        description: `You've successfully upgraded to the ${selectedPlan?.name} plan.`,
      })

      setShowPaymentDialog(false)
      setPaymentData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: "",
        email: user?.email || "",
      })
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (user?.role !== "lawyer") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Plans</h1>
              <p className="text-gray-600 mb-8">
                Subscription plans are available for lawyers only. As a client, you can access all features for free!
              </p>
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Client Access</h3>
                  <p className="text-gray-600 mb-4">
                    Enjoy unlimited access to our AI assistant, community forum, lawyer matching, and messaging
                    features.
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span>Unlimited AI consultations</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span>Full community access</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span>Lawyer matching & booking</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span>Document summarization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["lawyer"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to grow your legal practice and connect with more clients
            </p>
          </div>

          {/* Current Plan Status */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Current Plan: Free</h3>
                  <p className="text-blue-700">5 consultations remaining this month</p>
                </div>
                <Badge className="bg-blue-600">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""} ${plan.current ? "border-green-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-4 py-1">Current Plan</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan)}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Pro</th>
                      <th className="text-center py-3 px-4">Elite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">Monthly Consultations</td>
                      <td className="text-center py-3 px-4">5</td>
                      <td className="text-center py-3 px-4">50</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Profile Verification</td>
                      <td className="text-center py-3 px-4">
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Priority Search Listing</td>
                      <td className="text-center py-3 px-4">
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Zap className="w-4 h-4 text-yellow-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Advanced Analytics</td>
                      <td className="text-center py-3 px-4">
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">24/7 Support</td>
                      <td className="text-center py-3 px-4">
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <X className="w-4 h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Dialog */}
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Your Upgrade</DialogTitle>
              </DialogHeader>
              {selectedPlan && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedPlan.name} Plan</span>
                      <span className="font-bold">
                        ${selectedPlan.price}/{selectedPlan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={paymentData.name}
                        onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={paymentData.email}
                        onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handlePayment} className="flex-1" disabled={isProcessing}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : `Pay $${selectedPlan.price}`}
                    </Button>
                    <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  )
}
