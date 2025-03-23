"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import Link from "next/link"
import { ArrowLeft, ExternalLink, CheckCircle, Clock, FileText, Link2 } from "lucide-react"

// Mock data for demonstration
const mockSbtDetails = {
  id: "sbt-001",
  title: "Quantum Computing Applications in Drug Discovery",
  doi: "10.1234/qcadd.2023.001",
  type: "Author",
  timestamp: "2023-10-15T14:30:00Z",
  verified: true,
  verificationCount: 5,
  abstract:
    "This paper explores novel applications of quantum computing algorithms in accelerating drug discovery processes. We demonstrate a 10x improvement in molecular docking simulations using a custom quantum approach.",
  author: {
    name: "Dr. Alice Johnson",
    address: "0x1234...5678",
    institution: "MIT",
  },
  tokenId: "42",
  txHash: "0xabcd...1234",
  image: "/placeholder.svg?height=300&width=300",
}

export default function SbtDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const { isConnected } = useWallet()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleVerify = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to verify this contribution",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Verification submitted",
      description: "Thank you for verifying this research contribution!",
    })
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          {/* SBT Image and Metadata */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={mockSbtDetails.image || "/placeholder.svg"}
                    alt={mockSbtDetails.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Token ID</span>
                    <span className="font-mono text-sm">{mockSbtDetails.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline">{mockSbtDetails.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {mockSbtDetails.verified ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm">{formatDate(mockSbtDetails.timestamp)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://etherscan.io/tx/${mockSbtDetails.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Etherscan
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* SBT Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{mockSbtDetails.title}</CardTitle>
                <CardDescription>Soulbound Token for research contribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">DOI:</span>
                    <a
                      href={`https://doi.org/${mockSbtDetails.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      {mockSbtDetails.doi}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Author:</span>
                    <span>{mockSbtDetails.author.name}</span>
                    <span className="text-xs text-muted-foreground">({mockSbtDetails.author.institution})</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-medium">Abstract</h3>
                  <p className="text-sm text-muted-foreground">{mockSbtDetails.abstract}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-medium">Verification</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Verified by {mockSbtDetails.verificationCount} researchers
                    </div>
                    <Button variant="outline" size="sm" onClick={handleVerify} disabled={!isConnected}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify Contribution
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Citation</CardTitle>
                <CardDescription>Use this format to cite this research</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3 font-mono text-sm">
                  {`${mockSbtDetails.author.name}. (${new Date(mockSbtDetails.timestamp).getFullYear()}). ${mockSbtDetails.title}. DOI: ${mockSbtDetails.doi}`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

