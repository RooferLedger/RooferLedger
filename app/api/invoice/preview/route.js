import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '../../../../lib/pdf/InvoiceTemplate'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const data = await request.json()
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let orgData = null
    if (user) {
      const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
      if (userData?.organization_id) {
        const { data: org, error: orgError } = await supabase.from('organizations').select('*').eq('id', userData.organization_id).single()
        if (orgError) console.error("Org Fetch Error:", orgError)
        orgData = org
      }
    }

    let clientEmail = null
    let clientPhone = null
    let clientName = data.clientName || 'Valued Client'
    
    // Fetch live client data for the preview if selected
    if (data.clientId) {
      const { data: clientData } = await supabase.from('clients').select('*').eq('id', data.clientId).single()
      if (clientData) {
        clientName = `${clientData.first_name} ${clientData.last_name}`
        clientEmail = clientData.email
        clientPhone = clientData.phone
      }
    }

    const subtotal = data.lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0)
    const taxRateStr = data.taxRate ? data.taxRate.toString() : '0'
    const tax = subtotal * (parseFloat(taxRateStr) / 100)
    const total = subtotal + tax

    const invoiceData = {
      invoiceId: `PREVIEW`,
      date: data.customDate || new Date().toLocaleDateString(),
      clientName,
      clientEmail,
      clientPhone,
      subtotal,
      tax,
      total,
      lineItems: data.lineItems,
      companyName: orgData?.name || 'Your Company',
      companyEmail: user?.email,
      companyAddress: orgData?.address,
      companyPhone: orgData?.phone,
      logoUrl: orgData?.logo_url,
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
    return NextResponse.json({ error: 'Failed to generate preview: ' + error.message }, { status: 500 })
  }
}
