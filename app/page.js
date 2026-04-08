'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Zap, Smartphone, DollarSign, FileText } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleStart = (e) => {
    e.preventDefault()
    if (email) {
      router.push(`/login?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/login')
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', overflowX: 'hidden' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: 'rgba(47, 129, 247, 0.1)', borderBottom: '1px solid rgba(47, 129, 247, 0.2)', padding: '0.75rem', textAlign: 'center', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
        <Zap size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
        Beta Access: The first 50 Roofers get our $99/yr Lifetime Founders Rate.
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left: Hero Copy */}
        <div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Get paid <span style={{ color: 'var(--primary)' }}>before</span> you climb down the ladder.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8b949e', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Stop chasing checks and leaving thousands on the roof. Send professional digital invoices from your truck in 30 seconds, and let clients pay instantly via credit card.
          </p>

          <form onSubmit={handleStart} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '450px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                minWidth: 0
              }}
            />
            <button type="submit" style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '0 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s',
              flexShrink: 0
            }}>
              Start Free <ArrowRight size={18} />
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.85rem' }}>
            <CheckCircle2 size={14} color="var(--accent)" /> No credit card required. Cancel anytime.
          </div>
        </div>

        {/* Right: UI Mockup */}
        <div style={{ position: 'relative' }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(47, 129, 247, 0.15) 0%, rgba(13, 17, 23, 0) 70%)', zIndex: 0 }}></div>
          
          <div style={{ 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            position: 'relative',
            zIndex: 1,
            padding: '4px'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" 
              alt="RooferLedger Invoice Interface" 
              style={{ width: '100%', borderRadius: '20px', display: 'block', opacity: 0.9 }} 
            />
          </div>
        </div>

      </div>

      {/* Social Proof Bar */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', fontWeight: 'bold' }}>Trusted by 50+ Roofing Professionals</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.6 }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Apex Exteriors</h3>
          <h3 style={{ margin: 0, color: '#fff' }}>Elevate Roofing</h3>
          <h3 style={{ margin: 0, color: '#fff' }}>Summit Contractors</h3>
          <h3 style={{ margin: 0, color: '#fff' }}>Prime Roofs</h3>
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>Built exclusively for roofers.</h2>
          <p style={{ color: '#8b949e', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>General software is too clunky. We built a streamlined engine designed for the specific needs and workflows of the roofing industry.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: Smartphone, color: 'var(--primary)', title: 'Mobile-First Design', desc: 'Draft and send professional invoices directly from your truck before you even pull out of the driveway.' },
            { icon: DollarSign, color: 'var(--accent)', title: 'Instant Stripe Payouts', desc: 'Accept credit card and ACH payments directly on the invoice. Stop waiting 30 days for a paper check.' },
            { icon: FileText, color: '#a371f7', title: 'Look Like a Pro', desc: 'Automatically generated, stunning PDF invoices that make your operation look like a $10M powerhouse.' }
          ].map((feature, i) => (
            <div key={i} style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: `${feature.color}15`, color: feature.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <feature.icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 0.75rem 0' }}>{feature.title}</h3>
              <p style={{ color: '#8b949e', margin: 0, lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}
