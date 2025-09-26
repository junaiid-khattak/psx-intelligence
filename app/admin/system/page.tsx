import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { SystemMonitoring } from "@/components/admin/system-monitoring"

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

  const { data: userData } = await supabase.from("psx.users").select("role").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    redirect("/dashboard")
  }

  return { user, userData }
}

export default async function AdminSystemPage() {
  await checkAdminAccess()

  return (
    <AdminLayout>
      <SystemMonitoring />
    </AdminLayout>
  )
}
