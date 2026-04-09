'use server'

import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updateOrganizationProfile(formData) {
  const companyName = formData.get('companyName')
  const phone = formData.get('phone')
  // Parse the logo Base64 string that was bundled in the form
  const logoData = formData.get('logoData')

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Define the update payload
  const updatePayload = {
    name: companyName,
    phone: phone,
    ...(logoData ? { logo_url: logoData } : {}) // Only include if present
  }

  // Find their organization ID via the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.organization_id) {
    // If no org exists yet
    const { data: newOrg, error: orgCreateError } = await supabase
      .from('organizations')
      .insert(updatePayload)
      .select()
      .single()
      
    if (newOrg) {
      const { error: upsertError } = await supabase.from('users').upsert({ id: user.id, organization_id: newOrg.id })
      if (upsertError) console.error("User upsert error:", upsertError)
    } else {
      console.error('Org creation error:', orgCreateError)
    }
  } else {
    // Standard update
    await supabase
      .from('organizations')
      .update(updatePayload)
      .eq('id', userData.organization_id)
  }

  redirect('/onboarding/upgrade')
}
