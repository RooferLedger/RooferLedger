'use server'

import { createClient } from '../../../lib/supabase/server'

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

  const { error } = await supabase
    .from('organizations')
    .update(updatePayload)
    .eq('id', userData.organization_id)

  if (error) {
    throw new Error('Failed to update organization')
  }

  return { success: true }
}
