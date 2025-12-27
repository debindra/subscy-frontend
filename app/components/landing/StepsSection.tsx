'use client';

import { useState, useEffect, useRef } from 'react';
import { STEPS } from '@/lib/constants/landing';

export function StepsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const delayClasses = ['animate-delay-0', 'animate-delay-200', 'animate-delay-400'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-24 bg-slate-50" 
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 md:mb-16">
          <span className={`inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium uppercase tracking-wider text-slate-600 ${isVisible ? 'animate-fade-in-up animate-delay-0' : 'opacity-0'}`}>
            How it works
          </span>
          <h2 
            id="how-it-works-heading" 
            className={`mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 px-4 sm:px-0 ${isVisible ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}
          >
            Set up alerts in three simple steps
          </h2>
          <p 
            className={`mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-slate-600 px-4 sm:px-0 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}
          >
            Get started in minutes. Add your subscriptions, configure your alerts, and never worry about missing a renewal again.
          </p>
        </div>
        <div className="relative grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Connecting line animation - hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-16 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-0.5 bg-slate-200 overflow-hidden rounded-full">
            <div className={`h-full w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 ${isVisible ? 'animate-slide-line' : 'scale-x-0 opacity-0'}`}></div>
          </div>
          
          {STEPS.map((step, index) => {
            // Visual illustrations for each step
            const stepVisuals = [
              // Step 1: Add Form - Realistic subscription form
              <svg key="step1" className="w-full h-full" fill="none" viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg">
                {/* Form container with shadow */}
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="buttonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5"/>
                    <stop offset="100%" stopColor="#6366F1"/>
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="240" height="200" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" filter="url(#shadow)"/>
                
                {/* Form header */}
                <rect x="20" y="20" width="240" height="45" rx="12" fill="#F8FAFC"/>
                <rect x="35" y="32" width="80" height="10" rx="5" fill="#475569" className="animate-pulse"/>
                <rect x="35" y="45" width="120" height="7" rx="3.5" fill="#CBD5E1"/>
                
                {/* Name field */}
                <rect x="30" y="82" width="50" height="6" rx="3" fill="#64748B"/>
                <rect x="30" y="92" width="220" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <rect x="38" y="100" width="120" height="5" rx="2.5" fill="#E2E8F0">
                  <animate attributeName="width" values="120;140;120" dur="2.5s" repeatCount="indefinite"/>
                </rect>
                
                {/* Amount and Billing Cycle - side by side */}
                <rect x="30" y="130" width="45" height="6" rx="3" fill="#64748B"/>
                <rect x="30" y="140" width="105" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <text x="38" y="157" fill="#64748B" fontSize="11" fontWeight="500">$9.99</text>
                
                <rect x="145" y="130" width="70" height="6" rx="3" fill="#64748B"/>
                <rect x="145" y="140" width="105" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <text x="153" y="157" fill="#64748B" fontSize="11" fontWeight="500">Monthly</text>
                
                {/* Renewal Date */}
                <rect x="30" y="178" width="80" height="6" rx="3" fill="#64748B"/>
                <rect x="30" y="188" width="220" height="28" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <text x="38" y="206" fill="#64748B" fontSize="11">2024-02-15</text>
                
                {/* Add button - animated */}
                <rect x="30" y="228" width="220" height="36" rx="8" fill="url(#buttonGrad)">
                  <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
                </rect>
                <text x="140" y="248" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Add Subscription</text>
                
                {/* Floating success icon - appears on hover */}
                <g opacity="0" className="group-hover:opacity-100 transition-opacity duration-300">
                  <circle cx="220" cy="45" r="12" fill="#10B981"/>
                  <path d="M215 45l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>,
              
              // Step 2: Configure Timezone & Time - Realistic settings panel
              <svg key="step2" className="w-full h-full" fill="none" viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect x="20" y="20" width="240" height="200" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" filter="url(#shadow2)"/>
                
                {/* Settings header */}
                <rect x="20" y="20" width="240" height="42" rx="12" fill="#F8FAFC"/>
                <circle cx="38" cy="41" r="9" fill="#6366F1"/>
                <path d="M38 35v12M32 41h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="54" y="36" width="90" height="10" rx="5" fill="#475569"/>
                
                {/* Timezone selector */}
                <rect x="30" y="78" width="65" height="6" rx="3" fill="#64748B"/>
                <rect x="30" y="88" width="220" height="32" rx="6" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2"/>
                <rect x="38" y="97" width="140" height="6" rx="3" fill="#475569"/>
                {/* Dropdown arrow */}
                <path d="M235 104l-4-4 4-4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="230" cy="104" r="1.5" fill="#6366F1">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                
                {/* Time picker */}
                <rect x="30" y="132" width="100" height="6" rx="3" fill="#64748B"/>
                <rect x="30" y="142" width="220" height="32" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5"/>
                <text x="38" y="161" fill="#475569" fontSize="12" fontWeight="500">09:00</text>
                {/* Clock icon */}
                <circle cx="225" cy="158" r="8" fill="#F59E0B" opacity="0.2"/>
                <circle cx="225" cy="158" r="6" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
                <line x1="225" y1="158" x2="225" y2="154" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="225" y1="158" x2="228" y2="158" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                
                {/* Email toggle - active */}
                <rect x="30" y="186" width="220" height="28" rx="14" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5"/>
                <circle cx="48" cy="200" r="6" fill="#64748B"/>
                <rect x="60" y="192" width="70" height="6" rx="3" fill="#475569"/>
                <rect x="60" y="201" width="120" height="4" rx="2" fill="#94A3B8"/>
                {/* Active toggle switch */}
                <rect x="200" y="186" width="44" height="28" rx="14" fill="#10B981"/>
                <circle cx="222" cy="200" r="10" fill="white">
                  <animate attributeName="cx" values="222;222;222" dur="0.5s"/>
                </circle>
                
                {/* Push notification toggle - active */}
                <rect x="30" y="220" width="220" height="28" rx="14" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5"/>
                <circle cx="48" cy="234" r="6" fill="#64748B"/>
                <rect x="60" y="226" width="95" height="6" rx="3" fill="#475569"/>
                <rect x="60" y="235" width="120" height="4" rx="2" fill="#94A3B8"/>
                {/* Active toggle switch */}
                <rect x="200" y="220" width="44" height="28" rx="14" fill="#10B981"/>
                <circle cx="222" cy="234" r="10" fill="white">
                  <animate attributeName="cx" values="222;222;222" dur="0.5s"/>
                </circle>
              </svg>,
              
              // Step 3: Get Notifications - Realistic email and push notifications
              <svg key="step3" className="w-full h-full" fill="none" viewBox="0 0 280 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                    <feOffset dx="0" dy="3" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.4"/>
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="emailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F8FAFC"/>
                    <stop offset="100%" stopColor="#FFFFFF"/>
                  </linearGradient>
                </defs>
                
                {/* Email notification card */}
                <g transform="translate(15, 15)" filter="url(#shadow3)">
                  <rect width="110" height="85" rx="10" fill="url(#emailGrad)" stroke="#E2E8F0" strokeWidth="2"/>
                  
                  {/* Email header */}
                  <rect width="110" height="28" rx="10" fill="#F1F5F9"/>
                  <circle cx="22" cy="14" r="5" fill="#6366F1"/>
                  <path d="M19 14l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="32" y="10" width="60" height="6" rx="3" fill="#475569"/>
                  <rect x="32" y="18" width="50" height="4" rx="2" fill="#94A3B8"/>
                  
                  {/* Email subject */}
                  <rect x="15" y="38" width="80" height="5" rx="2.5" fill="#475569"/>
                  <rect x="15" y="46" width="65" height="4" rx="2" fill="#CBD5E1"/>
                  
                  {/* Email preview */}
                  <rect x="15" y="54" width="75" height="3" rx="1.5" fill="#E2E8F0"/>
                  <rect x="15" y="60" width="60" height="3" rx="1.5" fill="#E2E8F0"/>
                  
                  {/* Unread badge */}
                  <circle cx="98" cy="14" r="7" fill="#f97316"/>
                  <text x="98" y="17.5" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
                  
                  {/* Incoming animation */}
                  <circle cx="55" cy="14" r="2" fill="#10B981" opacity="0.6">
                    <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Push notification card (phone style) */}
                <g transform="translate(155, 15)" filter="url(#shadow3)">
                  <rect width="110" height="85" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
                  
                  {/* Phone status bar */}
                  <rect width="110" height="18" rx="12" fill="#0F172A"/>
                  <circle cx="55" cy="9" r="2" fill="#475569"/>
                  <rect x="45" y="7" width="20" height="4" rx="2" fill="#334155"/>
                  
                  {/* Notification banner */}
                  <rect x="8" y="25" width="94" height="52" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
                  <circle cx="22" cy="40" r="5" fill="#6366F1"/>
                  <rect x="32" y="36" width="55" height="5" rx="2.5" fill="#1E293B" fontWeight="600"/>
                  <rect x="32" y="44" width="50" height="4" rx="2" fill="#475569"/>
                  <rect x="32" y="51" width="45" height="3" rx="1.5" fill="#64748B"/>
                  <rect x="32" y="57" width="40" height="3" rx="1.5" fill="#94A3B8"/>
                  
                  {/* Notification badge */}
                  <circle cx="93" cy="32" r="6" fill="#f97316"/>
                  <text x="93" y="35.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">2</text>
                </g>
                
                {/* Success indicators with pulsing animation */}
                <g>
                  {/* Email success checkmark */}
                  <circle cx="70" cy="155" r="14" fill="#10B981" opacity="0.2">
                    <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="70" cy="155" r="12" fill="#10B981" opacity="0.3"/>
                  <path d="M65 155l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  
                  {/* Push notification success checkmark */}
                  <circle cx="210" cy="155" r="14" fill="#10B981" opacity="0.2">
                    <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                    <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                  </circle>
                  <circle cx="210" cy="155" r="12" fill="#10B981" opacity="0.3"/>
                  <path d="M205 155l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </g>
                
                {/* Notification waves */}
                <circle cx="70" cy="155" r="25" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.2" strokeDasharray="3 3">
                  <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="210" cy="155" r="25" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.2" strokeDasharray="3 3">
                  <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                </circle>
                
                {/* Delivery success text */}
                <text x="70" y="185" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" opacity="0.8">Delivered</text>
                <text x="210" y="185" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600" opacity="0.8">Delivered</text>
              </svg>
            ];

            return (
              <article
                key={step.title}
                className={`group relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-xl hover:-translate-y-2 ${
                  isVisible 
                    ? `animate-fade-in-up ${delayClasses[index]}` 
                    : 'opacity-0'
                }`}
              >
                {/* Large visual illustration container */}
                <div className="mb-6 relative h-48 sm:h-56 sm:h-64 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 via-brand-accent-50 to-primary-50 overflow-hidden group-hover:from-primary-100 group-hover:via-brand-accent-100 group-hover:to-primary-100 transition-all duration-300 p-4">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>
                  </div>
                  {/* Step number badge - outline style */}
                  <div className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white text-xs font-bold text-primary-600 shadow-sm group-hover:scale-110 group-hover:border-primary-700 group-hover:text-primary-700 transition-all duration-300 z-20">
                    {step.number}
                  </div>
                  {/* Main visual illustration */}
                  <div className="relative z-10 w-full h-full max-w-[220px] max-h-[180px] mx-auto transform group-hover:scale-105 transition-all duration-500">
                    {stepVisuals[index]}
                  </div>
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                {/* Title and description */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300 text-center">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors duration-300 text-center">
                  {step.description}
                </p>
                
                {/* Decorative arrow on hover */}
                <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg 
                    className="w-5 h-5 text-primary-600 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
