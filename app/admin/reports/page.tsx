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
import { Search, Eye, Check, X, Flag, AlertTriangle, MessageSquare, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample reports data
const userReports = [
  {
    id: 1,
    reportedBy: "John Smith",
    reportedByAvatar: "/placeholder.svg",
    reportedUser: "Mike Wilson",
    reportedUserAvatar: "/placeholder.svg",
    reason: "Inappropriate behavior",
    description: "User was being rude and unprofessional in messages",
    status: "Pending",
    createdAt: "2024-01-20T10:30:00Z",
    type: "user",
  },
  {
    id: 2,
    reportedBy: "Sarah Johnson",
    reportedByAvatar: "/placeholder.svg",
    reportedUser: "Robert Taylor",
    reportedUserAvatar: "/placeholder.svg",
    reason: "Spam",
    description: "User is posting spam content repeatedly",
    status: "Resolved",
    createdAt: "2024-01-19T14:20:00Z",
    type: "user",
  },
]

// Sample flagged content data
const flaggedContent = [
  {
    id: 1,
    type: "post",
    title: "This is misleading legal advice",
    author: "Anonymous User",
    authorAvatar: "/placeholder.svg",
    reason: "Misinformation",
    flaggedBy: "System",
    status: "Pending",
    createdAt: "2024-01-20T09:15:00Z",
    content: "This post contains potentially harmful legal misinformation...",
  },
  {
    id: 2,
    type: "comment",
    title: "Inappropriate language in comment",
    author: "Bad User",
    authorAvatar: "/placeholder.svg",
    reason: "Inappropriate content",
    flaggedBy: "Community",
    status: "Pending",
    createdAt: "2024-01-19T16:45:00Z",
    content: "This comment contains inappropriate language and harassment...",
  },
  {
    id: 3,
    type: "post",
    title: "Spam promotional content",
    author: "Spammer",
    authorAvatar: "/placeholder.svg",
    reason: "Spam",
    flaggedBy: "Auto-detection",
    status: "Resolved",
    createdAt: "2024-01-18T11:30:00Z",
    content: "This post is clearly promotional spam content...",
  },
]

export default function ReportsAndFlags() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)

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

  const getContentTypeBadge = (type: string) => {
    return type === "post" ? (
      <Badge variant="outline">
        <FileText className="h-3 w-3 mr-1" />
        Post
      </Badge>
    ) : (
      <Badge variant="outline">
        <MessageSquare className="h-3 w-3 mr-1" />
        Comment
      </Badge>
    )
  }

  const filteredReports = userReports.filter((report) => {
    const matchesSearch =
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredFlaggedContent = flaggedContent.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || content.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleResolveReport = (id: number, type: "report" | "content") => {
    console.log(`Resolving ${type}:`, id)
  }

  const handleDismissReport = (id: number, type: "report" | "content") => {
    console.log(`Dismissing ${type}:`, id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Flags</h1>
        <p className="text-gray-600 dark:text-gray-400">Review user reports and flagged content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userReports.length}</div>
            <p className="text-xs text-muted-foreground">Total reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flaggedContent.length}</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {[...userReports, ...flaggedContent].filter((item) => item.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {[...userReports, ...flaggedContent].filter((item) => item.status === "Resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports & Flagged Content</CardTitle>
          <CardDescription>Review and moderate user reports and automatically flagged content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">User Reports</TabsTrigger>
              <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={report.reportedByAvatar || "/placeholder.svg"}
                                alt={report.reportedBy}
                              />
                              <AvatarFallback>{report.reportedBy.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{report.reportedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={report.reportedUserAvatar || "/placeholder.svg"}
                                alt={report.reportedUser}
                              />
                              <AvatarFallback>{report.reportedUser.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{report.reportedUser}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{report.reason}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(report.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {report.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveReport(report.id, "report")}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDismissReport(report.id, "report")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="flagged" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Flagged By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlaggedContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate font-medium">{content.title}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={content.authorAvatar || "/placeholder.svg"} alt={content.author} />
                              <AvatarFallback>{content.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{content.author}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{getContentTypeBadge(content.type)}</TableCell>
                        <TableCell>{content.reason}</TableCell>
                        <TableCell>{getStatusBadge(content.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{content.flaggedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(content)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {content.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResolveReport(content.id, "content")}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDismissReport(content.id, "content")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.type === "user" ? "Report Details" : "Flagged Content Details"}</DialogTitle>
            <DialogDescription>Review and take action on this item</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.type === "user" ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">Reported By</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={selectedItem.reportedByAvatar || "/placeholder.svg"}
                            alt={selectedItem.reportedBy}
                          />
                          <AvatarFallback>{selectedItem.reportedBy.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedItem.reportedBy}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reported User</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={selectedItem.reportedUserAvatar || "/placeholder.svg"}
                            alt={selectedItem.reportedUser}
                          />
                          <AvatarFallback>{selectedItem.reportedUser.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedItem.reportedUser}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Reason</label>
                      <p className="text-sm text-gray-600">{selectedItem.reason}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-gray-600">{selectedItem.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reported At</label>
                      <p className="text-sm text-gray-600">{formatDate(selectedItem.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-2 mb-4">
                    <div>
                      <label className="text-sm font-medium">Content Title</label>
                      <p className="text-sm text-gray-600">{selectedItem.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Author</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={selectedItem.authorAvatar || "/placeholder.svg"}
                            alt={selectedItem.author}
                          />
                          <AvatarFallback>{selectedItem.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedItem.author}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content Type</label>
                      <div className="mt-1">{getContentTypeBadge(selectedItem.type)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reason for Flagging</label>
                      <p className="text-sm text-gray-600">{selectedItem.reason}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Flagged By</label>
                      <p className="text-sm text-gray-600">{selectedItem.flaggedBy}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content Preview</label>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-1">
                        <p className="text-sm">{selectedItem.content}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.status === "Pending" && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    onClick={() =>
                      handleResolveReport(selectedItem.id, selectedItem.type === "user" ? "report" : "content")
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleDismissReport(selectedItem.id, selectedItem.type === "user" ? "report" : "content")
                    }
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
