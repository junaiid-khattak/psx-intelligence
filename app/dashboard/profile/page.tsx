import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import { UserInfo } from "@/components/profile/user-info"

export default async function ProfilePage() {
  const supabase = createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/signin")
  }

  // Fetch user profile data
  const { data: profile } = await supabase.from("psx.profiles").select("*").eq("id", user.id).single()

  const { data: userData } = await supabase.from("psx.users").select("*").eq("id", user.id).single()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <UserInfo user={user} userData={userData} profile={profile} />
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm user={user} userData={userData} profile={profile} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
