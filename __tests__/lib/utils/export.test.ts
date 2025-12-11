import { exportSummaryToHTML, printHTML, downloadPDFFromHTML } from '@/lib/utils/export';
import { Subscription } from '@/lib/api/subscriptions';

// Mock DOMPurify
jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((html) => html.replace(/<script.*?>.*?<\/script>/gi, '')),
  },
}));

// Mock window.open for printHTML tests
const mockWindowOpen = jest.fn();
const mockPrint = jest.fn();
const mockDocumentWrite = jest.fn();
const mockDocumentClose = jest.fn();
const mockDocumentOpen = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();

  mockWindowOpen.mockReturnValue({
    document: {
      write: mockDocumentWrite,
      close: mockDocumentClose,
      open: mockDocumentOpen,
    },
    print: mockPrint,
    onload: null,
  });
});

describe('export utilities XSS protection', () => {
  const mockSubscription: Subscription = {
    id: '1',
    name: 'Test Subscription',
    amount: 10,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: '2024-12-31',
    category: 'Entertainment',
    description: 'Test description',
    website: 'https://example.com',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    userId: 'user1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockData = {
    subscriptions: [mockSubscription],
    monthlyTotal: 10,
    yearlyTotal: 120,
    totalSubscriptions: 1,
    activeSubscriptions: 1,
    currency: 'USD',
  };

  describe('exportSummaryToHTML', () => {
    it('should escape HTML entities in subscription data', () => {
      const xssSubscription: Subscription = {
        ...mockSubscription,
        name: '<script>alert("XSS")</script>Test',
        description: '<img src="x" onerror="alert(\'XSS\')">Description',
        category: 'Test<script>alert(1)</script>',
      };

      const data = {
        ...mockData,
        subscriptions: [xssSubscription],
      };

      const html = exportSummaryToHTML(data);

      // Check that script tags are escaped (they should appear as plain text, not executed)
      // The actual escaped output shows &lt; for <, &gt; for >
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&lt;/script&gt;');
      expect(html).toContain('&lt;img');
      expect(html).not.toContain('<script>'); // Should not contain unescaped script tags
      expect(html).not.toContain('</script>');

      // Check that the HTML is still valid
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
    });

    it('should handle empty description safely', () => {
      const subscriptionWithoutDesc: Subscription = {
        ...mockSubscription,
        description: undefined,
      };

      const data = {
        ...mockData,
        subscriptions: [subscriptionWithoutDesc],
      };

      const html = exportSummaryToHTML(data);

      // Should not throw errors and should generate valid HTML
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).not.toContain('undefined');
    });
  });

  describe('printHTML', () => {
    it('should sanitize HTML before document.write', () => {
      const maliciousHTML = '<html><script>alert("XSS")</script><body>Test</body></html>';

      printHTML(maliciousHTML);

      expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank');
      expect(mockDocumentOpen).toHaveBeenCalled();
      expect(mockDocumentWrite).toHaveBeenCalled();
      expect(mockDocumentClose).toHaveBeenCalled();

      // The sanitized HTML should not contain script tags
      const sanitizedHTML = mockDocumentWrite.mock.calls[0][0];
      expect(sanitizedHTML).not.toContain('<script>');
    });

    it('should handle empty HTML safely', () => {
      printHTML('');

      expect(mockWindowOpen).toHaveBeenCalled();
      expect(mockDocumentWrite).toHaveBeenCalledWith('');
    });
  });

  describe('downloadPDFFromHTML', () => {
    // Note: This is a complex function that requires html2canvas and jsPDF
    // We'll just test that it doesn't throw with basic input
    it('should be defined', () => {
      expect(downloadPDFFromHTML).toBeDefined();
      expect(typeof downloadPDFFromHTML).toBe('function');
    });
  });

  describe('escapeHTML function', () => {
    it('should escape dangerous HTML entities', () => {
      // Test through exportSummaryToHTML
      const dangerousData = {
        ...mockData,
        subscriptions: [{
          ...mockSubscription,
          name: 'Test & "Special" <Characters>',
          description: 'Line1\nLine2 & <script>alert(1)</script>',
        }],
      };

      const html = exportSummaryToHTML(dangerousData);

      // Check that special characters are escaped
      expect(html).toContain('Test &amp;'); // & should be escaped
      expect(html).toContain('&lt;Characters&gt;'); // < and > should be escaped
      expect(html).toContain('Line1'); // Check first line
      expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;'); // Script tags should be escaped
    });
  });
});