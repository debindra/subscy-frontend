'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { subscriptionsApi, Subscription } from '@/lib/api/subscriptions';
import { formatCurrency, formatDate } from '@/lib/utils/format';

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
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionsApi.getAll();
        setSubs(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    setTooltip({
      entry,
      position: {
        top: rect.top,
        left: rect.left + rect.width / 2,
      },
    });
  };

  const hideTooltip = () => setTooltip(null);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">Renewals and trial end dates</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCursor(addMonths(cursor, -1))}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Prev
          </button>
          <div className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{monthName}</div>
          <button
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-2">{d}</div>
        ))}
        {matrix.flat().map((day) => {
          const isCurrentMonth = day.getMonth() === month;
          const key = day.toDateString();
          const items = itemsByDay.get(key) || [];
          return (
            <div
              key={key}
              className={`min-h-[110px] rounded-lg border p-2 flex flex-col space-y-1 overflow-hidden ${
                isCurrentMonth
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className={`text-xs font-medium ${isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((entry, idx) => (
                  <div
                    key={idx}
                    className={`text-xs truncate px-2 py-1 rounded ${
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
                {items.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">+{items.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
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
