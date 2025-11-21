"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Users, Calendar, Star, Clock, DollarSign, FileText, UserCheck, Check, X } from "lucide-react"
import Link from "next/link"

function UserDashboard() {
  const [activeDMs, setActiveDMs] = useState<any[]>([])
  const [recentConversations, setRecentConversations] = useState<any[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchActiveDMs()
    fetchRecentConversations()
    fetchDashboardStats()
  }, [])

  const fetchActiveDMs = async () => {
    try {
      const res = await api.getDMs()
      if (res.success) {
        setActiveDMs(res.dms)
      }
    } catch (error) {
      console.error("Error fetching active DMs:", error)
    }
  }

  const fetchRecentConversations = async () => {
    try {
      const res = await api.getConversations()
      if (res.success) {
        // Sort by createdAt descending and take top 3
        const sorted = res.allConversation.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3)
        setRecentConversations(sorted)
      }
    } catch (error) {
      console.error("Error fetching recent conversations:", error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const res = await api.getUserDashboardStats()
      if (res.success) {
        setDashboardStats(res.stats)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const getOtherParticipant = (dm: any) => {
    return dm.participants.find((p: any) => p._id !== user?.id)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Here's what's happening with your legal matters</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">AI Chats</CardTitle>
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardStats?.aiChats || 0}</div>
            <p className="text-xs text-muted-foreground">Total conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Community Posts</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardStats?.posts || 0}</div>
            <p className="text-xs text-muted-foreground">Total posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Lawyers Connected</CardTitle>
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardStats?.connectedLawyers || 0}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Documents</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardStats?.documents || 0}</div>
            <p className="text-xs text-muted-foreground">Total uploaded</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Conversations</CardTitle>
            <CardDescription className="text-sm">Your latest AI assistant chats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentConversations.length === 0 ? (
              <p className="text-sm text-gray-500">No recent conversations</p>
            ) : (
              recentConversations.map((conv) => (
                <div key={conv._id} className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                    <Link href={`/chatbot?conversationId=${conv._id}`}>Continue</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Ongoing Consultations</CardTitle>
            <CardDescription className="text-sm">Your ongoing lawyer consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {activeDMs.length === 0 ? (
              <p className="text-sm text-gray-500">No active consultations</p>
            ) : (
              activeDMs.slice(0, 3).map((dm) => {
                const otherParticipant = getOtherParticipant(dm)
                const lastMessage = dm.messages?.[0]
                return (
                  <Link href={`/messages?dmId=${dm._id}`} key={dm._id}>
                    <div className="flex items-center space-x-3 sm:space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src={otherParticipant?.profilePicture} />
                        <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{otherParticipant?.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {lastMessage ? lastMessage.message : 'No messages yet'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button asChild className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
              <Link href="/chatbot">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Ask AI Assistant</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 bg-transparent"
            >
              <Link href="/matchmaking">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Find a Lawyer</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 bg-transparent sm:col-span-2 lg:col-span-1"
            >
              <Link href="/summarizer">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Summarize Document</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LawyerDashboard() {
  const [dmRequests, setDmRequests] = useState<any[]>([])
  const [lawyerProfile, setLawyerProfile] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    fetchRequests()
    fetchLawyerProfile()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.getPendingDMRequests()
      if (res.success) {
        setDmRequests(res.requests)
      }
    } catch (error) {
      console.error("Error fetching DM requests:", error)
    }
  }

  const fetchLawyerProfile = async () => {
    try {
      const res = await api.getLawyerProfile()
      if (res.success && res.lawyer) {
        setLawyerProfile(res.lawyer)
        setReviews(res.lawyer.reviews || [])
      } else if (res._id) {
         // Handle case where response is the lawyer object directly (as per user's sample)
         setLawyerProfile(res)
         setReviews(res.reviews || [])
      }
    } catch (error) {
      console.error("Error fetching lawyer profile:", error)
    }
  }

  const handleRespond = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.respondToDMRequest(requestId, status)
      fetchRequests() // Refresh list
    } catch (error) {
      console.error("Error responding to DM request:", error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your practice and clients</p>
      </div>

      {/* Subscription Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle className="text-blue-900 text-lg sm:text-xl">Pro Subscription</CardTitle>
              <CardDescription className="text-blue-700 text-sm">Active until Dec 31, 2024</CardDescription>
            </div>
            <Badge className="bg-blue-600 self-start sm:self-center">Pro Plan</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-blue-800 space-y-1">
              <p>50 client consultations remaining this month</p>
              <p>Unlimited community posts</p>
            </div>
            <Button asChild className="self-start sm:self-center">
              <Link href="/subscription">Manage Plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">$2,400</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{lawyerProfile?.activeClients || 0}</div>
            <p className="text-xs text-muted-foreground">Total accepted clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{lawyerProfile?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground">Community contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Rating</CardTitle>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {lawyerProfile?.rating ? lawyerProfile.rating.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {lawyerProfile?.reviews?.length || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DM Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">DM Requests</CardTitle>
            <CardDescription className="text-sm">Latest Direct Messages Requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {dmRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending requests</p>
            ) : (
              dmRequests.map((request) => (
                <div key={request._id} className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarImage src={request.senderId.profilePicture} />
                    <AvatarFallback>{request.senderId.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{request.senderId.name}</p>
                    <p className="text-xs text-gray-500">Sent you a message request</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleRespond(request._id, 'accepted')}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRespond(request._id, 'rejected')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Reviews</CardTitle>
            <CardDescription className="text-sm">Client Reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet</p>
            ) : (
              reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarImage src={review.userId?.profilePicture} />
                      <AvatarFallback>{review.userId?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{review.userId?.name || 'Anonymous'}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.review && (
                        <p className="text-xs text-gray-600 mt-1">{review.review}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {user?.role === "lawyer" ? <LawyerDashboard /> : <UserDashboard />}
        </main>
      </div>
    </ProtectedRoute>
  )
}
