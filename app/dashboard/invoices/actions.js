'use server'

import { createClient } from '../../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateInvoiceStatus(invoiceId, newStatus) {
  const supabase = createClient()
  
  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify the user's organization
  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) return { error: 'Organization not found' }

  // Update the invoice (only if it belongs to their organization)
  const { error } = await supabase
    .from('invoices')
    .update({ status: newStatus })
    .eq('id', invoiceId)
    .eq('organization_id', userData.organization_id)

  if (error) {
    console.error('Error updating invoice status:', error)
    return { error: error.message }
  }

  // Revalidate the ledger and dashboard paths
  revalidatePath('/dashboard/invoices')
  revalidatePath('/dashboard')

  return { success: true }
}
