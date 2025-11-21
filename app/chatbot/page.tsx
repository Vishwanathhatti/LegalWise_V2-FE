"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import { Send, Bot, Plus, MessageSquare, X, PanelLeftClose, PanelLeftOpen, Upload, FileText } from "lucide-react"
import { api } from "@/lib/api"
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

// Simple HTML sanitizer to fix link URLs and remove code block markers
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/^```html\s*/, '') // Remove opening ```html
    .replace(/\s*```$/, '') // Remove closing ```
    .replace(/<u>(https?:\/\/[^<]+)<\/u>/g, '$1') // Remove <u> tags around URLs
    .replace(/<u>(http?:\/\/[^<]+)<\/u>/g, '$1') // Remove <u> tags around URLs (http)
    .replace(/href="<u>(https?:\/\/[^<]+)<\/u>"/g, 'href="$1"') // Fix href attributes
    .replace(/href="<u>(http?:\/\/[^<]+)<\/u>"/g, 'href="$1"') // Fix href attributes (http)
}

interface Message {
  _id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

interface Conversation {
  _id: string
  title: string
  user: string
  messages: string[]
  createdAt: Date
  updatedAt: Date
}

export default function ChatbotPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const initialConversationId = searchParams.get('conversationId')

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [conversationTitle, setConversationTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSelectConversation = async (conversationId: string) => {
    console.log("Selecting conversation:", conversationId)
    setActiveConversation(conversationId)
    try {
      const response = await api.getMessages(conversationId)
      console.log("Get messages response:", response)
      if (response.success) {
        setMessages(response.conversation.messages.map((msg: any) => ({
          _id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        })))
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log("Loading conversations...")
        const response = await api.getConversations()
        if (response.success) {
          setConversations(response.allConversation)
          
          // Auto-select conversation if query param exists
          if (initialConversationId) {
            console.log("Found initialConversationId:", initialConversationId)
            // We need to wait for conversations to be set, but we can try to select it directly
            // or check if it exists in the response
            const targetConv = response.allConversation.find((c: Conversation) => c._id === initialConversationId)
            if (targetConv) {
              console.log("Found target conversation, selecting...")
              handleSelectConversation(initialConversationId)
            } else {
              console.log("Target conversation not found in list")
            }
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error)
      }
    }

    loadConversations()
  }, [initialConversationId])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeConversation) return

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await api.addMessage(activeConversation, inputValue)
      if (response.success) {
        const botMessage: Message = {
          _id: response.aiMessage._id,
          content: response.aiMessage.content,
          role: "bot",
          timestamp: new Date(response.aiMessage.timestamp),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateBotResponse = (userInput: string): string => {
    const responses = [
      "Based on your question, I'd recommend consulting with a qualified attorney for specific legal advice. However, I can provide some general information...",
      "That's an interesting legal question. Let me break this down for you based on general legal principles...",
      "I understand your concern. Here are some key points to consider from a legal perspective...",
      "This situation involves several legal considerations. Let me explain the relevant laws and your potential options...",
      "Thank you for that question. While I can't provide specific legal advice, I can help you understand the general legal framework...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const startNewConversation = () => {
    setIsDialogOpen(true)
  }

  const handleCreateConversation = async () => {
    if (!conversationTitle.trim()) {
      return
    }
    try {
      const response = await api.createConversation(conversationTitle.trim())
      if (response.success) {
        setActiveConversation(response.conversation._id)
        setMessages([
          {
            _id: Date.now().toString(),
            content: "Hello! I'm your AI legal assistant. How can I help you with your new legal question?",
            role: "bot",
            timestamp: new Date(),
          },
        ])
        setConversations((prev) => [response.conversation, ...prev])
        setIsDialogOpen(false)
        setConversationTitle("")
      }
    } catch (error) {
      console.error("Failed to create conversation:", error)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!activeConversation) return

    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('text')) {
      alert('Please upload PDF or text files only.')
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.')
      return
    }

    setIsUploading(true)

    // Add user message about uploading document
    const userMessage: Message = {
      _id: Date.now().toString(),
      content: `Uploading document: ${file.name}`,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.uploadDocument(formData)

      if (response.success) {
        // Add bot message with summary
        const botMessage: Message = {
          _id: Date.now().toString() + '_bot',
          content: `<p><b>Document Summary: ${file.name}</b></p>
<p>${response.document.summary}</p>
<p><b>Key Points:</b></p>
<ul>
${response.document.extractedData.map((point: string) => `<li>${point}</li>`).join('')}
</ul>
<p><i>This summary was generated using AI analysis of your document.</i></p>`,
          role: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("Failed to upload document:", error)
      const errorMessage: Message = {
        _id: Date.now().toString() + '_error',
        content: "Sorry, I couldn't process your document. Please try again.",
        role: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Desktop Sidebar */}
          <div
            className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
              showSidebar ? "w-80" : "w-0"
            } hidden md:flex`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <Button onClick={startNewConversation} className="flex-1 mr-2">
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Conversations</h3>
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <Card
                        key={conversation._id}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          activeConversation === conversation._id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => handleSelectConversation(conversation._id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{conversation.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
                                {conversation.messages.length > 0 ? "Last message..." : "No messages yet"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(conversation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            } fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 w-80 md:hidden overflow-hidden`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <Button onClick={startNewConversation} className="flex-1 mr-2">
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Conversations</h3>
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <Card
                        key={conversation._id}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          activeConversation === conversation._id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => {
                          handleSelectConversation(conversation._id)
                          setShowSidebar(false)
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{conversation.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
                                {conversation.messages.length > 0 ? "Last message..." : "No messages yet"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(conversation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(true)}>
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                </Button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h2>
                  <p className="text-sm text-gray-500">Always here to help with your legal questions</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            {message.role === "user" ? (
                              <>
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-blue-100">
                                <Bot className="w-4 h-4 text-blue-600" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 min-w-0 ${
                              message.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                            }`}
                          >
                            {message.role === "user" ? (
                              <p className="text-sm break-words">{message.content}</p>
                            ) : (
                              <div
                                className="text-sm prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }}
                              />
                            )}
                            <p
                              className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex space-x-3 max-w-3xl">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100">
                              <Bot className="w-4 h-4 text-blue-600" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about legal matters..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading || isUploading || !activeConversation}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isLoading || isUploading || !activeConversation}
                    title="Upload document for summarization"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={isLoading || isUploading || !inputValue.trim() || !activeConversation}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file)
                      e.target.value = '' // Reset input
                    }
                  }}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI responses are for informational purposes only and don't constitute legal advice.
                  {isUploading && <span className="block text-blue-600 mt-1">Processing document...</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>Enter a title for your new conversation</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={conversationTitle}
                onChange={(e) => setConversationTitle(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateConversation}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}
