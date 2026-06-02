import './globals.css'
import { Suspense } from 'react'
import FacebookPixel from './components/FacebookPixel'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata = {
  title: 'RooferLedger | The Invoicing Engine for Roofers',
  description: 'Generate $15,000 digital invoices in 30 seconds on the roof. Get paid before you leave the driveway.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
