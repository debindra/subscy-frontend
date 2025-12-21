'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { CategorySpending, MonthlyTrend } from '@/lib/api/analytics';
import { Card } from '../ui/Card';
import { useTheme } from '@/lib/context/ThemeContext';
import { useExchangeRates, calculateConversion } from '@/lib/hooks/useExchangeRates';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';
import { useSubscriptions } from '@/lib/hooks/useSubscriptions';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title);

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch subscriptions to calculate category-specific monthly trends
  const { data: subscriptions = [] } = useSubscriptions();
  
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

  // Calculate category-specific monthly trends from subscription data
  const categoryMonthlyTrend = useMemo(() => {
    if (!selectedCategory || subscriptions.length === 0) {
      return null; // Return null to use the default monthlyData
    }

    // Get month labels from the original monthlyData
    const monthLabels = monthlyData.map((item) => item.month);
    
    // Calculate monthly totals for the selected category
    const categoryTrend = monthLabels.map((monthLabel) => {
      // Parse month label (e.g., "Jan 2024")
      const [monthName, yearStr] = monthLabel.split(' ');
      const year = parseInt(yearStr, 10);
      
      // Map month abbreviations to indices (0-11)
      const monthAbbrMap: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const monthIndex = monthAbbrMap[monthName] ?? 0;
      
      // Calculate month start and end
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
      
      let monthTotal = 0.0;
      
      for (const sub of subscriptions) {
        // Only include subscriptions in the selected category that are active
        if (sub.category !== selectedCategory || !sub.isActive) {
          continue;
        }
        
        // Check if subscription existed by the end of this month
        const createdAt = new Date(sub.createdAt);
        if (createdAt > monthEnd) {
          continue;
        }
        
        // Calculate monthly amount based on billing cycle
        let monthlyAmount = sub.amount;
        if (sub.billingCycle === 'yearly') {
          monthlyAmount = sub.amount / 12;
        } else if (sub.billingCycle === 'quarterly') {
          monthlyAmount = sub.amount / 3;
        } else if (sub.billingCycle === 'weekly') {
          monthlyAmount = sub.amount * 4.33;
        }
        
        monthTotal += monthlyAmount;
      }
      
      return {
        month: monthLabel,
        total: Math.round(monthTotal * 100) / 100,
      };
    });
    
    return categoryTrend;
  }, [selectedCategory, subscriptions, monthlyData]);

  // Convert monthly data amounts to preferred currency
  // Use category-specific trend if a category is selected, otherwise use default monthlyData
  const displayMonthlyData = useMemo(() => {
    const dataToUse = categoryMonthlyTrend || monthlyData;
    
    if (!needsConversion || !ratesData?.rates || ratesLoading) {
      return dataToUse;
    }

    try {
      return dataToUse.map((item) => ({
        ...item,
        total: calculateConversion(item.total, fromCurrency, targetCurrency, ratesData.rates, 'USD'),
      }));
    } catch (error) {
      console.error('Error converting monthly data:', error);
      return dataToUse;
    }
  }, [categoryMonthlyTrend, monthlyData, needsConversion, ratesData?.rates, ratesLoading, targetCurrency, fromCurrency]);

  // Get the color of the selected category from the pie chart
  const selectedCategoryColor = useMemo(() => {
    if (!selectedCategory) {
      return '#0d9488'; // Default primary-600 color (hex format)
    }
    
    const categoryIndex = convertedCategoryData.findIndex(
      (item) => item.category === selectedCategory
    );
    
    if (categoryIndex >= 0 && categoryIndex < pieColors.length) {
      return pieColors[categoryIndex];
    }
    
    return '#0d9488'; // Fallback to default primary-600 color (hex format)
  }, [selectedCategory, convertedCategoryData, pieColors]);

  // Convert hex color to rgba with opacity for background
  const getRgbaColor = (hexColor: string, opacity: number = 1) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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

  const lineData = {
    labels: displayMonthlyData.map((item) => item.month),
    datasets: [
      {
        label: selectedCategory 
          ? `Monthly Spending - ${selectedCategory}` 
          : 'Monthly Spending',
        data: displayMonthlyData.map((item) => item.total),
        // Use selected category color, or default primary color
        borderColor: selectedCategoryColor,
        backgroundColor: getRgbaColor(selectedCategoryColor, 0.1), // Low opacity for fill
        borderWidth: 3,
        pointBackgroundColor: selectedCategoryColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: selectedCategoryColor,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  // Handle pie chart click to filter by category
  const handlePieClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedCategory = convertedCategoryData[clickedIndex]?.category;
      
      // Toggle: if same category is clicked, reset to show all
      if (selectedCategory === clickedCategory) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(clickedCategory || null);
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handlePieClick,
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
        onClick: (e: any, legendItem: any, legend: any) => {
          // Prevent default legend click behavior (hiding data)
          const clickedCategory = convertedCategoryData[legendItem.index]?.category;
          
          // Toggle category selection
          if (selectedCategory === clickedCategory) {
            setSelectedCategory(null);
          } else {
            setSelectedCategory(clickedCategory || null);
          }
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
          title: function(context: any) {
            return context[0]?.label || 'Category';
          },
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `${label}`,
              `Amount: ${formatCurrency(value, targetCurrency)}`,
              `Percentage: ${percentage}%`,
              selectedCategory === label ? '(Selected - Click to deselect)' : '(Click to filter trend)',
            ];
          },
        },
      },
    },
  };

  const lineOptions = {
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
          title: function(context: any) {
            return context[0]?.label || 'Month';
          },
          label: function(context: any) {
            const value = context.parsed.y;
            const previousValue = context.dataset.data[context.dataIndex - 1];
            let changeText = '';
            if (previousValue !== undefined) {
              const change = value - previousValue;
              const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : '0.0';
              const isPositive = change >= 0;
              changeText = ` (${isPositive ? '+' : ''}${formatCurrency(change, targetCurrency)}, ${isPositive ? '+' : ''}${changePercent}%)`;
            }
            return [
              `Spending: ${formatCurrency(value, targetCurrency)}`,
              previousValue !== undefined ? `Change: ${changeText}` : '',
            ].filter(Boolean);
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
      <Card variant="glass" className="transition-all duration-300 transform hover:-translate-y-1 touch-manipulation">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Spending by Category</h3>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        {selectedCategory && (
          <div className="mb-3 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-between">
            <span className="text-sm text-primary-800 dark:text-primary-200 font-medium">
              Filtering by: <strong>{selectedCategory}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium underline"
            >
              Clear filter
            </button>
          </div>
        )}
        <div className="h-72 flex items-center justify-center">
          {convertedCategoryData.length > 0 && !ratesLoading ? (
            <Pie key={`pie-${chartKey}`} data={pieData} options={pieOptions} />
          ) : (
            <div className="text-center py-12 px-4">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Category Data Yet</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">
                Add subscriptions with categories to see your spending breakdown by category
              </p>
              <Link
                href="/dashboard/subscriptions"
                className="inline-flex items-center px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Subscription
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
        {convertedCategoryData.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Click a category slice or legend item to filter the monthly trend
          </p>
        )}
      </Card>

      <Card variant="glass" className="transition-all duration-300 transform hover:-translate-y-1 touch-manipulation">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Monthly Trend{selectedCategory ? ` - ${selectedCategory}` : ''}
          </h3>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
        <div className="h-72">
          {displayMonthlyData.length > 0 && !ratesLoading ? (
            <Line key={`line-${chartKey}-${selectedCategory || 'all'}`} data={lineData} options={lineOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Trend Data Yet</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">
                  Your monthly spending trends will appear here as you track your subscriptions over time
                </p>
                <Link
                  href="/dashboard/subscriptions"
                  className="inline-flex items-center px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  View Subscriptions
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

