import { createClient } from '../../../lib/supabase/server'
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import TrackPaymentClient from './TrackPaymentClient'

export default async function PaymentSuccess({ searchParams }) {
  const invoiceId = searchParams?.invoice

  if (!invoiceId) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>
        <h2>Invalid Link</h2>
        <p style={{ color: '#8b949e' }}>Invoice ID missing.</p>
      </div>
    )
  }

  const supabase = createClient()

  // Verify the invoice exists
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, status, total, organizations(name)')
    .eq('id', invoiceId)
    .single()

  if (invoice) {
    // Optimistic Quick-Update to mark as paid (For MVP. Production uses Webhooks)
    if (invoice.status !== 'paid') {
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceId)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: '16px', 
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        
        <TrackPaymentClient value={invoice?.total || 0} />

        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <CheckCircle2 color="var(--success)" size={48} />
        </div>

        <h1 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>Payment Successful</h1>
        
        <p style={{ color: '#8b949e', fontSize: '1rem', lineHeight: 1.5, marginBottom: '2rem' }}>
          Your payment to <strong>{invoice?.organizations?.name || 'the contractor'}</strong> has been securely processed. Details have been logged to the ledger.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.85rem', marginBottom: '2rem' }}>
          <ShieldCheck size={16} /> Secure payment via Stripe
        </div>

        <Link href={`/pay?invoice=${invoiceId}`} style={{
          display: 'inline-block',
          color: '#fff',
          textDecoration: 'none',
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          transition: 'all 0.2s',
          fontSize: '0.9rem'
        }}>
          View Receipt
        </Link>
      </div>
    </main>
  )
}
