'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, CalendarCheck } from 'lucide-react'

export default function WhiteGloveSuccess() {
  const router = useRouter()

  const handleContinue = () => {
    // Navigate to the final step: Stripe Connect (Bank Connection)
    router.push('/onboarding/payments')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(35, 134, 54, 0.1)', color: 'var(--success)', marginBottom: '1rem' }}>
          <CalendarCheck size={30} />
        </div>
        <h2 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 1rem 0' }}>Payment Successful!</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>
          Thank you for trusting us with your setup. Please choose a 30-minute window below so our expert team can import your clients and connect your dashboard.
        </p>
      </div>

      {/* Calendly Inline Embed */}
      <div style={{ 
        backgroundColor: '#fff', // Calendly frames often look best on white, but we can set transparent in URL
        borderRadius: '12px',
        overflow: 'hidden',
        height: '650px',
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <iframe
          src="https://calendly.com/your-calendly-link"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Calendly Widget"
        ></iframe>
      </div>

      <button 
        onClick={handleContinue}
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: 'var(--primary)',
          color: '#000',
          border: 'none',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}
      >
        I have booked my slot. Continue! <ArrowRight size={18} />
      </button>

    </div>
  )
}
