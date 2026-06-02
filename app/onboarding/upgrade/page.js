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
        body: JSON.stringify({ 
          price_id: foundersPriceId,
          mode: 'subscription',
          success_url: '/onboarding/white-glove',
          cancel_url: '/onboarding/upgrade' 
        })
      })
      
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ? "Stripe Checkout Error: " + data.error : 'Could not start checkout. Make sure your Founders Price ID is correct.')
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(99, 91, 255, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', border: '1px solid rgba(99, 91, 255, 0.2)' }}>
          <Zap size={14} className="pulse-badge" style={{ color: 'var(--accent)' }} /> EXCLUSIVE BETA OFFER
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '800', letterSpacing: '-0.02em' }}>Lock In Founders Pricing</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          As one of our first 50 early adopters, bypass our regular $49/month rate and lock in lifetime access for a single yearly flat fee.
        </p>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '2px solid var(--primary)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        marginBottom: '1.5rem',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(99, 91, 255, 0.1)'
      }}>
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary)', color: '#fff', padding: '2px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>
          RECOMMENDED
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#fff', fontWeight: '700' }}>Founders Club</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>$99</span>
            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem', marginBottom: '4px' }}>$588</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '4px' }}>/yr</span>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            'Unlimited Branded Invoices',
            'Accept Direct Online Client Payments',
            'Auto-Sent Client Payment Reminders',
            'Custom Business Logo Integration',
            'Priority Support Hotline Access'
          ].map((feature, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e4e4e7', fontSize: '0.95rem' }}>
              <CheckCircle2 color="var(--primary)" size={16} style={{ flexShrink: 0 }} /> <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button 
          onClick={handleFoundersUpgrade}
          disabled={loading}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.95rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Processing...' : 'Claim Founders Rate'} <ArrowRight size={18} />
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="var(--accent)" /> Secure billing infrastructure by Stripe
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={handleSkip}
          className="btn btn-secondary"
          style={{
            padding: '0.85rem',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}
        >
          Continue on Free Tier (3 free invoices)
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--success)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}></div>
      </div>
    </div>
  )
}
