"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, FileText, TrendingUp, TrendingDown, Eye, Heart, MessageCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { api } from "@/lib/api"

// Sample data for charts (keeping other charts static for now as per request scope)
const dailyActiveUsers = [
  { date: "2024-01-01", users: 1200 },
  { date: "2024-01-02", users: 1350 },
  { date: "2024-01-03", users: 1100 },
  { date: "2024-01-04", users: 1400 },
  { date: "2024-01-05", users: 1600 },
  { date: "2024-01-06", users: 1800 },
  { date: "2024-01-07", users: 1750 },
]

const weeklyActiveUsers = [
  { week: "Week 1", users: 8500 },
  { week: "Week 2", users: 9200 },
  { week: "Week 3", users: 8800 },
  { week: "Week 4", users: 10100 },
]

const monthlyGrowth = [
  { month: "Jan", growth: 12 },
  { month: "Feb", growth: 18 },
  { month: "Mar", growth: 15 },
  { month: "Apr", growth: 22 },
  { month: "May", growth: 28 },
  { month: "Jun", growth: 25 },
]

const pageVisits = [
  { name: "Dashboard", value: 35, color: "#3B82F6" },
  { name: "Community", value: 25, color: "#10B981" },
  { name: "Find Lawyers", value: 20, color: "#F59E0B" },
  { name: "Messages", value: 15, color: "#EF4444" },
  { name: "AI Assistant", value: 5, color: "#8B5CF6" },
]

export default function AdminDashboard() {
  const [trendingPosts, setTrendingPosts] = useState<any[]>([])
  const [legalTopics, setLegalTopics] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedLawyers: 0,
    totalPosts: 0,
    connectionsCreated: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashboardResponse, statsResponse] = await Promise.all([
          api.getDashboardStats(),
          api.getAdminStats()
        ])
        
        if (dashboardResponse.success) {
          setTrendingPosts(dashboardResponse.trendingPosts.map((post: any) => ({
            id: post._id,
            title: post.title,
            author: post.author?.name || "Unknown",
            likes: post.likesCount,
            comments: post.commentsCount,
            views: 0, // Not available in API yet
          })))
          
          setLegalTopics(dashboardResponse.popularTopics.map((topic: any) => ({
            topic: topic.topic,
            discussions: topic.count
          })))
        }

        if (statsResponse.success) {
          setStats(statsResponse.stats)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Lawyers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedLawyers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active lawyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Community posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections Created</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectionsCreated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Accepted DM requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>User activity over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Active Users</CardTitle>
            <CardDescription>Weekly user engagement trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth Rate</CardTitle>
            <CardDescription>User growth percentage by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growth" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>Page visit distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pageVisits}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pageVisits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Discussed Legal Topics</CardTitle>
            <CardDescription>Popular discussion topics in the community</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={legalTopics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="topic" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="discussions" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Posts</CardTitle>
            <CardDescription>Most popular posts this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingPosts.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No trending posts found.</div>
              ) : (
                trendingPosts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{post.title}</h4>
                      <p className="text-xs text-muted-foreground">by {post.author}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        {/* <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.views}
                        </div> */}
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
