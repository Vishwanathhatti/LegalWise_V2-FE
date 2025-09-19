"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, Copy, Trash2, Eye, Clock, CheckCircle, X } from "lucide-react"
import { api } from "@/lib/api"

interface SummarizedDocument {
  _id: string
  filename: string
  fileurl: string
  summary: string
  extractedData: string[]
  createdAt: string
  status?: "processing" | "completed" | "error"
}

export default function SummarizerPage() {
  const [documents, setDocuments] = useState<SummarizedDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SummarizedDocument | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load documents on component mount
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await api.getDocuments()
      console.log("API Response:", response)
      if (response.success) {
        // Ensure documents is an array
        const docs = response.documents || []
        // Set default status to 'completed' if missing
        const docsWithStatus = docs.map((doc: any) => ({
          ...doc,
          status: doc.status || "completed",
          extractedData: doc.extractedData || [],
        }))
        setDocuments(docsWithStatus)
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error("Failed to load documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type !== "application/pdf" && !file.type.startsWith("text/")) {
        toast({
          title: "Unsupported file type",
          description: "Please upload PDF or text files only.",
          variant: "destructive",
        })
        continue
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        })
        continue
      }

      setIsProcessing(true)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.uploadDocument(formData)

        if (response.success) {
          setDocuments((prev) => [response.document, ...prev])
          toast({
            title: "Document processed!",
            description: `${file.name} has been successfully summarized.`,
          })
        }
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Upload failed",
          description: "Failed to process the document. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard.",
    })
  }

  const handleDownload = (doc: SummarizedDocument) => {
    const content = `Document Summary: ${doc.filename}\n\nSummary:\n${doc.summary}\n\nKey Points:\n${doc.extractedData.map((point: string) => `• ${point}`).join("\n")}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.filename}_summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (documentId: string) => {
    try {
      await api.deleteDocument(documentId)
      setDocuments(documents.filter((doc) => doc._id !== documentId))
      if (selectedDocument?._id === documentId) {
        setSelectedDocument(null)
      }
      toast({
        title: "Document deleted",
        description: "The document and its summary have been removed.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Document Summarizer</h1>
            <p className="text-gray-600">Upload legal documents to get AI-powered summaries and key insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Area & Document List */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your files here, or</p>
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer">
                        Browse Files
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.txt,.doc,.docx"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Supports PDF, TXT, DOC files up to 10MB</p>
                  </div>
                </CardContent>
              </Card>

              {/* Document List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading documents...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  ) : (
                    documents.map((document) => (
                      <div
                        key={document._id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDocument?._id === document._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDocument(document)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{document.filename}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(document.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(document._id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Display */}
            <div className="lg:col-span-2">
              {selectedDocument ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <span>{selectedDocument.filename}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploaded {new Date(selectedDocument.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(selectedDocument.summary)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(selectedDocument)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedDocument.status === "processing" ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Document</h3>
                        <p className="text-gray-600">Our AI is analyzing your document and generating a summary...</p>
                      </div>
                    ) : selectedDocument.status === "completed" ? (
                      <>
                        {/* Summary */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">{selectedDocument.summary}</p>
                          </div>
                        </div>

                        {/* Key Points */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                          <div className="space-y-2">
                            {selectedDocument.extractedData.map((point: string, index: number) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Document Link */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Document</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <a
                              href={selectedDocument.fileurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View original document</span>
                            </a>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                            <div>
                              <h4 className="font-medium text-yellow-800">Important Disclaimer</h4>
                              <p className="text-sm text-yellow-700 mt-1">
                                This AI-generated summary is for informational purposes only and should not be
                                considered as legal advice. Please consult with a qualified attorney for specific legal
                                guidance.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <X className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Error</h3>
                        <p className="text-gray-600">
                          There was an error processing this document. Please try uploading again.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No document selected</h3>
                    <p className="text-gray-600">Upload a document or select one from the list to view its summary</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
