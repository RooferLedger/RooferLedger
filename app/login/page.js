export default function LoginPage() {
  return (
    <main className="main-content">
      <div className="form-card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Sign in to your account
        </h2>
        <p style={{ color: '#8b949e', marginBottom: '2rem' }}>
          Or <a href="/dashboard" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>bypass to dashboard preview</a>
        </p>

        <form action="/dashboard" method="GET">
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

          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
