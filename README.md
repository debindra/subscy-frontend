# Subscription Tracker Frontend

Next.js frontend application for the Subscription Tracking Dashboard.

## Features

- 🔐 User authentication with Supabase
- 📊 Beautiful dashboard with spending analytics
- 💳 Full CRUD for subscriptions
- 📈 Interactive charts with Chart.js
- 📱 Fully responsive design with TailwindCSS
- 🎨 Modern UI components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Charts**: Chart.js + react-chartjs-2
- **Authentication**: Supabase Auth
- **API Client**: Axios
- **State Management**: React Hooks
- **Language**: TypeScript

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Copy the example file
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/         # Dashboard pages
│   │   ├── page.tsx       # Main dashboard
│   │   └── subscriptions/ # Subscriptions management
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home/redirect page
├── components/            # React components
│   ├── auth/             # Auth-related components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components (Navbar, etc.)
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── api/              # API client and endpoints
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   └── supabase.ts       # Supabase client
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

### Authentication
- `/auth/login` - User login
- `/auth/signup` - User registration

### Dashboard
- `/dashboard` - Main dashboard with analytics and upcoming renewals
- `/dashboard/subscriptions` - Manage all subscriptions

## Components

### UI Components
- `Button` - Customizable button with variants
- `Input` - Form input with label and error handling
- `Select` - Dropdown select component
- `Card` - Container card component
- `Modal` - Modal dialog component

### Dashboard Components
- `SubscriptionCard` - Display individual subscription
- `SubscriptionForm` - Create/edit subscription form
- `SpendingChart` - Analytics charts (Pie & Bar)

### Layout Components
- `Navbar` - Main navigation bar

## API Integration

The frontend communicates with the backend API through Axios client with automatic:
- JWT token injection
- Token refresh on expiration
- Error handling

## Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
Build the production bundle:
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

