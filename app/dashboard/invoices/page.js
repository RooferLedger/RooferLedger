import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, FileText, CheckCircle2, Clock, X, Download } from 'lucide-react'
import { updateInvoiceStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage({ searchParams }) {
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

  const previewId = searchParams?.preview

  return (
    <div className="container">
      {/* Quick View Modal Overlay */}
      {previewId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '90vh' }}>
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161b22', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--foreground)' }}>Invoice Viewer</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <a href={`/api/invoice/download?id=${previewId}`} download={`Invoice-${previewId.slice(0,8)}.pdf`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={16} /> Save Document
                </a>
                <Link href={'/dashboard/invoices'} scroll={false} style={{ color: '#8b949e', display: 'flex', alignItems: 'center' }}>
                  <X size={24} />
                </Link>
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#000' }}>
              <iframe src={`/api/invoice/download?id=${previewId}`} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
            </div>
          </div>
        </div>
      )}
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
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: '#8b949e', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem' }}>ID / Date</th>
                  <th style={{ padding: '1rem' }}>Client</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: 'var(--primary)' }}>
                        <Link href={`?preview=${inv.id}`} scroll={false} style={{ textDecoration: 'underline' }}>
                          INV-{inv.id.slice(0, 8)}
                        </Link>
                      </div>
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
                      ) : inv.status === 'cancelled' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', fontSize: '0.85rem', fontWeight: '500' }}>
                          Cancelled
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', fontSize: '0.85rem', fontWeight: '500' }}>
                          <Clock size={14} /> {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {['sent'].includes(inv.status) && (
                          <form action={updateInvoiceStatus.bind(null, inv.id, 'draft')}>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#8b949e', cursor: 'pointer' }}>Recall to Draft</button>
                          </form>
                        )}
                        {['sent', 'draft'].includes(inv.status) && (
                          <form action={updateInvoiceStatus.bind(null, inv.id, 'cancelled')}>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', cursor: 'pointer' }}>Cancel</button>
                          </form>
                        )}
                      </div>
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
