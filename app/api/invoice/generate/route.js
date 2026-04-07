import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '../../../../lib/pdf/InvoiceTemplate'
import React from 'react' // Crucial for jsx rendering in server

// This is a Node.js runtime API (not edge) so we can use react-pdf node bindings
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const data = await request.json()

    // We do math validation here again for security
    const subtotal = data.lineItems.reduce((acc, item) => {
      return acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0)
    
    const tax = subtotal * (parseFloat(data.taxRate || 0) / 100)
    const total = subtotal + tax

    const invoiceData = {
      invoiceId: `INV-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString(),
      clientName: data.clientName || 'Valued Client',
      subtotal,
      tax,
      total,
      lineItems: data.lineItems,
      companyName: 'RooferLedger Beta Co.'
    }

    // Generate the PDF stream from our React Component
    const stream = await renderToStream(<InvoiceDocument invoiceData={invoiceData} />)

    // Convert Stream to Buffer
    const chunks = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)

    // In a real production environment, you would:
    // 1. Upload pdfBuffer to Supabase Storage
    // 2. Insert record into `public.invoices` table
    // 3. Trigger Resend/Twilio SMS logic using the public URL
    // For this engine demo, we just return the raw PDF buffer

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceId}.pdf"`)
    
    return new NextResponse(pdfBuffer, { status: 200, headers })

  } catch (error) {
    console.error('Core PDF Engine Error:', error)
    return NextResponse.json({ error: 'Failed to generate invoice PDF' }, { status: 500 })
  }
}
