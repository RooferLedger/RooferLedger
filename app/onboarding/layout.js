import Link from 'next/link'

export default function OnboardingLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030303',
      backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(99, 91, 255, 0.12) 0%, transparent 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem 4rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center', zIndex: 5 }}>
        <Link href="/" style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '900', letterSpacing: '-0.03em' }}>
          Roofer<span className="gradient-text">Ledger</span>
        </Link>
        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Setup Command Center
        </p>
      </div>

      <div className="form-card" style={{
        width: '100%',
        maxWidth: '500px',
        zIndex: 5,
        position: 'relative'
      }}>
        {children}
      </div>

      <div style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', zIndex: 5, textAlign: 'center' }}>
        Need assistance? Email <a href="mailto:support@rooferledger.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>support@rooferledger.com</a>
      </div>
    </div>
  )
}
