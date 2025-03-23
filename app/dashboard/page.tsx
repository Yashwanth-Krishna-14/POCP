"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Web3 from "web3"
import { abi } from "../abi"
import {  contractAddress } from "../contractAddress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SbtCard } from "@/components/sbt-card"
import { ProfileInfo } from "@/components/profile-info"
import Link from "next/link"
import { Plus, ExternalLink } from "lucide-react"

// Mock data for demonstration
const mockSbts = [
  {
    id: "sbt-001",
    title: "Quantum Computing Applications in Drug Discovery",
    doi: "10.1234/qcadd.2023.001",
    type: "author",
    timestamp: "2023-10-15T14:30:00Z",
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "sbt-002",
    title: "Peer Review: Machine Learning in Climate Modeling",
    doi: "10.1234/mlcm.2023.002",
    type: "reviewer",
    timestamp: "2023-11-05T09:15:00Z",
    verified: true,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "sbt-003",
    title: "Open Source Contribution: Data Visualization Library",
    doi: "github.com/username/data-viz-lib",
    type: "collaborator",
    timestamp: "2023-12-01T16:45:00Z",
    verified: false,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }
    checkWalletConnection()
  }, [])

  const handleConnectWallet = async () => {
    setLoading(true)

    if (typeof window.ethereum !== "undefined") {
      try {
        const web3 = new Web3(window.ethereum)
        const contract = new web3.eth.Contract(abi, contractAddress)

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
        setIsConnected(true)

        const isRegistered = await contract.methods.isStudentRegistered(accounts[0]).call()
        if (Number(isRegistered) === 1) {
          router.push("/profile")
        } else {
          router.push("/sign-up")
        }
      } catch (error) {
        console.error("Error:", error)
        alert("Error checking registration.")
      }
    } else {
      alert("Please install MetaMask.")
    }
    setLoading(false)
  }

  const filteredSbts = activeTab === "all" ? mockSbts : mockSbts.filter((sbt) => sbt.type.toLowerCase() === activeTab)

  if (!isConnected) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to view your dashboard.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={handleConnectWallet} disabled={loading}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-[1fr_3fr] lg:gap-10">
        {/* Sidebar */}
        <div className="space-y-6">
          <ProfileInfo
            address={walletAddress || "0x0000...0000"}
            contributionCount={mockSbts.length}
            verifiedCount={mockSbts.filter((sbt) => sbt.verified).length}
          />
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Contribution
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Your Soulbound Tokens</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/sbt/all">
                View All
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="author">Author</TabsTrigger>
              <TabsTrigger value="reviewer">Reviewer</TabsTrigger>
              <TabsTrigger value="collaborator">Collaborator</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              {filteredSbts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSbts.map((sbt) => (
                    <SbtCard key={sbt.id} sbt={sbt} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">No tokens found in this category.</p>
                  <Button asChild>
                    <Link href="/submit">Submit a Contribution</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}