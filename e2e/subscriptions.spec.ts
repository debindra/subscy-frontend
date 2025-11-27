import { test, expect, Page } from '@playwright/test';

type SubscriptionRecord = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextRenewalDate: string;
  category: string;
  description?: string;
  website?: string;
  isActive: boolean;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  paymentMethod?: string;
  lastFourDigits?: string;
  cardBrand?: string;
  isTrial: boolean;
  trialEndDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

const appOrigin = process.env.PLAYWRIGHT_APP_ORIGIN ?? 'http://localhost:3000';

const corsHeaders = (origin?: string) => ({
  'Access-Control-Allow-Origin': origin ?? appOrigin,
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
});

const configuredApiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').origin;
const apiOrigins = new Set([configuredApiOrigin, 'http://127.0.0.1:3001']);

const now = new Date().toISOString();

const baseSubscriptions: SubscriptionRecord[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: now,
    category: 'Entertainment',
    description: 'Streaming service',
    website: 'https://netflix.com',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: 'credit_card',
    lastFourDigits: '4242',
    cardBrand: 'Visa',
    isTrial: false,
    trialEndDate: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sub-2',
    userId: 'user-1',
    name: 'Figma',
    amount: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: now,
    category: 'Design',
    description: 'Design tooling',
    website: 'https://figma.com',
    isActive: true,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: '',
    lastFourDigits: '',
    cardBrand: '',
    isTrial: true,
    trialEndDate: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sub-3',
    userId: 'user-1',
    name: 'Gym Membership',
    amount: 50,
    currency: 'USD',
    billingCycle: 'monthly',
    nextRenewalDate: now,
    category: 'Fitness',
    description: 'Local gym',
    website: '',
    isActive: false,
    reminderEnabled: true,
    reminderDaysBefore: 7,
    paymentMethod: '',
    lastFourDigits: '',
    cardBrand: '',
    isTrial: false,
    trialEndDate: null,
    createdAt: now,
    updatedAt: now,
  },
];

async function mockPlanApi(page: Page) {
  await page.route('**/business/plan', async (route) => {
    const url = new URL(route.request().url());
    if (!apiOrigins.has(url.origin)) {
      return route.continue();
    }
    const headers = corsHeaders(route.request().headers()['origin']);

    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 200, headers });
    }

    return route.fulfill({
      status: 200,
      headers,
      body: JSON.stringify({
        accountType: 'pro',
        limits: {
          categorization: true,
          smart_renewal_management: true,
        },
      }),
    });
  });
}

async function mockSubscriptionsApi(page: Page) {
  let subscriptions = [...baseSubscriptions];

  await page.route('**/subscriptions/**', async (route) => {
    const method = route.request().method();
    const url = new URL(route.request().url());
    if (!apiOrigins.has(url.origin)) {
      return route.continue();
    }
    const pathname = url.pathname;
    const headers = corsHeaders(route.request().headers()['origin']);

    const ua = route.request().headers()['user-agent'] || 'unknown';
    console.log(`[e2e] ${method} ${pathname} :: ${ua.split(' ')[0]}`);

    if (method === 'OPTIONS') {
      return route.fulfill({ status: 200, headers });
    }

    if (pathname === '/subscriptions/' && method === 'GET') {
      return route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify(subscriptions),
      });
    }

    if (pathname === '/subscriptions/' && method === 'POST') {
      const payload = JSON.parse(route.request().postData() ?? '{}');
      const timestamp = new Date().toISOString();
      const newSubscription: SubscriptionRecord = {
        id: `sub-${Date.now()}`,
        userId: 'user-1',
        name: payload.name || 'Untitled',
        amount: payload.amount ?? 0,
        currency: payload.currency || 'USD',
        billingCycle: payload.billingCycle || 'monthly',
        nextRenewalDate: payload.nextRenewalDate || timestamp,
        category: payload.category || 'Other',
        description: payload.description || '',
        website: payload.website || '',
        isActive: payload.isActive ?? true,
        reminderEnabled: payload.reminderEnabled ?? true,
        reminderDaysBefore: payload.reminderDaysBefore ?? 7,
        paymentMethod: payload.paymentMethod || '',
        lastFourDigits: payload.lastFourDigits || '',
        cardBrand: payload.cardBrand || '',
        isTrial: payload.isTrial ?? false,
        trialEndDate: payload.trialEndDate ?? null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      subscriptions = [newSubscription, ...subscriptions];

      return route.fulfill({
        status: 201,
        headers,
        body: JSON.stringify(newSubscription),
      });
    }

    if (pathname.startsWith('/subscriptions/') && method === 'DELETE') {
      const id = pathname.replace('/subscriptions/', '').replace('/', '');
      subscriptions = subscriptions.filter((sub) => sub.id !== id);

      return route.fulfill({
        status: 204,
        headers,
        body: '',
      });
    }

    if (pathname.startsWith('/subscriptions/') && method === 'PATCH') {
      const id = pathname.replace('/subscriptions/', '').replace('/', '');
      const payload = JSON.parse(route.request().postData() ?? '{}');

      subscriptions = subscriptions.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              ...payload,
              updatedAt: new Date().toISOString(),
            }
          : sub
      );

      const updated = subscriptions.find((sub) => sub.id === id);

      return route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify(updated),
      });
    }

    return route.fulfill({
      status: 404,
      headers,
      body: JSON.stringify({ message: 'Not mocked in e2e tests' }),
    });
  });
}

async function visitSubscriptionsPage(page: Page) {
  const dataResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/subscriptions/') &&
      response.request().method() === 'GET'
  );
  await page.goto('/dashboard/subscriptions');
  await dataResponse;
  await expect(
    page.getByRole('heading', { name: 'Subscriptions', exact: true })
  ).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Manage all your subscriptions')).toBeVisible();
}

test.describe('Subscriptions dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await mockPlanApi(page);
    await mockSubscriptionsApi(page);
  });

  test('displays subscriptions and filters results', async ({ page }) => {
    await visitSubscriptionsPage(page);
    await page.getByRole('button', { name: /all \(3\)/i }).click();
    await expect(page.getByText('Netflix')).toBeVisible();
    await expect(page.getByText('Figma')).toBeVisible();

    const searchInput = page.getByPlaceholder('Search name, category, description...');
    await searchInput.fill('Gym');
    await expect(page.getByText('Gym Membership')).toBeVisible();
    await expect(page.getByText('Netflix')).not.toBeVisible();
  });

  test('creates a subscription from the modal', async ({ page }) => {
    await visitSubscriptionsPage(page);

    await page.getByRole('button', { name: '+ Add Subscription' }).click();
    await expect(page.getByText('Add New Subscription')).toBeVisible();

    await page
      .getByPlaceholder('e.g., Netflix, Spotify, Adobe Creative Cloud')
      .fill('New SaaS Suite');
    await page.getByPlaceholder('Amount').fill('29.99');
    await page.getByPlaceholder('Next Renewal Date').fill('2025-02-01');

    await page.getByRole('button', { name: /^Add Subscription$/ }).click();
    await expect(page.getByText('Subscription created successfully!')).toBeVisible();
    await expect(page.getByText('New SaaS Suite')).toBeVisible();
  });
});


