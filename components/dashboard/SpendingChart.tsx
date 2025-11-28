'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { Card } from '../ui/Card';
import { useTheme } from '@/lib/context/ThemeContext';
import { useExchangeRates, calculateConversion } from '@/lib/hooks/useExchangeRates';
import { formatCurrency } from '@/lib/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface SpendingChartProps {
  categoryData: CategorySpending[];
  monthlyData: MonthlyTrend[];
  preferredCurrency?: string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  categoryData,
  monthlyData,
  preferredCurrency = 'USD',
}) => {
  const { theme } = useTheme();
  const [chartKey, setChartKey] = useState(0);
  
  // Normalize preferred currency
  const targetCurrency = preferredCurrency?.toUpperCase() || 'USD';
  const fromCurrency = 'USD'; // Backend returns amounts in USD (or mixed, but we assume USD for conversion)
  
  // Fetch exchange rates if conversion is needed
  const needsConversion = targetCurrency !== fromCurrency;
  const { data: ratesData, isLoading: ratesLoading } = useExchangeRates({
    baseCurrency: 'USD',
    targetCurrencies: needsConversion ? [targetCurrency] : undefined,
  });

  // Force chart re-render when theme changes
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [theme]);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)';

  // Brand-based color palettes for charts
  const brandPrimaryShades = [
    '#0d9488', // primary-600 main brand
    '#14b8a6', // primary-500
    '#0f766e', // primary-700
    '#115e59', // primary-800
    '#2dd4bf', // primary-400
    '#5eead4', // primary-300
  ];

  const brandAccentShades = [
    '#f97316', // brand-accent-500
    '#ea580c', // brand-accent-600
    '#c2410c', // brand-accent-700
    '#9a3412', // brand-accent-800
    '#fb923c', // brand-accent-400
    '#fdba74', // brand-accent-300
  ];

  const pieColors = categoryData.map((_, index) => {
    const palette = index % 2 === 0 ? brandPrimaryShades : brandAccentShades;
    return palette[index % palette.length];
  });

  // Convert category data amounts to preferred currency
  const convertedCategoryData = useMemo(() => {
    if (!needsConversion || !ratesData?.rates || ratesLoading) {
      return categoryData;
    }

    try {
      return categoryData.map((item) => ({
        ...item,
        amount: calculateConversion(item.amount, fromCurrency, targetCurrency, ratesData.rates, 'USD'),
      }));
    } catch (error) {
      console.error('Error converting category data:', error);
      return categoryData;
    }
  }, [categoryData, needsConversion, ratesData?.rates, ratesLoading, targetCurrency, fromCurrency]);

  // Convert monthly data amounts to preferred currency
  const convertedMonthlyData = useMemo(() => {
    if (!needsConversion || !ratesData?.rates || ratesLoading) {
      return monthlyData;
    }

    try {
      return monthlyData.map((item) => ({
        ...item,
        total: calculateConversion(item.total, fromCurrency, targetCurrency, ratesData.rates, 'USD'),
      }));
    } catch (error) {
      console.error('Error converting monthly data:', error);
      return monthlyData;
    }
  }, [monthlyData, needsConversion, ratesData?.rates, ratesLoading, targetCurrency, fromCurrency]);

  const pieData = {
    labels: convertedCategoryData.map((item) => item.category),
    datasets: [
      {
        label: 'Monthly Spending',
        data: convertedCategoryData.map((item) => item.amount),
        backgroundColor: pieColors,
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: convertedMonthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Spending',
        data: convertedMonthlyData.map((item) => item.total),
        // Use brand primary color for bars
        backgroundColor: 'rgba(20, 184, 166, 0.8)', // primary-500
        borderColor: 'rgba(13, 148, 136, 1)', // primary-600
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(13, 148, 136, 1)',
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
            return `${label}: ${formatCurrency(value, targetCurrency)} (${percentage}%)`;
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
            return `Spending: ${formatCurrency(context.parsed.y, targetCurrency)}`;
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
            // Format currency without full formatting to keep it compact
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return formatCurrency(numValue, targetCurrency);
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
          {convertedCategoryData.length > 0 && !ratesLoading ? (
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
          {convertedMonthlyData.length > 0 && !ratesLoading ? (
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

