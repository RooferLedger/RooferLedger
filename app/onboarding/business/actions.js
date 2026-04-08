'use server'

import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateOrganizationProfile(formData) {
  const companyName = formData.get('companyName')
  const phone = formData.get('phone')

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Find their organization ID via the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.organization_id) {
    // If no org exists yet (no DB trigger), let's create one and bind it
    const { data: newOrg, error: orgCreateError } = await supabase
      .from('organizations')
      .insert({ name: companyName, phone: phone })
      .select()
      .single()
      
    if (newOrg) {
      // Upsert the user record
      await supabase.from('users').upsert({ id: user.id, organization_id: newOrg.id, email: user.email })
    }
  } else {
    // Standard update
    await supabase
      .from('organizations')
      .update({ name: companyName, phone: phone })
      .eq('id', userData.organization_id)
  }

  redirect('/onboarding/upgrade')
}
