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
    <section id="faq" className="py-12 sm:py-16 md:py-24 bg-slate-50" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600">
            FAQ
          </span>
          <h2 id="faq-heading" className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0">Frequently asked questions about alerts</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">Everything you need to know about our subscription alert system</p>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isExpanded = expandedFaqs.has(index);
            return (
              <article 
                key={faq.question} 
                className="rounded-xl bg-white border border-slate-200 transition-all hover:shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-xl min-h-[60px] sm:min-h-[70px]"
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${index}`}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} question: ${faq.question}`}
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-4">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
