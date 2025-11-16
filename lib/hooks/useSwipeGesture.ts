'use client';

import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
  } = options;

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const xDistance = touchStart.current.x - touchEnd.current.x;
    const yDistance = touchStart.current.y - touchEnd.current.y;
    const isHorizontalSwipe = Math.abs(xDistance) > Math.abs(yDistance);

    if (isHorizontalSwipe) {
      if (xDistance > minSwipeDistance) {
        onSwipeLeft?.();
      } else if (xDistance < -minSwipeDistance) {
        onSwipeRight?.();
      }
    } else {
      if (yDistance > minSwipeDistance) {
        onSwipeUp?.();
      } else if (yDistance < -minSwipeDistance) {
        onSwipeDown?.();
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

