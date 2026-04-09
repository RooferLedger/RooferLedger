'use server'

import { createClient } from '../../../lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function updateSettingsProfile(formData) {
  const companyName = formData.get('companyName')
  const phone = formData.get('phone')
  
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Find their organization ID via the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAdmin = adminKey 
    ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, adminKey)
    : supabase

  const updatePayload = {
    name: companyName,
    phone: phone,
  }

  if (userError || !userData?.organization_id) {
    // Auto-heal: If the organization doesn't exist, create it via admin client and link it to the user
    const { data: newOrg, error: orgCreateError } = await supabaseAdmin
      .from('organizations')
      .insert(updatePayload)
      .select()
      .single()
      
    if (newOrg) {
      await supabaseAdmin.from('users').update({ organization_id: newOrg.id }).eq('id', user.id)
      return { success: true }
    } else {
      throw new Error('DB Error: Failed to auto-create missing organization.')
    }
  }

  const { error } = await supabaseAdmin
    .from('organizations')
    .update(updatePayload)
    .eq('id', userData.organization_id)

  if (error) {
    throw new Error('DB Error: ' + error.message)
  }

  return { success: true }
}
