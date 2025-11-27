'use client';

import React, { useState } from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { exportToCSV, exportSummaryToHTML, printHTML, downloadHTML, downloadPDFFromHTML } from '@/lib/utils/export';
import { Button } from '../ui/Button';
import { useToast } from '@/lib/context/ToastContext';

interface ExportButtonProps {
  subscriptions: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
  currency?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  subscriptions,
  monthlyTotal,
  yearlyTotal,
  currency,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { showToast } = useToast();

  const handleExportCSV = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      exportToCSV(subscriptions, `subscriptions-${timestamp}.csv`);
      showToast('CSV exported successfully', 'success');
    } catch (e) {
      showToast('Failed to export CSV', 'error');
      // eslint-disable-next-line no-console
      console.error('CSV export failed:', e);
    } finally {
      setShowMenu(false);
    }
  };

  const handleExportHTML = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const htmlContent = exportSummaryToHTML({
        subscriptions,
        monthlyTotal,
        yearlyTotal,
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: subscriptions.filter(s => s.isActive).length,
        currency,
      });
      downloadHTML(htmlContent, `subscription-report-${timestamp}.html`);
      showToast('HTML report downloaded', 'success');
    } catch (e) {
      showToast('Failed to export HTML', 'error');
      // eslint-disable-next-line no-console
      console.error('HTML export failed:', e);
    } finally {
      setShowMenu(false);
    }
  };

  const handlePrint = () => {
    try {
      const htmlContent = exportSummaryToHTML({
        subscriptions,
        monthlyTotal,
        yearlyTotal,
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: subscriptions.filter(s => s.isActive).length,
        currency,
      });
      printHTML(htmlContent);
      showToast('Opening print dialog…', 'info');
    } catch (e) {
      showToast('Failed to open print dialog', 'error');
      // eslint-disable-next-line no-console
      console.error('Print failed:', e);
    } finally {
      setShowMenu(false);
    }
  };

  const handleExportPDF = async () => {
    if (isGeneratingPDF) return;
    
    try {
      setIsGeneratingPDF(true);
      showToast('Generating PDF…', 'info');
      const timestamp = new Date().toISOString().split('T')[0];
      const htmlContent = exportSummaryToHTML({
        subscriptions,
        monthlyTotal,
        yearlyTotal,
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: subscriptions.filter(s => s.isActive).length,
        currency,
      });
      await downloadPDFFromHTML(htmlContent, `subscription-report-${timestamp}.pdf`);
      showToast('PDF exported successfully', 'success');
    } catch (e) {
      showToast('Failed to export PDF', 'error');
      // eslint-disable-next-line no-console
      console.error('PDF export failed:', e);
    } finally {
      setIsGeneratingPDF(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export</span>
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20">
            <button
              onClick={handleExportCSV}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export as CSV</span>
            </button>
            
            <button
              onClick={handleExportHTML}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Export as HTML</span>
            </button>
            
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF}
              className={`w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 ${
                isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 0-2.486.293-3.121a3 3 0 011.586-1.586C14.514 6 15.343 6 17 6h1a2 2 0 012 2v8a2 2 0 01-2 2H7m5-7H7m5 0v6m0-6l-3 3" />
                  </svg>
                  <span>Export as PDF</span>
                </>
              )}
            </button>
            
            <button
              onClick={handlePrint}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Report</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

