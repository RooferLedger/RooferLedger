'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InvoiceSchema } from '../../../lib/schemas'
import { PlusCircle, Trash2, ArrowLeft, Send, Download, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function InvoiceForm({ activeClients }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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
      customDate: new Date().toISOString().split('T')[0],
      notes: '',
      taxRate: 0,
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  })

  const watchLineItems = watch('lineItems')
  const watchTaxRate = watch('taxRate')

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const subtotal = watchLineItems.reduce((acc, item) => {
    return acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
  }, 0)

  const tax = subtotal * (parseFloat(watchTaxRate || 0) / 100)
  const total = subtotal + tax

  // The Live In-App Preview Handler
  const onPreview = async (data) => {
    setIsPreviewing(true)
    try {
      const response = await fetch('/api/invoice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Preview Generation Failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      setPreviewUrl(url)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error(error)
      alert("Failed to layout preview.")
    } finally {
      setIsPreviewing(false)
    }
  }

  // The Final Production Dispatcher
  const onSubmit = async (data) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Generation Failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${new Date().getTime()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      alert("Invoice fully processed, logged in Database, and downloaded successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred during final sync.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Modal Popup Overlay */}
      {isPreviewOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '90vh' }}>
            <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161b22' }}>
              <h3 style={{ margin: 0, color: 'var(--foreground)' }}>Live PDF Preview</h3>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, backgroundColor: '#000' }}>
              <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="dash-header" style={{ borderBottom: 'none' }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button"
              onClick={handleSubmit(onPreview)} 
              disabled={isPreviewing || isGenerating}
              className="btn btn-secondary" 
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isPreviewing ? 0.7 : 1 }}
            >
              <Download size={18} /> {isPreviewing ? 'Loading...' : 'Preview PDF'}
            </button>
            <button 
              onClick={handleSubmit(onSubmit)} 
              className="btn btn-primary" 
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isGenerating ? 0.7 : 1 }}
              disabled={isGenerating || isPreviewing}
            >
              <Send size={18} /> {isGenerating ? 'Processing API...' : 'Generate & Sync'}
            </button>
          </div>
        </div>

        <div className="form-card" style={{ padding: '3rem' }}>
          <h1 style={{ margin: '0 0 2rem 0', fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '900' }}>INVOICE</h1>
          
          <form id="invoice-form">
            <div className="invoice-top-grid">
              <div>
                <label className="input-label" style={{ color: 'var(--foreground)' }}>Bill To</label>
                <select 
                  {...register('clientId')} 
                  className="input-field" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: errors.clientId ? 'var(--danger)' : 'var(--border)' }}
                >
                  <option value="" disabled>Select a client...</option>
                  {activeClients.map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
                {errors.clientId && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.clientId.message}</span>}
              </div>
              
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p style={{ margin: 0, color: '#8b949e', fontWeight: '500', marginBottom: '0.5rem' }}>Date Issued</p>
                <input 
                  type="date"
                  {...register('customDate')}
                  className="input-field"
                  style={{ width: '200px', backgroundColor: 'transparent', textAlign: 'right', padding: '0.5rem', borderColor: 'transparent', fontSize: '1.2rem', color: 'var(--foreground)', cursor: 'pointer' }}
                />
                
                <p style={{ margin: '1.5rem 0 0 0', color: '#8b949e', fontWeight: '500' }}>Amount Due</p>
                <p style={{ margin: '0.25rem 0', color: 'var(--accent)', fontSize: '2rem', fontWeight: 'bold' }}>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div className="invoice-line-headers">
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
                  <div key={field.id} className="invoice-line-row">
                    <div>
                      <span className="mobile-only-label" style={{ display: 'none', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.25rem' }}>Description</span>
                      <input 
                        {...register(`lineItems.${index}.description`)} 
                        className="input-field" 
                        placeholder="E.g., Asphalt Shingle Replacement"
                        style={{ padding: '0.75rem', borderColor: errors.lineItems?.[index]?.description ? 'var(--danger)' : 'var(--border)' }}
                      />
                    </div>
                    <div>
                      <span className="mobile-only-label" style={{ display: 'none', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.25rem' }}>QTY</span>
                      <input 
                        {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} 
                        type="number" 
                        step="0.01"
                        className="input-field" 
                        style={{ padding: '0.75rem', borderColor: errors.lineItems?.[index]?.quantity ? 'var(--danger)' : 'var(--border)' }}
                      />
                    </div>
                    <div>
                      <span className="mobile-only-label" style={{ display: 'none', fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.25rem' }}>Unit Price</span>
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
                      <span className="mobile-only-label" style={{ display: 'none', fontSize: '0.8rem', color: '#8b949e', marginRight: '0.5rem' }}>Amount:</span>
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

            {/* Notes & Totals Layout */}
            <div className="invoice-bottom-grid">
              
              {/* Custom Notes */}
              <div style={{ flex: 1, maxWidth: '400px' }}>
                <label className="input-label" style={{ color: '#8b949e' }}>Invoice Notes / Terms</label>
                <textarea 
                  {...register('notes')} 
                  className="input-field" 
                  placeholder="E.g., Please make checks payable to Apex Roofing. Net 15 terms apply."
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              </div>

              {/* Totals Setup */}
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
    </>
  )
}
