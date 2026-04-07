import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '../../../../lib/pdf/InvoiceTemplate'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const data = await request.json()

    const subtotal = data.lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0)
    const taxRateStr = data.taxRate ? data.taxRate.toString() : '0'
    const tax = subtotal * (parseFloat(taxRateStr) / 100)
    const total = subtotal + tax

    // We use dummy client names if none is selected because this is just a visual preview
    const invoiceData = {
      invoiceId: `PREVIEW`,
      date: data.customDate || new Date().toLocaleDateString(),
      clientName: data.clientName || 'Valued Client',
      subtotal,
      tax,
      total,
      lineItems: data.lineItems,
      companyName: 'Your Company',
      notes: data.notes
    }

    const stream = await renderToStream(<InvoiceDocument invoiceData={invoiceData} />)
    const chunks = []
    for await (const chunk of stream) chunks.push(chunk)
    const pdfBuffer = Buffer.concat(chunks)

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    
    return new NextResponse(pdfBuffer, { status: 200, headers })

  } catch (error) {
    console.error('Preview Delivery API Error:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
}
