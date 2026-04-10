'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Zap, Smartphone, DollarSign, FileText, Star } from 'lucide-react'
import { createClient } from '../lib/supabase/client'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setIsLoggedIn(true)
    }
    checkUser()
  }, [])

  const handleStart = (e) => {
    e.preventDefault()
    if (isLoggedIn) {
      router.push('/dashboard')
    } else if (email) {
      router.push(`/login?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/login')
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', overflowX: 'hidden' }}>
      {/* Top Banner */}
      <div style={{ backgroundColor: 'rgba(47, 129, 247, 0.1)', borderBottom: '1px solid rgba(47, 129, 247, 0.2)', padding: '0.75rem', textAlign: 'center', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} style={{ color: '#fbbf24' }} />
          <span><strong style={{ color: '#fff' }}>BETA ACCESS:</strong> Only <span style={{ backgroundColor: '#da3633', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', animation: 'pulse 2s infinite' }}>14 of 50</span> Founders Spots Remaining. Lock in your $99/yr Lifetime Rate.</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
          Roofer<span style={{ color: 'var(--primary)' }}>Ledger</span>
        </div>
        <button 
          onClick={() => router.push(isLoggedIn ? '/dashboard' : '/login')}
          style={{ 
            backgroundColor: 'transparent', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.2)', 
            padding: '0.5rem 1.25rem', 
            borderRadius: '6px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          {isLoggedIn ? 'Dashboard' : 'Sign In'}
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left: Action-Oriented Hero Copy */}
        <div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Get paid <span style={{ color: 'var(--primary)' }}>faster</span> before you leave the job site.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a1a1aa', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '500px' }}>
            Stop chasing checks and leaving cash on the roof. Generate professional, branded invoices from your truck in 30 seconds and accept secure credit card payments instantly.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(46, 160, 67, 0.15)', color: '#3fb950', padding: '8px 16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', marginBottom: '2.5rem', border: '1px solid rgba(46, 160, 67, 0.3)' }}>
            <CheckCircle2 size={18} /> Your first 3 invoices are completely on us.
          </div>

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
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                minWidth: 0,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
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
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(47, 129, 247, 0.4)'
            }}>
              Start Free Trial <ArrowRight size={18} />
            </button>
          </form>
          
          {/* Micro-Proofing Elements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <div style={{ color: '#8b949e', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#c9d1d9' }}>4.9/5</span> from 50+ Roofing Pros
            </div>
            <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border)', color: '#8b949e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <CheckCircle2 size={14} color="var(--success)" /> No credit card required.
            </div>
          </div>
        </div>

        {/* Right: Custom Bespoke UI Mockup */}
        <div style={{ position: 'relative' }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '130%', height: '130%', background: 'radial-gradient(circle, rgba(47, 129, 247, 0.2) 0%, rgba(13, 17, 23, 0) 70%)', zIndex: 0 }}></div>
          
          <div style={{ 
            backgroundColor: '#161b22', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1,
            padding: '6px'
          }}>
            <img 
              src="/hero-mockup.png" 
              alt="RooferLedger App in action on a roof" 
              style={{ width: '100%', borderRadius: '18px', display: 'block' }} 
            />
          </div>
        </div>

      </div>

      {/* Social Proof Bar */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', fontWeight: 'bold' }}>Trusted daily by leading contractors</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3.5rem', flexWrap: 'wrap', opacity: 0.5 }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: '900' }}>APEX<span style={{fontWeight:'300'}}>EXTERIORS</span></h3>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontStyle: 'italic', fontWeight: '800' }}>Summit Roofs</h3>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', letterSpacing: '-1px' }}>ELEVATE CONTRACTORS</h3>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>PRIME<span style={{color:'var(--primary)'}}>.</span></h3>
        </div>
      </div>

      {/* Bottom Line Benefit Mapping */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Built to accelerate your cash flow.</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>General contracting software is confusing and bloated. We built a streamlined, mobile-first engine specifically engineered for the daily workflow of a busy roofer.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {[
            { 
              icon: Smartphone, 
              color: 'var(--primary)', 
              title: 'Reclaim 10+ Hours a Week', 
              desc: 'Stop doing paperwork at 9PM. Draft and send branded PDF invoices directly from the driveway on your phone right after the inspection.' 
            },
            { 
              icon: DollarSign, 
              color: 'var(--success)', 
              title: 'Get Paid 3x Faster', 
              desc: 'Embed secure payment links directly into your invoices. Clients tap to pay with a credit card or ACH, landing the money in your bank instantly.' 
            },
            { 
              icon: FileText, 
              color: '#a371f7', 
              title: 'Look Like a True Pro', 
              desc: 'Auto-generate stunning, perfectly formatted invoices that make your operation look like a premium corporate powerhouse, increasing your close rate.' 
            }
          ].map((feature, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '48px', height: '48px', backgroundColor: `${feature.color}15`, color: feature.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <feature.icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 'bold' }}>{feature.title}</h3>
              <p style={{ color: '#a1a1aa', margin: 0, lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials */}
      <div style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Used by top roofing professionals.</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto' }}>Don't just take our word for it. Here's what owners are saying.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                name: "Marcus T.",
                role: "Owner, Summit Roofs",
                quote: "I used to spend my entire Sunday morning doing invoicing in QuickBooks. Now I literally send the invoice from my truck before I even pull out of the client's driveway. Game changer."
              },
              {
                name: "David R.",
                role: "Operator, Prime Exteriors",
                quote: "The ability to just text the invoice straight to the homeowner is huge. They tap the link and pay with their credit card instantly. We've cut our accounts receivable time down by 80%."
              },
              {
                name: "Sarah L.",
                role: "Admin, Elevate Contractors",
                quote: "Everything else we tried was just too complicated. RooferLedger is so simple that our newest guys in the field were generating professional estimates and invoices on day one without any training."
              }
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: '#0d1117', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p style={{ fontSize: '1.05rem', color: '#e6edf3', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontWeight: 'bold' }}>{t.name}</h4>
                  <span style={{ color: '#8b949e', fontSize: '0.9rem' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Final CTA Footer */}
      <div style={{ backgroundColor: 'rgba(47, 129, 247, 0.05)', borderTop: '1px solid var(--border)', padding: '6rem 1.5rem 8rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>Ready to modernize your business?</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>Join the exclusive beta today and lock in our $99/yr lifetime founders rate before it jumps to $49/month.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', width: 'auto', margin: '0 auto' }}>
          Create Your Free Account
        </button>
      </div>

      {/* Legal Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#0d1117' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Link href="/terms" style={{ color: '#8b949e', fontSize: '0.9rem', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: '#8b949e', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</Link>
          <a href="mailto:support@rooferledger.com" style={{ color: '#8b949e', fontSize: '0.9rem', textDecoration: 'none' }}>Contact Support</a>
        </div>
        <p style={{ color: '#8b949e', fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>&copy; {new Date().getFullYear()} RooferLedger. All rights reserved.</p>
      </footer>

    </main>
  )
}
