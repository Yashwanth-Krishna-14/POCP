import type { ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface ResearcherProps {
  id: string
  name: string
  address: string
  contributions: number
  authorCount: number
  reviewerCount: number
  collaboratorCount: number
  verified: number
  avatar: string
  institution: string
  field: string
  recentWork: string
}

export function ResearcherPopover({
  researcher,
  children,
}: {
  researcher: ResearcherProps
  children: ReactNode
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src={researcher.avatar || "/placeholder.svg"}
                alt={researcher.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{researcher.name}</h4>
              <p className="text-xs text-muted-foreground">{researcher.institution}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Field</span>
              <Badge variant="outline">{researcher.field}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Recent Work</span>
              <span className="text-xs truncate max-w-[180px]">{researcher.recentWork}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted p-2">
              <div className="text-sm font-medium">{researcher.authorCount}</div>
              <div className="text-xs text-muted-foreground">Author</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="text-sm font-medium">{researcher.reviewerCount}</div>
              <div className="text-xs text-muted-foreground">Reviewer</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="text-sm font-medium">{researcher.collaboratorCount}</div>
              <div className="text-xs text-muted-foreground">Collaborator</div>
            </div>
          </div>
        </div>

        <div className="border-t p-3 flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/researcher/${researcher.id}`}>
              View Profile
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

