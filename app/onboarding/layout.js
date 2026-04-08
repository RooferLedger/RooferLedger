export default function OnboardingLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 'bold', margin: '0' }}>RooferLedger</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#a1a1aa' }}>Account Setup</p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative'
      }}>
        {children}
      </div>

      <div style={{ marginTop: '2rem', color: '#8b949e', fontSize: '0.85rem' }}>
        Need help? Contact support@rooferledger.com
      </div>
    </div>
  )
}
