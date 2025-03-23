import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User } from "lucide-react"

interface ProfileInfoProps {
  address: string
  contributionCount: number
  verifiedCount: number
}

export function ProfileInfo({ address, contributionCount, verifiedCount }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 p-2">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Researcher Profile</h3>
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Wallet Address</div>
            <div className="font-mono text-sm">{address}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border p-2 text-center">
              <div className="text-2xl font-bold">{contributionCount}</div>
              <div className="text-xs text-muted-foreground">Contributions</div>
            </div>
            <div className="rounded-lg border p-2 text-center">
              <div className="text-2xl font-bold">{verifiedCount}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
          </div>

          {verifiedCount > 0 && (
            <div className="flex items-center justify-center rounded-md bg-primary/10 py-1.5">
              <Badge variant="outline" className="flex items-center gap-1 bg-background">
                <CheckCircle className="h-3 w-3 text-primary" />
                Verified Researcher
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

