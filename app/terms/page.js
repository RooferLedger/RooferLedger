import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | RooferLedger',
  description: 'Terms of Service for the RooferLedger platform.',
}

export default function TermsOfService() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', textDecoration: 'none', marginBottom: '2rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '1rem' }}>Terms of Service</h1>
        <p style={{ color: '#8b949e', marginBottom: '3rem' }}>Last Updated: April 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.6 }}>
          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using RooferLedger ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Service, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Provision of Service</h2>
            <p>RooferLedger provides a streamlined invoicing and client management software tailored for roofing professionals. We reserve the right to modify, suspend, or discontinue the Service with or without notice at any time and without any liability to you.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>3. User Obligations</h2>
            <p>You agree to use RooferLedger only for lawful purposes. You are strictly prohibited from using the tool to generate fraudulent invoices, facilitate illegal transactions, or harass individuals via the integrated Twilio SMS and Resend email pipelines. You are entirely responsible for maintaining the confidentiality of your password and account.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Billing and Payment</h2>
            <p>RooferLedger operates on a subscription basis. By selecting a premium or Founders rate tier, you agree to pay RooferLedger the monthly or annual subscription fees indicated for that service. Payments will be charged on a pre-pay basis on the day you sign up, and will cover the use of that service for the indicated subscription period. Subscription fees are not refundable.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>5. Communications</h2>
            <p>By creating an account on our service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>6. Limitation of Liability</h2>
            <p>In no event shall RooferLedger, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>7. Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at:</p>
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
              Email: <a href="mailto:support@rooferledger.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>support@rooferledger.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
