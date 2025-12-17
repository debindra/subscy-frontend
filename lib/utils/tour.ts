/**
 * Tour utility functions for managing dashboard tour dismissal state
 */

const TOUR_DISMISSED_KEY = 'subsy_dashboard_tour_dismissed';
const TOUR_SEEN_KEY = 'subsy_dashboard_tour_seen';

export function isTourDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TOUR_DISMISSED_KEY) === 'true';
}

export function hasSeenTour(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TOUR_SEEN_KEY) === 'true';
}

export function dismissTour(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOUR_DISMISSED_KEY, 'true');
  markTourAsSeen();
}

export function markTourAsSeen(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOUR_SEEN_KEY, 'true');
}

export function resetTour(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOUR_DISMISSED_KEY);
  localStorage.removeItem(TOUR_SEEN_KEY);
}

export function shouldShowTourOnFirstLogin(): boolean {
  if (typeof window === 'undefined') return false;
  // Show tour only if user hasn't seen it and hasn't dismissed it
  return !hasSeenTour() && !isTourDismissed();
}

