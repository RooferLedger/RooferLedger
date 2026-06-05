'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Zap, Smartphone, DollarSign, FileText, Star, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { createClient } from '../lib/supabase/client'
import { event } from './components/FacebookPixel'
import InteractiveHeroDemo from './components/InteractiveHeroDemo'


export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
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
    event('InitiateCheckout')

    if (isLoggedIn) {
      router.push('/dashboard')
    } else if (email) {
      router.push(`/login?email=${encodeURIComponent(email)}&mode=signup`)
    } else {
      router.push('/login?mode=signup')
    }
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "How does the 'paid before leaving the driveway' workflow work?",
      a: "You simply draft the invoice on your phone while still at the property, tap send to email/text a secure link to the homeowner, and they can pay instantly using Apple Pay, Credit Card, or bank transfer right in front of you."
    },
    {
      q: "What exactly does the monthly fee include and how much?",
      a: "RooferLedger offers a limited Free Tier where your first 3 invoices are completely free. For unlimited invoicing and advanced features, our standard subscription is $49/month. However, during our beta, you can lock in our Founders Club rate of $99/year (saving over 80%). This includes unlimited invoice generation, custom logos, automated client reminders, client portal access, and priority support."
    },
    {
      q: "What are the transaction fees?",
      a: "We process payments via Stripe Connect. For card payments, the processing fee is 2.9% + 30¢ plus a platform fee of 0.5% (total 3.4% + 30¢). For ACH bank transfers, it is only 0.8% capped at $5 plus our 0.5% fee. There are no different rates or markups for credit cards vs. debit cards."
    },
    {
      q: "Is there a limit on the number or dollar amount of invoices?",
      a: "No. Once you upgrade to Pro or lock in the Founders Rate, there is no limit to the number of invoices you can send. Single transaction limits match Stripe's standard limits (up to $999,999.99 for credit cards and standard ACH transaction limits)."
    },
    {
      q: "Are there chargeback fees and how do you support disputes?",
      a: "Stripe Connect has a standard $15 dispute fee which is refunded if the dispute is decided in your favor. If a client initiates a chargeback, Stripe provides a secure Dispute Portal directly in your dashboard where you can upload evidence—such as photos of completed work or signed contracts—to submit to the card issuer."
    },
    {
      q: "Do I have fraud protection?",
      a: "Yes. All payments run through Stripe Radar, a state-of-the-art fraud detection network that uses advanced machine learning to detect and block suspicious payments before they go through."
    },
    {
      q: "How long does it take to go live and start invoicing?",
      a: "Instantly. Account creation takes under 30 seconds, and you can draft invoices immediately. To accept online card and ACH payments, you'll need to link your bank account via Stripe Connect, which takes about 3-5 minutes."
    },
    {
      q: "What features are included in the dashboard and supporting tools?",
      a: "Your dashboard tracks Total Revenue, Outstanding A/R, and Active Clients in real-time. Supporting tools include a Client Directory (to save client contact info), an Invoice Ledger (to filter by Draft, Sent, Paid, and Cancelled), one-click PDF downloading, and immediate Stripe refund/recall action buttons."
    },
    {
      q: "Can I upload my own company logo?",
      a: "Absolutely! During onboarding or in your settings, you can upload your business logo. It will automatically render beautifully on all PDF invoices sent to clients."
    }
  ]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#030303', color: '#fff', overflowX: 'hidden', position: 'relative' }}>
      {/* JSON-LD Structured Data for AI & Search Engine Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'RooferLedger',
            'description': 'Mobile-first invoicing and payments engine built specifically for roofing contractors to get paid instantly on-site.',
            'applicationCategory': 'BusinessApplication',
            'operatingSystem': 'iOS, Android, Windows, macOS',
            'offers': {
              '@type': 'Offer',
              'price': '99.00',
              'priceCurrency': 'USD',
              'priceSpecification': {
                '@type': 'UnitPriceSpecification',
                'price': '99.00',
                'priceCurrency': 'USD',
                'referenceQuantity': {
                  '@type': 'QuantitativeValue',
                  'value': '1',
                  'unitCode': 'ANN'
                }
              }
            },
            'author': {
              '@type': 'Organization',
              'name': 'RooferLedger',
              'url': 'https://www.rooferledger.com'
            }
          })
        }}
      />
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99, 91, 255, 0.12) 0%, rgba(3, 3, 3, 0) 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, rgba(3, 3, 3, 0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navigation Bar */}
      <nav className="nav-bar" style={{ position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: '1.6rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em' }}>
          Roofer<span className="gradient-text" style={{ fontWeight: '900' }}>Ledger</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => router.push(isLoggedIn ? '/dashboard' : '/login')}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#8e909a', 
              border: 'none', 
              padding: '0.5rem 0.5rem', 
              fontWeight: '600', 
              cursor: 'pointer',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#8e909a'}
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
          
          <button 
            onClick={() => router.push(isLoggedIn ? '/dashboard' : '/login?mode=signup')}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: '700' }}
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 6rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 5 }}>
        
        {/* Left: Copy & Form */}
        <div>
          <h1 className="hero-title">
            Get paid <span className="gradient-text">on the roof</span> before you leave the driveway.
          </h1>
          <p className="hero-subtitle">
            Create professional, branded PDF invoices from your truck in 30 seconds. Text or email a secure link to the homeowner and accept Apple Pay, cards, or ACH instantly.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#34d399', padding: '8px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', marginBottom: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={16} /> Your first 3 invoices are completely free.
          </div>

          <form onSubmit={handleStart} className="hero-form">
            <input 
              type="email" 
              placeholder="Enter your email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                minWidth: 0,
                transition: 'all 0.2s',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{
              width: 'auto',
              padding: '1rem 1.75rem',
              fontWeight: '700',
              flexShrink: 0
            }}>
              Create My First Invoice <ArrowRight size={18} />
            </button>
          </form>
          
          {/* Trust Metrics */}
          <div className="micro-proof">
            <div style={{ display: 'flex', gap: '3px', color: '#fbbf24' }}>
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: '700', color: '#fff' }}>4.9/5</span> from 50+ Roofing Pros
            </div>
            <div className="micro-proof-divider" style={{ gap: '6px' }}>
               <ShieldCheck size={16} color="var(--accent)" /> 
               <span>Payments infrastructure secured by <strong style={{ color: '#fff' }}>Stripe</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Mockup with Glow Backdrop */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Spotlight background glow behind the mockup */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '120%', 
            height: '120%', 
            background: 'radial-gradient(circle, rgba(99, 91, 255, 0.22) 0%, rgba(3, 3, 3, 0) 70%)', 
            zIndex: 0,
            pointerEvents: 'none'
          }}></div>
          
          <InteractiveHeroDemo />
        </div>

      </div>

      {/* Trust Logo Bar */}
      <div style={{ 
        borderTop: '1px solid var(--border)', 
        borderBottom: '1px solid var(--border)', 
        backgroundColor: 'rgba(255, 255, 255, 0.01)', 
        padding: '3rem 1.5rem', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', fontWeight: '700' }}>
          Trusted Daily by Leading Roofing Contractors
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '1.4rem', fontWeight: '900', opacity: 0.65 }}>APEX<span style={{fontWeight:'300'}}>EXTERIORS</span></h3>
          <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '1.4rem', fontStyle: 'italic', fontWeight: '800', opacity: 0.65 }}>Summit Roofs</h3>
          <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '1.3rem', letterSpacing: '-1px', fontWeight: '700', opacity: 0.65 }}>ELEVATE CONTRACTORS</h3>
          <h3 style={{ margin: 0, color: '#c9d1d9', fontSize: '1.4rem', fontWeight: '900', opacity: 0.65 }}>PRIME<span style={{color:'var(--accent)'}}>.</span></h3>
        </div>
      </div>

      {/* How it Works Section */}
      <div style={{ padding: '7rem 1.5rem', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <div style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Simplified Workflow</div>
             <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Zero Friction From Roof to Bank</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>A seamless payment system designed specifically for contractors in the field.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
             {/* Step 1 */}
             <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: '20px', padding: '3.5rem 2.25rem', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'rgba(255,255,255,0.03)', fontSize: '5rem', fontWeight: '900', lineHeight: 1 }}>01</div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
                  <FileText size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: '700' }}>Draft In Seconds</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>Fill in customer details, work scope, and line items. We auto-format a gorgeous PDF matching your business brand.</p>
             </div>

             {/* Step 2 */}
             <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: '20px', padding: '3.5rem 2.25rem', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'rgba(255,255,255,0.03)', fontSize: '5rem', fontWeight: '900', lineHeight: 1 }}>02</div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(99, 91, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
                  <Smartphone size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: '700' }}>Send with One Tap</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>Deliver the invoice instantly via text or email. Homeowners click the link to view the document and secure payment gate.</p>
             </div>

             {/* Step 3 */}
             <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: '20px', padding: '3.5rem 2.25rem', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'rgba(0, 242, 254, 0.03)', fontSize: '5rem', fontWeight: '900', lineHeight: 1 }}>03</div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
                  <DollarSign size={24} style={{ color: 'var(--success)' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: '700' }}>Instant Deposit</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>Clients pay instantly via credit card, Apple Pay, or bank transfer. Funds are direct-deposited straight to your bank account.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Core Benefits Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem 1.5rem', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Why RooferLedger?</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Built to accelerate cash flow</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Bloated general invoicing apps delay payouts. RooferLedger cuts out the administrative overhead so you get paid faster.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { 
              icon: Smartphone, 
              color: 'var(--primary)', 
              title: 'Reclaim 10+ Hours Every Week', 
              desc: 'Stop logging into complicated software at 9PM. Create, review, and send stunning invoices directly from the driveway in under a minute.' 
            },
            { 
              icon: DollarSign, 
              color: 'var(--success)', 
              title: 'Get Paid 3x Faster', 
              desc: 'Embed active payment gateways directly on the document. Enable customers to tap and pay on the spot rather than waiting for physical checks.' 
            },
            { 
              icon: FileText, 
              color: 'var(--accent)', 
              title: 'Elevate Business Reputation', 
              desc: 'Deliver crisp, professional PDF invoices with custom branding. Project a premium corporate look that commands respect and triggers rapid payments.' 
            }
          ].map((feature, i) => (
            <div key={i} style={{ 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              padding: '2.5rem', 
              borderRadius: '20px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              transition: 'all 0.3s ease'
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: `${feature.color}15`, color: feature.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <feature.icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, fontWeight: '700' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '7rem 1.5rem', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Proven Success</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Loved by Roofing Pros</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto' }}>Read stories from roofing business owners who optimized their collections.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                name: "Marcus T.",
                role: "Owner, Summit Roofs",
                quote: "I used to spend Sunday mornings manually formatting client bills. Now I do it in 30 seconds from my truck before leaving. Homeowners pay on the spot. Game changer."
              },
              {
                name: "David R.",
                role: "Operator, Prime Exteriors",
                quote: "Having payment buttons directly inside the text message is huge. They tap the link and pay with their credit card. Our collection times dropped by 80%."
              },
              {
                name: "Sarah L.",
                role: "Admin, Elevate Contractors",
                quote: "Everything else we tried was bloated. RooferLedger is so simple our crew in the field generated professional estimates on day one without any training."
              }
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: 'var(--surface-card)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '3px', color: '#fbbf24', marginBottom: '1.25rem' }}>
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </div>
                  <p style={{ fontSize: '1.05rem', color: '#e4e4e7', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', color: '#fff', fontWeight: '700' }}>{t.name}</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '7rem 1.5rem', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Got Questions?</div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              style={{ 
                backgroundColor: 'var(--surface-card)', 
                border: '1px solid var(--border)', 
                borderRadius: '14px', 
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              <button 
                onClick={() => toggleFaq(idx)}
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  color: '#fff', 
                  padding: '1.5rem', 
                  textAlign: 'left', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '1.05rem',
                }}
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </button>
              
              <div style={{ 
                maxHeight: activeFaq === idx ? '200px' : '0px', 
                overflow: 'hidden',
                transition: 'max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <p style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Footer */}
      <div style={{ 
        backgroundColor: 'rgba(99, 91, 255, 0.02)', 
        borderTop: '1px solid var(--border)', 
        padding: '7rem 1.5rem', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff', letterSpacing: '-0.03em' }}>Ready to Modernize Your Operations?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '550px', margin: '0 auto 2.5rem auto' }}>
          Create an account in 30 seconds. Draft your first invoice and test payment collections instantly.
        </p>
        <form onSubmit={handleStart} className="hero-form" style={{ margin: '0 auto 1.5rem auto', justifyContent: 'center' }}>
          <input 
            type="email" 
            placeholder="Enter your email address..."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              minWidth: '220px',
              transition: 'all 0.2s',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{
            width: 'auto',
            padding: '1rem 2rem',
            fontWeight: '700',
            flexShrink: 0
          }}>
            Create My First Invoice <ArrowRight size={18} />
          </button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
           <Lock size={14} color="var(--accent)" />
           <span>Secured by <strong style={{color: '#fff'}}>Stripe Connect</strong> Payments Infrastructure</span>
        </div>
      </div>

      {/* Legal Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 1.5rem', textAlign: 'center', backgroundColor: '#030303', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link href="/terms" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</Link>
          <a href="mailto:support@rooferledger.com" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Contact Support</a>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, opacity: 0.6 }}>&copy; {new Date().getFullYear()} RooferLedger. All rights reserved.</p>
      </footer>

    </main>
  )
}
