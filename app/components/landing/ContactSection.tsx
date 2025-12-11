'use client';

import Link from 'next/link';
import { getNotificationChannelIcon } from '@/lib/utils/icons';

export function ContactSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-100 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-primary-700">
            Contact
          </span>
          <h2 id="contact-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">
            Get in touch with us
          </h2>
          <p className="mt-4 sm:mt-6 mx-auto max-w-2xl text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <div className="w-8 h-8 text-primary-600 [&>svg]:w-8 [&>svg]:h-8">
                {getNotificationChannelIcon('email')}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
            <a href="mailto:hello@subsy.tech" className="text-primary-600 hover:text-primary-700 transition-colors font-medium text-lg">
              hello@subsy.tech
            </a>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="mailto:hello@subsy.tech"
            className="inline-flex items-center justify-center rounded-lg bg-brand-accent-500 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-brand-accent-600 hover:shadow-xl hover:scale-105"
          >
            Send us a message
          </Link>
        </div>
      </div>
    </section>
  );
}
