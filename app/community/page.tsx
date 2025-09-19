"use client"

import { useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Search, Plus, TrendingUp, Clock, Filter } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: "user" | "lawyer"
    verified?: boolean
  }
  category: string
  likes: number
  comments: number
  timestamp: Date
  isLiked?: boolean
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Understanding Employment Contract Terms",
    content:
      'I recently received an employment contract and there are some clauses I don\'t understand. Can someone help explain what "non-compete" really means in practical terms?',
    author: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      role: "user",
    },
    category: "Employment Law",
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Landlord-Tenant Rights: Security Deposit Issues",
    content:
      "My landlord is refusing to return my security deposit claiming damages that were pre-existing. What are my rights as a tenant? Has anyone dealt with similar situations?",
    author: {
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      role: "user",
    },
    category: "Real Estate Law",
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Small Business Legal Requirements - Getting Started",
    content:
      "As a lawyer specializing in business law, I often get asked about the essential legal steps when starting a small business. Here's a comprehensive guide...",
    author: {
      name: "Attorney Lisa Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      role: "lawyer",
      verified: true,
    },
    category: "Business Law",
    likes: 45,
    comments: 15,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Divorce Proceedings: What to Expect",
    content:
      "Going through a divorce can be overwhelming. I want to share my experience and what I learned about the process to help others who might be in similar situations.",
    author: {
      name: "Jennifer Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      role: "user",
    },
    category: "Family Law",
    likes: 32,
    comments: 22,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
]

const categories = [
  "All Categories",
  "Employment Law",
  "Real Estate Law",
  "Business Law",
  "Family Law",
  "Criminal Law",
  "Personal Injury",
  "Immigration Law",
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
  const [showFilters, setShowFilters] = useState(false)

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )
  }

  const filteredPosts = posts
    .filter(
      (post) =>
        (selectedCategory === "All Categories" || post.category === selectedCategory) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.likes - a.likes
      }
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Connect with others and share legal knowledge</p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/community/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>

          {/* Mobile Search and Filter Toggle */}
          <div className="lg:hidden mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Sort
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar - Hidden on mobile unless toggled */}
            <div className={`lg:col-span-1 space-y-4 sm:space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              {/* Search - Desktop only */}
              <Card className="hidden lg:block">
                <CardHeader className="pb-3">
                  <h3 className="font-semibold">Search Posts</h3>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold">Categories</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Sort Options */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold">Sort By</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setSortBy("recent")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                      sortBy === "recent" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Most Recent
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                      sortBy === "popular" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Most Popular
                  </button>
                </CardContent>
              </Card>

              {/* Hide filters button on mobile */}
              <Button variant="outline" onClick={() => setShowFilters(false)} className="w-full lg:hidden">
                Hide Filters
              </Button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-600">
                  {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{post.author.name}</h3>
                          <div className="flex items-center space-x-2">
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified {post.author.role === "lawyer" ? "Lawyer" : "User"}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {post.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Link href={`/community/post/${post.id}`}>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-3">{post.content}</p>

                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              post.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                            <span>{post.likes}</span>
                          </button>

                          <Link
                            href={`/community/post/${post.id}`}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card>
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
