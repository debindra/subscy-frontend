'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants/landing';

export function FAQSection() {
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20 md:py-24 bg-white" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
            FAQ
          </span>
          <h2 id="faq-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Frequently asked questions</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Everything you need to know about our subscription alert system</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isExpanded = expandedFaqs.has(index);
            return (
              <div key={faq.question} className="rounded-xl border border-slate-200 bg-white">
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl p-5 text-left text-base font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:p-6 sm:text-lg"
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {faq.question}
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={!isExpanded}
                  className="px-5 pb-5 sm:px-6 sm:pb-6"
                >
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
