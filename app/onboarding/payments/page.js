'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CreditCard, Banknote, HelpCircle } from 'lucide-react'

export default function PaymentsSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConnectStripe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start Stripe Connect onboarding')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Error connecting to Stripe.')
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', borderRadius: '50%', marginBottom: '1rem' }}>
          <Banknote size={32} />
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Get Paid 3x Faster</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          Connect your bank account securely to enable "Pay Now" buttons on all your invoices. Clients pay with credit card or ACH instantly.
        </p>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <CreditCard size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#fff' }}>1 Month Free Bonus</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b949e' }}>Connect right now to get your first month of Pro entirely free.</p>
          </div>
        </div>

        <button 
          onClick={handleConnectStripe}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Connecting...' : 'Connect Bank via Stripe'} <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleSkip}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8b949e',
            fontSize: '0.95rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#fff'}
          onMouseOut={(e) => e.target.style.color = '#8b949e'}
        >
          Skip, I&apos;ll set up payments later (Miss out on free month)
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
}
