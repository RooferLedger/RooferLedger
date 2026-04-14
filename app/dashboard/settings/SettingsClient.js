'use client'

import { Settings, Building, CreditCard, Bell, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { updateSettingsProfile } from './actions'

export default function SettingsClient({ initialOrg, initialUser, chargesEnabled, bankLast4, isSubscribed }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const formData = new FormData(e.target)
    try {
      const result = await updateSettingsProfile(formData)
      if (result && result.error) throw new Error(result.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Error: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const renderProfile = () => (
    <form className="form-card" onSubmit={handleSaveProfile}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Company Profile</h2>
      
      <div className="input-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <label className="input-label" style={{ marginBottom: 0 }}>Company Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
              {initialOrg?.logo_url ? (
                <img src={initialOrg.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>No Logo</span>
              )}
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
          <input name="companyName" className="input-field" defaultValue={initialOrg?.name || ''} required />
        </div>
        
        <div>
          <label className="input-label">Support Email</label>
          <input name="email" className="input-field" type="email" defaultValue={initialUser?.email || ''} disabled style={{ opacity: 0.7 }} />
          <p style={{ fontSize: '0.8rem', color: '#8b949e', margin: '4px 0 0 0' }}>Email is managed via your secure login settings.</p>
        </div>

        <div>
          <label className="input-label">Business Phone</label>
          <input name="phone" className="input-field" defaultValue={initialOrg?.phone || ''} />
        </div>

        <div>
          <label className="input-label">Company Address (Optional)</label>
          <textarea 
            name="address" 
            className="input-field" 
            defaultValue={initialOrg?.address || ''} 
            placeholder="123 Roofing Way&#10;Dallas, TX 75201"
            rows={3} 
            style={{ resize: 'vertical', fontFamily: 'inherit' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '2rem', alignItems: 'center', gap: '1rem' }}>
        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <CheckCircle2 size={16} /> Profile Saved
          </span>
        )}
      </div>
    </form>
  )

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to initiate checkout.")
      }
    } catch (e) {
      console.error(e)
      alert("Billing server error.")
    }
  }

  const renderBilling = () => (
    <div className="form-card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Subscription & Billing</h2>
      
      {/* Payment Processing Onboarding */}
      <div style={{ backgroundColor: chargesEnabled ? 'rgba(52, 211, 153, 0.05)' : initialOrg?.stripe_account_id ? 'rgba(210, 153, 34, 0.05)' : 'rgba(47, 129, 247, 0.05)', border: `1px solid ${chargesEnabled ? 'rgba(52, 211, 153, 0.2)' : initialOrg?.stripe_account_id ? 'rgba(210, 153, 34, 0.2)' : 'rgba(47, 129, 247, 0.2)'}`, borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Accept Credit Cards</h3>
            <p style={{ color: '#8b949e', margin: 0, maxWidth: '400px' }}>
              {chargesEnabled 
                ? 'Your Stripe account is successfully linked. You can accept payments on invoices.' 
                : initialOrg?.stripe_account_id 
                  ? 'Your account was created but setup is incomplete! You cannot accept payments yet.'
                  : 'Link your bank account via Stripe Connect to allow homeowners to pay your invoices online instantly.'}
            </p>
          </div>
          {!chargesEnabled && (
            <button 
              onClick={async (e) => {
                e.target.disabled = true;
                e.target.innerText = 'Connecting...';
                try {
                  const res = await fetch('/api/stripe/connect', { method: 'POST' });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                  else {
                    e.target.innerText = initialOrg?.stripe_account_id ? 'Resume Onboarding' : 'Connect Bank Account';
                    e.target.disabled = false;
                    alert("Stripe Integration Error: " + (data.error || JSON.stringify(data)));
                  }
                } catch(err) {
                  e.target.innerText = initialOrg?.stripe_account_id ? 'Resume Onboarding' : 'Connect Bank Account';
                  e.target.disabled = false;
                  alert("Gateway error: " + err.message);
                }
              }} 
              className="btn btn-primary" 
              style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', backgroundColor: initialOrg?.stripe_account_id ? '#d29922' : '#2f81f7', color: '#fff' }}
            >
              {initialOrg?.stripe_account_id ? 'Resume Onboarding' : 'Connect Bank Account'}
            </button>
          )}
          {chargesEnabled && (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', padding: '0.75rem 1rem', backgroundColor: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px' }}>
                 <CheckCircle2 size={18} /> Stripe Connected & Active
               </span>
               {bankLast4 && (
                 <span style={{ fontSize: '0.85rem', color: '#8b949e', fontWeight: '500' }}>
                   Account ending in •••• {bankLast4}
                 </span>
               )}
             </div>
          )}
        </div>
      </div>

      {/* Subscription */}
      <div style={{ backgroundColor: isSubscribed ? 'rgba(52, 211, 153, 0.05)' : 'rgba(47, 129, 247, 0.05)', border: `1px solid ${isSubscribed ? 'rgba(52, 211, 153, 0.2)' : 'rgba(47, 129, 247, 0.2)'}`, borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>RooferLedger Core <em>(Beta)</em></h3>
            <p style={{ color: '#8b949e', margin: 0 }}>Unlock infinite invoice generation, Twilio SMS, and Resend capabilities.</p>
          </div>
          {isSubscribed ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', padding: '0.75rem 1rem', backgroundColor: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px' }}>
              <CheckCircle2 size={18} /> Subscribed
            </span>
          ) : (
            <button onClick={handleSubscribe} className="btn btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold' }}>
              Subscribe Now
            </button>
          )}
        </div>
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

      <div className="settings-grid">
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
