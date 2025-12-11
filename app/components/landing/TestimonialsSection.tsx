'use client';

import { TESTIMONIALS } from '@/lib/constants/landing';
import { useTestimonialCarousel } from '@/lib/hooks/useTestimonialCarousel';

export function TestimonialsSection() {
  const { getCarouselTransform } = useTestimonialCarousel();

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white" aria-label="Customer testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            What Users Say About Subsy
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Hear what users who stay on top of their subscriptions with Subsy have to say.
          </p>
        </div>
        
        {/* Carousel Container - Infinite Loop */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-6"
              style={{
                transform: getCarouselTransform(),
                transition: 'transform 0.6s ease-in-out'
              }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="w-full md:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333333%_-_1rem)] flex-shrink-0"
                >
                  <article className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all hover:shadow-lg h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-slate-300'
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-sm sm:text-base leading-relaxed text-slate-700 mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{testimonial.timestamp}</span>
                      {testimonial.verified && (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Verified User</span>
                        </>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
