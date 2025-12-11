import { useState, useEffect } from 'react';
import { TESTIMONIALS } from '@/lib/constants/landing';

/**
 * Custom hook for managing testimonial carousel state and logic
 * Handles responsive carousel behavior with automatic rotation
 * 
 * @param autoRotateInterval - Interval in milliseconds for auto-rotation (default: 5000)
 * @returns Object containing current index, window width, and transform function
 */
export function useTestimonialCarousel(autoRotateInterval: number = 5000) {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window width for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Auto-rotate testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotateInterval]);

  // Calculate carousel transform based on window width
  const getCarouselTransform = (): string => {
    if (windowWidth === 0) return 'translateX(0)';

    if (windowWidth >= 1024) {
      // Desktop: 3 cards visible
      return `translateX(-${currentTestimonialIndex * (100 / 3)}%)`;
    } else if (windowWidth >= 768) {
      // Tablet: 2 cards visible
      return `translateX(-${currentTestimonialIndex * 50}%)`;
    } else {
      // Mobile: 1 card visible
      return `translateX(-${currentTestimonialIndex * 100}%)`;
    }
  };

  return {
    currentTestimonialIndex,
    windowWidth,
    getCarouselTransform,
  };
}
