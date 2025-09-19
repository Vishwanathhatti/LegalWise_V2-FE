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
import { Search, Eye, Check, X, Star } from "lucide-react"

// Sample lawyer data
const lawyers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    specialization: "Contract Law",
    status: "Verified",
    registeredAt: "2024-01-10",
    rating: 4.9,
    cases: 45,
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    specialization: "Family Law",
    status: "Pending",
    registeredAt: "2024-01-18",
    rating: 0,
    cases: 0,
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    specialization: "Employment Law",
    status: "Verified",
    registeredAt: "2024-01-05",
    rating: 4.7,
    cases: 32,
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    specialization: "Real Estate",
    status: "Pending",
    registeredAt: "2024-01-20",
    rating: 0,
    cases: 0,
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    specialization: "Criminal Law",
    status: "Verified",
    registeredAt: "2024-01-12",
    rating: 4.8,
    cases: 28,
    avatar: "/placeholder.svg",
  },
]

export default function LawyerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null)

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lawyer.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    return status === "Verified" ? (
      <Badge className="bg-green-100 text-green-800">Verified</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    )
  }

  const handleVerify = (lawyerId: number) => {
    // Handle lawyer verification
    console.log("Verifying lawyer:", lawyerId)
  }

  const handleReject = (lawyerId: number) => {
    // Handle lawyer rejection
    console.log("Rejecting lawyer:", lawyerId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lawyer Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage lawyer verifications and profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lawyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyers.length}</div>
            <p className="text-xs text-muted-foreground">Registered lawyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyers.filter((l) => l.status === "Verified").length}</div>
            <p className="text-xs text-muted-foreground">Active lawyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyers.filter((l) => l.status === "Pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lawyers</CardTitle>
          <CardDescription>Manage lawyer verifications and view profiles</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search lawyers..."
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
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lawyers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lawyer</TableHead>
                  <TableHead className="hidden md:table-cell">Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Cases</TableHead>
                  <TableHead className="hidden xl:table-cell">Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLawyers.map((lawyer) => (
                  <TableRow key={lawyer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lawyer.avatar || "/placeholder.svg"} alt={lawyer.name} />
                          <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lawyer.name}</div>
                          <div className="text-sm text-gray-500">{lawyer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{lawyer.specialization}</TableCell>
                    <TableCell>{getStatusBadge(lawyer.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {lawyer.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {lawyer.rating}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{lawyer.cases}</TableCell>
                    <TableCell className="hidden xl:table-cell">{lawyer.registeredAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLawyer(lawyer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {lawyer.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(lawyer.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(lawyer.id)}
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
        </CardContent>
      </Card>

      {/* Lawyer Profile Dialog */}
      <Dialog open={!!selectedLawyer} onOpenChange={() => setSelectedLawyer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lawyer Profile</DialogTitle>
            <DialogDescription>Detailed information about the selected lawyer</DialogDescription>
          </DialogHeader>
          {selectedLawyer && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedLawyer.avatar || "/placeholder.svg"} alt={selectedLawyer.name} />
                  <AvatarFallback>{selectedLawyer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedLawyer.name}</h3>
                  <p className="text-gray-600">{selectedLawyer.email}</p>
                  <div className="mt-1">{getStatusBadge(selectedLawyer.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Specialization</label>
                  <p className="text-sm text-gray-600">{selectedLawyer.specialization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registered</label>
                  <p className="text-sm text-gray-600">{selectedLawyer.registeredAt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <p className="text-sm text-gray-600">
                    {selectedLawyer.rating > 0 ? `${selectedLawyer.rating}/5` : "No ratings yet"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cases Handled</label>
                  <p className="text-sm text-gray-600">{selectedLawyer.cases}</p>
                </div>
              </div>

              {selectedLawyer.status === "Pending" && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button onClick={() => handleVerify(selectedLawyer.id)} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Verify Lawyer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedLawyer.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
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
