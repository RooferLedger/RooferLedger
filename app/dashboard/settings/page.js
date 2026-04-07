'use client'

import { Settings, Building, CreditCard, Bell, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderProfile = () => (
    <div className="form-card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Company Profile</h2>
      
      <div className="input-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <label className="input-label" style={{ marginBottom: 0 }}>Company Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>No Logo</span>
            </div>
            <div>
              <input type="file" id="logoUpload" style={{ display: 'none' }} accept="image/png, image/jpeg" />
              <label htmlFor="logoUpload" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Choose Image (.png, .jpg)
              </label>
              <p style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '0.5rem', marginBottom: 0 }}>
                Recommended size: 400x150px. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="input-label">Company Name</label>
          <input className="input-field" defaultValue="Apex Roofing LLC" />
        </div>
        
        <div>
          <label className="input-label">Support Email</label>
          <input className="input-field" defaultValue="billing@apexroofing.com" />
        </div>

        <div>
          <label className="input-label">Business Address</label>
          <input className="input-field" defaultValue="789 Industrial Pkwy, Suite 100" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem' }}>
        <button className="btn btn-primary" style={{ width: 'auto' }}>Save Changes</button>
      </div>
    </div>
  )

  const renderBilling = () => (
    <div className="form-card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Subscription & Billing</h2>
      
      <div style={{ backgroundColor: 'rgba(47, 129, 247, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Pro Tier</h3>
            <p style={{ color: '#8b949e', margin: 0 }}>$49.00 / month. Renews on May 1st, 2026.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 'bold' }}>Active</span>
          </div>
        </div>
      </div>

      <div className="input-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <label className="input-label">Payment Method</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <CreditCard color="#8b949e" />
            <span style={{ color: 'var(--foreground)' }}>Visa ending in 4242</span>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}>Update</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <button className="btn btn-secondary" style={{ width: 'auto', color: 'var(--danger)', borderColor: 'rgba(248, 81, 73, 0.3)' }}>Cancel Subscription</button>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="form-card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Notification Preferences</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--foreground)' }}>Invoice Viewed Alerts</h4>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Receive an email when a client opens your invoice PDF.</p>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--foreground)' }}>Payment Receipts</h4>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Automatically trigger an email receipt when an invoice is marked Paid.</p>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--foreground)' }}>Marketing Campaigns</h4>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '0.9rem' }}>Receive tips and tricks from the RooferLedger team.</p>
          </div>
          <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem' }}>
        <button className="btn btn-primary" style={{ width: 'auto' }}>Save Preferences</button>
      </div>
    </div>
  )

  return (
    <div className="container">
      <div className="dash-header">
        <div className="dash-title-box">
          <h1>Settings</h1>
          <p>Manage your roofing company profile and billing.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 3fr', gap: '2rem' }}>
        {/* Settings Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: activeTab === 'profile' ? 'var(--surface)' : 'transparent', border: '1px solid', borderColor: activeTab === 'profile' ? 'var(--primary)' : 'transparent', borderRadius: '8px', color: activeTab === 'profile' ? 'var(--foreground)' : '#8b949e', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', textAlign: 'left', cursor: 'pointer' }}
          >
            <Building size={18} /> Company Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('billing')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: activeTab === 'billing' ? 'var(--surface)' : 'transparent', border: '1px solid', borderColor: activeTab === 'billing' ? 'var(--primary)' : 'transparent', borderRadius: '8px', color: activeTab === 'billing' ? 'var(--foreground)' : '#8b949e', fontWeight: activeTab === 'billing' ? 'bold' : 'normal', textAlign: 'left', cursor: 'pointer' }}
          >
            <CreditCard size={18} /> Subscription & Billing
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: activeTab === 'notifications' ? 'var(--surface)' : 'transparent', border: '1px solid', borderColor: activeTab === 'notifications' ? 'var(--primary)' : 'transparent', borderRadius: '8px', color: activeTab === 'notifications' ? 'var(--foreground)' : '#8b949e', fontWeight: activeTab === 'notifications' ? 'bold' : 'normal', textAlign: 'left', cursor: 'pointer' }}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Dynamic Form Content */}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'notifications' && renderNotifications()}

      </div>
    </div>
  )
}
