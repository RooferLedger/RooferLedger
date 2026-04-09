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

  if (userError || !userData?.organization_id) {
    throw new Error('Organization not found')
  }

  const updatePayload = {
    name: companyName,
    phone: phone,
  }

  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAdmin = adminKey 
    ? createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, adminKey)
    : supabase

  const { error } = await supabaseAdmin
    .from('organizations')
    .update(updatePayload)
    .eq('id', userData.organization_id)

  if (error) {
    throw new Error('Failed to update organization')
  }

  return { success: true }
}
