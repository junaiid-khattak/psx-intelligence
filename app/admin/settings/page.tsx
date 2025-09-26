import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminSettings } from "@/components/admin/admin-settings"

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  return (
    <AdminLayout>
      <AdminSettings />
    </AdminLayout>
  )
}
