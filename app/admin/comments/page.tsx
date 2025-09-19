"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Flag, Reply, MessageCircle } from "lucide-react"

// Sample comments data with nested structure
const comments = [
  {
    id: 1,
    postId: 1,
    postTitle: "Understanding Employment Contracts in 2024",
    author: "John Smith",
    authorAvatar: "/placeholder.svg",
    content: "This is really helpful! I had no idea about these new regulations.",
    createdAt: "2024-01-20T10:30:00Z",
    flagged: false,
    replies: [
      {
        id: 11,
        author: "Sarah Johnson",
        authorAvatar: "/placeholder.svg",
        content: "Glad you found it useful! Feel free to ask if you have any questions.",
        createdAt: "2024-01-20T11:15:00Z",
        flagged: false,
      },
    ],
  },
  {
    id: 2,
    postId: 1,
    postTitle: "Understanding Employment Contracts in 2024",
    author: "Mike Wilson",
    authorAvatar: "/placeholder.svg",
    content: "I disagree with some of these points. The implementation seems rushed.",
    createdAt: "2024-01-20T09:45:00Z",
    flagged: true,
    replies: [],
  },
  {
    id: 3,
    postId: 2,
    postTitle: "New Real Estate Laws: What You Need to Know",
    author: "Emma Davis",
    authorAvatar: "/placeholder.svg",
    content: "Great breakdown of the new laws. This will definitely impact my upcoming purchase.",
    createdAt: "2024-01-19T16:20:00Z",
    flagged: false,
    replies: [
      {
        id: 31,
        author: "Michael Chen",
        authorAvatar: "/placeholder.svg",
        content: "Make sure to consult with a real estate attorney before proceeding.",
        createdAt: "2024-01-19T17:00:00Z",
        flagged: false,
      },
      {
        id: 32,
        author: "Lisa Brown",
        authorAvatar: "/placeholder.svg",
        content: "I can recommend a good attorney if you need one.",
        createdAt: "2024-01-19T17:30:00Z",
        flagged: false,
      },
    ],
  },
  {
    id: 4,
    postId: 3,
    postTitle: "Family Law Updates and Recent Court Decisions",
    author: "Robert Taylor",
    authorAvatar: "/placeholder.svg",
    content: "This is completely wrong and misleading information!",
    createdAt: "2024-01-18T14:10:00Z",
    flagged: true,
    replies: [],
  },
]

export default function CommentsModeration() {
  const [searchTerm, setSearchTerm] = useState("")
  const [postFilter, setPostFilter] = useState("all")
  const [flagFilter, setFlagFilter] = useState("all")

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPost = postFilter === "all" || comment.postId.toString() === postFilter
    const matchesFlag =
      flagFilter === "all" ||
      (flagFilter === "flagged" && comment.flagged) ||
      (flagFilter === "unflagged" && !comment.flagged)

    return matchesSearch && matchesPost && matchesFlag
  })

  const handleDeleteComment = (commentId: number) => {
    console.log("Deleting comment:", commentId)
  }

  const handleFlagComment = (commentId: number) => {
    console.log("Flagging comment:", commentId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comments Moderation</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and moderate user comments across all posts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Comments</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{comments.filter((c) => c.flagged).length}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Replies</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.filter((c) => c.replies.length > 0).length}</div>
            <p className="text-xs text-muted-foreground">Active discussions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Review and moderate user comments with nested thread view</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={postFilter} onValueChange={setPostFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by post" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="1">Employment Contracts</SelectItem>
                <SelectItem value="2">Real Estate Laws</SelectItem>
                <SelectItem value="3">Family Law Updates</SelectItem>
              </SelectContent>
            </Select>
            <Select value={flagFilter} onValueChange={setFlagFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Comments</SelectItem>
                <SelectItem value="flagged">Flagged Only</SelectItem>
                <SelectItem value="unflagged">Not Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                {/* Main Comment */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      {comment.flagged && (
                        <Badge className="bg-red-100 text-red-800">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      On: <span className="font-medium">{comment.postTitle}</span>
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFlagComment(comment.id)}
                      className={comment.flagged ? "text-red-600" : ""}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-11 mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.author} />
                          <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                            {reply.flagged && (
                              <Badge className="bg-red-100 text-red-800">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagComment(reply.id)}
                            className={reply.flagged ? "text-red-600" : ""}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(reply.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
