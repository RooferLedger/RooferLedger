'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { event } from '../../components/FacebookPixel'

export default function TrackSignupClient() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('new_signup') === 'true') {
      event('CompleteRegistration')
      event('Lead')
    }
  }, [searchParams])

  return null
}
