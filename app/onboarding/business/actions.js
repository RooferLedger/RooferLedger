'use server'

import { createClient as createServerClient } from '../../../lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function updateOrganizationProfile(formData) {
  const companyName = formData.get('companyName')
  const phone = formData.get('phone')
  const address = formData.get('address')
  const logoData = formData.get('logoData')

  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const updatePayload = {
    name: companyName,
    address: address || null,
    ...(logoData ? { logo_url: logoData } : {})
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  // Use Admin key for DB mutations to bypass RLS ownership issues caused by auto-triggers
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAdmin = adminKey 
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, adminKey)
    : supabase

  if (userError || !userData?.organization_id) {
    const { data: newOrg, error: orgCreateError } = await supabaseAdmin
      .from('organizations')
      .insert(updatePayload)
      .select()
      .single()
      
    if (newOrg) {
      const { error: upsertError } = await supabaseAdmin.from('users').upsert({ id: user.id, organization_id: newOrg.id })
      if (upsertError) console.error("User upsert error:", upsertError)
    } else {
      console.error('Org creation error:', orgCreateError)
    }
  } else {
    // Standard update
    const { error: updateError } = await supabaseAdmin
      .from('organizations')
      .update(updatePayload)
      .eq('id', userData.organization_id)
      
    if (updateError) console.error("Update org error:", updateError)
  }

  redirect('/onboarding/upgrade')
}
