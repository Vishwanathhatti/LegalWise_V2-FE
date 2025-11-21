"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { Heart, MessageCircle, ArrowLeft, Reply, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Post {
  _id: string
  title: string
  description: string
  author: {
    _id: string
    name: string
  }
  tags: string[]
  likes: { userId: string; _id: string }[]
  comments: string[]
  createdAt: string
}

interface Comment {
  _id: string
  content: string
  text?: string // Keep for backward compatibility
  author?: {
    _id: string
    name: string
  }
  userId?: {
    _id: string
    name: string
    email: string
  }
  postId?: string
  post?: string
  likes: { userId: string; _id: string }[]
  createdAt: string
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postId = params.id as string

        // Validate that postId is a valid ObjectId format
        if (!postId || postId === 'user' || postId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(postId)) {
          toast({
            title: "Invalid Post ID",
            description: "The post ID in the URL is invalid. Please navigate from a valid post link.",
            variant: "destructive",
          })
          // Redirect to community page after a short delay
          setTimeout(() => {
            router.push('/community')
          }, 2000)
          setLoading(false)
          return
        }

        const postResponse = await api.getSinglePost(postId)
        setPost(postResponse.post)

        const commentsResponse = await api.getPostComments(postId)
        // The backend returns the post object with populated comments
        const postWithComments = commentsResponse.comments
        setComments(postWithComments?.comments || [])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load post",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPostAndComments()
    }
  }, [params.id, toast])

  const handleLikePost = async () => {
    if (!post || !user) return

    try {
      const isLiked = post.likes.some(like => like.userId === user.id)
      if (isLiked) {
        await api.unlikePost(post._id)
        setPost(prev => prev ? { ...prev, likes: prev.likes.filter(like => like.userId !== user.id) } : null)
      } else {
        await api.likePost(post._id)
        // Optimistically add the like. We use a temp ID since the real one comes from backend
        setPost(prev => prev ? { ...prev, likes: [...prev.likes, { userId: user.id, _id: 'temp-id' }] } : null)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      })
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      const comment = comments.find(c => c._id === commentId)
      if (!comment) return

      const isLiked = comment.likes.some(like => like.userId === user.id)
      if (isLiked) {
        await api.unlikeComment(commentId)
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: c.likes.filter(like => like.userId !== user.id) } : c))
      } else {
        await api.likeComment(commentId)
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: [...c.likes, { userId: user.id, _id: 'temp-id' }] } : c))
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to like comment",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post) return

    try {
      await api.addComment(post._id, newComment.trim())
      // Refresh comments
      const commentsResponse = await api.getPostComments(post._id)
      const postWithComments = commentsResponse.comments
      setComments(postWithComments?.comments || [])
      setNewComment("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return

    try {
      await api.deleteComment(commentId)
      // Refresh comments
      const commentsResponse = await api.getPostComments(post!._id)
      const postWithComments = commentsResponse.comments
      setComments(postWithComments?.comments || [])
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Button>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : post ? (
            <>
              {/* Post */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {post.tags[0] || "General"}
                        </Badge>
                        <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                      <div className="prose max-w-none mb-6">
                        <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <button
                          onClick={handleLikePost}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            post.likes.some(like => like.userId === user?.id) ? "text-red-600" : "text-gray-500 hover:text-red-600"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.likes.some(like => like.userId === user?.id) ? "fill-current" : ""}`} />
                          <span>{post.likes.length}</span>
                        </button>

                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Comments ({comments.length})</h2>

                  {/* New Comment Form */}
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-2"
                        />
                        <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border-l-2 border-gray-100 pl-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage alt={comment.userId?.name || 'Unknown'} />
                            <AvatarFallback>{comment.userId?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm text-gray-900">{comment.userId?.name || 'Unknown User'}</h4>
                              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>

                            <p className="text-gray-700 text-sm mb-2">{comment.content || comment.text}</p>

                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleLikeComment(comment._id)}
                                className={`flex items-center space-x-1 text-xs transition-colors ${
                                  comment.likes.some(like => like.userId === user?.id) ? "text-red-600" : "text-gray-500 hover:text-red-600"
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${comment.likes.some(like => like.userId === user?.id) ? "fill-current" : ""}`} />
                                <span>{comment.likes.length}</span>
                              </button>

                              {/* Delete comment button - only show for comment author */}
                              {user && comment.userId && comment.userId._id === user.id && (
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center">Post not found</div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
