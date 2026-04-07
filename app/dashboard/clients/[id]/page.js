import { createClient } from '../../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, PlusCircle, CheckCircle2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ClientViewPage({ params }) {
  const supabase = createClient()
  const { id } = params
  
  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/')

  // Fetch client details
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (clientError || !client) return redirect('/dashboard/clients')

  // Fetch past invoices for this specific client
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, created_at, total, status')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const safeInvoices = invoices || []

  // Create initals for avatar
  const initials = `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`.toUpperCase()

  return (
    <div className="container">
      <div className="dash-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1.5rem' }}>
        <Link href="/dashboard/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontWeight: '500', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Clients
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="form-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #3a82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: 'var(--foreground)' }}>
                {client.first_name} {client.last_name}
              </h1>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>
                Active Client
              </span>
            </div>
            <div>
              <Link href={`/invoice/new?client_id=${client.id}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                <PlusCircle size={16} /> New Invoice
              </Link>
            </div>
          </div>

          <div className="form-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)' }}>
              <FileText size={20} /> Invoice History
            </h3>
            
            {safeInvoices.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                <p style={{ margin: 0, color: '#8b949e' }}>No invoices have been issued to this client yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {safeInvoices.map(inv => (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#0d1117', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong style={{ color: 'var(--foreground)' }}>INV-{inv.id.slice(0, 8)}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#8b949e' }}>{new Date(inv.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>${Number(inv.total).toFixed(2)}</strong>
                      {inv.status === 'paid' ? (
                        <span style={{ width: '80px', textAlign: 'center', padding: '0.25rem 0.5rem', borderRadius: '999px', backgroundColor: 'rgba(46, 160, 67, 0.1)', color: '#3fb950', fontSize: '0.75rem', fontWeight: '600' }}>PAID</span>
                      ) : (
                        <span style={{ width: '80px', textAlign: 'center', padding: '0.25rem 0.5rem', borderRadius: '999px', backgroundColor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', fontSize: '0.75rem', fontWeight: '600' }}>SENT</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--foreground)', fontSize: '1.1rem' }}>Contact Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Mail size={18} style={{ color: '#8b949e', marginTop: '0.1rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                  <span style={{ color: 'var(--foreground)' }}>{client.email || 'No email provided'}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Phone size={18} style={{ color: '#8b949e', marginTop: '0.1rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</span>
                  <span style={{ color: 'var(--foreground)' }}>{client.phone}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <MapPin size={18} style={{ color: '#8b949e', marginTop: '0.1rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</span>
                  <span style={{ color: 'var(--foreground)', lineHeight: '1.4' }}>{client.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
