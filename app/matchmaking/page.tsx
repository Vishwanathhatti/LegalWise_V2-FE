"use client"

import React, { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Filter,
  Languages,
  Award,
  BookOpen,
  X,
} from "lucide-react"

interface Lawyer {
  id: string
  userId: string
  name: string
  avatar: string
  specializations: string[]
  location: string
  rating: number
  reviewCount: number
  consultationCharges: number
  languages: string[]
  experience: number
  education: string
  verified: boolean
  availability: "available" | "busy" | "unavailable"
  bio: string
}



const practiceAreas = [
  "All Practice Areas",
  "Employment Law",
  "Family Law",
  "Business Law",
  "Personal Injury",
  "Criminal Law",
  "Real Estate Law",
  "Immigration Law",
  "Intellectual Property",
  "Tax Law",
]

const languages = [
  "All Languages",
  "English",
  "Spanish",
  "Mandarin",
  "French",
  "German",
  "Portuguese",
  "Korean",
  "Japanese",
]

export default function MatchmakingPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPracticeArea, setSelectedPracticeArea] = useState("All Practice Areas")
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [maxRate, setMaxRate] = useState("")
  const [sortBy, setSortBy] = useState<"rating" | "rate" | "experience">("rating")
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  const filteredLawyers = lawyers
    .filter((lawyer) => {
      const matchesSearch =
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPracticeArea =
        selectedPracticeArea === "All Practice Areas" || lawyer.specializations.includes(selectedPracticeArea)
      const matchesLanguage = selectedLanguage === "All Languages" || lawyer.languages.includes(selectedLanguage)
      const matchesLocation =
        !selectedLocation || lawyer.location.toLowerCase().includes(selectedLocation.toLowerCase())
      const matchesRate = !maxRate || lawyer.consultationCharges <= Number.parseInt(maxRate)

      return matchesSearch && matchesPracticeArea && matchesLanguage && matchesLocation && matchesRate
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "rate":
          return a.consultationCharges - b.consultationCharges
        case "experience":
          return b.experience - a.experience
        default:
          return 0
      }
    })

  const fetchLawyers = async () => {
    try {
      const response = await api.getAllLawyers()
      if (response.success) {
        const mappedLawyers: Lawyer[] = response.lawyers.map((lawyer: any) => ({
          id: lawyer._id,
          userId: lawyer.userId._id,
          name: lawyer.userId.name,
          avatar: lawyer.userId.profilePicture,
          specializations: lawyer.specializations,
          location: lawyer.location,
          rating: lawyer.rating,
          reviewCount: lawyer.reviews ? lawyer.reviews.length : 0,
          consultationCharges: lawyer.consultationCharges,
          languages: lawyer.languages,
          experience: lawyer.experience,
          education: lawyer.education,
          verified: lawyer.isVerified,
          availability: lawyer.isVerified ? "available" : "unavailable",
          bio: lawyer.bio,
        }))
        setLawyers(mappedLawyers)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch lawyers.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching lawyers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch lawyers.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLawyers()
  }, [])



  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Find a Lawyer</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Connect with verified legal professionals</p>
          </div>

          {/* Mobile Search and Filter Toggle */}
          <div className="lg:hidden mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search lawyers or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Sort
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 space-y-4 sm:space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search - Desktop only */}
                  <div className="hidden lg:block">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Practice Area */}
                  <div>
                    <Label>Practice Area</Label>
                    <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {practiceAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div>
                    <Label>Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="City, State"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Max Rate */}
                  <div>
                    <Label>Max Hourly Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="500"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="rate">Lowest Rate</SelectItem>
                        <SelectItem value="experience">Most Experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lawyers List */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-600">
                  {loading ? "Loading..." : `${filteredLawyers.length} lawyer${filteredLawyers.length !== 1 ? "s" : ""} found`}
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-4 sm:p-6">
                      <div className="animate-pulse">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto sm:mx-0"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {filteredLawyers.map((lawyer) => (
                    <Card key={lawyer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                          <Avatar className="w-16 h-16 mx-auto sm:mx-0 flex-shrink-0">
                            <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                            <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                              <div className="flex items-center justify-center sm:justify-start space-x-2">
                                {lawyer.verified && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <Badge
                                  variant={lawyer.availability === "available" ? "default" : "secondary"}
                                  className={lawyer.availability === "available" ? "bg-green-100 text-green-800" : ""}
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  {lawyer.availability === "available" ? "Available" : "Busy"}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                              <div className="flex items-center justify-center sm:justify-start">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm font-medium">{lawyer.rating}</span>
                                <span className="ml-1 text-sm text-gray-500">({lawyer.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                {lawyer.location}
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                              {lawyer.specializations.map((specialty) => (
                                <Badge key={specialty} variant="outline">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lawyer.bio}</p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                                <div className="flex items-center justify-center sm:justify-start">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  {lawyer.experience} years
                                </div>
                                <div className="flex items-center justify-center sm:justify-start">
                                  <Languages className="w-4 h-4 mr-1" />
                                  {lawyer.languages.join(", ")}
                                </div>
                                <div className="flex items-center justify-center sm:justify-start">
                                  <DollarSign className="w-4 h-4 mr-1" />${lawyer.consultationCharges}/hr
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedLawyer(lawyer)}
                                      className="w-full sm:w-auto"
                                    >
                                      View Profile
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Lawyer Profile</DialogTitle>
                                    </DialogHeader>
                                    {selectedLawyer && (
                                      <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                          <Avatar className="w-20 h-20">
                                            <AvatarImage
                                              src={selectedLawyer.avatar}
                                              alt={selectedLawyer.name}
                                            />
                                            <AvatarFallback>{selectedLawyer.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div className="text-center sm:text-left">
                                            <h3 className="text-2xl font-bold">{selectedLawyer.name}</h3>
                                            <p className="text-gray-600">{selectedLawyer.education}</p>
                                            <div className="flex items-center justify-center sm:justify-start mt-2">
                                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                              <span className="ml-1 font-medium">{selectedLawyer.rating}</span>
                                              <span className="ml-1 text-gray-500">
                                                ({selectedLawyer.reviewCount} reviews)
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h4 className="font-semibold mb-2">About</h4>
                                          <p className="text-gray-600">{selectedLawyer.bio}</p>
                                        </div>

                                        <div>
                                          <h4 className="font-semibold mb-2">Practice Areas</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {selectedLawyer.specializations.map((specialty) => (
                                              <Badge key={specialty} variant="outline">
                                                {specialty}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <h4 className="font-semibold mb-2">Experience</h4>
                                            <p className="text-gray-600">{selectedLawyer.experience} years</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold mb-2">Languages</h4>
                                            <p className="text-gray-600">{selectedLawyer.languages.join(", ")}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold mb-2">Location</h4>
                                            <p className="text-gray-600">{selectedLawyer.location}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-semibold mb-2">Rate</h4>
                                            <p className="text-gray-600">${selectedLawyer.consultationCharges}/hour</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                            <Button
                              onClick={async () => {
                                try {
                                  await api.sendDMRequest(lawyer.userId);
                                  toast({
                                    title: "DM Request Sent",
                                    description: `Your direct message request to ${lawyer.name} has been sent.`,
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to send DM request.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              disabled={lawyer.availability !== "available"}
                              className="w-full sm:w-auto"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Request DM
                            </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredLawyers.length === 0 && (
                    <Card>
                      <CardContent className="p-8 sm:p-12 text-center">
                        <div className="text-gray-400 mb-4">
                          <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>


        </main>
      </div>
    </ProtectedRoute>
  )
}
