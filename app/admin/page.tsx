import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  // Check if user is admin (you can implement role-based access)
  const { data: userData } = await supabase.from("psx.users").select("*").eq("id", data.user.id).single()

  // For now, allow any authenticated user to access admin
  // In production, you'd check for admin role

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
