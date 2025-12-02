'use client';

import React, { useMemo, useState } from 'react';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { createPortal } from 'react-dom';
import { Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useSubscriptions } from '@/lib/hooks/useSubscriptions';

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // Monday start

  const weeks: Date[][] = [];
  let current = new Date(startDay);
  while (current <= lastDay || current.getDay() !== 1) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (current > lastDay && current.getDay() === 1) break;
  }
  return weeks;
}

type CalendarEntry = { type: 'renewal' | 'trial'; sub: Subscription };

interface TooltipState {
  entry: CalendarEntry;
  position: {
    top: number;
    left: number;
  };
}

export default function CalendarPage() {
  usePageTitle('Calendar');
  const { data: subs = [], isLoading } = useSubscriptions();
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const s of subs) {
      const renewalKey = new Date(s.nextRenewalDate).toDateString();
      const arr = map.get(renewalKey) || [];
      arr.push({ type: 'renewal', sub: s });
      map.set(renewalKey, arr);
      if (s.isTrial && s.trialEndDate) {
        const trialKey = new Date(s.trialEndDate).toDateString();
        const arr2 = map.get(trialKey) || [];
        arr2.push({ type: 'trial', sub: s });
        map.set(trialKey, arr2);
      }
    }
    return map;
  }, [subs]);

  const showTooltip = (
    event: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
    entry: CalendarEntry,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 256; // w-64 = 256px
    const padding = 16; // Padding from viewport edge
    const centerX = rect.left + rect.width / 2;
    
    // Calculate the left position ensuring tooltip stays within viewport
    let left = centerX;
    const viewportWidth = window.innerWidth;
    
    // Check if tooltip would extend beyond left edge
    if (centerX - tooltipWidth / 2 < padding) {
      left = padding + tooltipWidth / 2;
    }
    // Check if tooltip would extend beyond right edge
    else if (centerX + tooltipWidth / 2 > viewportWidth - padding) {
      left = viewportWidth - padding - tooltipWidth / 2;
    }
    
    setTooltip({
      entry,
      position: {
        top: rect.top,
        left: left,
      },
    });
  };

  const hideTooltip = () => setTooltip(null);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="h-7 sm:h-9 w-full sm:w-48 md:w-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-16 sm:h-20 md:h-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Renewals and trial end dates</p>
        </div>
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
          <button
            onClick={() => setCursor(addMonths(cursor, -1))}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
            aria-label="Previous month"
          >
            Prev
          </button>
          <div className="px-3 sm:px-4 py-2 font-semibold text-gray-900 dark:text-white text-sm sm:text-base whitespace-nowrap">{monthName}</div>
          <button
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
            aria-label="Next month"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="grid grid-cols-7 gap-px sm:gap-1 md:gap-2 w-full">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div
              key={d}
              className="text-[10px] sm:text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-0.5 sm:px-2 text-center"
            >
              {d}
            </div>
          ))}
          {matrix.flat().map((day) => {
            const isCurrentMonth = day.getMonth() === month;
            const key = day.toDateString();
            const items = itemsByDay.get(key) || [];
            return (
              <div
                key={key}
                className={`min-h-[80px] sm:min-h-[110px] rounded-lg border p-1 sm:p-2 flex flex-col space-y-1 overflow-hidden ${
                  isCurrentMonth
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className={`text-xs sm:text-sm font-medium ${isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-0.5 sm:space-y-1 flex-1 overflow-hidden">
                  {items.slice(0, 2).map((entry, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] sm:text-xs truncate px-1 sm:px-2 py-0.5 sm:py-1 rounded ${
                        entry.type === 'trial'
                          ? 'bg-brand-accent-100 text-brand-accent-800 dark:bg-brand-accent-900/30 dark:text-brand-accent-300'
                          : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                      }`}
                      onMouseEnter={(event) => showTooltip(event, entry)}
                      onMouseLeave={hideTooltip}
                      onFocus={(event) => showTooltip(event, entry)}
                      onBlur={hideTooltip}
                      tabIndex={0}
                    >
                      {entry.type === 'trial' ? 'Trial: ' : ''}
                      {entry.sub.name}
                    </div>
                  ))}
                  {items.length > 2 && (
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">+{items.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {tooltip &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50"
            style={{ top: tooltip.position.top - 12, left: tooltip.position.left }}
          >
            <div className="-translate-x-1/2 -translate-y-full rounded-lg bg-gray-900 px-4 py-3 text-xs text-white shadow-xl ring-1 ring-black/10 max-w-xs w-64">
              <div className="text-sm font-semibold leading-tight">
                {tooltip.entry.sub.name}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-primary-300 font-medium">
                {tooltip.entry.type === 'trial' ? 'Trial Ends' : 'Renewal'} · {formatDate(
                  tooltip.entry.type === 'trial'
                    ? (tooltip.entry.sub.trialEndDate as string)
                    : tooltip.entry.sub.nextRenewalDate
                )}
              </div>
              <div className="mt-1 text-xs text-gray-200">
                {formatCurrency(tooltip.entry.sub.amount, tooltip.entry.sub.currency)} · {tooltip.entry.sub.billingCycle}
              </div>
              {tooltip.entry.sub.description && (
                <div className="mt-2 text-xs text-gray-300 line-clamp-3">
                  {tooltip.entry.sub.description}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
