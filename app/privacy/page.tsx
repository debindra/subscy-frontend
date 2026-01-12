import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Subsy Privacy Policy - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="Subsy Home">
            <span className="sr-only">Subsy</span>
            <img
              src="/subsy-full-logo.png"
              alt="Subsy logo"
              width={140}
              height={40}
              className="h-8 sm:h-10 w-auto dark:hidden"
              loading="eager"
            />
            <img
              src="/subsy-full-logo-darktheme.png"
              alt="Subsy logo"
              width={140}
              height={40}
              className="h-8 sm:h-10 w-auto hidden dark:block"
              loading="eager"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-primary-600 hover:bg-primary-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
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

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.4 Data Categories</h3>
              <p>We process the following categories of personal data:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Identity Data:</strong> Name, email address, username, and account credentials</li>
                <li><strong>Contact Data:</strong> Email address, billing address, and communication preferences</li>
                <li><strong>Financial Data:</strong> Payment card details (processed by third-party payment processors), transaction history, subscription costs, and spending analytics</li>
                <li><strong>Transaction Data:</strong> Details about subscriptions, vendors, renewal dates, payment methods, and billing cycles</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone, device identifiers, operating system, and platform information</li>
                <li><strong>Usage Data:</strong> Information about how you use our Service, including pages visited, features accessed, clickstream data, and interaction patterns</li>
                <li><strong>Marketing and Communications Data:</strong> Your preferences for receiving marketing communications from us and your communication history</li>
                <li><strong>Profile Data:</strong> Username, password, preferences, feedback, and survey responses</li>
              </ul>
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

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.5 Legal Basis for Processing (GDPR)</h3>
              <p>Under the General Data Protection Regulation (GDPR), we process your personal data based on the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Contract Performance:</strong> Processing necessary to provide our Service and fulfill our contractual obligations to you</li>
                <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests, including improving our Service, preventing fraud, ensuring security, and communicating with you about service updates</li>
                <li><strong>Consent:</strong> Processing based on your consent, such as marketing communications and optional data collection features</li>
                <li><strong>Legal Obligation:</strong> Processing required to comply with legal obligations, such as tax reporting and regulatory requirements</li>
              </ul>
              <p className="mt-4">
                You have the right to withdraw consent at any time where processing is based on consent, without affecting the lawfulness of processing before withdrawal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights under applicable data protection laws (including GDPR, CCPA, and other regional regulations):</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Right of Access:</strong> Request access to your personal data and receive a copy of the data we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal data</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your personal data when it is no longer necessary or when you withdraw consent</li>
                <li><strong>Right to Restrict Processing:</strong> Request restriction of processing of your personal data in certain circumstances</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service provider in a structured, commonly used format</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data for direct marketing or legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
                <li><strong>Right to Non-Discrimination (CCPA):</strong> Exercise your rights without discrimination</li>
                <li><strong>Right to Opt-Out (CCPA):</strong> Opt out of the sale of personal information (we do not sell personal information)</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@subsy.tech" className="text-primary-600 hover:underline">privacy@subsy.tech</a>. We will respond to your request within 30 days (or as required by applicable law).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. Our data retention practices are as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Account Data:</strong> Retained for the duration of your account and for 30 days after account deletion, unless longer retention is required by law</li>
                <li><strong>Transaction and Financial Data:</strong> Retained for 7 years for tax and accounting purposes, as required by law</li>
                <li><strong>Marketing Data:</strong> Retained until you opt out or withdraw consent, plus a reasonable period to process your request</li>
                <li><strong>Technical and Usage Data:</strong> Retained for up to 2 years for analytics and security purposes</li>
                <li><strong>Legal and Compliance Data:</strong> Retained as required by applicable laws, regulations, or legal proceedings</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal, regulatory, tax, or accounting purposes. Some data may remain in backup systems for up to 90 days before permanent deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from those in your country. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Data Breach Notification</h2>
              <p>
                In the event of a personal data breach that is likely to result in a high risk to your rights and freedoms, we will notify you and the relevant supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware of the breach, in accordance with applicable data protection laws.
              </p>
              <p className="mt-4">
                Our breach notification will include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Description of the nature of the breach</li>
                <li>Categories and approximate number of individuals and personal data records concerned</li>
                <li>Likely consequences of the breach</li>
                <li>Measures taken or proposed to address the breach and mitigate its effects</li>
                <li>Contact information for our data protection officer or privacy team</li>
              </ul>
              <p className="mt-4">
                If you suspect a data breach or have security concerns, please contact us immediately at <a href="mailto:privacy@subsy.tech" className="text-primary-600 hover:underline">privacy@subsy.tech</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Governing Jurisdiction</h2>
              <p>
                This Privacy Policy is governed by and construed in accordance with the laws of the State of Delaware, United States. However, if you are located in the European Economic Area (EEA), United Kingdom, or other jurisdictions with specific data protection laws, your local data protection laws will apply to the processing of your personal data.
              </p>
              <p className="mt-4">
                For users in the EEA and UK, the General Data Protection Regulation (GDPR) and UK GDPR apply. For users in California, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) apply.
              </p>
              <p className="mt-4">
                Our data processing activities may involve transfers of personal data to the United States and other countries. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Privacy Email:</strong> <a href="mailto:privacy@subsy.tech" className="text-primary-600 hover:underline">privacy@subsy.tech</a></p>
                <p><strong>General Inquiries:</strong> <a href="mailto:hello@subsy.tech" className="text-primary-600 hover:underline">hello@subsy.tech</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer showNewsletter={false} />
    </div>
  );
}

