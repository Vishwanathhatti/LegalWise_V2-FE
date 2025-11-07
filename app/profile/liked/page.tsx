"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface LikedPost {
  _id: string
  title: string
  description: string
  author: {
    _id: string
    name: string
  }
  tags: string[]
  likes: any[]
  comments: any[]
  createdAt: string
}

export default function LikedPostsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        setLoading(true)
        const response = await api.getLikedPosts()
        if (response.success) {
          setLikedPosts(response.likedPosts)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load liked posts",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadLikedPosts()
  }, [toast])

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : likedPosts.length > 0 ? (
              likedPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link href={`/community/post/${post._id}`}>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span>by {post.author.name}</span>
                          {post.tags.length > 0 && (
                            <Badge variant="outline">{post.tags[0]}</Badge>
                          )}
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-red-600 ml-4">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-sm">{post.likes.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
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
