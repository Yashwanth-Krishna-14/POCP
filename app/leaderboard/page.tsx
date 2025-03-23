"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResearcherPopover } from "@/components/researcher-popover"
import { Search, ArrowUpDown } from "lucide-react"

// Mock data for demonstration
const mockResearchers = [
  {
    id: "r1",
    name: "Dr. Alice Johnson",
    address: "0x1234...5678",
    contributions: 24,
    authorCount: 12,
    reviewerCount: 8,
    collaboratorCount: 4,
    verified: 22,
    avatar: "/placeholder.svg?height=40&width=40",
    institution: "MIT",
    field: "Quantum Computing",
    recentWork: "Quantum Algorithms for Drug Discovery",
  },
  {
    id: "r2",
    name: "Prof. Bob Smith",
    address: "0x2345...6789",
    contributions: 19,
    authorCount: 7,
    reviewerCount: 10,
    collaboratorCount: 2,
    verified: 18,
    avatar: "/placeholder.svg?height=40&width=40",
    institution: "Stanford University",
    field: "Machine Learning",
    recentWork: "Neural Networks in Climate Modeling",
  },
  {
    id: "r3",
    name: "Dr. Carol Williams",
    address: "0x3456...7890",
    contributions: 31,
    authorCount: 15,
    reviewerCount: 12,
    collaboratorCount: 4,
    verified: 29,
    avatar: "/placeholder.svg?height=40&width=40",
    institution: "Oxford University",
    field: "Bioinformatics",
    recentWork: "Genomic Data Analysis for Rare Diseases",
  },
  {
    id: "r4",
    name: "Dr. David Chen",
    address: "0x4567...8901",
    contributions: 16,
    authorCount: 8,
    reviewerCount: 5,
    collaboratorCount: 3,
    verified: 14,
    avatar: "/placeholder.svg?height=40&width=40",
    institution: "UC Berkeley",
    field: "Artificial Intelligence",
    recentWork: "Reinforcement Learning in Robotics",
  },
  {
    id: "r5",
    name: "Prof. Elena Rodriguez",
    address: "0x5678...9012",
    contributions: 27,
    authorCount: 14,
    reviewerCount: 9,
    collaboratorCount: 4,
    verified: 25,
    avatar: "/placeholder.svg?height=40&width=40",
    institution: "ETH Zurich",
    field: "Cryptography",
    recentWork: "Post-Quantum Cryptographic Protocols",
  },
]

type SortField = "contributions" | "authorCount" | "reviewerCount" | "collaboratorCount" | "verified"
type SortDirection = "asc" | "desc"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contributionType, setContributionType] = useState("all")
  const [sortField, setSortField] = useState<SortField>("contributions")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredResearchers = mockResearchers
    .filter((researcher) => {
      const matchesSearch =
        researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        researcher.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        researcher.institution.toLowerCase().includes(searchQuery.toLowerCase())

      if (contributionType === "all") return matchesSearch
      if (contributionType === "author") return matchesSearch && researcher.authorCount > 0
      if (contributionType === "reviewer") return matchesSearch && researcher.reviewerCount > 0
      if (contributionType === "collaborator") return matchesSearch && researcher.collaboratorCount > 0

      return matchesSearch
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Leaderboard</h1>
          <p className="text-muted-foreground mt-2">Discover top researchers ranked by their verified contributions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Researchers</CardTitle>
            <CardDescription>Researchers are ranked based on their total verified contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, wallet or institution..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={contributionType} onValueChange={setContributionType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contributions</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="collaborator">Collaborator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Researcher</TableHead>
                      <TableHead className="hidden md:table-cell">Institution</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("contributions")}
                          className="flex items-center gap-1 font-medium"
                        >
                          Total
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("authorCount")}
                          className="flex items-center gap-1 font-medium"
                        >
                          Author
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("reviewerCount")}
                          className="flex items-center gap-1 font-medium"
                        >
                          Reviewer
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("collaboratorCount")}
                          className="flex items-center gap-1 font-medium"
                        >
                          Collaborator
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("verified")}
                          className="flex items-center gap-1 font-medium"
                        >
                          Verified
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResearchers.map((researcher, index) => (
                      <TableRow key={researcher.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <ResearcherPopover researcher={researcher}>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={researcher.avatar || "/placeholder.svg"}
                                  alt={researcher.name || "Researcher"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{researcher.name}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {researcher.address}
                                </span>
                              </div>
                            </div>
                          </ResearcherPopover>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{researcher.institution}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {researcher.contributions}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{researcher.authorCount}</TableCell>
                        <TableCell className="hidden sm:table-cell">{researcher.reviewerCount}</TableCell>
                        <TableCell className="hidden lg:table-cell">{researcher.collaboratorCount}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="font-mono">
                            {researcher.verified}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredResearchers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No researchers found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}