import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | RooferLedger',
  description: 'Privacy Policy for the RooferLedger platform.',
}

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', textDecoration: 'none', marginBottom: '2rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: '#8b949e', marginBottom: '3rem' }}>Last Updated: April 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.6 }}>
          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
            <p>Welcome to RooferLedger. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>2. The Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and title.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Contact Data</strong> includes billing address, email address, and telephone numbers.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Financial Data</strong> includes bank account and payment card details (managed securely by Stripe).</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Customer Data</strong> includes the information you input regarding your own clients (homeowners, property managers) for the purpose of generating invoices.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., generating PDFs, sending SMS/emails).</li>
              <li style={{ marginBottom: '0.5rem' }}>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li style={{ marginBottom: '0.5rem' }}>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Your data is stored on secure, encrypted servers (Supabase) and payment information is tokenized and processed exclusively through Stripe. We do not store raw credit card numbers on our servers.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>5. Data Retention</h2>
            <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. You may request account deletion at any time by contacting support.</p>
          </section>

          <section>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>6. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager in the following way:</p>
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
              Email address: <a href="mailto:support@rooferledger.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>support@rooferledger.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
