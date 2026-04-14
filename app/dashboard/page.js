import Link from 'next/link'
import { PlusCircle, TrendingUp, Users, DollarSign, Clock, FileText } from 'lucide-react'
import { updateInvoiceStatus } from './invoices/actions'

import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

// Dummy Data for UI implementation
export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Enforce Onboarding Completion
  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) {
    // They are authenticated but have not set up their business!
    redirect('/onboarding/business')
  }

  // Fetch true organization name for the dashboard header
  const { data: orgData } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', userData.organization_id)
    .single()

  const rooferName = orgData?.name || 'Valued User'

  // Fetch invoices for metric calculation
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      id,
      total,
      status,
      created_at,
      client_id,
      clients ( first_name, last_name )
    `)
    .eq('organization_id', userData.organization_id)
    .order('created_at', { ascending: false })

  const invList = invoices || []
  
  const totalRevenue = invList.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total || 0), 0)
  const outstanding = invList.filter(i => ['sent', 'draft'].includes(i.status)).reduce((sum, i) => sum + Number(i.total || 0), 0)
  const uniqueClients = new Set(invList.map(i => i.client_id)).size

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  const metrics = [
    { title: 'Total Revenue', value: formatter.format(totalRevenue), icon: DollarSign, trend: '+0%', color: 'var(--primary)' },
    { title: 'Outstanding', value: formatter.format(outstanding), icon: Clock, trend: '-0%', color: 'var(--accent)' },
    { title: 'Active Clients', value: uniqueClients.toString(), icon: Users, trend: '+0', color: '#a371f7' },
  ]

  const recentInvoices = invList.slice(0, 5)

  return (
    <div className="container">
      <div className="dash-header">
        <div className="dash-title-box">
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome back, {rooferName}!</h1>
          <p style={{ fontSize: '1rem', color: '#8b949e', marginTop: 0 }}>Here's what's happening with your business.</p>
        </div>
        <Link href="/invoice/new" className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} /> New Invoice
        </Link>
      </div>

      <div className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.title} className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 className="metric-title" style={{ margin: 0 }}>{metric.title}</h3>
                <div style={{ backgroundColor: `${metric.color}20`, padding: '0.5rem', borderRadius: '8px' }}>
                  <Icon size={24} color={metric.color} />
                </div>
              </div>
              <p className="metric-value">{metric.value}</p>
            </div>
          )
        })}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Invoices</h2>
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {recentInvoices.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8b949e' }}>
            <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>No recent invoices</h3>
            <p style={{ margin: 0 }}>Create your first invoice to get paid.</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Invoice</th>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Client</th>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Amount</th>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Date</th>
                <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--primary)' }}>
                    <Link href={`/api/invoice/preview?invoiceId=${inv.id}`} target="_blank" style={{ textDecoration: 'underline' }}>
                      INV-{inv.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.clients?.first_name} {inv.clients?.last_name}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{formatter.format(inv.total)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600',
                      backgroundColor: inv.status === 'paid' ? 'rgba(35, 134, 54, 0.2)' : inv.status === 'cancelled' ? 'rgba(248, 81, 73, 0.2)' : inv.status === 'sent' ? 'rgba(47, 129, 247, 0.2)' : 'rgba(139, 148, 158, 0.2)',
                      color: inv.status === 'paid' ? 'var(--accent)' : inv.status === 'cancelled' ? '#f85149' : inv.status === 'sent' ? 'var(--primary)' : '#8b949e'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#8b949e', fontSize: '0.9rem' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {['sent'].includes(inv.status) && (
                        <form action={updateInvoiceStatus.bind(null, inv.id, 'draft')}>
                          <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: '#8b949e', cursor: 'pointer' }}>Recall</button>
                        </form>
                      )}
                      {['sent', 'draft'].includes(inv.status) && (
                        <form action={updateInvoiceStatus.bind(null, inv.id, 'cancelled')}>
                          <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'transparent', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', cursor: 'pointer' }}>Cancel</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
