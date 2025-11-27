'use client';

import React from 'react';
import { SubscriptionStats } from '@/lib/api/analytics';
import { useUpcomingSubscriptions } from '@/lib/hooks/useSubscriptions';
import { Card } from '../ui/Card';

interface SubscriptionSummaryCardsProps {
  stats: SubscriptionStats;
}

export const SubscriptionSummaryCards: React.FC<SubscriptionSummaryCardsProps> = ({ stats }) => {
  const { data: upcomingSubscriptions = [] } = useUpcomingSubscriptions();

  const cards = [
    {
      title: 'Total Subscriptions',
      value: stats.total,
      description: `${stats.active} active • ${stats.inactive} inactive`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Subscriptions',
      value: stats.active,
      description: `${Math.round((stats.active / stats.total) * 100)}% of total`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Upcoming Renewals',
      value: upcomingSubscriptions.length,
      description: 'Next 7 days',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Categories',
      value: stats.categories,
      description: 'Unique categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.description}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 dark:bg-opacity-20 ${card.textColor}`}>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};