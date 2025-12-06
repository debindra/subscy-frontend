'use client';

import { usePostHog } from '@/lib/hooks/usePostHog';
import { useState } from 'react';

export default function TestPostHogPage() {
  const posthog = usePostHog();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicEvent = () => {
    try {
      posthog.capture('test_button_clicked', {
        button_name: 'test_basic_event',
        test_type: 'manual',
      });
      addResult('✅ Basic event captured: test_button_clicked');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testCustomEvent = () => {
    try {
      posthog.capture('subscription_created', {
        subscription_name: 'Test Subscription',
        amount: 29.99,
        currency: 'USD',
        test: true,
      });
      addResult('✅ Custom event captured: subscription_created');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testIdentify = () => {
    try {
      posthog.identify('test-user-123', {
        email: 'test@example.com',
        name: 'Test User',
        test: true,
      });
      addResult('✅ User identified: test-user-123');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const testReset = () => {
    try {
      posthog.reset();
      addResult('✅ PostHog reset (user session cleared)');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const checkPostHogStatus = () => {
    if (posthog.isLoaded) {
      addResult('✅ PostHog is initialized and ready');
      addResult(`📊 PostHog instance: Available`);
      addResult(`🔑 PostHog loaded: ${posthog.posthog ? 'Yes' : 'No'}`);
    } else {
      addResult('⚠️ PostHog is not initialized yet');
      addResult('💡 Make sure your dev server is running and check the browser console');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          PostHog Test Page
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Test Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={checkPostHogStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Check PostHog Status
            </button>
            <button
              onClick={testBasicEvent}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Test Basic Event
            </button>
            <button
              onClick={testCustomEvent}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Test Custom Event
            </button>
            <button
              onClick={testIdentify}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Test Identify User
            </button>
            <button
              onClick={testReset}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Reset Session
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Test Results
          </h2>
          <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Click the buttons above to test PostHog events. Results will appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {testResults.map((result, index) => (
                  <li
                    key={index}
                    className={`text-sm font-mono ${
                      result.includes('✅')
                        ? 'text-green-600 dark:text-green-400'
                        : result.includes('❌')
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {testResults.length > 0 && (
            <button
              onClick={() => setTestResults([])}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Clear Results
            </button>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
            ⚠️ Ad Blocker Detected:
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
            If you see <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">ERR_BLOCKED_BY_CLIENT</code> errors in the console, an ad blocker is blocking PostHog requests.
          </p>
          <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200 text-sm">
            <li><strong>Disable ad blockers</strong> temporarily (uBlock Origin, AdBlock Plus, Privacy Badger, etc.)</li>
            <li><strong>Whitelist</strong> <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">us.i.posthog.com</code> in your ad blocker</li>
            <li><strong>Test in incognito/private mode</strong> (most ad blockers are disabled there)</li>
            <li>Check the browser console Network tab for blocked requests</li>
          </ul>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            📝 Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
            <li>Open your browser console (F12) to see PostHog debug messages</li>
            <li>Click "Check PostHog Status" to verify PostHog is initialized</li>
            <li>Click the test buttons to send events to PostHog</li>
            <li>Check your PostHog dashboard at https://us.i.posthog.com to see the events</li>
            <li>Navigate to "Activity" or "Events" in PostHog to view captured events</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

