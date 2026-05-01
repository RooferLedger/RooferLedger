'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TrackSignupClient() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new_signup') === 'true') {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration');
        window.fbq('track', 'Lead');
      }
    }
  }, [searchParams])

  return null
}
