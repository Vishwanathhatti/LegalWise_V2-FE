"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Trash2, Heart, MessageCircle, TrendingUp } from "lucide-react"

// Sample posts data
const posts = [
  {
    id: 1,
    title: "Understanding Employment Contracts in 2024",
    author: "Sarah Johnson",
    authorAvatar: "/placeholder.svg",
    topic: "Employment Law",
    createdAt: "2024-01-20",
    likes: 156,
    comments: 43,
    views: 2340,
    trending: true,
    content: "Employment contracts have evolved significantly in 2024. Here are the key changes you need to know...",
  },
  {
    id: 2,
    title: "New Real Estate Laws: What You Need to Know",
    author: "Michael Chen",
    authorAvatar: "/placeholder.svg",
    topic: "Real Estate",
    createdAt: "2024-01-19",
    likes: 134,
    comments: 38,
    views: 1890,
    trending: true,
    content: "Recent changes in real estate legislation affect both buyers and sellers...",
  },
  {
    id: 3,
    title: "Family Law Updates and Recent Court Decisions",
    author: "Emily Davis",
    authorAvatar: "/placeholder.svg",
    topic: "Family Law",
    createdAt: "2024-01-18",
    likes: 98,
    comments: 29,
    views: 1560,
    trending: false,
    content: "The latest court decisions in family law cases have set new precedents...",
  },
  {
    id: 4,
    title: "Contract Disputes: Prevention and Resolution",
    author: "Robert Wilson",
    authorAvatar: "/placeholder.svg",
    topic: "Contract Law",
    createdAt: "2024-01-17",
    likes: 87,
    comments: 22,
    views: 1230,
    trending: false,
    content: "Contract disputes can be costly and time-consuming. Here's how to prevent them...",
  },
  {
    id: 5,
    title: "Criminal Defense Strategies in Modern Courts",
    author: "Lisa Anderson",
    authorAvatar: "/placeholder.svg",
    topic: "Criminal Law",
    createdAt: "2024-01-16",
    likes: 76,
    comments: 18,
    views: 980,
    trending: false,
    content: "Modern criminal defense requires understanding of both traditional and digital evidence...",
  },
]

export default function PostManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [topicFilter, setTopicFilter] = useState("all")
  const [sortFilter, setSortFilter] = useState("recent")
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.topic.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTopic = topicFilter === "all" || post.topic.toLowerCase().includes(topicFilter.toLowerCase())

      return matchesSearch && matchesTopic
    })
    .sort((a, b) => {
      switch (sortFilter) {
        case "trending":
          return b.trending ? 1 : -1
        case "most-liked":
          return b.likes - a.likes
        case "most-commented":
          return b.comments - a.comments
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleDeletePost = (postId: number) => {
    // Handle post deletion
    console.log("Deleting post:", postId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage community posts and content moderation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((p) => p.trending).length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.likes, 0)}</div>
            <p className="text-xs text-muted-foreground">All posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.comments, 0)}</div>
            <p className="text-xs text-muted-foreground">All posts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Manage and moderate community posts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="employment">Employment Law</SelectItem>
                <SelectItem value="real estate">Real Estate</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="contract">Contract Law</SelectItem>
                <SelectItem value="criminal">Criminal Law</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
                <SelectItem value="most-commented">Most Commented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Topic</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium truncate">{post.title}</div>
                        <div className="text-sm text-gray-500 md:hidden">by {post.author}</div>
                        {post.trending && (
                          <Badge className="mt-1 bg-orange-100 text-orange-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{post.author}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline">{post.topic}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{post.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPost(post)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Post Details Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>View and manage post content</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedPost.authorAvatar || "/placeholder.svg"} alt={selectedPost.author} />
                      <AvatarFallback>{selectedPost.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{selectedPost.author}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedPost.createdAt}</span>
                  <Badge variant="outline">{selectedPost.topic}</Badge>
                </div>
              </div>

              <div className="prose max-w-none">
                <p>{selectedPost.content}</p>
              </div>

              <div className="flex items-center space-x-6 py-4 border-t border-b">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{selectedPost.likes} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>{selectedPost.comments} comments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span>{selectedPost.views} views</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm">
                  Edit Post
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDeletePost(selectedPost.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
