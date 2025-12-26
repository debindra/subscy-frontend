'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { isTourDismissed, dismissTour, shouldShowTourOnFirstLogin, markTourAsSeen } from '@/lib/utils/tour';
import { useAuth } from '@/lib/hooks/useAuth';

interface TourStep {
  id: string;
  target: string; // CSS selector or data-tour attribute
  title: string;
  content: string;
  icon?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Welcome to Subsy! 🎉',
    content: 'Your personal subscription management dashboard. Track all your subscriptions, spending, and never miss a renewal.',
    icon: '👋',
    position: 'center',
  },
  {
    id: 'spending',
    target: '[data-tour="spending-summary"]',
    title: 'Track Your Spending',
    content: 'See your total monthly and yearly spending at a glance. Monitor your recurring expenses and stay on budget.',
    icon: '💰',
    position: 'bottom',
  },
  {
    id: 'renewals',
    target: '[data-tour="upcoming-renewals"]',
    title: 'Upcoming Renewals',
    content: 'Never miss a payment! View all subscriptions renewing soon. Edit or cancel them directly from your dashboard.',
    icon: '📆',
    position: 'top',
  },
  {
    id: 'analytics',
    target: '[data-tour="analytics"]',
    title: 'Spending Insights',
    content: 'Get detailed analytics and charts to understand your spending patterns. Identify opportunities to save money.',
    icon: '📈',
    position: 'bottom',
  },
  {
    id: 'manage',
    target: '[data-tour="manage-button"]',
    title: 'Manage Everything',
    content: 'Click here to view and manage all your subscriptions. Organize by category, set reminders, and track everything in one place.',
    icon: '⚙️',
    position: 'left',
  },
];

interface ProductTourProps {
  forceShow?: boolean;
  onClose?: () => void;
}

