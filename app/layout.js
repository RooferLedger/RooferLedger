import './globals.css'

export const metadata = {
  title: 'RooferLedger | The Invoicing Engine for Roofers',
  description: 'Generate $15,000 digital invoices in 30 seconds on the roof. Get paid before you leave the driveway.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
