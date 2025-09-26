import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}
