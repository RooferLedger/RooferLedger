'use client'

import { useState } from 'react'

export default function PayButton({ invoiceId, stripeAccountId, disabled }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Error initiating checkout.')
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={disabled || loading}
      style={{
        width: '100%',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        border: 'none',
        padding: '1.25rem',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.6 : 1,
        transition: 'all 0.2s',
        boxShadow: (disabled || loading) ? 'none' : '0 10px 20px rgba(47, 129, 247, 0.3)'
      }}
    >
      {loading ? 'Securely Redirecting...' : 'Pay securely with Card / Apple Pay'}
    </button>
  )
}
