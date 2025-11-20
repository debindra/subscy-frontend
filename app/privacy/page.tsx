import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Subsy Privacy Policy - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5" aria-label="Main navigation">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary-600 transition hover:text-primary-700">
            Subsy
          </Link>
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary-600 hover:bg-primary-50"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16 lg:py-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-lg text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-base leading-relaxed text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Subsy ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our subscription finance platform and services (the "Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.1 Information You Provide</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Account Information:</strong> Name, email address, password, and business information</li>
                <li><strong>Subscription Data:</strong> Details about your subscriptions, vendors, payment methods, and renewal dates</li>
                <li><strong>Financial Information:</strong> Transaction data, spending patterns, and billing information</li>
                <li><strong>Communication Data:</strong> Messages, feedback, and support requests</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our Service:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Usage Data:</strong> How you interact with our Service, features used, and pages visited</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Cookies and Tracking:</strong> Data collected through cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.3 Third-Party Integrations</h3>
              <p>
                When you connect third-party services (e.g., payment processors, accounting software), we may receive information from those services in accordance with their privacy policies and your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and manage your subscriptions</li>
                <li>Send renewal alerts, notifications, and important updates</li>
                <li>Generate analytics, reports, and insights about your spending</li>
                <li>Detect and prevent fraud, security threats, and unauthorized access</li>
                <li>Communicate with you about our Service, updates, and promotional offers</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal data. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.1 Service Providers</h3>
              <p>We share data with trusted service providers who assist in operating our Service, such as:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Cloud hosting and infrastructure providers</li>
                <li>Payment processors and financial institutions</li>
                <li>Analytics and monitoring services</li>
                <li>Email and notification services</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.2 Legal Requirements</h3>
              <p>We may disclose your information if required by law or to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Comply with legal processes, subpoenas, or government requests</li>
                <li>Protect our rights, property, or safety, or that of our users</li>
                <li>Investigate potential violations of our terms of service</li>
                <li>Prevent or address fraud, security, or technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.3 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based access and authentication requirements</li>
                <li><strong>Monitoring:</strong> Continuous security monitoring and threat detection</li>
                <li><strong>Compliance:</strong> SOC 2 Type II certified infrastructure</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@subsy.tech" className="text-primary-600 hover:underline">privacy@subsy.tech</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from those in your country. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@subsy.tech" className="text-primary-600 hover:underline">privacy@subsy.tech</a></p>
                <p><strong>General Inquiries:</strong> <a href="mailto:hello@subsy.tech" className="text-primary-600 hover:underline">hello@subsy.tech</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/95 backdrop-blur-sm pt-10 pb-20 md:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 md:flex-row">
          <p className="text-base">© {new Date().getFullYear()} Subsy. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
            <Link href="/privacy" className="text-base transition hover:text-primary-600 hover:underline font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="text-base transition hover:text-primary-600 hover:underline">
              Terms
            </Link>
            <Link href="mailto:hello@subsy.tech" className="text-base transition hover:text-primary-600 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

