'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientSchema } from '../../../../lib/schemas' // Fix path dynamically if needed, it's actually 4 dirs back: app -> dashboard -> clients -> new
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewClientPage() {
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ClientSchema),
  })

  const onSubmit = async (data) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500))
    
    // Save to localStorage for functional prototyping
    const existingClients = JSON.parse(localStorage.getItem('mockClients') || '[]')
    const newClient = {
      id: Math.random().toString(36).substr(2, 9),
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address
    }
    localStorage.setItem('mockClients', JSON.stringify([newClient, ...existingClients]))

    alert("Client saved successfully!")
    router.push('/dashboard/clients')
  }

  return (
    <div className="container">
      <div className="dash-header" style={{ borderBottom: 'none', marginBottom: '1rem', paddingBottom: '0' }}>
        <Link href="/dashboard/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Clients
        </Link>
      </div>

      <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginTop: '0', fontSize: '1.5rem', color: 'var(--foreground)', marginBottom: '2rem' }}>Add New Client</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-section">Homeowner Details</h3>
          
          <div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="input-label">First Name *</label>
              <input 
                {...register('firstName')} 
                className="input-field" 
                placeholder="John" 
                style={{ borderColor: errors.firstName ? 'var(--danger)' : 'var(--border)' }}
              />
              {errors.firstName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="input-label">Last Name *</label>
              <input 
                {...register('lastName')} 
                className="input-field" 
                placeholder="Doe"
                style={{ borderColor: errors.lastName ? 'var(--danger)' : 'var(--border)' }}
              />
              {errors.lastName && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.lastName.message}</span>}
            </div>
          </div>

          <h3 className="form-section" style={{ marginTop: '2.5rem' }}>Contact Information</h3>

          <div className="input-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="input-label">Email Address (Optional)</label>
              <input 
                {...register('email')} 
                className="input-field" 
                type="email" 
                placeholder="john@example.com"
                style={{ borderColor: errors.email ? 'var(--danger)' : 'var(--border)' }}
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email.message}</span>}
            </div>
            <div>
              <label className="input-label">Phone Number *</label>
              <input 
                {...register('phone')} 
                className="input-field" 
                type="tel" 
                placeholder="(555) 123-4567"
                style={{ borderColor: errors.phone ? 'var(--danger)' : 'var(--border)' }}
              />
              {errors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone.message}</span>}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label className="input-label">Property Address *</label>
            <input 
              {...register('address')} 
              className="input-field" 
              placeholder="123 Oak St, City, ST 12345"
              style={{ borderColor: errors.address ? 'var(--danger)' : 'var(--border)' }}
            />
            {errors.address && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.address.message}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <Link href="/dashboard/clients" className="btn btn-secondary" style={{ width: 'auto' }}>
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
              <Save size={20} />
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
