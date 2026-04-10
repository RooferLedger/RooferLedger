import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceDocument } from '../../../../lib/pdf/InvoiceTemplate'
import React from 'react'
import { Resend } from 'resend'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const data = await request.json()
    const supabase = createClient()

    // 1. Auth Validation
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Fetch User Organization & Client Details
    const { data: userData } = await supabase.from('users').select('organization_id').eq('id', user.id).single()
    const { data: clientData } = await supabase.from('clients').select('*').eq('id', data.clientId).single()
    const { data: orgData } = await supabase.from('organizations').select('name, logo_url, address').eq('id', userData?.organization_id).single()

    if (!clientData) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    // 2.5 Security: Free Tier Limit Enforcement
    const { count: invoiceCount } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', userData.organization_id)
      
    const isPremium = orgData?.subscription_status === 'active' || orgData?.subscription_status === 'trialing'
    if (invoiceCount >= 3 && !isPremium) {
      return NextResponse.json({ error: 'Free tier limit reached (3 invoices). Please upgrade your subscription.' }, { status: 403 })
    }

    // 3. Mathematical Security & PDF Setup
    const subtotal = data.lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0)
    const taxRateStr = data.taxRate ? data.taxRate.toString() : '0'
    const tax = subtotal * (parseFloat(taxRateStr) / 100)
    const total = subtotal + tax

    const invoiceData = {
      invoiceId: `INV-${Date.now().toString().slice(-4)}`,
      date: data.customDate || new Date().toLocaleDateString(),
      clientName: `${clientData.first_name} ${clientData.last_name}`,
      clientEmail: clientData.email,
      clientPhone: clientData.phone,
      subtotal,
      tax,
      total,
      lineItems: data.lineItems,
      companyName: orgData?.name || 'RooferLedger',
      companyEmail: user.email,
      companyAddress: orgData?.address,
      logoUrl: orgData?.logo_url,
      notes: data.notes
    }

    // 4. Persistence into Supabase Database
    const { data: invoiceRecord, error: invError } = await supabase.from('invoices').insert({
      organization_id: userData.organization_id,
      client_id: clientData.id,
      created_by: user.id,
      status: 'sent',
      subtotal,
      tax,
      total,
      notes: data.notes,
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // Net 14 by default
    }).select().single()

    if (invError) throw new Error('Database insertion failed.')

    // Insert Line Items
    const lineItemInserts = data.lineItems.map(item => ({
      invoice_id: invoiceRecord.id,
      description: item.description,
      quantity: parseFloat(item.quantity) || 1,
      unit_price: parseFloat(item.unitPrice) || 0,
      total: (parseFloat(item.quantity) || 1) * (parseFloat(item.unitPrice) || 0)
    }))
    await supabase.from('line_items').insert(lineItemInserts)

    // 5. Build PDF Memory Buffer
    const stream = await renderToStream(<InvoiceDocument invoiceData={invoiceData} />)
    const chunks = []
    for await (const chunk of stream) chunks.push(chunk)
    const pdfBuffer = Buffer.concat(chunks)

    // 6. Asynchronous Delivery Systems
    const deliveryPromises = []
    
    // The payment link for the end client
    // We will use a generic query string format for when the public payment portal is built
    const paymentLink = `https://rooferledger.com/pay?invoice=${invoiceRecord.id}`
    
    // A) Email via Resend
    if (clientData.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      deliveryPromises.push(
        resend.emails.send({
          from: 'billing@rooferledger.com',
          to: clientData.email,
          subject: `Invoice ${invoiceData.invoiceId} from ${invoiceData.companyName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Hi ${clientData.first_name},</h2>
              <p style="color: #555; font-size: 16px;">Please find your invoice attached for the recent roofing work totaling <strong>$${total.toFixed(2)}</strong>.</p>
              <div style="margin: 30px 0;">
                <a href="${paymentLink}" style="background-color: #238636; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Pay Invoice Online</a>
              </div>
              <p style="color: #888; font-size: 14px;">Thank you for your business!</p>
            </div>
          `,
          attachments: [{ filename: `invoice-${invoiceData.invoiceId}.pdf`, content: pdfBuffer }]
        })
      )
    }

    // B) SMS via Twilio
    if (clientData.phone && process.env.TWILIO_ACCOUNT_SID) {
      const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      // Twilio requires a public URL to attach PDFs to an SMS/MMS. For now, we send text.
      // In a real flow, we'd upload PDF to Supabase Storage first and link it.
      deliveryPromises.push(
        twilioClient.messages.create({
          body: `Hi ${clientData.first_name}, your invoice for ${invoiceData.companyName} is ready. Total: $${total.toFixed(2)}. Please check your email for the PDF.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: clientData.phone
        })
      )
    }

    // Dispatch and explicitly AWAIT so Vercel does not freeze the microVM before network packets depart
    const deliveryResults = await Promise.allSettled(deliveryPromises)
    console.log('Delivery Results:', deliveryResults)

    // 7. Return PDF Buffer directly to Browser for immediate local download
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceId}.pdf"`)
    
    return new NextResponse(pdfBuffer, { status: 200, headers })

  } catch (error) {
    console.error('Invoice Delivery API Error:', error)
    return NextResponse.json({ error: 'Failed to generate, sync, or send invoice: ' + error.message }, { status: 500 })
  }
}
