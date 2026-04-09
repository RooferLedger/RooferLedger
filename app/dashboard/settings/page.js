import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Enforce Onboarding Completion & get Organization ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.organization_id) {
    console.error("Settings page user check failed:", userError)
    redirect('/onboarding/business')
  }

  // Fetch true organization profile
  const { data: orgData } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', userData.organization_id)
    .single()

  return (
    <SettingsClient initialOrg={orgData} initialUser={{ email: user.email }} />
  )
}
