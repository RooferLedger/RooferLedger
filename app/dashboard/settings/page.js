import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'
import { stripe } from '../../../lib/stripe/server'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({ searchParams }) {
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

  // Phase 1: Aggressive Paywall Unlock Bypass
  if (searchParams?.checkout === 'success') {
    await supabase.from('organizations').update({ subscription_status: 'active' }).eq('id', userData.organization_id)
  }

  // Fetch true organization profile
  const { data: orgData } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', userData.organization_id)
    .single()

  // Phase 2: Live Stripe Connect Verification
  let chargesEnabled = false
  let bankLast4 = null
  if (orgData?.stripe_account_id) {
    try {
      const account = await stripe.accounts.retrieve(orgData.stripe_account_id)
      chargesEnabled = account.charges_enabled
      
      // Attempt to get the last 4 digits of the connected bank account
      if (account.external_accounts?.data?.length > 0) {
        bankLast4 = account.external_accounts.data[0].last4
      }
    } catch (e) {
      console.error("Failed to check Stripe account status:", e.message)
    }
  }

  const isSubscribed = orgData?.subscription_status === 'active' || orgData?.subscription_status === 'trialing'

  return (
    <SettingsClient 
      initialOrg={orgData} 
      initialUser={{ email: user.email }} 
      chargesEnabled={chargesEnabled} 
      bankLast4={bankLast4}
      isSubscribed={isSubscribed}
    />
  )
}
