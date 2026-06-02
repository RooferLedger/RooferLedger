import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { ShieldCheck, ArrowLeft, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export default function LoginPage({ searchParams }) {
  const currentMode = searchParams?.mode === 'signup' ? 'signup' : 'login'
  const emailPrefill = searchParams?.email || ''
  const emailParam = emailPrefill ? `&email=${encodeURIComponent(emailPrefill)}` : ''

  // Server Action to Handle Logging In
  const login = async (formData) => {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error) {
      return redirect(`/login?mode=login&message=${encodeURIComponent(error.message)}${emailParam}`)
    }
    
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Server Action to Handle Creating a Brand New Organization/User
  const signup = async (formData) => {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')
    const supabase = createClient()
    
    // Create the Auth User
    const { error } = await supabase.auth.signUp({ 
      email, 
      password 
    })

    if (error) {
      return redirect(`/login?mode=signup&message=${encodeURIComponent(error.message)}${emailParam}`)
    }
    
    revalidatePath('/', 'layout')
    redirect('/onboarding/business?new_signup=true')
  }

  return (
    <main className="main-content" style={{ minHeight: '100vh', backgroundColor: '#030303', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(99, 91, 255, 0.1) 0%, rgba(3, 3, 3, 0) 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.05) 0%, rgba(3, 3, 3, 0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Floating Go Back Home link */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
        <Link href="/" className="back-home-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', width: '100%', maxWidth: '1050px', margin: '0 auto', gap: '3rem', padding: '1.5rem', zIndex: 5, alignItems: 'center' }}>
        
        {/* Left Side: Benefit Copy (Fintech-like sidebar) */}
        <div style={{ color: '#fff', padding: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', display: 'block', marginBottom: '2.5rem' }}>
            Roofer<span className="gradient-text">Ledger</span>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <Zap size={12} /> SECURED POWER
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                {currentMode === 'signup' ? 'Create your free account today.' : 'Log back into your command center.'}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                {currentMode === 'signup' 
                  ? 'Join hundreds of roofing contractors optimizing their cash flow. Get 3 free invoices right away.' 
                  : 'Manage customer invoices, check your metrics, and confirm client payouts.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {[
                'Instant payouts using Stripe card processing',
                'Auto-generated premium PDF invoicing templates',
                'Interactive dashboard showing revenues and A/R'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#c9d1d9' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: The Form Card */}
        <div>
          <div className="form-card" style={{ width: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              {currentMode === 'signup' ? 'Get Started' : 'Welcome Back'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {currentMode === 'signup' ? 'Create a secure credentials profile.' : 'Sign in using your email and password.'}
            </p>

            {searchParams?.message && (
              <div style={{ 
                padding: '0.85rem 1.15rem', 
                backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                color: 'var(--danger)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '10px', 
                marginBottom: '1.5rem', 
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}>
                {searchParams.message}
              </div>
            )}

            <form action={currentMode === 'signup' ? signup : login}>
              <div className="input-grid" style={{ gridTemplateColumns: '1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="input-label">Email address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    defaultValue={emailPrefill}
                    className="input-field"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="input-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {currentMode === 'signup' && (
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Must be at least 6 characters long.
                    </span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '700' }}>
                {currentMode === 'signup' ? 'Create Free Account' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {currentMode === 'signup' ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <Link href={`/login?mode=login${emailParam}`} style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                    Sign In
                  </Link>
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>
                  New to RooferLedger?{' '}
                  <Link href={`/login?mode=signup${emailParam}`} style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                    Create Account
                  </Link>
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
