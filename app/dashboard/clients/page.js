'use client'

import Link from 'next/link'
import { PlusCircle, Search, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ClientsPage() {
  const [clients, setClients] = useState([
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      address: '123 Oak St'
    },
    {
      id: '2',
      first_name: 'Sarah',
      last_name: 'Smith',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      address: '456 Pine Ave'
    }
  ])

  useEffect(() => {
    // Load dynamically added clients from localStorage to prototype the UX flow
    const savedClients = JSON.parse(localStorage.getItem('mockClients') || '[]')
    if (savedClients.length > 0) {
      setClients(prev => [...savedClients, ...prev])
    }
  }, [])

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
            {clients.map((client) => (
              <tr key={client.id}>
                <td style={{ fontWeight: 'bold' }}>{client.first_name} {client.last_name}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#8b949e' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {client.email}</span>
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
    </div>
  )
}
