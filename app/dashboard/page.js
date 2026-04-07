import Link from 'next/link'
import { PlusCircle, TrendingUp, Users, DollarSign, Clock, FileText } from 'lucide-react'

// Dummy Data for UI implementation
export default function Dashboard() {
  const metrics = [
    { title: 'Total Revenue', value: '$24,500', icon: DollarSign, trend: '+12%', color: 'var(--primary)' },
    { title: 'Outstanding', value: '$8,200', icon: Clock, trend: '-5%', color: 'var(--accent)' },
    { title: 'Active Clients', value: '14', icon: Users, trend: '+2', color: '#a371f7' },
  ]

  const recentInvoices = [
    { id: '#INV-001', client: 'John Doe', amount: '$4,500.00', status: 'Paid', date: '2026-04-05' },
    { id: '#INV-002', client: 'Sarah Smith', amount: '$8,200.00', status: 'Sent', date: '2026-04-02' },
    { id: '#INV-003', client: 'Mike Johnson', amount: '$12,000.00', status: 'Draft', date: '2026-04-06' },
  ]

  // In Phase 4, we will pull this dynamically from the logged-in Supabase User session
  // e.g. const { data: { user } } = await supabase.auth.getUser()
  // const rooferName = user.user_metadata.company_name || 'Roofer'
  const rooferName = 'Apex Roofing'

  return (
    <div className="container">
      <div className="dash-header">
        <div className="dash-title-box">
          <h1>Overview</h1>
          <p>Welcome back, {rooferName}! Here&apos;s what&apos;s happening with your business.</p>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', color: metric.trend.startsWith('+') ? 'var(--accent)' : 'var(--danger)', fontSize: '0.9rem', fontWeight: '500' }}>
                <TrendingUp size={16} />
                <span>{metric.trend} from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Invoices</h2>
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Invoice</th>
              <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Client</th>
              <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Amount</th>
              <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Status</th>
              <th style={{ padding: '1rem', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--primary)' }}>{inv.id}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.client}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.amount}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: '600',
                    backgroundColor: inv.status === 'Paid' ? 'rgba(35, 134, 54, 0.2)' : inv.status === 'Sent' ? 'rgba(47, 129, 247, 0.2)' : 'rgba(139, 148, 158, 0.2)',
                    color: inv.status === 'Paid' ? 'var(--accent)' : inv.status === 'Sent' ? 'var(--primary)' : '#8b949e'
                  }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#8b949e', fontSize: '0.9rem' }}>{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
