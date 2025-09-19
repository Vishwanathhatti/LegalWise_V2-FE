"use client"

import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockLikedPosts = [
  {
    id: "1",
    title: "Understanding Employment Contract Terms",
    author: "Sarah Johnson",
    category: "Employment Law",
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    excerpt: "I recently received an employment contract and there are some clauses I don't understand...",
  },
  {
    id: "2",
    title: "Small Business Legal Requirements - Getting Started",
    author: "Lisa Rodriguez",
    category: "Business Law",
    likes: 45,
    comments: 15,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    excerpt: "As a lawyer specializing in business law, I often get asked about the essential legal steps...",
  },
  {
    id: "3",
    title: "Divorce Proceedings: What to Expect",
    author: "Jennifer Davis",
    category: "Family Law",
    likes: 32,
    comments: 22,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    excerpt: "Going through a divorce can be overwhelming. I want to share my experience...",
  },
]

export default function LikedPostsPage() {
  const router = useRouter()

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Liked Posts</h1>
              <p className="text-gray-600">Posts you've liked in the community</p>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {mockLikedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link href={`/community/post/${post.id}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <Badge variant="outline">{post.category}</Badge>
                        <span>{post.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-red-600 ml-4">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockLikedPosts.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
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
        </main>
      </div>
    </ProtectedRoute>
  )
}
