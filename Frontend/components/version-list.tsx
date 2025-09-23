"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { Version } from "@/lib/store"
import { Clock, Eye } from "lucide-react"

interface VersionListProps {
  versions: Version[]
  onSelectVersion: (version: Version) => void
}

export function VersionList({ versions, onSelectVersion }: VersionListProps) {
  if (versions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No versions yet</h3>
          <p className="text-sm text-muted-foreground">Humanize your text to create the first version</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        {versions.length} version{versions.length !== 1 ? "s" : ""} available
      </div>

      {versions.map((version, index) => (
        <Card key={version.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {index === 0 ? "Latest" : `Version ${versions.length - index}`}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={() => onSelectVersion(version)} className="gap-2">
                <Eye className="h-3 w-3" />
                View
              </Button>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{version.outputText.substring(0, 200)}...</p>

            {version.checkScores && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">AI Detection:</span>
                <Badge
                  variant={
                    version.checkScores.overall < 30
                      ? "default"
                      : version.checkScores.overall < 70
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {version.checkScores.overall}% AI probability
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
