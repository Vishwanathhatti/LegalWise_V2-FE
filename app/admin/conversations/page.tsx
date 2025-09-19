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
import { Search, Eye, Bot, MessageSquare, Flag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample AI conversations data
const aiConversations = [
  {
    id: 1,
    userId: 1,
    userName: "John Smith",
    userAvatar: "/placeholder.svg",
    messageCount: 15,
    lastMessage: "Thank you for the contract advice!",
    lastMessageTime: "2024-01-20T14:30:00Z",
    topic: "Contract Law",
    flagged: false,
  },
  {
    id: 2,
    userId: 2,
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg",
    messageCount: 8,
    lastMessage: "Can you help me understand employment rights?",
    lastMessageTime: "2024-01-20T12:15:00Z",
    topic: "Employment Law",
    flagged: false,
  },
  {
    id: 3,
    userId: 3,
    userName: "Mike Wilson",
    userAvatar: "/placeholder.svg",
    messageCount: 23,
    lastMessage: "This AI is giving wrong legal advice!",
    lastMessageTime: "2024-01-20T10:45:00Z",
    topic: "General",
    flagged: true,
  },
]

// Sample direct messages data
const directMessages = [
  {
    id: 1,
    participants: ["John Smith", "Sarah Johnson"],
    participantAvatars: ["/placeholder.svg", "/placeholder.svg"],
    messageCount: 12,
    lastMessage: "Thanks for the consultation!",
    lastMessageTime: "2024-01-20T16:20:00Z",
    flagged: false,
  },
  {
    id: 2,
    participants: ["Mike Wilson", "Emily Davis"],
    participantAvatars: ["/placeholder.svg", "/placeholder.svg"],
    messageCount: 5,
    lastMessage: "When can we schedule the meeting?",
    lastMessageTime: "2024-01-20T11:30:00Z",
    flagged: false,
  },
  {
    id: 3,
    participants: ["Robert Taylor", "Lisa Anderson"],
    participantAvatars: ["/placeholder.svg", "/placeholder.svg"],
    messageCount: 8,
    lastMessage: "This is inappropriate content",
    lastMessageTime: "2024-01-19T18:45:00Z",
    flagged: true,
  },
]

export default function ConversationsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [flagFilter, setFlagFilter] = useState("all")
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [conversationType, setConversationType] = useState<"ai" | "dm">("ai")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const filteredAIConversations = aiConversations.filter((conv) => {
    const matchesSearch =
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFlag =
      flagFilter === "all" ||
      (flagFilter === "flagged" && conv.flagged) ||
      (flagFilter === "unflagged" && !conv.flagged)

    return matchesSearch && matchesFlag
  })

  const filteredDirectMessages = directMessages.filter((dm) => {
    const matchesSearch =
      dm.participants.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      dm.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFlag =
      flagFilter === "all" || (flagFilter === "flagged" && dm.flagged) || (flagFilter === "unflagged" && !dm.flagged)

    return matchesSearch && matchesFlag
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conversations & Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor AI conversations and direct messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiConversations.length}</div>
            <p className="text-xs text-muted-foreground">Active chats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{directMessages.length}</div>
            <p className="text-xs text-muted-foreground">User conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {[...aiConversations, ...directMessages].filter((c) => c.flagged).length}
            </div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...aiConversations, ...directMessages].reduce((sum, c) => sum + c.messageCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All conversations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>Monitor and moderate user conversations and AI interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={flagFilter} onValueChange={setFlagFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conversations</SelectItem>
                <SelectItem value="flagged">Flagged Only</SelectItem>
                <SelectItem value="unflagged">Not Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">AI Conversations</TabsTrigger>
              <TabsTrigger value="dm">Direct Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Topic</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Message</TableHead>
                      <TableHead className="hidden lg:table-cell">Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAIConversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={conversation.userAvatar || "/placeholder.svg"}
                                alt={conversation.userName}
                              />
                              <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{conversation.userName}</div>
                              <div className="text-sm text-gray-500 md:hidden">{conversation.topic}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{conversation.topic}</Badge>
                        </TableCell>
                        <TableCell>{conversation.messageCount}</TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                          {conversation.lastMessage}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDate(conversation.lastMessageTime)}
                        </TableCell>
                        <TableCell>
                          {conversation.flagged ? (
                            <Badge className="bg-red-100 text-red-800">
                              <Flag className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedConversation(conversation)
                              setConversationType("ai")
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="dm" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participants</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Message</TableHead>
                      <TableHead className="hidden lg:table-cell">Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDirectMessages.map((dm) => (
                      <TableRow key={dm.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {dm.participantAvatars.map((avatar, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={avatar || "/placeholder.svg"} alt={dm.participants[index]} />
                                  <AvatarFallback>{dm.participants[index].charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="text-sm">{dm.participants.join(" & ")}</div>
                          </div>
                        </TableCell>
                        <TableCell>{dm.messageCount}</TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{dm.lastMessage}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(dm.lastMessageTime)}</TableCell>
                        <TableCell>
                          {dm.flagged ? (
                            <Badge className="bg-red-100 text-red-800">
                              <Flag className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedConversation(dm)
                              setConversationType("dm")
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Conversation Details Dialog */}
      <Dialog open={!!selectedConversation} onOpenChange={() => setSelectedConversation(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {conversationType === "ai" ? "AI Conversation Details" : "Direct Message Details"}
            </DialogTitle>
            <DialogDescription>View conversation history and moderate content</DialogDescription>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-4">
              {conversationType === "ai" ? (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedConversation.userAvatar || "/placeholder.svg"}
                        alt={selectedConversation.userName}
                      />
                      <AvatarFallback>{selectedConversation.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.userName}</h3>
                      <p className="text-sm text-gray-500">Topic: {selectedConversation.topic}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Messages:</strong> {selectedConversation.messageCount}
                    </p>
                    <p className="text-sm">
                      <strong>Last Message:</strong> {selectedConversation.lastMessage}
                    </p>
                    <p className="text-sm">
                      <strong>Time:</strong> {formatDate(selectedConversation.lastMessageTime)}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex -space-x-2">
                      {selectedConversation.participantAvatars.map((avatar: string, index: number) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-white">
                          <AvatarImage
                            src={avatar || "/placeholder.svg"}
                            alt={selectedConversation.participants[index]}
                          />
                          <AvatarFallback>{selectedConversation.participants[index].charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.participants.join(" & ")}</h3>
                      <p className="text-sm text-gray-500">Direct Message</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Messages:</strong> {selectedConversation.messageCount}
                    </p>
                    <p className="text-sm">
                      <strong>Last Message:</strong> {selectedConversation.lastMessage}
                    </p>
                    <p className="text-sm">
                      <strong>Time:</strong> {formatDate(selectedConversation.lastMessageTime)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t">
                <Button size="sm">View Full Conversation</Button>
                <Button variant="outline" size="sm">
                  {selectedConversation.flagged ? "Remove Flag" : "Flag Content"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
