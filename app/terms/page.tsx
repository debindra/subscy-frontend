import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Subsy Terms of Service - Read our terms and conditions for using our subscription finance platform.',
};

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-lg text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-base leading-relaxed text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using Subsy ("we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use our subscription finance platform and services (the "Service").
              </p>
              <p className="mt-4">
                These Terms apply to all users, including individuals, businesses, and organizations that access or use our Service. By creating an account or using our Service, you represent that you have the authority to bind your organization to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
              <p>
                Subsy is a subscription finance platform that helps businesses track, manage, and optimize their recurring subscriptions and spending. Our Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Subscription tracking and management</li>
                <li>Spending analytics and insights</li>
                <li>Renewal alerts and notifications</li>
                <li>Vendor management and health monitoring</li>
                <li>Integration with third-party services</li>
                <li>Automated workflows and approvals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Account Registration and Security</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.1 Account Creation</h3>
              <p>To use our Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Create an account with accurate and complete information</li>
                <li>Maintain and update your account information as necessary</li>
                <li>Be at least 18 years old or have parental consent</li>
                <li>Have the legal authority to enter into these Terms</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.2 Account Security</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring that your team members follow security best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Use of Service</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.1 Permitted Use</h3>
              <p>You may use our Service solely for lawful business purposes in accordance with these Terms.</p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">4.2 Prohibited Activities</h3>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Upload or transmit malicious code, viruses, or harmful data</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use the Service to compete with us or create derivative services</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Resell, sublicense, or redistribute the Service without our written consent</li>
                <li>Use automated systems to access the Service in excess of normal usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Content and Data</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.1 Your Content</h3>
              <p>
                You retain all ownership rights to the data and content you upload to our Service ("Your Content"). By using our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and process Your Content solely for the purpose of providing and improving our Service.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.2 Your Responsibilities</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Ensuring you have the right to upload and process Your Content</li>
                <li>Backing up Your Content regularly</li>
                <li>Complying with data protection and privacy laws applicable to Your Content</li>
                <li>Obtaining necessary consents for processing personal data</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.3 Data Retention</h3>
              <p>
                We will retain Your Content for as long as your account is active. Upon account deletion, we will delete or anonymize Your Content within 30 days, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Third-Party Integrations</h2>
              <p>
                Our Service may integrate with third-party services (e.g., payment processors, accounting software). Your use of these third-party services is subject to their respective terms and conditions. We are not responsible for the availability, accuracy, or practices of third-party services.
              </p>
              <p className="mt-4">
                When you connect third-party services, you authorize us to access and use your data from those services as necessary to provide our Service. You are responsible for maintaining your third-party account credentials and permissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Subscription and Payment</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">7.1 Subscription Plans</h3>
              <p>
                We offer various subscription plans with different features and pricing. You agree to pay all fees associated with your selected plan. Fees are billed in advance on a monthly or annual basis, as applicable.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">7.2 Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>All fees are non-refundable except as required by law or as specified in your plan</li>
                <li>We reserve the right to change our pricing with 30 days' notice</li>
                <li>If payment fails, we may suspend or terminate your access to the Service</li>
                <li>You are responsible for any taxes, duties, or fees applicable to your subscription</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">7.3 Cancellation</h3>
              <p>
                You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You will continue to have access to the Service until the end of your paid period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Intellectual Property</h2>
              <p>
                The Service, including all software, designs, text, graphics, logos, and other content, is owned by Subsy or our licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your internal business purposes in accordance with these Terms. This license does not include the right to resell, sublicense, or create derivative works.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
              </p>
              <p className="mt-4">
                We do not warrant that the Service will be uninterrupted, error-free, secure, or free from viruses or other harmful components. We do not guarantee the accuracy, completeness, or usefulness of any information provided through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SUBSY, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p className="mt-4">
                Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Subsy, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your Content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Termination</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.1 Termination by You</h3>
              <p>You may terminate your account at any time by contacting us or using the account deletion feature in the Service.</p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.2 Termination by Us</h3>
              <p>We may suspend or terminate your access to the Service immediately if:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>You violate these Terms</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>You fail to pay applicable fees</li>
                <li>We are required to do so by law</li>
                <li>We discontinue the Service (with reasonable notice)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">12.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service will immediately cease. We will delete or anonymize your account data within 30 days, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p className="mt-4">
                Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization], except where prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">15. Miscellaneous</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">15.1 Entire Agreement</h3>
              <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Subsy regarding the Service.</p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">15.2 Severability</h3>
              <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.</p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">15.3 Waiver</h3>
              <p>Our failure to enforce any provision of these Terms does not constitute a waiver of that provision.</p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">15.4 Assignment</h3>
              <p>You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">16. Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:legal@subsy.tech" className="text-primary-600 hover:underline">legal@subsy.tech</a></p>
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
            <Link href="/privacy" className="text-base transition hover:text-primary-600 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-base transition hover:text-primary-600 hover:underline font-medium">
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

