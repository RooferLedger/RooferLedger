import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '../../../../lib/pdf/InvoiceTemplate'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Missing invoice id', { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, line_items(*), clients(*)')
      .eq('id', id)
      .single()

    if (invoiceError || !invoice) {
      return new NextResponse('Invoice not found', { status: 404 })
    }

    // Fetch the org data
    const { data: orgData } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', invoice.organization_id)
      .single()

    const invoiceData = {
      invoiceId: `INV-${invoice.id.slice(0, 8)}`,
      date: new Date(invoice.created_at).toLocaleDateString(),
      clientName: invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Unknown Client',
      clientEmail: invoice.clients?.email,
      clientPhone: invoice.clients?.phone,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      lineItems: invoice.line_items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price
      })),
      companyName: orgData?.name || 'Your Company',
      companyEmail: user.email,
      companyAddress: orgData?.address,
      logoUrl: orgData?.logo_url,
      notes: invoice.notes
    }

    const stream = await renderToStream(<InvoiceDocument invoiceData={invoiceData} />)
    const chunks = []
    for await (const chunk of stream) chunks.push(chunk)
    const pdfBuffer = Buffer.concat(chunks)

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    // Add disposition so they can save it easily if they navigate directly
    headers.set('Content-Disposition', `inline; filename="invoice_${invoiceData.invoiceId}.pdf"`)
    
    return new NextResponse(pdfBuffer, { status: 200, headers })

  } catch (error) {
    console.error('Invoice Download API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
