'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Phone } from 'lucide-react'
import { updateOrganizationProfile } from './actions'

export default function BusinessSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ companyName: '', phone: '' })

  const clientAction = async (formData) => {
    setLoading(true)
    try {
      await updateOrganizationProfile(formData)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 0.5rem 0' }}>Tell us about your business</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>This is what your clients will see on their invoices.</p>
      </div>

      <form action={clientAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem' }}>Company Name</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} color="#8b949e" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              name="companyName"
              required
              placeholder="e.g. Apex Roofing & Exteriors"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid var(--border)',
                color: '#fff',
                padding: '0.8rem 1rem 0.8rem 2.8rem',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem' }}>Business Phone</label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} color="#8b949e" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="tel" 
              name="phone"
              required
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid var(--border)',
                color: '#fff',
                padding: '0.8rem 1rem 0.8rem 2.8rem',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.companyName}
          style={{
            marginTop: '1rem',
            backgroundColor: 'var(--primary)',
            color: '#000',
            border: 'none',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading || !formData.companyName ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: loading || !formData.companyName ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Saving...' : 'Continue'} <ArrowRight size={18} />
        </button>
      </form>
      
      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
}
