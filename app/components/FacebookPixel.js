'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

export const pageview = () => {
  window.fbq('track', 'PageView')
}

export const event = (name, options = {}) => {
  window.fbq('track', name, options)
}

export default function FacebookPixel() {
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!FB_PIXEL_ID) return

    if (!loaded) {
      setLoaded(true)
    } else {
      pageview()
    }
  }, [pathname, searchParams, loaded])

  if (!FB_PIXEL_ID) return null

  return (
    <div>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
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
            fbq('init', ${FB_PIXEL_ID});
            fbq('track', 'PageView');
          `,
        }}
      />
    </div>
  )
}
