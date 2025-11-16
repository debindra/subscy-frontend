'use client';

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { Card } from '../ui/Card';
import { useTheme } from '@/lib/context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface SpendingChartProps {
  categoryData: CategorySpending[];
  monthlyData: MonthlyTrend[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  categoryData,
  monthlyData,
}) => {
  const { theme } = useTheme();
  const [chartKey, setChartKey] = useState(0);

  // Force chart re-render when theme changes
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [theme]);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)';

  const pieData = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: 'Monthly Spending',
        data: categoryData.map((item) => item.amount),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlyData.map((item) => item.total),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Spending: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card variant="glass" className="transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spending by Category</h3>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center">
          {categoryData.length > 0 ? (
            <Pie key={`pie-${chartKey}`} data={pieData} options={pieOptions} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">📊</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No category data available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add subscriptions to see your spending breakdown</p>
            </div>
          )}
        </div>
      </Card>

      <Card variant="glass" className="transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Trend</h3>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="h-72">
          {monthlyData.length > 0 ? (
            <Bar key={`bar-${chartKey}`} data={barData} options={barOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">📈</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No trend data available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Your spending history will appear here</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

