"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Trash2, Download, FileText, File, ImageIcon, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface Document {
  _id: string
  title: string
  uploadedBy: string
  uploaderAvatar?: string
  fileType: string
  fileSize: string
  summary: string
  createdAt: string
  downloads: number
  category: string
  fileUrl: string
}

export default function DocumentsOverview() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [fileTypeFilter, setFileTypeFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const { toast } = useToast()

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await api.getAllDocuments()
      if (response.success) {
        setDocuments(response.documents)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "docx":
      case "doc":
        return <File className="h-4 w-4 text-blue-500" />
      case "jpg":
      case "png":
      case "gif":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const getFileTypeBadge = (fileType: string) => {
    const colors = {
      PDF: "bg-red-100 text-red-800",
      DOCX: "bg-blue-100 text-blue-800",
      DOC: "bg-blue-100 text-blue-800",
      JPG: "bg-green-100 text-green-800",
      PNG: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[fileType as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{fileType}</Badge>
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || doc.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesFileType = fileTypeFilter === "all" || doc.fileType.toLowerCase() === fileTypeFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesFileType
  })

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      await api.deleteDocumentAdmin(docId)
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
      fetchDocuments() // Refresh list
      if (selectedDocument?._id === docId) {
        setSelectedDocument(null)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const handleDownloadDocument = (docId: string) => {
    const doc = documents.find(d => d._id === docId)
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage uploaded documents and templates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">All uploads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.reduce((sum, doc) => sum + doc.downloads, 0)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter((d) => d.fileType === "PDF").length}</div>
            <p className="text-xs text-muted-foreground">PDF files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 GB</div>
            <p className="text-xs text-muted-foreground">Total storage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Manage uploaded documents, templates, and legal forms</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="real estate">Real Estate</SelectItem>
                <SelectItem value="family law">Family Law</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="ip law">IP Law</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="doc">DOC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Uploaded By</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                  <TableHead className="hidden xl:table-cell">Downloads</TableHead>
                  <TableHead className="hidden xl:table-cell">Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading documents...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(document.fileType)}
                          <div className="max-w-[200px]">
                            <div className="font-medium truncate">{document.title}</div>
                            <div className="text-sm text-gray-500 md:hidden">by {document.uploadedBy}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={document.uploaderAvatar} alt={document.uploadedBy} />
                            <AvatarFallback>{document.uploadedBy.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{document.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{document.category}</Badge>
                      </TableCell>
                      <TableCell>{getFileTypeBadge(document.fileType)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{document.fileSize}</TableCell>
                      <TableCell className="hidden xl:table-cell">{document.downloads}</TableCell>
                      <TableCell className="hidden xl:table-cell">{formatDate(document.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(document)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(document._id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(document._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Document Details Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>View document information and manage access</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {getFileTypeIcon(selectedDocument.fileType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedDocument.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={selectedDocument.uploaderAvatar}
                          alt={selectedDocument.uploadedBy}
                        />
                        <AvatarFallback>{selectedDocument.uploadedBy.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedDocument.uploadedBy}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(selectedDocument.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedDocument.category}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">File Type</label>
                  <div className="mt-1">{getFileTypeBadge(selectedDocument.fileType)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">File Size</label>
                  <p className="text-sm text-gray-600">{selectedDocument.fileSize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Downloads</label>
                  <p className="text-sm text-gray-600">{selectedDocument.downloads}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Summary</label>
                <p className="text-sm text-gray-600 mt-1">{selectedDocument.summary}</p>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={() => handleDownloadDocument(selectedDocument._id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDeleteDocument(selectedDocument._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
