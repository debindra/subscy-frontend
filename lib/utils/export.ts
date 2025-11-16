import { Subscription } from '../api/subscriptions';
import { formatCurrency, formatDate } from './format';

export function exportToCSV(subscriptions: Subscription[], filename: string = 'subscriptions.csv') {
  // CSV headers
  const headers = [
    'Name',
    'Amount',
    'Currency',
    'Billing Cycle',
    'Next Renewal Date',
    'Category',
    'Description',
    'Website',
    'Active',
    'Reminder Enabled',
    'Reminder Days Before',
  ];

  // Convert subscriptions to CSV rows
  const rows = subscriptions.map(sub => [
    sub.name,
    sub.amount.toString(),
    sub.currency,
    sub.billingCycle,
    sub.nextRenewalDate,
    sub.category,
    sub.description || '',
    sub.website || '',
    sub.isActive ? 'Yes' : 'No',
    sub.reminderEnabled ? 'Yes' : 'No',
    sub.reminderDaysBefore.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface ExportSummaryData {
  subscriptions: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
}

export function exportSummaryToHTML(data: ExportSummaryData): string {
  const { subscriptions, monthlyTotal, yearlyTotal, totalSubscriptions, activeSubscriptions } = data;

  // Generate HTML for the summary
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Subscription Report - ${new Date().toLocaleDateString()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #ffffff;
      padding: 40px 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
      font-weight: 400;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: white;
      padding: 24px;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    .summary-card h3 {
      margin: 0 0 12px 0;
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .summary-card p {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }
    .subscriptions-list {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
    }
    .subscriptions-list h2 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f3f4f6;
    }
    .subscription-item {
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .subscription-item:last-child {
      border-bottom: none;
    }
    .subscription-info {
      flex: 1;
    }
    .subscription-info h4 {
      margin: 0 0 8px 0;
      color: #111827;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .subscription-info p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .subscription-amount {
      font-size: 20px;
      font-weight: 700;
      color: #4f46e5;
      white-space: nowrap;
      margin-left: 20px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .badge-active {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .footer p {
      margin: 4px 0;
    }
    @media print {
      body {
        background-color: white;
        padding: 20px;
      }
      .summary-card, .subscriptions-list {
        box-shadow: none;
        border: 1px solid #e5e7eb;
        page-break-inside: avoid;
      }
      .subscription-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 Subscription Report</h1>
      <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <h3>Monthly Total</h3>
        <p>${formatCurrency(monthlyTotal, 'USD')}</p>
      </div>
      <div class="summary-card">
        <h3>Yearly Total</h3>
        <p>${formatCurrency(yearlyTotal, 'USD')}</p>
      </div>
      <div class="summary-card">
        <h3>Total Subscriptions</h3>
        <p>${totalSubscriptions}</p>
      </div>
      <div class="summary-card">
        <h3>Active Subscriptions</h3>
        <p>${activeSubscriptions}</p>
      </div>
    </div>

    <div class="subscriptions-list">
      <h2>All Subscriptions</h2>
      ${subscriptions.map(sub => `
        <div class="subscription-item">
          <div class="subscription-info">
            <h4>
              ${sub.name}
              <span class="badge ${sub.isActive ? 'badge-active' : 'badge-inactive'}">
                ${sub.isActive ? 'Active' : 'Inactive'}
              </span>
            </h4>
            <p>${sub.category} • ${sub.billingCycle} • Next renewal: ${formatDate(sub.nextRenewalDate)}</p>
            ${sub.description ? `<p style="margin-top: 6px; color: #9ca3af;">${sub.description}</p>` : ''}
          </div>
          <div class="subscription-amount">
            ${formatCurrency(sub.amount, sub.currency)}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>This report was generated by SubTracker</p>
      <p>&copy; ${new Date().getFullYear()} All rights reserved</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function printHTML(htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export function downloadHTML(htmlContent: string, filename: string = 'subscription-report.html') {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate a PDF from the provided HTML content using html2canvas + jsPDF
export async function downloadPDFFromHTML(htmlContent: string, filename: string = 'subscription-report.pdf') {
  // Dynamically import to avoid SSR issues
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf') as unknown as Promise<{ jsPDF: any }>,
  ]);

  // Create a hidden container to render HTML for capture
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96 DPI approx
  container.style.background = '#ffffff';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const canvas = await html2canvas(container as HTMLElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: 794,
  });

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale image to fit page width (points). Compute how many canvas pixels fit per PDF page in height.
  const imgWidth = pageWidth;
  const scale = imgWidth / canvas.width; // points per pixel horizontally
  const pageHeightInPixels = Math.floor(pageHeight / scale); // pixels that fit vertically per page

  // Slice the big canvas into page-height chunks and render each as an image
  let offset = 0;
  let pageIndex = 0;
  while (offset < canvas.height) {
    const sliceHeight = Math.min(pageHeightInPixels, canvas.height - offset);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) break;

    ctx.drawImage(
      canvas,
      0,
      offset,
      canvas.width,
      sliceHeight,
      0,
      0,
      pageCanvas.width,
      pageCanvas.height
    );

    const pageImgData = pageCanvas.toDataURL('image/png');
    const pageImgHeightPts = sliceHeight * scale; // convert pixels to points using same scale

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, pageImgHeightPts);

    offset += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(filename);
  document.body.removeChild(container);
}

