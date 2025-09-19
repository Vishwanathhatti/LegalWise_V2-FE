"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Heart,
  Bookmark,
  MessageCircle,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  joinDate: Date
  avatar: string
  role: "user" | "lawyer"
}

const profileTabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "liked", label: "Liked Posts", icon: Heart },
  { id: "saved", label: "Saved Posts", icon: Bookmark },
  { id: "comments", label: "Comments", icon: MessageCircle },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
]

const mockLikedPosts = [
  {
    id: "1",
    title: "Understanding Employment Contract Terms",
    author: "Sarah Johnson",
    category: "Employment Law",
    likes: 24,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Small Business Legal Requirements",
    author: "Lisa Rodriguez",
    category: "Business Law",
    likes: 45,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
]

const mockSavedPosts = [
  {
    id: "3",
    title: "Landlord-Tenant Rights Guide",
    author: "Mike Chen",
    category: "Real Estate Law",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Divorce Proceedings: What to Expect",
    author: "Jennifer Davis",
    category: "Family Law",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
]

const mockCommentedPosts = [
  {
    id: "5",
    title: "Contract Review Best Practices",
    author: "Attorney Smith",
    category: "Contract Law",
    myComment: "This is very helpful, thank you for sharing!",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Understanding Copyright Law",
    author: "Legal Expert",
    category: "Intellectual Property",
    myComment: "Could you elaborate on fair use exceptions?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Legal enthusiast seeking guidance on various legal matters. Always eager to learn and connect with legal professionals.",
    joinDate: new Date(2023, 5, 15),
    avatar: user?.avatar || "",
    role: user?.role || "user",
  })

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved successfully.",
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Reset to original data
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      bio: "Legal enthusiast seeking guidance on various legal matters. Always eager to learn and connect with legal professionals.",
      joinDate: new Date(2023, 5, 15),
      avatar: user?.avatar || "",
      role: user?.role || "user",
    })
    setIsEditing(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {profileData.role}
                          </Badge>
                          <Badge variant="secondary">Member since {profileData.joinDate.getFullYear()}</Badge>
                        </div>
                      </div>

                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "default"}
                        className="mt-4 sm:mt-0"
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profileData.location}
                              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveProfile}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600">{profileData.bio}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{profileData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{profileData.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{profileData.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Joined {profileData.joinDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockLikedPosts.length}</div>
                  <div className="text-sm text-gray-600">Liked Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{mockSavedPosts.length}</div>
                  <div className="text-sm text-gray-600">Saved Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockCommentedPosts.length}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">AI Chats</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "liked":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Liked Posts</h2>
              <Badge variant="secondary">{mockLikedPosts.length} posts</Badge>
            </div>
            {mockLikedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/community/post/${post.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <Badge variant="outline">{post.category}</Badge>
                        <span>{post.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {mockLikedPosts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No liked posts yet</h3>
                  <p className="text-gray-600">Posts you like will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "saved":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saved Posts</h2>
              <Badge variant="secondary">{mockSavedPosts.length} posts</Badge>
            </div>
            {mockSavedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/community/post/${post.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <Badge variant="outline">{post.category}</Badge>
                        <span>{post.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-blue-600 fill-current" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {mockSavedPosts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved posts yet</h3>
                  <p className="text-gray-600">Posts you save will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "comments":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Comments</h2>
              <Badge variant="secondary">{mockCommentedPosts.length} comments</Badge>
            </div>
            {mockCommentedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Link href={`/community/post/${post.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">"{post.myComment}"</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>on post by {post.author}</span>
                    <Badge variant="outline">{post.category}</Badge>
                    <span>{post.timestamp.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {mockCommentedPosts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                  <p className="text-gray-600">Your comments on posts will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "subscriptions":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscriptions</h2>
            </div>

            {user?.role === "lawyer" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Pro Plan</h3>
                      <p className="text-gray-600">$49/month</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>• 50 client consultations per month</p>
                    <p>• Priority listing in search results</p>
                    <p>• Advanced messaging features</p>
                    <p>• Client management tools</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild>
                      <Link href="/subscription">Manage Subscription</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/payment/invoice">View Invoice</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Free Access</h3>
                  <p className="text-gray-600 mb-4">
                    As a client, you have unlimited access to all features at no cost!
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>✓ Unlimited AI consultations</p>
                    <p>✓ Full community access</p>
                    <p>✓ Lawyer matching & booking</p>
                    <p>✓ Document summarization</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your account activity</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control who can see your profile and activity</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {profileTabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-colors ${
                            activeTab === tab.id
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{renderTabContent()}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
