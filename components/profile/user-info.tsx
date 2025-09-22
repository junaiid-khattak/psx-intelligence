"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, MapPin, Phone, Globe } from "lucide-react"

interface UserInfoProps {
  user: any
  userData: any
  profile: any
}

export function UserInfo({ user, userData, profile }: UserInfoProps) {
  const initials = userData?.full_name
    ? userData.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData?.avatar_url || "/placeholder.svg"} alt={userData?.full_name || "User"} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{userData?.full_name || "User"}</CardTitle>
        <p className="text-muted-foreground">@{profile?.username || "username"}</p>
        <Badge variant="secondary" className="w-fit mx-auto">
          {profile?.is_public ? "Public Profile" : "Private Profile"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.bio && (
          <div>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{user.email}</span>
          </div>

          {profile?.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.location}</span>
            </div>
          )}

          {profile?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.phone}</span>
            </div>
          )}

          {profile?.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Joined {new Date(userData?.created_at || user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
