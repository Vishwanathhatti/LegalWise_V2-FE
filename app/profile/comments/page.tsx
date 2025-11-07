"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UserComment {
  _id: string
  content: string
  postId: {
    _id: string
    title: string
  }
  createdAt: string
}

export default function CommentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [comments, setComments] = useState<UserComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserComments = async () => {
      try {
        setLoading(true)
        const response = await api.getUserComments()
        if (response.success) {
          setComments(response.userComments)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load comments",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserComments()
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Comments</h1>
              <p className="text-gray-600">Posts where you've shared your thoughts</p>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <Link href={`/community/post/${comment.postId._id}`}>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                        {comment.postId.title}
                      </h3>
                    </Link>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">Your comment:</span>
                      </div>
                      <p className="text-sm text-gray-700 pl-6">"{comment.content}"</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>Commented {new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
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
        </main>
      </div>
    </ProtectedRoute>
  )
}