export function ProductTour({ forceShow = false, onClose }: ProductTourProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const originalStylesRef = useRef<{ zIndex: string | null; position: string | null } | null>(null);
  
  // Use refs for touch positions to avoid stale state issues
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Restore element styles when tour closes or step changes
  const restoreElementStyles = useCallback(() => {
    if (highlightedElementRef.current && originalStylesRef.current) {
      // Restore z-index
      if (originalStylesRef.current.zIndex === 'auto' || !originalStylesRef.current.zIndex) {
        highlightedElementRef.current.style.zIndex = '';
      } else {
        highlightedElementRef.current.style.zIndex = originalStylesRef.current.zIndex;
      }
      
      // Restore position
      if (originalStylesRef.current.position === 'static') {
        // Remove the relative position we added
        highlightedElementRef.current.style.position = '';
      } else {
        highlightedElementRef.current.style.position = originalStylesRef.current.position || '';
      }
      
      highlightedElementRef.current = null;
      originalStylesRef.current = null;
    }
  }, []);

  // Reset tour to beginning when manually started via forceShow
  // Also handle hiding when forceShow becomes false
  useEffect(() => {
    if (forceShow) {
      // Reset all tour state when manually starting
      restoreElementStyles(); // Restore any previous element styles
      setCurrentStep(0);
      setHighlightRect(null);
      setIsTransitioning(false);
      // Small delay to ensure reset happens before showing
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(showTimer);
    } else {
      // Hide tour when forceShow becomes false
      restoreElementStyles(); // Restore element styles when hiding
      setIsVisible(false);
      setHighlightRect(null);
      setIsTransitioning(false);
    }
  }, [forceShow, restoreElementStyles]);

  useEffect(() => {
    if (user && !forceShow) {
      // Only auto-show on first login (when user hasn't seen tour before)
      // Skip auto-start on mobile to avoid interrupting users
      if (shouldShowTourOnFirstLogin() && !isMobile) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          markTourAsSeen();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, forceShow, isMobile]);

  const handleDone = useCallback(() => {
    // Always dismiss when user completes tour to prevent auto-restart
    // Even if manually started, we want to respect user's completion
    dismissTour();
    restoreElementStyles();
    setIsVisible(false);
    setHighlightRect(null);
    setIsTransitioning(false);
    onClose?.();
  }, [onClose, restoreElementStyles]);

  const handleSkip = useCallback(() => {
    // Always dismiss when user skips tour to prevent auto-restart
    // User explicitly chose to skip, so respect that decision
    dismissTour();
    restoreElementStyles();
    setIsVisible(false);
    setHighlightRect(null);
    setIsTransitioning(false);
    onClose?.();
  }, [onClose, restoreElementStyles]);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 200);
    } else {
      handleDone();
    }
  }, [currentStep, handleDone]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 200);
    }
  }, [currentStep]);

  // Debounced update function
  const updateHighlight = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (!isVisible || currentStep >= tourSteps.length) return;

      const step = tourSteps[currentStep];
      let targetElement: HTMLElement | null = null;

      if (step.target === 'body') {
        setHighlightRect(null);
        return;
      }

      targetElement = document.querySelector(step.target) as HTMLElement;

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightRect(rect);
      }
      // Don't auto-skip if element not found - just don't highlight
      // The step will still be shown to the user
    }, 100);
  }, [currentStep, isVisible]);

  // Update highlight when step changes
  useEffect(() => {
    if (!isVisible || currentStep >= tourSteps.length) return;

    const step = tourSteps[currentStep];
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 300;

    const findAndHighlightElement = () => {
      if (step.target === 'body') {
        setHighlightRect(null);
        setIsTransitioning(false);
        // Restore previous element styles if any
        if (highlightedElementRef.current && originalStylesRef.current) {
          highlightedElementRef.current.style.zIndex = originalStylesRef.current.zIndex || '';
          if (originalStylesRef.current.position) {
            highlightedElementRef.current.style.position = originalStylesRef.current.position;
          }
          highlightedElementRef.current = null;
          originalStylesRef.current = null;
        }
        return;
      }

      // Restore previous element styles if any
      if (highlightedElementRef.current && originalStylesRef.current) {
        highlightedElementRef.current.style.zIndex = originalStylesRef.current.zIndex || '';
        if (originalStylesRef.current.position) {
          highlightedElementRef.current.style.position = originalStylesRef.current.position;
        }
      }

      const targetElement = document.querySelector(step.target) as HTMLElement;

      if (targetElement) {
        setIsTransitioning(true);
        
        // Store original styles and bring element to front
        const computedStyle = window.getComputedStyle(targetElement);
        const wasStatic = computedStyle.position === 'static';
        originalStylesRef.current = {
          zIndex: targetElement.style.zIndex || computedStyle.zIndex || 'auto',
          position: wasStatic ? 'static' : (targetElement.style.position || computedStyle.position || 'auto'),
        };
        highlightedElementRef.current = targetElement;
        
        // Ensure element has positioning context for z-index to work
        if (wasStatic) {
          targetElement.style.position = 'relative';
        }
        
        // Bring element above tour overlay (z-index 9998) and tooltip (z-index 10000)
        targetElement.style.zIndex = '10001';
        
        // Smooth scroll to element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });

        // Wait for scroll and update highlight
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          setHighlightRect(rect);
          setIsTransitioning(false);
        }, 600);
      } else {
        // Element not found - retry a few times before giving up
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(findAndHighlightElement, retryDelay);
        } else {
          // After retries, just show the step without highlighting (don't auto-skip)
          setHighlightRect(null);
          setIsTransitioning(false);
          console.warn(`Tour step "${step.id}" target element not found: ${step.target}`);
        }
      }
    };

    // Initial attempt
    findAndHighlightElement();

    // Update on window resize/scroll
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      // Restore element styles when step changes or tour closes
      restoreElementStyles();
    };
  }, [currentStep, isVisible, updateHighlight, restoreElementStyles]);

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        handleSkip();
      } else if (e.key === 'ArrowRight' && currentStep < tourSteps.length - 1) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        e.preventDefault();
        handlePrevious();
      }
    };

    // Use capture phase to ensure we catch the event before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible, currentStep, handleSkip, handleNext, handlePrevious]);

  // Focus management
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const firstButton = tooltipRef.current.querySelector('button') as HTMLElement;
      if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
      }
    }
  }, [isVisible, currentStep]);

  if (!isVisible || currentStep >= tourSteps.length) {
    return null;
  }

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isWelcomeStep = step.target === 'body';

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Swipe gesture handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchEndXRef.current = null;
    isSwipingRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartXRef.current || !touchStartYRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;
    
    // Only prevent default for horizontal swipes (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwipingRef.current = true;
      e.preventDefault();
    }
    
    touchEndXRef.current = touch.clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartXRef.current || !touchStartYRef.current) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchEndXRef.current = null;
      isSwipingRef.current = false;
      return;
    }
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    
    const deltaX = touchStartXRef.current - endX;
    const deltaY = touchStartYRef.current - endY;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    // Check if it's a clear horizontal swipe (more horizontal than vertical, and significant distance)
    const isHorizontalSwipe = horizontalDistance > verticalDistance && horizontalDistance > 20;
    
    // Only trigger if it's a clear horizontal swipe with minimum distance
    if (isHorizontalSwipe && horizontalDistance > minSwipeDistance) {
      const isLeftSwipe = deltaX > 0; // Swiping left (start > end)
      const isRightSwipe = deltaX < 0; // Swiping right (start < end)
      
      if (isLeftSwipe && currentStep < tourSteps.length - 1) {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      } else if (isRightSwipe && currentStep > 0) {
        e.preventDefault();
        e.stopPropagation();
        handlePrevious();
      }
    }
    
    // Reset touch states
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    isSwipingRef.current = false;
  };

  // Calculate tooltip position with better mobile support
  const getTooltipPosition = () => {
    if (isWelcomeStep || !highlightRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90vw',
        actualPosition: 'center' as const,
      };
    }

    const position = step.position || 'bottom';
    const padding = isMobile ? 12 : 16;
    const tooltipWidth = isMobile ? Math.min(340, window.innerWidth - 24) : Math.min(380, window.innerWidth - 32);
    const tooltipHeight = isMobile ? 280 : 320;

    let top = 0;
    let left = 0;
    let transform = '';
    let actualPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' = position;

    switch (position) {
      case 'top':
        top = highlightRect.top - tooltipHeight - padding;
        left = highlightRect.left + highlightRect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = highlightRect.bottom + padding;
        left = highlightRect.left + highlightRect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = highlightRect.top + highlightRect.height / 2;
        left = highlightRect.left - tooltipWidth - padding;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = highlightRect.top + highlightRect.height / 2;
        left = highlightRect.right + padding;
        transform = 'translate(0, -50%)';
        break;
      default:
        top = highlightRect.top + highlightRect.height / 2;
        left = highlightRect.left + highlightRect.width / 2;
        transform = 'translate(-50%, -50%)';
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (isMobile) {
      // On mobile, center the tooltip
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding));
      if (top < padding) {
        top = highlightRect.bottom + padding;
        transform = 'translate(-50%, 0)';
        actualPosition = 'bottom';
      }
      if (top + tooltipHeight > viewportHeight - padding) {
        top = Math.max(padding, highlightRect.top - tooltipHeight - padding);
        transform = 'translate(-50%, -100%)';
        actualPosition = 'top';
      }
    } else {
      // Desktop positioning with smart flipping
      // Handle horizontal positioning
      if (left < padding) left = padding;
      if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
      
      // Handle vertical positioning with smart flipping
      if (position === 'top') {
        // Check if there's enough space above
        const spaceAbove = highlightRect.top;
        const spaceBelow = viewportHeight - highlightRect.bottom;
        
        if (spaceAbove < tooltipHeight + padding && spaceBelow > spaceAbove) {
          // Not enough space above, flip to bottom if more space below
          top = highlightRect.bottom + padding;
          transform = 'translate(-50%, 0)';
          actualPosition = 'bottom';
        } else if (top < padding) {
          // Ensure tooltip doesn't go above viewport
          top = padding;
        }
      } else if (position === 'bottom') {
        // Check if there's enough space below
        const spaceBelow = viewportHeight - highlightRect.bottom;
        const spaceAbove = highlightRect.top;
        
        if (spaceBelow < tooltipHeight + padding && spaceAbove > spaceBelow) {
          // Not enough space below, flip to top if more space above
          top = highlightRect.top - tooltipHeight - padding;
          transform = 'translate(-50%, -100%)';
          actualPosition = 'top';
        } else if (top + tooltipHeight > viewportHeight - padding) {
          // Ensure tooltip doesn't go below viewport
          top = viewportHeight - tooltipHeight - padding;
        }
      }
      
      // Final safety check - ensure tooltip is always within viewport
      if (top < padding) {
        top = padding;
      }
      if (top + tooltipHeight > viewportHeight - padding) {
        top = Math.max(padding, viewportHeight - tooltipHeight - padding);
      }
    }

    return { 
      top: `${top}px`, 
      left: `${left}px`, 
      transform, 
      maxWidth: `${tooltipWidth}px`,
      actualPosition 
    };
  };

  const tooltipPositionData = getTooltipPosition();
  const tooltipStyle = {
    top: tooltipPositionData.top,
    left: tooltipPositionData.left,
    transform: tooltipPositionData.transform,
    maxWidth: tooltipPositionData.maxWidth,
  };
  const actualPosition = tooltipPositionData.actualPosition;

  return (
    <>
      {/* Overlay with cutout for highlighted element */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        onClick={handleSkip}
        style={{
          background: highlightRect
            ? `radial-gradient(ellipse ${Math.max(highlightRect.width + 60, 200)}px ${Math.max(highlightRect.height + 60, 200)}px at ${highlightRect.left + highlightRect.width / 2}px ${highlightRect.top + highlightRect.height / 2}px, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.75) 100%)`
            : 'rgba(0, 0, 0, 0.75)',
          // Removed backdropFilter to prevent blur on highlighted elements
        }}
        aria-hidden="true"
      />

      {/* Highlight border around target element */}
      {highlightRect && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-500"
          style={{
            top: `${highlightRect.top - 6}px`,
            left: `${highlightRect.left - 6}px`,
            width: `${highlightRect.width + 12}px`,
            height: `${highlightRect.height + 12}px`,
            border: '3px solid #0d9488',
            borderRadius: '12px',
            boxShadow: `
              0 0 0 9999px rgba(0, 0, 0, 0.4),
              0 0 0 4px rgba(13, 148, 136, 0.3),
              0 0 20px rgba(13, 148, 136, 0.4),
              inset 0 0 20px rgba(13, 148, 136, 0.1)
            `,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] pointer-events-auto transition-all duration-300"
        style={{
          ...tooltipStyle,
          opacity: isTransitioning ? 0.5 : 1,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
          style={{ touchAction: 'pan-y pinch-zoom' }}
          onTouchStart={(e) => {
            // Allow button clicks to work normally
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) {
              return;
            }
            onTouchStart(e);
          }}
          onTouchMove={(e) => {
            // Allow button interactions
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) {
              return;
            }
            onTouchMove(e);
          }}
          onTouchEnd={(e) => {
            // Allow button clicks to work normally
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.closest('button')) {
              return;
            }
            onTouchEnd(e);
          }}
        >
          {/* Header with Step indicator, Percentage, and Close button */}
          <div className="flex items-center justify-between mb-6">
            {/* Step indicator on left */}
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            
            {/* Percentage and Close button on right */}
            <div className="flex items-center gap-3">
              {/* Percentage */}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
              </span>
              
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="w-7 h-7 flex items-center justify-center border-2 border-primary-500 dark:border-primary-400 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-primary-600 dark:hover:border-primary-300 transition-all duration-200"
                aria-label="Close tour"
                title="Close (Esc)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentStep
                      ? 'flex-1 bg-primary-500 shadow-lg shadow-primary-500/50'
                      : index < currentStep
                      ? 'w-2 bg-primary-700 dark:bg-primary-700'
                      : 'w-2 bg-gray-600 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            {step.icon && (
              <div className="text-center mb-4">
                <div className="text-5xl md:text-6xl inline-block animate-bounce" style={{ animationDuration: '2s' }}>
                  {step.icon}
                </div>
              </div>
            )}
            <h3
              id="tour-title"
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center"
            >
              {step.title}
            </h3>
            <p
              id="tour-content"
              className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-left"
            >
              {step.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile: Next button first, Desktop: Skip on left */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto order-1">
              {/* Primary action button - Full width on mobile, larger touch target */}
              <button
                onClick={isLastStep ? handleDone : handleNext}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 text-base sm:text-sm font-bold bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                aria-label={isLastStep ? 'Finish tour' : 'Next step'}
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </button>
              
              {/* Previous button - Full width on mobile, only if not first step */}
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 text-base sm:text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                  aria-label="Previous step"
                >
                  <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
              )}
            </div>

            {/* Skip Tour - Text link, bottom on mobile, left on desktop */}
            <button
              onClick={handleSkip}
              className="text-sm font-medium text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-center sm:text-left order-2 sm:order-1 px-0 py-2 sm:py-0 bg-transparent hover:bg-transparent active:opacity-70"
            >
              Skip Tour
            </button>
          </div>

          {/* Navigation hint - Different for mobile and desktop */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {isMobile ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                <span>Swipe</span>
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <span>or</span>
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span>to navigate</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Use <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">←</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">→</kbd> to navigate • <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd> to skip
              </p>
            )}
          </div>
        </div>

        {/* Arrow pointing to element */}
        {highlightRect && actualPosition && actualPosition !== 'center' && (
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              ...(actualPosition === 'bottom' && {
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '-1px',
              }),
              ...(actualPosition === 'top' && {
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '-1px',
              }),
              ...(actualPosition === 'left' && {
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: '-1px',
              }),
              ...(actualPosition === 'right' && {
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginRight: '-1px',
              }),
            }}
          >
            <div
              className={`w-0 h-0 border-8 border-transparent ${
                actualPosition === 'bottom'
                  ? 'border-b-white dark:border-b-gray-800'
                  : actualPosition === 'top'
                  ? 'border-t-white dark:border-t-gray-800'
                  : actualPosition === 'left'
                  ? 'border-l-white dark:border-l-gray-800'
                  : 'border-r-white dark:border-r-gray-800'
              }`}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 
              0 0 0 9999px rgba(0, 0, 0, 0.4),
              0 0 0 4px rgba(13, 148, 136, 0.3),
              0 0 20px rgba(13, 148, 136, 0.4),
              inset 0 0 20px rgba(13, 148, 136, 0.1);
          }
          50% {
            box-shadow: 
              0 0 0 9999px rgba(0, 0, 0, 0.4),
              0 0 0 6px rgba(13, 148, 136, 0.5),
              0 0 30px rgba(13, 148, 136, 0.6),
              inset 0 0 30px rgba(13, 148, 136, 0.2);
          }
        }
      `}</style>
    </>
  );
}
