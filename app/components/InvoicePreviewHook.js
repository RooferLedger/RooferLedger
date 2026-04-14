'use client'

import { X, Download } from 'lucide-react'
import { useState } from 'react'

export function useInvoicePreview() {
  const [activeInvoiceId, setActiveInvoiceId] = useState(null)
  
  const openPreview = (id) => setActiveInvoiceId(id)
  const closePreview = () => setActiveInvoiceId(null)

  const PreviewModal = () => {
    if (!activeInvoiceId) return null

    const previewUrl = `/api/invoice/download?id=${activeInvoiceId}`

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '900px', backgroundColor: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '90vh' }}>
          <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161b22' }}>
            <h3 style={{ margin: 0, color: 'var(--foreground)' }}>Invoice Quick View</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href={previewUrl} download={`Invoice-${activeInvoiceId.slice(0, 8)}.pdf`} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                <Download size={14} /> Download PDF
              </a>
              <button onClick={closePreview} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', display: 'flex', alignItems: 'center' }}>
                <X size={24} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#000' }}>
            <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
          </div>
        </div>
      </div>
    )
  }

  return { openPreview, PreviewModal }
}
