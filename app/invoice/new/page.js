import InvoiceForm from './InvoiceForm'
import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewInvoicePage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all active clients to populate the dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, first_name, last_name')
    .order('first_name', { ascending: true })

  return (
    <div className="dashboard-layout">
      <InvoiceForm activeClients={clients || []} />
    </div>
  )
}
