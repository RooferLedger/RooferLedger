import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export default function LoginPage({ searchParams }) {
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
      return redirect(`/login?message=${error.message}`)
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
      return redirect(`/login?message=${error.message}`)
    }
    
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return (
    <main className="main-content">
      <div className="form-card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Welcome to RooferLedger
        </h2>
        <p style={{ color: '#8b949e', marginBottom: '2rem' }}>
          Sign in or create a new corporate account below.
        </p>

        {searchParams?.message && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(248, 81, 73, 0.1)', color: 'var(--danger)', border: '1px solid rgba(248, 81, 73, 0.4)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {searchParams.message}
          </div>
        )}

        <form>
          <div className="input-grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label className="input-label">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="roofer@example.com"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="********"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button formAction={login} className="btn btn-primary" style={{ flex: 1 }}>
              Sign In
            </button>
            <button formAction={signup} className="btn btn-secondary" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)' }}>
              Create Account
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
