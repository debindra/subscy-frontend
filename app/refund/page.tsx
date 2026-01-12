import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Subsy Refund Policy - Learn about our refund and cancellation policies.',
};

export default function RefundPage() {
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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Refund Policy</h1>
            <p className="mt-4 text-lg text-slate-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-base leading-relaxed text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Overview</h2>
              <p>
                At Subsy, we strive to provide exceptional service and value to our customers. This Refund Policy outlines the terms and conditions under which refunds may be issued for our subscription finance platform services. By using our Service, you agree to this Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Subscription Plans and Billing</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.1 Free Trial</h3>
              <p>
                Subsy offers a free trial period for new users. During the free trial, you can access and use our Service without charge. No refund is applicable during the free trial period as no payment is required.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">2.2 Subscription Billing</h3>
              <p>
                Subscriptions are billed on a monthly or annual basis, depending on your selected plan. Billing occurs automatically at the beginning of each billing cycle. You will be charged the full subscription fee for the billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.1 14-Day Money-Back Guarantee</h3>
              <p>
                We offer a 14-day money-back guarantee for new paid subscriptions. If you are not satisfied with our Service within the first 14 days of your initial paid subscription, you may request a full refund. This guarantee applies only to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your first paid subscription period</li>
                <li>Refund requests made within 14 days of the initial payment</li>
                <li>Accounts that have not violated our Terms of Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">3.2 Refund Requests</h3>
              <p>
                To request a refund, please contact us at <a href="mailto:support@subsy.tech" className="text-primary-600 hover:underline">support@subsy.tech</a> with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your account email address</li>
                <li>The date of your subscription purchase</li>
                <li>The reason for your refund request</li>
              </ul>
              <p className="mt-4">
                We will process refund requests within 5-10 business days. Refunds will be issued to the original payment method used for the purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Non-Refundable Items</h2>
              <p>The following are not eligible for refunds:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Renewal Subscriptions:</strong> Refunds are not available for subscription renewals after the initial 14-day period</li>
                <li><strong>Partial Periods:</strong> We do not provide prorated refunds for unused portions of a billing period</li>
                <li><strong>Downgrades:</strong> Refunds are not available when downgrading from a higher-tier plan to a lower-tier plan</li>
                <li><strong>Violations:</strong> Accounts terminated for violations of our Terms of Service are not eligible for refunds</li>
                <li><strong>Third-Party Services:</strong> Refunds for third-party integrations or services are subject to their respective refund policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Cancellation Policy</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.1 Cancellation Rights</h3>
              <p>
                You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period. You will continue to have access to the Service until the end of the paid period.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">5.2 How to Cancel</h3>
              <p>You can cancel your subscription by:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Accessing your account settings and selecting "Cancel Subscription"</li>
                <li>Contacting our support team at <a href="mailto:support@subsy.tech" className="text-primary-600 hover:underline">support@subsy.tech</a></li>
              </ul>
              <p className="mt-4">
                Once cancelled, your subscription will not renew automatically. You will retain access to all features until the end of your current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Processing Refunds</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.1 Refund Processing Time</h3>
              <p>
                Approved refunds will be processed within 5-10 business days. The refund will be issued to the original payment method used for the purchase. The time it takes for the refund to appear in your account depends on your payment provider and may take up to 10-14 business days.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">6.2 Refund Method</h3>
              <p>
                Refunds are issued to the original payment method. If the original payment method is no longer available, please contact us to arrange an alternative refund method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Chargebacks and Disputes</h2>
              <p>
                If you dispute a charge with your payment provider (chargeback), we may suspend or terminate your account while the dispute is being resolved. We encourage you to contact us directly at <a href="mailto:support@subsy.tech" className="text-primary-600 hover:underline">support@subsy.tech</a> before initiating a chargeback, as we are committed to resolving any issues promptly and fairly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Special Circumstances</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">8.1 Service Interruptions</h3>
              <p>
                If our Service experiences significant downtime or technical issues that prevent you from using the Service for an extended period, we may offer credits or refunds on a case-by-case basis. Our Service Level Agreement (SLA) terms, as outlined in our <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>, apply to service availability and uptime commitments. Please contact our support team to discuss your situation.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">8.2 Billing Errors</h3>
              <p>
                If you believe you have been charged incorrectly, please contact us immediately at <a href="mailto:support@subsy.tech" className="text-primary-600 hover:underline">support@subsy.tech</a>. We will investigate and, if an error is confirmed, issue a refund or credit as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Changes to This Refund Policy</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date. Your continued use of our Service after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Contact Us</h2>
              <p>
                If you have questions about this Refund Policy or need assistance with a refund request, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:support@subsy.tech" className="text-primary-600 hover:underline">support@subsy.tech</a></p>
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

