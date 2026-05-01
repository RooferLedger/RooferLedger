'use client'

import { useEffect } from 'react'

export default function TrackPaymentClient({ value }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', { currency: 'USD', value: parseFloat(value) });
    }
  }, [value])

  return null
}
