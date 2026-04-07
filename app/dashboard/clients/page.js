import Link from 'next/link'
import { PlusCircle, Search, Mail, Phone, Users as UsersIcon } from 'lucide-react'
import { createClient } from '../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const supabase = createClient()
  
  // Safely fetch clients under RLS
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  const safeClients = clients || []

  return (
    <div className="container">
      <div className="dash-header">
        <div className="dash-title-box">
          <h1>Clients</h1>
          <p>Manage your homeowners and property managers.</p>
        </div>
        <Link href="/dashboard/clients/new" className="btn btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> Add Client
        </Link>
      </div>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
        <input 
          className="input-field" 
          placeholder="Search clients..." 
          style={{ paddingLeft: '2.5rem' }} 
        />
      </div>

      {safeClients.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <UsersIcon size={48} style={{ margin: '0 auto 1rem auto', color: '#8b949e', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No clients yet</h3>
          <p style={{ color: '#8b949e', marginBottom: '1.5rem' }}>Get started by adding your first homeowner or property manager to the database.</p>
          <Link href="/dashboard/clients/new" className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
            <PlusCircle size={18} style={{ marginRight: '0.5rem' }}/> 
            Add New Client
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {safeClients.map((client) => {
            const initials = `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`.toUpperCase();
            
            return (
              <Link 
                href={`/dashboard/clients/${client.id}`} 
                key={client.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 2fr) auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                className="client-row-card"
              >
                {/* Name & Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                  <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #3a82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
                    {initials}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontWeight: '600', color: 'var(--foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {client.first_name} {client.last_name}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#8b949e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {client.phone}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.9rem', overflow: 'hidden' }}>
                  <Mail size={16} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {client.email || 'No email'}
                  </span>
                </div>

                {/* Address */}
                <div style={{ color: '#8b949e', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {client.address}
                </div>

                {/* Actions */}
                <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(88, 166, 255, 0.1)', borderRadius: '999px' }}>
                  View Profile
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
