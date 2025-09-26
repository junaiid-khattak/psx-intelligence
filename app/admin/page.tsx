import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

async function checkAdminAccess() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/signin")
  }

  // Check if user is admin
  const { data: userData } = await supabase.from("psx.users").select("role").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    redirect("/dashboard") // Redirect non-admins to regular dashboard
  }

  return { user, userData }
}

export default async function AdminPage() {
  await checkAdminAccess()

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
