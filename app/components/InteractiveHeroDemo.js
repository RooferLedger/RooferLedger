'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Clock, FileText, Send, CheckCircle2, ChevronRight } from 'lucide-react'

export default function InteractiveHeroDemo() {
  const [revenue, setRevenue] = useState(145000)
  const [hoveredMetric, setHoveredMetric] = useState(null)
  const [hoveredInvoice, setHoveredInvoice] = useState(null)
  
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', client: 'Sarah Jenkins', amount: '$14,250', status: 'draft', animate: false },
    { id: 'INV-002', client: 'Michael Ross', amount: '$8,400', status: 'paid', animate: false },
    { id: 'INV-003', client: 'Apex Commercial', amount: '$32,100', status: 'paid', animate: false },
  ])

  // Simple count-up effect for revenue to make it feel alive
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenue(184200)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = (index) => {
    const newInvoices = [...invoices]
    newInvoices[index].status = 'sending'
    setInvoices(newInvoices)

    setTimeout(() => {
      const updated = [...invoices]
      updated[index].status = 'sent'
      updated[index].animate = true
      setInvoices(updated)
      
      // Remove animation class after a bit
      setTimeout(() => {
        const reset = [...updated]
        reset[index].animate = false
        setInvoices(reset)
      }, 2000)
    }, 800)
  }

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <div 
      style={{
        backgroundColor: '#0a0a0f',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '24px',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 1), 0 0 80px rgba(99, 91, 255, 0.3), 0 0 30px rgba(0, 242, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 10,
        padding: '1.5rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>Apex Exteriors</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Live Dashboard Preview</p>
        </div>
        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(to top right, var(--primary), var(--accent))' }}></div>
      </div>

      {/* Metrics */}
      <div className="demo-metric-grid">
        <div 
          onMouseEnter={() => setHoveredMetric(0)}
          onMouseLeave={() => setHoveredMetric(null)}
          style={{ 
            backgroundColor: hoveredMetric === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)', 
            border: hoveredMetric === 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '1rem', 
            transition: 'all 0.3s ease-out',
            transform: hoveredMetric === 0 ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredMetric === 0 ? '0 10px 25px rgba(16, 185, 129, 0.1)' : 'none',
            cursor: 'default'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.375rem', borderRadius: '8px' }}>
              <DollarSign size={16} style={{ color: 'var(--success)' }} />
            </div>
          </div>
          <div 
            style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', transition: 'all 1s ease-out', opacity: revenue > 150000 ? 1 : 0.8 }}
          >
            {formatter.format(revenue)}
          </div>
        </div>
        
        <div 
          onMouseEnter={() => setHoveredMetric(1)}
          onMouseLeave={() => setHoveredMetric(null)}
          style={{ 
            backgroundColor: hoveredMetric === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)', 
            border: hoveredMetric === 1 ? '1px solid rgba(99, 91, 255, 0.3)' : '1px solid rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '1rem',
            transition: 'all 0.3s ease-out',
            transform: hoveredMetric === 1 ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredMetric === 1 ? '0 10px 25px rgba(99, 91, 255, 0.1)' : 'none',
            cursor: 'default'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Outstanding</span>
            <div style={{ backgroundColor: 'rgba(99, 91, 255, 0.1)', padding: '0.375rem', borderRadius: '8px' }}>
              <Clock size={16} style={{ color: 'var(--primary-hover)' }} />
            </div>
          </div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
            $14,250
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div>
        <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={16} style={{ color: 'var(--text-muted)' }} /> Recent Invoices
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {invoices.map((inv, i) => (
            <div 
              key={inv.id} 
              className="demo-invoice-row"
              onMouseEnter={() => setHoveredInvoice(i)}
              onMouseLeave={() => setHoveredInvoice(null)}
              style={{
                backgroundColor: inv.animate ? 'rgba(16, 185, 129, 0.05)' : (hoveredInvoice === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'),
                border: inv.animate ? '1px solid rgba(16, 185, 129, 0.5)' : (hoveredInvoice === i ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)'),
                transform: hoveredInvoice === i ? 'scale(1.01)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{inv.client}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>{inv.id} &bull; {inv.amount}</div>
              </div>
              
              <div>
                {inv.status === 'draft' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSend(i);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(99, 91, 255, 0.2)'
                    }}
                  >
                    <Send size={14} /> Send
                  </button>
                )}
                {inv.status === 'sending' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary-hover)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.375rem 0.75rem' }}>
                    <span className="pulse-badge">Sending...</span>
                  </div>
                )}
                {inv.status === 'sent' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.375rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                    <CheckCircle2 size={14} /> Sent
                  </div>
                )}
                {inv.status === 'paid' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.375rem 0.75rem' }}>
                    Paid <ChevronRight size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
