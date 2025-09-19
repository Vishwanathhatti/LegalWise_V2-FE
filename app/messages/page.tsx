"use client"

import { useState, useRef, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, MessageSquare } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: "text" | "file" | "image"
}

interface Conversation {
  id: string
  participant: {
    name: string
    avatar: string
    role: "user" | "lawyer"
    online: boolean
  }
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-msg",
      role: "lawyer",
      online: true,
    },
    lastMessage: "I'll review the contract and get back to you by tomorrow.",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: "1",
        content: "Hi! I need help reviewing an employment contract.",
        sender: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "text",
      },
      {
        id: "2",
        content: "I'd be happy to help you with that. Could you please share the contract document?",
        sender: "Sarah Johnson",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: "text",
      },
      {
        id: "3",
        content: "I'll review the contract and get back to you by tomorrow.",
        sender: "Sarah Johnson",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "2",
    participant: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-msg",
      role: "lawyer",
      online: false,
    },
    lastMessage: "Thank you for the consultation. I'll prepare the documents.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "Thank you for the consultation. I'll prepare the documents.",
        sender: "Michael Chen",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "3",
    participant: {
      name: "Emma Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-msg",
      role: "user",
      online: true,
    },
    lastMessage: "When can we schedule the next meeting?",
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    unreadCount: 1,
    messages: [
      {
        id: "1",
        content: "When can we schedule the next meeting?",
        sender: "Emma Davis",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "4",
    participant: {
      name: "Robert Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert-msg",
      role: "lawyer",
      online: true,
    },
    lastMessage: "The intellectual property filing has been completed successfully.",
    lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "The intellectual property filing has been completed successfully.",
        sender: "Robert Wilson",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
  {
    id: "5",
    participant: {
      name: "Jennifer Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer-msg",
      role: "lawyer",
      online: false,
    },
    lastMessage: "I've prepared the divorce settlement agreement for your review.",
    lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
    unreadCount: 3,
    messages: [
      {
        id: "1",
        content: "I've prepared the divorce settlement agreement for your review.",
        sender: "Jennifer Martinez",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        type: "text",
      },
    ],
  },
]

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showConversationList, setShowConversationList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user?.name || "You",
      timestamp: new Date(),
      type: "text",
    }

    // Update the active conversation
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date(),
    }

    // Update conversations list
    setConversations(conversations.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))

    setActiveConversation(updatedConversation)
    setNewMessage("")

    // Simulate response after a delay
    setTimeout(
      () => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message. I'll get back to you shortly.",
          sender: activeConversation.participant.name,
          timestamp: new Date(),
          type: "text",
        }

        const responseConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, response],
          lastMessage: response.content,
          lastMessageTime: new Date(),
        }

        setConversations(conversations.map((conv) => (conv.id === activeConversation.id ? responseConversation : conv)))

        setActiveConversation(responseConversation)
      },
      1000 + Math.random() * 2000,
    )
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation)
    markAsRead(conversation.id)
    setShowConversationList(false) // Hide conversation list on mobile
  }

  const handleBackToList = () => {
    setShowConversationList(true)
    setActiveConversation(null)
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
                  {filteredConversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                        activeConversation?.id === conversation.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                              <AvatarImage
                                src={conversation.participant.avatar || "/placeholder.svg"}
                                alt={conversation.participant.name}
                              />
                              <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conversation.participant.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base pr-2">
                                {conversation.participant.name}
                              </h4>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {conversation.participant.role}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2 break-words">
                              {conversation.lastMessage}
                            </p>

                            <p className="text-xs text-gray-400">
                              {conversation.lastMessageTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                            src={activeConversation.participant.avatar || "/placeholder.svg"}
                            alt={activeConversation.participant.name}
                          />
                          <AvatarFallback>{activeConversation.participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {activeConversation.participant.online && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {activeConversation.participant.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {activeConversation.participant.online ? "Online" : "Offline"} •{" "}
                          {activeConversation.participant.role}
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
                        {activeConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === user?.name ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex space-x-2 sm:space-x-3 max-w-xs sm:max-w-2xl ${message.sender === user?.name ? "flex-row-reverse space-x-reverse" : ""}`}
                            >
                              <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                                {message.sender === user?.name ? (
                                  <>
                                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                  </>
                                ) : (
                                  <>
                                    <AvatarImage src={activeConversation.participant.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{activeConversation.participant.name.charAt(0)}</AvatarFallback>
                                  </>
                                )}
                              </Avatar>
                              <div
                                className={`rounded-lg p-2 sm:p-3 min-w-0 ${
                                  message.sender === user?.name
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                <p className="text-xs sm:text-sm break-words">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.sender === user?.name ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
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
    </ProtectedRoute>
  )
}
