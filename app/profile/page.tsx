"use client"

import { useState, useEffect } from "react"
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
import { api } from "@/lib/api"
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
  Loader2,
  FileText,
  Scale,
  GraduationCap,
  Award,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface ActivityStats {
  likedPosts: number
  documentsSummarized: number
  comments: number
  aiChats: number
}

interface LikedPost {
  _id: string
  title: string
  description: string
  author: {
    name: string
  }
  tags: string[]
  likes: string[]
  comments: string[]
  createdAt: string
}

interface UserComment {
  _id: string
  content: string
  postId: {
    _id: string
    title: string
  }
  createdAt: string
}

interface Document {
  _id: string
  filename: string
  summary: string
  createdAt: string
}

const profileTabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "liked", label: "Liked Posts", icon: Heart },
  { id: "documents", label: "Documents Summarized", icon: Bookmark },
  { id: "comments", label: "Comments", icon: MessageCircle },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // UI state
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(false)

  // Profile state
  const [profileData, setProfileData] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: new Date(),
    avatar: "",
    role: "user",
  })

  // Activity stats
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    likedPosts: 0,
    documentsSummarized: 0,
    comments: 0,
    aiChats: 0,
  })

  // Collections
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([])
  const [userComments, setUserComments] = useState<UserComment[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  // Lawyer registration state
  const [isLawyerDialogOpen, setIsLawyerDialogOpen] = useState<boolean>(false)
  const [registeringLawyer, setRegisteringLawyer] = useState<boolean>(false)
  const [lawyerForm, setLawyerForm] = useState({
    licenseNumber: "",
    specialization: "",
    yearsOfExperience: "",
    barAssociation: "",
    education: "",
    bio: "",
  })

  // Load profile data on mount / when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true)
      try {
        const response = await api.getProfile()
        // Defensive: response might be nested; adjust if your API shape is different
        setProfileData({
          name: response.name || response.user?.name || "",
          email: response.email || response.user?.email || "",
          phone: response.phone || response.user?.phone || "",
          location: response.location || "",
          bio: response.bio || "",
          joinDate: response.joinDate ? new Date(response.joinDate) : new Date(),
          avatar: response.avatar || "",
          role: (response.role || response.user?.role || "user") as "user" | "lawyer",
        })

        // Load activity stats after profile arrives
        await loadActivityStats()
      } catch (err: any) {
        toast({
          title: "Error loading profile",
          description: err?.message || "Could not fetch profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfileData()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Activity stats loader
  const loadActivityStats = async () => {
    try {
      const likedPostsResponse = await api.getLikedPosts()
      const commentsResponse = await api.getUserComments()
      const documentsResponse = await api.getDocuments()
      const conversationsResponse = await api.getConversations()

      setActivityStats({
        likedPosts: likedPostsResponse?.likedPosts?.length || 0,
        documentsSummarized: documentsResponse?.documents?.length || 0,
        comments: commentsResponse?.userComments?.length || 0,
        aiChats: conversationsResponse?.allConversation?.length || 0,
      })
    } catch (err) {
      console.error("Failed to load activity stats", err)
    }
  }

  // Individual tab loaders
  const loadLikedPosts = async () => {
    setLoadingData(true)
    try {
      const res = await api.getLikedPosts()
      setLikedPosts(res.likedPosts || [])
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to load liked posts",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const loadUserComments = async () => {
    setLoadingData(true)
    try {
      const res = await api.getUserComments()
      setUserComments(res.userComments || [])
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const loadDocuments = async () => {
    setLoadingData(true)
    try {
      const res = await api.getDocuments()
      setDocuments(res.documents || [])
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setUpdating(true)
      await api.updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      })
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      })
      setIsEditing(false)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      bio: "",
      joinDate: new Date(),
      avatar: "",
      role: (user?.role as "user" | "lawyer") || "user",
    })
    setIsEditing(false)
  }

  // Lawyer registration handler
  const handleLawyerRegistration = async () => {
    // basic client-side validation
    if (
      !lawyerForm.licenseNumber.trim() ||
      !lawyerForm.specialization.trim() ||
      !lawyerForm.yearsOfExperience.trim() ||
      !lawyerForm.barAssociation.trim() ||
      !lawyerForm.education.trim() ||
      !lawyerForm.bio.trim()
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setRegisteringLawyer(true)

      // Prepare payload
      const payload = {
        licenseNumber: lawyerForm.licenseNumber.trim(),
        specialization: lawyerForm.specialization.trim(),
        yearsOfExperience: Number(lawyerForm.yearsOfExperience),
        barAssociation: lawyerForm.barAssociation.trim(),
        education: lawyerForm.education.trim(),
        bio: lawyerForm.bio.trim(),
      }

      // Call backend API - adjust method name if your API differs
      const res = await api.registerLawyer(payload)

      // If backend returns success, update UI accordingly
      toast({
        title: "Registration submitted",
        description: res?.message || "Your lawyer registration has been submitted.",
      })

      // Optionally: update local profile role to 'lawyer' if backend approves immediately.
      // If backend requires review, you might not want to flip role yet.
      // Here we honor a success flag if returned.
      if (res?.success) {
        setProfileData((p) => ({ ...p, role: "lawyer" }))
      }

      // Reset form & close dialog
      setLawyerForm({
        licenseNumber: "",
        specialization: "",
        yearsOfExperience: "",
        barAssociation: "",
        education: "",
        bio: "",
      })
      setIsLawyerDialogOpen(false)
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message || "Failed to register as a lawyer. Try again later.",
        variant: "destructive",
      })
    } finally {
      setRegisteringLawyer(false)
    }
  }

  // Render main content for each tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name || "avatar"} />
                    <AvatarFallback className="text-2xl">{(profileData.name && profileData.name.charAt(0)) || "?"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{profileData.name || "Unnamed"}</h1>
                        <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {profileData.role}
                          </Badge>
                          <Badge variant="secondary">Member</Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Register as Lawyer Button */}
                        {profileData.role === "user" && (
                          <Dialog open={isLawyerDialogOpen} onOpenChange={setIsLawyerDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="mt-4 sm:mt-0">
                                <Scale className="w-4 h-4 mr-2" />
                                Register as Lawyer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Register as Lawyer</DialogTitle>
                                <DialogDescription>
                                  Complete your lawyer registration to start offering legal services on our platform.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="licenseNumber">License Number *</Label>
                                    <Input
                                      id="licenseNumber"
                                      placeholder="Enter your bar license number"
                                      value={lawyerForm.licenseNumber}
                                      onChange={(e) => setLawyerForm({ ...lawyerForm, licenseNumber: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization *</Label>
                                    <Select
                                      value={lawyerForm.specialization}
                                      onValueChange={(value) => setLawyerForm({ ...lawyerForm, specialization: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select specialization" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="corporate">Corporate Law</SelectItem>
                                        <SelectItem value="criminal">Criminal Law</SelectItem>
                                        <SelectItem value="family">Family Law</SelectItem>
                                        <SelectItem value="immigration">Immigration Law</SelectItem>
                                        <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                                        <SelectItem value="real-estate">Real Estate Law</SelectItem>
                                        <SelectItem value="tax">Tax Law</SelectItem>
                                        <SelectItem value="employment">Employment Law</SelectItem>
                                        <SelectItem value="personal-injury">Personal Injury</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                                    <Input
                                      id="yearsOfExperience"
                                      type="number"
                                      min={0}
                                      placeholder="e.g., 5"
                                      value={lawyerForm.yearsOfExperience}
                                      onChange={(e) => setLawyerForm({ ...lawyerForm, yearsOfExperience: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="barAssociation">Bar Association *</Label>
                                    <Input
                                      id="barAssociation"
                                      placeholder="e.g., State Bar of California"
                                      value={lawyerForm.barAssociation}
                                      onChange={(e) => setLawyerForm({ ...lawyerForm, barAssociation: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="education">Education *</Label>
                                  <Input
                                    id="education"
                                    placeholder="e.g., JD from Harvard Law School"
                                    value={lawyerForm.education}
                                    onChange={(e) => setLawyerForm({ ...lawyerForm, education: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="lawyerBio">Professional Bio *</Label>
                                  <Textarea
                                    id="lawyerBio"
                                    placeholder="Describe your legal background, expertise, and approach to client service..."
                                    rows={4}
                                    value={lawyerForm.bio}
                                    onChange={(e) => setLawyerForm({ ...lawyerForm, bio: e.target.value })}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsLawyerDialogOpen(false)}
                                  disabled={registeringLawyer}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleLawyerRegistration}
                                  disabled={
                                    registeringLawyer ||
                                    !lawyerForm.licenseNumber ||
                                    !lawyerForm.specialization ||
                                    !lawyerForm.yearsOfExperience ||
                                    !lawyerForm.barAssociation ||
                                    !lawyerForm.education ||
                                    !lawyerForm.bio
                                  }
                                >
                                  {registeringLawyer ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Registering...
                                    </>
                                  ) : (
                                    <>
                                      <Scale className="w-4 h-4 mr-2" />
                                      Register as Lawyer
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

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
                          <Button onClick={handleSaveProfile} disabled={updating}>
                            {updating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>

                          <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600">{profileData.bio || "No bio available"}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{profileData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{profileData.phone || "Not provided"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{profileData.location || "Not provided"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{profileData.joinDate ? profileData.joinDate.toLocaleDateString() : "Joined recently"}</span>
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
                  <div className="text-2xl font-bold text-blue-600">{activityStats.likedPosts}</div>
                  <div className="text-sm text-gray-600">Liked Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{activityStats.documentsSummarized}</div>
                  <div className="text-sm text-gray-600">Documents Summarized</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{activityStats.comments}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{activityStats.aiChats}</div>
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
              <Badge variant="secondary">{activityStats.likedPosts} posts</Badge>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : likedPosts.length > 0 ? (
              <div className="space-y-4">
                {likedPosts.map((post) => (
                  <Card key={post._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {post.tags[0] || "General"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link href={`/community/post/${post._id}`}>
                            <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                              {post.title}
                            </h4>
                          </Link>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {post.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes.length}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No liked posts yet</h3>
                  <p className="text-gray-600 mb-4">Posts you like will appear here</p>
                  <Button asChild>
                    <Link href="/community">Browse Community</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case "documents":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documents Summarized</h2>
              <Badge variant="secondary">{activityStats.documentsSummarized} documents</Badge>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <Card key={doc._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{doc.filename}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                            {doc.summary}
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/summarizer">View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents summarized yet</h3>
                  <p className="text-gray-600 mb-4">Upload and summarize your legal documents</p>
                  <Button asChild>
                    <Link href="/summarizer">Upload Document</Link>
                  </Button>
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
              <Badge variant="secondary">{activityStats.comments} comments</Badge>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : userComments.length > 0 ? (
              <div className="space-y-4">
                {userComments.map((comment) => (
                  <Card key={comment._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" alt={user?.name || "user"} />
                          <AvatarFallback>{user?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{user?.name || "You"}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">on</span>
                            <Link href={`/community/post/${comment.postId._id}`}>
                              <span className="text-xs text-blue-600 hover:text-blue-800">
                                {comment.postId.title}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                  <p className="text-gray-600 mb-4">Your comments on posts will appear here</p>
                  <Button asChild>
                    <Link href="/community">Join Discussions</Link>
                  </Button>
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

            {profileData.role === "lawyer" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Subscription Management</h3>
                    <p className="text-gray-600 mb-4">Manage your lawyer subscription and billing</p>
                    <Button asChild>
                      <Link href="/subscription">Manage Subscription</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Free Access</h3>
                  <p className="text-gray-600 mb-4">As a client, you have unlimited access to all features at no cost!</p>
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

  // Load tab-specific data when activeTab changes
  useEffect(() => {
    if (activeTab === "liked" && likedPosts.length === 0) {
      loadLikedPosts()
    } else if (activeTab === "comments" && userComments.length === 0) {
      loadUserComments()
    } else if (activeTab === "documents" && documents.length === 0) {
      loadDocuments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

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
