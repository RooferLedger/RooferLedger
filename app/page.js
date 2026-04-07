export default function Home() {
  return (
    <main className="main-content">
      <div style={{ backgroundColor: 'rgba(47, 129, 247, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--primary)', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
        Beta Access: First 10 users get 30 days free.
      </div>
      
      <h1 className="hero-title">RooferLedger.</h1>
      
      <p className="hero-subtitle">
        Stop leaving $15,000 on the roof. Generate pristine digital invoices in 30 seconds and get paid before you climb down the ladder.
      </p>
      
      <div className="btn-group">
        <a href="/dashboard" className="btn btn-primary">Start Free Trial</a>
        <a href="/dashboard" className="btn btn-secondary">See How It Works</a>
      </div>
    </main>
  )
}
