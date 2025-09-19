"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { Heart, MessageCircle, ArrowLeft, Reply } from "lucide-react"

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: "user" | "lawyer"
    verified?: boolean
  }
  timestamp: Date
  likes: number
  isLiked?: boolean
  replies?: Comment[]
}

const mockPost = {
  id: "1",
  title: "Understanding Employment Contract Terms",
  content: `I recently received an employment contract and there are some clauses I don't understand. Can someone help explain what "non-compete" really means in practical terms?

The contract states that I cannot work for a competitor for 2 years after leaving the company. This seems quite restrictive - is this normal? What happens if I violate this clause?

I'm particularly concerned about:
1. How broadly "competitor" is defined
2. Whether this applies if I'm laid off
3. If there are any exceptions for certain types of work

Any advice would be greatly appreciated!`,
  author: {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "user" as const,
  },
  category: "Employment Law",
  likes: 24,
  comments: 8,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  isLiked: false,
}

const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "Non-compete clauses can vary significantly by state. In general, they need to be reasonable in scope, duration, and geographic area to be enforceable. A 2-year period might be considered excessive depending on your industry.",
    author: {
      name: "Attorney Michael Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      role: "lawyer",
      verified: true,
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 12,
    replies: [
      {
        id: "1-1",
        content: "Thank you for the response! I'm in California - does that make a difference?",
        author: {
          name: "Sarah Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          role: "user",
        },
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 3,
      },
    ],
  },
  {
    id: "2",
    content:
      'I had a similar situation last year. The key is to negotiate before signing. You might be able to get them to reduce the time period or narrow the definition of "competitor".',
    author: {
      name: "Jennifer Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
      role: "user",
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 8,
  },
]

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState(mockPost)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleLikePost = () => {
    setPost((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }))
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          : comment,
      ),
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: user?.name || "Anonymous",
        avatar: user?.avatar || "",
        role: user?.role || "user",
      },
      timestamp: new Date(),
      likes: 0,
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: {
        name: user?.name || "Anonymous",
        avatar: user?.avatar || "",
        role: user?.role || "user",
      },
      timestamp: new Date(),
      likes: 0,
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment,
      ),
    )
    setReplyContent("")
    setReplyingTo(null)
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

          {/* Post */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{post.timestamp.toLocaleDateString()}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleLikePost}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        post.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
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
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
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
                  <div key={comment.id} className="border-l-2 border-gray-100 pl-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900">{comment.author.name}</h4>
                          {comment.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified {comment.author.role === "lawyer" ? "Lawyer" : "User"}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{comment.timestamp.toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-700 text-sm mb-2">{comment.content}</p>

                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center space-x-1 text-xs transition-colors ${
                              comment.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
                            <span>{comment.likes}</span>
                          </button>

                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Reply className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="mb-2 text-sm"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!replyContent.trim()}
                                >
                                  Reply
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-3 border-l-2 border-gray-50 pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={reply.author.avatar || "/placeholder.svg"}
                                    alt={reply.author.name}
                                  />
                                  <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium text-xs text-gray-900">{reply.author.name}</h5>
                                    <span className="text-xs text-gray-500">
                                      {reply.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>

                                  <p className="text-gray-700 text-xs mb-1">{reply.content}</p>

                                  <button
                                    className={`flex items-center space-x-1 text-xs transition-colors ${
                                      reply.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${reply.isLiked ? "fill-current" : ""}`} />
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
