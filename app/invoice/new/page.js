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

  // --- Premium Paywall Engine ---
  const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
  const orgId = userData?.organization_id
  
  // Get invoice count
  const { count: invoiceCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)

  // Get org subscription status
  const { data: orgData } = await supabase.from('organizations').select('subscription_status, stripe_customer_id').eq('id', orgId).single()
  
  let isPremium = orgData?.subscription_status === 'active' || orgData?.subscription_status === 'trialing'

  // Live Auto-Heal Fallback
  if (!isPremium && orgData?.stripe_customer_id) {
    const { stripe } = require('../../../lib/stripe/server')
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: orgData.stripe_customer_id,
        status: 'active',
        limit: 1
      })
      if (subscriptions.data.length > 0) {
        isPremium = true
        const { createClient: createAdminClient } = require('@supabase/supabase-js')
        const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
        await supabaseAdmin.from('organizations').update({ subscription_status: 'active' }).eq('id', orgId)
      }
    } catch (err) {
      console.error("Live Stripe verify failed:", err.message)
    }
  }
  const reachedLimit = (invoiceCount >= 3) && !isPremium

  if (reachedLimit) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Free Tier Limit Reached</h1>
        <p style={{ fontSize: '1.1rem', color: '#8b949e', maxWidth: '600px', marginBottom: '2rem' }}>
          You have generated {invoiceCount} invoices, exhausting your Limited Free Tier capacity. Upgrade to RooferLedger Pro to unlock unlimited invoicing and instant credit card payments.
        </p>
        <a href="/dashboard/settings" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Upgrade Now
        </a>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <InvoiceForm activeClients={clients || []} />
    </div>
  )
}
