"use client"

import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockSavedPosts = [
  {
    id: "3",
    title: "Landlord-Tenant Rights: Security Deposit Issues",
    author: "Mike Chen",
    category: "Real Estate Law",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    excerpt: "My landlord is refusing to return my security deposit claiming damages that were pre-existing...",
  },
  {
    id: "4",
    title: "Contract Review Best Practices",
    author: "Attorney Smith",
    category: "Contract Law",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    excerpt: "Here are the key things to look for when reviewing any legal contract...",
  },
]

export default function SavedPostsPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Posts</h1>
              <p className="text-gray-600">Posts you've saved for later reference</p>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {mockSavedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link href={`/community/post/${post.id}`}>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>by {post.author}</span>
                        <Badge variant="outline">{post.category}</Badge>
                        <span>Saved {post.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-blue-600 fill-current ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockSavedPosts.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved posts yet</h3>
                  <p className="text-gray-600 mb-4">Posts you save will appear here</p>
                  <Button asChild>
                    <Link href="/community">Browse Community</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
