import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, FileText, CheckCircle2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/')

  const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
  if (!userData?.organization_id) return redirect('/')

  // Fetch all invoices for this organization, joining with clients table to get names
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      id,
      created_at,
      total,
      status,
      due_date,
      clients ( first_name, last_name )
    `)
    .eq('organization_id', userData.organization_id)
    .order('created_at', { ascending: false })

  return (
    <div className="container">
      <div className="dash-header">
        <div>
          <h1>Invoice Ledger</h1>
          <p>A history of all generated and dispatched invoices.</p>
        </div>
        <Link href="/invoice/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> New Invoice
        </Link>
      </div>

      <div className="form-card">
        {!invoices || invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8b949e' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3>No invoices yet</h3>
            <p>Create your first invoice to initialize the ledger.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: '#8b949e', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem' }}>ID / Date</th>
                  <th style={{ padding: '1rem' }}>Client</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: 'var(--foreground)' }}>INV-{inv.id.slice(0, 8)}</div>
                      <div style={{ fontSize: '0.85rem', color: '#8b949e' }}>{new Date(inv.created_at).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--foreground)' }}>
                      {inv.clients?.first_name} {inv.clients?.last_name}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                      ${Number(inv.total).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {inv.status === 'paid' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(46, 160, 67, 0.1)', color: '#3fb950', fontSize: '0.85rem', fontWeight: '500' }}>
                          <CheckCircle2 size={14} /> Paid
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', fontSize: '0.85rem', fontWeight: '500' }}>
                          <Clock size={14} /> {inv.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
