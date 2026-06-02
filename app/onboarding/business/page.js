'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import TrackSignupClient from './TrackSignupClient'
import { ArrowRight, Building2, Phone, ImagePlus, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { updateOrganizationProfile } from './actions'
import { createClient } from '../../../lib/supabase/client'

export default function BusinessSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
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
      <Suspense fallback={null}>
        <TrackSignupClient />
      </Suspense>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Welcome aboard!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          What name should display on your client invoices?
        </p>
      </div>

      <form action={clientAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <input type="hidden" name="logoData" value={logoBase64} />
        
        {/* Required field */}
        <div>
          <label className="input-label" style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Company Name</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              name="companyName"
              required
              placeholder="e.g. Apex Roofing"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border)',
                color: '#fff',
                padding: '0.95rem 1rem 0.95rem 2.8rem',
                borderRadius: '10px',
                fontSize: '1.05rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Collapsible Optional Section */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.25rem 0',
              cursor: 'pointer'
            }}
          >
            {showOptional ? (
              <>
                <ChevronUp size={16} /> Hide optional invoice details
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Add optional invoice details (Logo, Phone, Address)
              </>
            )}
          </button>

          {showOptional && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '1rem' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Company Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px dashed var(--border)', padding: '0.85rem', borderRadius: '8px' }}>
                  {logoBase64 ? (
                    <img src={logoBase64} alt="Logo Preview" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#fff' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ImagePlus size={20} color="var(--text-muted)" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '100%' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Business Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border)', color: '#fff', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Company Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '0.85rem' }} />
                  <textarea 
                    name="address"
                    placeholder="123 Roofing Way&#10;Dallas, TX 75201"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border)', color: '#fff', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.companyName}
          className="btn btn-primary"
          style={{
            marginTop: '1rem',
            padding: '1rem',
            fontSize: '1.05rem',
            fontWeight: '700',
            cursor: loading || !formData.companyName ? 'not-allowed' : 'pointer',
            opacity: loading || !formData.companyName ? 0.5 : 1,
          }}
        >
          {loading ? 'Processing...' : 'Save & Continue'} <ArrowRight size={18} />
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
