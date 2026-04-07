'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClientRecord(data) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error("Unauthorized")

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()
    
  if (userError || !userData) throw new Error("Could not find organization for user")

  const { error: insertError } = await supabase
    .from('clients')
    .insert({
      organization_id: userData.organization_id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address
    })

  if (insertError) throw new Error(insertError.message)

  revalidatePath('/dashboard/clients')
  return { success: true }
}
