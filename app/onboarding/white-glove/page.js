'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, HardHat, CalendarCheck } from 'lucide-react'

export default function WhiteGloveSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleWhiteGlovePurchase = async () => {
    setLoading(true)
    try {
      const setupPriceId = process.env.NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID
      
      if (!setupPriceId) {
        alert("The Stripe Setup Price ID is not configured yet. Skipping to next step.")
        router.push('/onboarding/payments')
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          price_id: setupPriceId,
          mode: 'payment', // One-time charge
          success_url: '/onboarding/white-glove/success',
          cancel_url: '/onboarding/white-glove' 
        })
      })
      
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Could not start checkout.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Error connecting to checkout.')
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/payments')
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 153, 0, 0.1)', color: '#ff9900', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          <HardHat size={14} /> WHITE-GLOVE SETUP
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Let us do the heavy lifting.</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          Migrating software is a pain. For a one-time fee, our expert team will jump on a 30-minute call with you, import your entire client list from your old software, connect your bank, and help you send your first real invoice.
        </p>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#fff' }}>White-Glove Migration</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>$149</span>
            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '4px' }}>one-time</span>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {['1-on-1 Zoom Setup Call', 'We import your clients (from QuickBooks/Excel)', 'We connect your bank payouts securely', 'We configure your logo & branding', 'We send your first live invoice together'].map((feature, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#c9d1d9', fontSize: '0.95rem' }}>
              <CheckCircle2 color="var(--success)" size={18} /> {feature}
            </li>
          ))}
        </ul>

        <button 
          onClick={handleWhiteGlovePurchase}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#ff9900', // Distinct action color
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
          {loading ? 'Processing...' : 'Add Setup Assistance ($149)'} <CalendarCheck size={18} />
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
          No thanks, I will set it up myself
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
}
