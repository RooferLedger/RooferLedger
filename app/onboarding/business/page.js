'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Phone, ImagePlus, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { updateOrganizationProfile } from './actions'
import { createClient } from '../../../lib/supabase/client'

export default function BusinessSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ companyName: '', phone: '', address: '' })
  const [logoBase64, setLogoBase64] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const fetchUserAndPrefill = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        const domain = user.email.split('@')[1]
        if (domain) {
          const name = domain.split('.')[0]
          const genericDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'me', 'aol', 'mail']
          if (!genericDomains.includes(name.toLowerCase())) {
            // Capitalize first letter and append "Roofing" logic if we want, or just the name
            const parsedName = name.charAt(0).toUpperCase() + name.slice(1)
            setFormData(prev => ({ ...prev, companyName: parsedName }))
          }
        }
      }
    }
    fetchUserAndPrefill()
  }, [])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const clientAction = async (formDataEvent) => {
    setLoading(true)
    try {
      await updateOrganizationProfile(formDataEvent)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '900' }}>Welcome aboard!</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', margin: 0 }}>What name do you want on your invoices?</p>
      </div>

      <form action={clientAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="hidden" name="logoData" value={logoBase64} />
        
        {/* Core Field - Always Visible */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem', fontWeight: 'bold' }}>Company Name</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} color="#8b949e" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              name="companyName"
              required
              placeholder="e.g. Apex Roofing"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '2px solid var(--border)',
                color: '#fff',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Optional Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem' }}>Company Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#0d1117', border: '1px dashed var(--border)', padding: '1rem', borderRadius: '8px' }}>
                {logoBase64 ? (
                  <img src={logoBase64} alt="Logo Preview" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#fff' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ImagePlus size={24} color="#8b949e" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ color: '#8b949e', fontSize: '0.9rem', width: '100%' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem' }}>Business Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#8b949e" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontSize: '0.9rem' }}>Company Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#8b949e" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <textarea 
                  name="address"
                  placeholder="123 Roofing Way&#10;Dallas, TX 75201"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  style={{ width: '100%', backgroundColor: '#0d1117', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

        <button 
          type="submit" 
          disabled={loading || !formData.companyName}
          style={{
            marginTop: '1.5rem',
            backgroundColor: 'var(--primary)',
            color: '#000',
            border: 'none',
            padding: '1.2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading || !formData.companyName ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: loading || !formData.companyName ? 0.5 : 1,
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(47, 129, 247, 0.4)'
          }}
        >
          {loading ? 'Processing...' : 'Save & Continue'} <ArrowRight size={20} />
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
