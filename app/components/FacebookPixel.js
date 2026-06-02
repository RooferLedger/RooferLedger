'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

// A robust event tracking function that queues events if the pixel isn't loaded yet
export const event = (name, options = {}) => {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('track', name, options)
    } else {
      // If fbq isn't initialized yet, queue it up in a temporary list
      if (!window._fbqQueue) window._fbqQueue = []
      window._fbqQueue.push({ name, options })
    }
  }
}

export const customEvent = (name, options = {}) => {
  if (typeof window !== 'undefined') {
    if (window.fbq) {
      window.fbq('trackCustom', name, options)
    } else {
      if (!window._fbqQueue) window._fbqQueue = []
      window._fbqQueue.push({ name, options, isCustom: true })
    }
  }
}

export const pageview = () => {
  event('PageView')
}

export default function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  // Flush queued events once the script is loaded
  const handleScriptLoad = () => {
    if (typeof window !== 'undefined' && window.fbq && window._fbqQueue) {
      while (window._fbqQueue.length > 0) {
        const item = window._fbqQueue.shift()
        if (item.isCustom) {
          window.fbq('trackCustom', item.name, item.options)
        } else {
          window.fbq('track', item.name, item.options)
        }
      }
    }
  }

  useEffect(() => {
    if (!FB_PIXEL_ID) return

    // Skip the very first pageview because the inline script tracks it automatically during initialization
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    pageview()
  }, [pathname, searchParams])

  if (!FB_PIXEL_ID) return null

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', "${FB_PIXEL_ID}");
            fbq('track', 'PageView');
          `,
        }}
      />
    </>
  )
}
