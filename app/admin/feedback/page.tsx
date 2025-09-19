"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, MessageSquare, Star, HelpCircle, Bug, Lightbulb, AlertTriangle } from "lucide-react"

// Sample feedback data
const feedbackData = [
  {
    id: 1,
    category: "Bug Report",
    message:
      "The search function is not working properly on mobile devices. It keeps crashing when I try to search for lawyers.",
    submittedBy: "John Smith",
    submitterAvatar: "/placeholder.svg",
    submitterEmail: "john.smith@email.com",
    date: "2024-01-20T10:30:00Z",
    status: "Pending",
    priority: "High",
    rating: null,
  },
  {
    id: 2,
    category: "Feature Request",
    message:
      "It would be great to have a dark mode option for the platform. Many users prefer dark themes for better eye comfort.",
    submittedBy: "Sarah Johnson",
    submitterAvatar: "/placeholder.svg",
    submitterEmail: "sarah.johnson@email.com",
    date: "2024-01-19T14:20:00Z",
    status: "Resolved",
    priority: "Medium",
    rating: 5,
  },
  {
    id: 3,
    category: "General Feedback",
    message:
      "The platform is excellent! The AI assistant is very helpful and the lawyer matching system works perfectly.",
    submittedBy: "Michael Chen",
    submitterAvatar: "/placeholder.svg",
    submitterEmail: "michael.chen@email.com",
    date: "2024-01-18T09:15:00Z",
    status: "Resolved",
    priority: "Low",
    rating: 5,
  },
  {
    id: 4,
    category: "Technical Issue",
    message: "I'm having trouble uploading documents. The upload keeps failing with large PDF files over 5MB.",
    submittedBy: "Emily Davis",
    submitterAvatar: "/placeholder.svg",
    submitterEmail: "emily.davis@email.com",
    date: "2024-01-17T16:45:00Z",
    status: "Pending",
    priority: "High",
    rating: null,
  },
  {
    id: 5,
    category: "Feature Request",
    message:
      "Please add a notification system for new messages and updates. Email notifications would be very helpful.",
    submittedBy: "Robert Wilson",
    submitterAvatar: "/placeholder.svg",
    submitterEmail: "robert.wilson@email.com",
    date: "2024-01-16T11:30:00Z",
    status: "Pending",
    priority: "Medium",
    rating: null,
  },
]

export default function FeedbackAndSupport() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const getStatusBadge = (status: string) => {
    return status === "Resolved" ? (
      <Badge className="bg-green-100 text-green-800">Resolved</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Bug Report":
        return <Bug className="h-4 w-4 text-red-500" />
      case "Feature Request":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "Technical Issue":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "General Feedback":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getRatingStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 text-sm">({rating}/5)</span>
      </div>
    )
  }

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesSearch =
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || feedback.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || feedback.status.toLowerCase() === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSendReply = () => {
    if (replyMessage.trim() && selectedFeedback) {
      console.log("Sending reply to feedback:", selectedFeedback.id, replyMessage)
      setReplyMessage("")
      // Update status to resolved
      setSelectedFeedback(null)
    }
  }

  const handleMarkResolved = (feedbackId: number) => {
    console.log("Marking feedback as resolved:", feedbackId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feedback & Support</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user feedback and support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {feedbackData.filter((f) => f.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {feedbackData.filter((f) => f.status === "Resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>Review and respond to user feedback and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bug report">Bug Report</SelectItem>
                <SelectItem value="feature request">Feature Request</SelectItem>
                <SelectItem value="technical issue">Technical Issue</SelectItem>
                <SelectItem value="general feedback">General Feedback</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feedback Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead className="hidden lg:table-cell">Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(feedback.category)}
                        <span className="text-sm font-medium">{feedback.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={feedback.submitterAvatar || "/placeholder.svg"}
                            alt={feedback.submittedBy}
                          />
                          <AvatarFallback>{feedback.submittedBy.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{feedback.submittedBy}</div>
                          <div className="text-xs text-gray-500 md:hidden">{feedback.message.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px]">
                      <p className="text-sm truncate">{feedback.message}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{getPriorityBadge(feedback.priority)}</TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell className="hidden xl:table-cell">{formatDate(feedback.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedFeedback(feedback)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {feedback.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkResolved(feedback.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Details Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>Review feedback and send a response</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedFeedback.submitterAvatar || "/placeholder.svg"}
                    alt={selectedFeedback.submittedBy}
                  />
                  <AvatarFallback>{selectedFeedback.submittedBy.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{selectedFeedback.submittedBy}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(selectedFeedback.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedFeedback.submitterEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(selectedFeedback.category)}
                    <span className="text-sm">{selectedFeedback.category}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <div className="mt-1">{getPriorityBadge(selectedFeedback.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedFeedback.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="mt-1">{getRatingStars(selectedFeedback.rating)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
                  <p className="text-sm">{selectedFeedback.message}</p>
                </div>
              </div>

              {selectedFeedback.status === "Pending" && (
                <div>
                  <label className="text-sm font-medium">Reply</label>
                  <Textarea
                    placeholder="Type your response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t">
                {selectedFeedback.status === "Pending" ? (
                  <>
                    <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                    <Button variant="outline" onClick={() => handleMarkResolved(selectedFeedback.id)}>
                      Mark as Resolved
                    </Button>
                  </>
                ) : (
                  <Badge className="bg-green-100 text-green-800">This feedback has been resolved</Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
