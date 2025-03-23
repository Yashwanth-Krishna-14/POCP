import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"

interface SbtProps {
  id: string
  title: string
  doi: string
  type: string
  timestamp: string
  verified: boolean
  image: string
}

export function SbtCard({ sbt }: { sbt: SbtProps }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Link href={`/sbt/${sbt.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square overflow-hidden">
          <img
            src={sbt.image || "/placeholder.svg"}
            alt={sbt.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{sbt.type}</Badge>
              {sbt.verified ? (
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
            <h3 className="font-medium line-clamp-2">{sbt.title}</h3>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 text-xs text-muted-foreground">
          <span>{formatDate(sbt.timestamp)}</span>
          <span className="flex items-center">
            View Details
            <ExternalLink className="ml-1 h-3 w-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

