import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({ children }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) {
    redirect('/onboarding/business')
  }

  return <ClientLayout>{children}</ClientLayout>
}
