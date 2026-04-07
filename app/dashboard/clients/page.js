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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeClients.map((client) => (
                <tr key={client.id}>
                  <td style={{ fontWeight: 'bold' }}>{client.first_name} {client.last_name}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#8b949e' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {client.email || 'N/A'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {client.phone}</span>
                    </div>
                  </td>
                  <td style={{ color: '#8b949e' }}>{client.address}</td>
                  <td><Link href={`/dashboard/clients/${client.id}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
