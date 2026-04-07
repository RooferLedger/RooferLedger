'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvoiceSchema } from '../../../lib/schemas'
import { PlusCircle, Trash2, ArrowLeft, Send, Download } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NewInvoicePage() {
  const [isGenerating, setIsGenerating] = useState(false)

  // Dummy clients list for the UI until backend is fully synced
  const activeClients = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'John Doe' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Sarah Smith' },
  ]

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      clientId: '',
      status: 'draft',
      taxRate: 0,
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  })

  // Watch values for live calculation
  const watchLineItems = watch('lineItems')
  const watchTaxRate = watch('taxRate')

  const subtotal = watchLineItems.reduce((acc, item) => {
    return acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
  }, 0)

  const tax = subtotal * (parseFloat(watchTaxRate || 0) / 100)
  const total = subtotal + tax

  const onSubmit = async (data) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('PDF Generation Failed')
      
      // Convert the response to a binary blob and download it
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      alert("Invoice successfully processed and downloaded!")
    } catch (error) {
      console.error(error)
      alert("An error occurred generating the invoice.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="dashboard-layout">
      {/* We are utilizing the Dashboard Layout but hiding sidebar for focus, or keeping it depending on UX.
          Currently page.js is NOT a child of /dashboard, it is at /invoice/new in the structure we wrote earlier. 
          To give a full bleed focused experience, we use a custom clean layout here. */}
      
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="dash-header" style={{ borderBottom: 'none' }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> Preview PDF
            </button>
            <button 
              onClick={handleSubmit(onSubmit)} 
              className="btn btn-primary" 
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isGenerating ? 0.7 : 1 }}
              disabled={isGenerating}
            >
              <Send size={18} /> {isGenerating ? 'Processing...' : 'Send Invoice'}
            </button>
          </div>
        </div>

        <div className="form-card" style={{ padding: '3rem' }}>
          <h1 style={{ margin: '0 0 2rem 0', fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '900' }}>INVOICE</h1>
          
          <form id="invoice-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '3rem' }}>
              <div>
                <label className="input-label" style={{ color: 'var(--foreground)' }}>Bill To</label>
                <select 
                  {...register('clientId')} 
                  className="input-field" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: errors.clientId ? 'var(--danger)' : 'var(--border)' }}
                >
                  <option value="" disabled>Select a client...</option>
                  {activeClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.clientId && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.clientId.message}</span>}
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: '#8b949e', fontWeight: '500' }}>Invoice Date</p>
                <p style={{ margin: '0.25rem 0 2rem 0', color: 'var(--foreground)', fontSize: '1.2rem' }}>
                  {new Date().toLocaleDateString()}
                </p>
                
                <p style={{ margin: 0, color: '#8b949e', fontWeight: '500' }}>Amount Due</p>
                <p style={{ margin: '0.25rem 0', color: 'var(--accent)', fontSize: '2rem', fontWeight: 'bold' }}>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr auto', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: '#8b949e', fontWeight: '600', fontSize: '0.9rem' }}>
                <div>Description</div>
                <div>QTY</div>
                <div>Unit Price</div>
                <div style={{ textAlign: 'right' }}>Amount</div>
                <div style={{ width: '40px' }}></div>
              </div>

              {fields.map((field, index) => {
                const qty = watchLineItems[index]?.quantity || 0;
                const price = watchLineItems[index]?.unitPrice || 0;
                const rowTotal = qty * price;

                return (
                  <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr auto', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                    <div>
                      <input 
                        {...register(`lineItems.${index}.description`)} 
                        className="input-field" 
                        placeholder="E.g., Asphalt Shingle Replacement"
                        style={{ padding: '0.75rem', borderColor: errors.lineItems?.[index]?.description ? 'var(--danger)' : 'var(--border)' }}
                      />
                    </div>
                    <div>
                      <input 
                        {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} 
                        type="number" 
                        step="0.01"
                        className="input-field" 
                        style={{ padding: '0.75rem', borderColor: errors.lineItems?.[index]?.quantity ? 'var(--danger)' : 'var(--border)' }}
                      />
                    </div>
                    <div>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }}>$</span>
                        <input 
                          {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })} 
                          type="number" 
                          step="0.01"
                          className="input-field" 
                          style={{ padding: '0.75rem 0.75rem 0.75rem 1.75rem', borderColor: errors.lineItems?.[index]?.unitPrice ? 'var(--danger)' : 'var(--border)' }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: '500', color: 'var(--foreground)' }}>
                      ${rowTotal.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', opacity: 0.7, cursor: 'pointer', outline: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button 
              type="button" 
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '0', fontSize: '1rem' }}
            >
              <PlusCircle size={18} /> Add Line Item
            </button>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <div style={{ width: '100%', maxWidth: '350px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#8b949e' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--foreground)' }}>${subtotal.toFixed(2)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: '#8b949e' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Tax (%)</span>
                    <input 
                      {...register('taxRate', { valueAsNumber: true })} 
                      type="number" 
                      className="input-field" 
                      style={{ width: '70px', padding: '0.25rem 0.5rem', textAlign: 'center' }}
                    />
                  </div>
                  <span style={{ color: 'var(--foreground)' }}>+${tax.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--foreground)' }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
