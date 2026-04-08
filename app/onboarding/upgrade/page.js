'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function UpgradeSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleFoundersUpgrade = async () => {
    setLoading(true)
    try {
      const foundersPriceId = process.env.NEXT_PUBLIC_STRIPE_FOUNDERS_PRICE_ID
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_id: foundersPriceId })
      })
      
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Could not start checkout. Make sure your Founders Price ID is correct.')
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          <Zap size={14} /> EXCLUSIVE OFFER
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Lock in Founders Pricing</h2>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          As one of our first 50 early adopters, bypass our $49/month subscription and get lifetime access for a single, flat yearly rate. 
        </p>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '2px solid var(--primary)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary)', color: '#000', padding: '2px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          MOST POPULAR
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#fff' }}>Founders Club</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>$99</span>
            <span style={{ color: '#8b949e', textDecoration: 'line-through', fontSize: '1rem', marginBottom: '4px' }}>$588</span>
            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '4px' }}>/yr</span>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {['Unlimited Invoicing', 'Accept Instant Credit Card Payments', 'Automated Client Follow-ups', 'Client Portal Access', 'Priority Support via Phone'].map((feature, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#c9d1d9', fontSize: '0.95rem' }}>
              <CheckCircle2 color="var(--primary)" size={18} /> {feature}
            </li>
          ))}
        </ul>

        <button 
          onClick={handleFoundersUpgrade}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: 'var(--primary)',
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
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}
        >
          {loading ? 'Processing...' : 'Claim $99/yr Lifetime Rate'} <ArrowRight size={18} />
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#8b949e', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} /> Secure checkout via Stripe
        </div>
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
          No thanks, I&apos;ll use the limited free version
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
}
