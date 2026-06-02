'use client'

import { useEffect } from 'react'
import { event } from '../../components/FacebookPixel'

export default function TrackPaymentClient({ value }) {
  useEffect(() => {
    event('Purchase', { currency: 'USD', value: parseFloat(value) })
  }, [value])

  return null
}
