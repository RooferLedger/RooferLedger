import { createClient as createServerClient } from '../../lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import PayButton from './PayButton'
import { stripe } from '../../lib/stripe/server'

export default async function PublicInvoicePayment({ searchParams }) {
  const invoiceId = searchParams?.invoice

  if (!invoiceId) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>
        <h2>Invalid Invoice Link</h2>
        <p style={{ color: '#8b949e' }}>The link you followed is missing an invoice ID.</p>
      </div>
    )
  }

  // Use Admin Service Role Key to bypass Row-Level Security for public invoice viewing
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = adminKey
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, adminKey)
    : createServerClient()

  // 1. Fetch the invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*, line_items(*)')
    .eq('id', invoiceId)
    .single()


  if (invoiceError || !invoice) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>
        <h2>Invoice Not Found</h2>
        <p style={{ color: '#8b949e' }}>This invoice may have been deleted or the link is incorrect.</p>
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(218, 54, 51, 0.1)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'left' }}>
          <strong>Debug Error:</strong> {invoiceError ? JSON.stringify(invoiceError) : 'No invoice record returned.'}<br/>
          <strong>Admin Key Present:</strong> {adminKey ? 'Yes' : 'No'}
        </div>
      </div>
    )
  }

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('name, stripe_account_id')
    .eq('id', invoice.organization_id)
    .single()

  if (!organization) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
        <h2>System Error: Merchant not found.</h2>
        <div style={{ backgroundColor: 'rgba(218, 54, 51, 0.1)', color: 'var(--danger)', padding: '1rem', marginTop: '1rem', borderRadius: '8px', textAlign: 'left' }}>
          <strong>Org ID Searched:</strong> {invoice.organization_id || 'NULL'}<br/>
          <strong>Supabase Error:</strong> {orgError ? JSON.stringify(orgError) : 'No Organization record returned.'}<br/>
        </div>
      </div>
    )
  }

  // Verify the merchant has fully configured Stripe and can accept payments
  let merchantActive = false
  if (organization?.stripe_account_id) {
    try {
      const account = await stripe.accounts.retrieve(organization.stripe_account_id)
      merchantActive = account.charges_enabled
    } catch (e) {
      console.error("Stripe verification failed for public invoice:", e.message)
    }
  }

  const isPaid = invoice.status === 'paid'

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: '16px', 
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{organization.name}</h1>
          <p style={{ color: '#8b949e', margin: 0, fontSize: '0.9rem' }}>Invoice Receipt</p>
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#8b949e', margin: '0 0 0.5rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Due</p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: isPaid ? 'var(--success)' : '#fff', lineHeight: 1 }}>
            ${parseFloat(invoice.total).toFixed(2)}
          </div>
          {isPaid && (
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '1rem' }}>
              PAID IN FULL
            </div>
          )}
        </div>

        {/* Line Items */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Details</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {invoice.line_items?.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#c9d1d9', fontSize: '0.95rem' }}>
                <span>{item.quantity}x {item.description}</span>
                <span>${parseFloat(item.total).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e', fontSize: '0.9rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
            <span>Subtotal</span>
            <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <span>Tax</span>
            <span>${parseFloat(invoice.tax).toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        {!isPaid ? (
          <PayButton 
            invoiceId={invoice.id} 
            stripeAccountId={organization.stripe_account_id}
            disabled={!merchantActive}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#8b949e', fontSize: '0.9rem' }}>
            Thank you for your payment!
          </div>
        )}

        {!merchantActive && !isPaid && (
          <div style={{ textAlign: 'center', color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem' }}>
            This business has not fully completed their payment setup to accept credit cards. Please contact them directly to pay this invoice.
          </div>
        )}
      </div>
    </main>
  )
}
