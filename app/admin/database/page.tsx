import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DatabaseManagement } from "@/components/admin/database-management"

export default async function AdminDatabasePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  return (
    <AdminLayout>
      <DatabaseManagement />
    </AdminLayout>
  )
}
