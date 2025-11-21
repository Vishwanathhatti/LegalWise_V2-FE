"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useSocket } from "@/components/providers/socket-provider"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, MessageSquare, Star } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  _id: string
  directMessageId: string
  senderId: {
    _id: string
    name: string
    profilePicture?: string
  }
  message: string
  createdAt: string
}

interface Conversation {
  _id: string
  participants: Array<{
    _id: string
    name: string
    profilePicture?: string
    role: string
  }>
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  const { toast } = useToast()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showConversationList, setShowConversationList] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = useMemo(
    () => conversations.find(conv => conv._id === activeConversationId) || null,
    [conversations, activeConversationId]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await api.getDMs()
        const sortedConversations = response.dms.sort((a: Conversation, b: Conversation) => {
          const aLastMessage = a.messages[a.messages.length - 1]
          const bLastMessage = b.messages[b.messages.length - 1]
          if (!aLastMessage && !bLastMessage) return 0
          if (!aLastMessage) return 1
          if (!bLastMessage) return -1
          return new Date(bLastMessage.createdAt).getTime() - new Date(aLastMessage.createdAt).getTime()
        })
        setConversations(sortedConversations)

        if (socket && sortedConversations) {
          sortedConversations.forEach((dm: Conversation) => {
            socket.emit("joinRoom", dm._id)
          })
        }
      } catch (error) {
        console.error("Failed to load conversations:", error)
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) loadConversations()
  }, [user, toast, socket])

  // Socket events
  useEffect(() => {
    if (!socket) return

    socket.on("newMessage", (message: any) => {
      if (!message || !message.senderId) return

      // Skip adding the message if it's from the current user (already added locally)
      if (message.senderId._id === user?.id) return

      const normalizedMessage: Message = {
        ...message,
        _id: message._id || `temp-${Date.now()}`,
        message: message.message || message.content || "",
        senderId: {
          _id: message.senderId?._id || "",
          name: message.senderId?.name || "",
          profilePicture: message.senderId?.profilePicture,
        },
        createdAt: message.createdAt || new Date().toISOString(),
      }

      setConversations(prev =>
        prev
          .map(conv =>
            conv._id === message.directMessageId
              ? {
                  ...conv,
                  messages: [...conv.messages, normalizedMessage],
                  updatedAt: normalizedMessage.createdAt,
                }
              : conv
          )
          .sort((a, b) => {
            const aLastMessage = a.messages[a.messages.length - 1]
            const bLastMessage = b.messages[b.messages.length - 1]
            if (!aLastMessage && !bLastMessage) return 0
            if (!aLastMessage) return 1
            if (!bLastMessage) return -1
            return new Date(bLastMessage.createdAt).getTime() - new Date(aLastMessage.createdAt).getTime()
          })
      )
    })

    socket.on("dmRequestReceived", (request: any) => {
      toast({
        title: "New DM Request",
        description: `You have a new DM request from ${request.senderId.name}`,
      })
      api.getDMs().then(res => setConversations(res.dms)).catch(console.error)
    })

    return () => {
      socket.off("newMessage")
      socket.off("dmRequestReceived")
    }
  }, [socket, toast])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    try {
      const sentMessage = await api.sendMessage(activeConversation._id, newMessage)
      setNewMessage("")

      const updatedMessage: Message = {
        ...sentMessage,
        senderId: {
          _id: user?.id || "",
          name: user?.name || "",
          profilePicture: user?.avatar,
        },
      }

      setConversations(prev =>
        prev.map(conv =>
          conv._id === activeConversation._id
            ? { ...conv, messages: [...conv.messages, updatedMessage], updatedAt: updatedMessage.createdAt }
            : conv
        )
      )
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const otherParticipant = conv.participants.find(p => p._id !== user?.id)
      return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false
    })
  }, [conversations, searchTerm, user?.id])

  const handleConversationSelect = async (conversation: Conversation) => {
    setActiveConversationId(conversation._id)
    setShowConversationList(false)

    try {
      const messages = await api.getDMMessages(conversation._id)
      const lastMessage = messages[messages.length - 1]
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversation._id
            ? { ...conv, messages, updatedAt: lastMessage ? lastMessage.createdAt : conv.updatedAt }
            : conv
        )
      )
    } catch (error) {
      console.error("Failed to load messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    }
  }

  const handleBackToList = () => {
    setShowConversationList(true)
    setActiveConversationId(null)
  }

  const handleRateLawyer = () => {
    setIsRatingDialogOpen(true)
  }

  const handleSubmitRating = async () => {
    if (!activeConversation || rating === 0) return

    const lawyerId = activeConversation.participants.find(p => p._id !== user?.id)?._id
    if (!lawyerId) return

    try {
      await api.submitRating(lawyerId, { rating, review })
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      })
      setIsRatingDialogOpen(false)
      setRating(0)
      setReview("")
    } catch (error) {
      console.error("Failed to submit rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Conversations Sidebar */}
          <div
            className={`bg-white border-r border-gray-200 flex flex-col overflow-hidden ${
              showConversationList ? "w-full md:w-80" : "hidden md:flex md:w-80"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading conversations...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No conversations yet</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const otherParticipant = conversation.participants.find(p => p._id !== user?.id)
                      const lastMessage = conversation.messages[conversation.messages.length - 1]

                      return (
                        <Card
                          key={`${conversation._id}-${conversation.updatedAt}`}
                          className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                            activeConversation?._id === conversation._id ? "bg-blue-50 border-blue-200" : ""
                          }`}
                          onClick={() => handleConversationSelect(conversation)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start space-x-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                                  <AvatarImage
                                    src={otherParticipant?.profilePicture}
                                    alt={otherParticipant?.name}
                                  />
                                  <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {isConnected && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base pr-2">
                                    {otherParticipant?.name}
                                  </h4>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <Badge variant="outline" className="text-xs">
                                      {otherParticipant?.role}
                                    </Badge>
                                  </div>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2 break-words">
                                  {lastMessage ? lastMessage.message : "No messages yet"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) : ""}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col min-w-0 ${showConversationList ? "hidden md:flex" : "flex"}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBackToList}>
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                          <AvatarImage
                            src={activeConversation.participants.find(p => p._id !== user?.id)?.profilePicture}
                            alt={activeConversation.participants.find(p => p._id !== user?.id)?.name}
                          />
                          <AvatarFallback>{activeConversation.participants.find(p => p._id !== user?.id)?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isConnected && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {activeConversation.participants.find(p => p._id !== user?.id)?.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {isConnected ? "Online" : "Offline"} •{" "}
                          {activeConversation.participants.find(p => p._id !== user?.id)?.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      {user?.role !== 'lawyer' && (
                        <Button variant="ghost" size="sm" onClick={handleRateLawyer}>
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <div className="space-y-4 max-w-4xl mx-auto">
                        {activeConversation.messages.map((message) => {
                          if (!message || !message.senderId || !message.senderId._id) return null
                          const isCurrentUser = message.senderId._id === user?.id
                          const otherParticipant = activeConversation.participants.find(p => p._id !== user?.id)

                          return (
                            <div
                              key={message._id}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex space-x-2 sm:space-x-3 max-w-xs sm:max-w-2xl ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                              >
                                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                                  {isCurrentUser ? (
                                    <>
                                      <AvatarImage src={user?.avatar} />
                                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage src={otherParticipant?.profilePicture} />
                                      <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                                <div
                                  className={`rounded-lg p-2 sm:p-3 min-w-0 ${
                                    isCurrentUser
                                      ? "bg-blue-600 text-white"
                                      : "bg-white border border-gray-200"
                                  }`}
                                >
                                  <p className="text-xs sm:text-sm break-words">{message.message}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isCurrentUser ? "text-blue-100" : "text-gray-500"
                                    }`}
                                  >
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Button variant="ghost" size="sm" className="hidden sm:flex">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="sm" className="hidden sm:flex">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Lawyer Service</DialogTitle>
            <DialogDescription>
              Share your experience with {activeConversation?.participants.find(p => p._id !== user?.id)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <div className="col-span-3 flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => setRating(star)}
                    className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="review" className="text-right">
                Review
              </Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your feedback..."
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRating} disabled={rating === 0}>
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}
