import { useState, useEffect, useRef } from 'react';

interface UseCounterOptions {
  duration?: number;
  startOnMount?: boolean;
  decimals?: number;
  triggerOnVisible?: boolean;
  elementRef?: React.RefObject<HTMLElement>;
}

/**
 * Custom hook for animating numbers from 0 to a target value
 * @param targetValue - The final value to count to
 * @param options - Configuration options
 * @returns The current animated value
 */
export function useCounter(
  targetValue: number,
  options: UseCounterOptions = {}
): number {
  const { 
    duration = 2000, 
    startOnMount = false, 
    decimals = 1,
    triggerOnVisible = true,
    elementRef
  } = options;
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(!triggerOnVisible);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const targetValueRef = useRef(targetValue);
  const hasAnimatedRef = useRef(false);

  // Update target value ref when it changes
  useEffect(() => {
    targetValueRef.current = targetValue;
  }, [targetValue]);

  // Intersection Observer for visibility
  useEffect(() => {
    if (!triggerOnVisible || !elementRef?.current) {
      if (startOnMount) {
        setIsVisible(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px',
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnVisible, elementRef, startOnMount]);

  // Animation effect
  useEffect(() => {
    // Clean up any existing animation
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!isVisible || hasAnimatedRef.current) {
      return;
    }

    // Reset state
    setCount(0);
    startTimeRef.current = null;
    hasAnimatedRef.current = true;

    // Small delay to ensure everything is ready
    const timeoutId = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = targetValueRef.current * easeOut;
        
        setCount(currentValue);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCount(targetValueRef.current);
        }
      };

      // Start animation
      rafRef.current = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isVisible, duration]); // Only depend on isVisible and duration

  // Format the number with appropriate decimals
  const formattedCount = parseFloat(count.toFixed(decimals));

  return formattedCount;
}

/**
 * Parse a string value to extract the numeric value for counter animation
 * Handles formats like: "99.9%", "2.5M+", "3+", "12 hrs", etc.
 */
export function parseCounterValue(value: string): { number: number; suffix: string } {
  // Remove common suffixes and extract number
  const cleanValue = value.trim();
  
  // Handle percentage
  if (cleanValue.includes('%')) {
    const num = parseFloat(cleanValue.replace('%', ''));
    return { number: num, suffix: '%' };
  }
  
  // Handle "M+" (millions)
  if (cleanValue.includes('M+') || cleanValue.includes('M')) {
    const num = parseFloat(cleanValue.replace(/M\+?/g, ''));
    return { number: num * 1000000, suffix: 'M+' };
  }
  
  // Handle "K+" (thousands)
  if (cleanValue.includes('K+') || cleanValue.includes('K')) {
    const num = parseFloat(cleanValue.replace(/K\+?/g, ''));
    return { number: num * 1000, suffix: 'K+' };
  }
  
  // Handle "+" suffix
  if (cleanValue.includes('+')) {
    const num = parseFloat(cleanValue.replace('+', ''));
    return { number: num, suffix: '+' };
  }
  
  // Handle "hrs" or "hr"
  if (cleanValue.includes('hrs') || cleanValue.includes('hr')) {
    const num = parseFloat(cleanValue.replace(/hrs?/g, '').trim());
    return { number: num, suffix: ' hrs' };
  }
  
  // Try to parse as regular number
  const num = parseFloat(cleanValue);
  if (!isNaN(num)) {
    return { number: num, suffix: '' };
  }
  
  return { number: 0, suffix: value };
}

/**
 * Format a number back to its original display format
 */
export function formatCounterValue(value: number, originalValue: string): string {
  const parsed = parseCounterValue(originalValue);
  
  if (parsed.suffix === '%') {
    return `${value.toFixed(1)}%`;
  }
  
  if (parsed.suffix === 'M+') {
    const millions = value / 1000000;
    return `${millions.toFixed(1)}M+`;
  }
  
  if (parsed.suffix === 'K+') {
    const thousands = value / 1000;
    return `${thousands.toFixed(1)}K+`;
  }
  
  if (parsed.suffix === '+') {
    return `${Math.floor(value)}+`;
  }
  
  if (parsed.suffix.includes('hr')) {
    return `${Math.floor(value)}${parsed.suffix}`;
  }
  
  // For plain numbers, use appropriate decimal places
  if (parsed.suffix === '') {
    // If original had decimals, preserve them
    const originalNum = parseFloat(originalValue);
    if (!isNaN(originalNum) && originalNum % 1 !== 0) {
      return value.toFixed(1);
    }
    return Math.floor(value).toString();
  }
  
  return `${value.toFixed(1)}${parsed.suffix}`;
}

