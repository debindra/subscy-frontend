'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/lib/context/ThemeContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { isPasswordStrong, PASSWORD_ERROR_MESSAGE } from '@/lib/utils/passwordRules';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyTaxId, setCompanyTaxId] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isPasswordStrong(password)) {
      setError(PASSWORD_ERROR_MESSAGE);
      return;
    }
    setLoading(true);

    try {
      await signUp({
        email,
        password,
        fullName,
        accountType,
        companyName: accountType === 'business' ? companyName : undefined,
        companyAddress: accountType === 'business' ? companyAddress : undefined,
        companyTaxId: accountType === 'business' ? companyTaxId : undefined,
        companyPhone: accountType === 'business' ? companyPhone : undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setOauthLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setOauthLoading(false);
      setError(err.message || 'Google sign-up failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="max-w-md animate-scale-in shadow-2xl">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full mb-6 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Welcome Aboard!</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Your account has been created successfully</p>
            <div className="mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              Redirecting to dashboard...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-white/80 px-6 py-4 shadow-2xl ring-1 ring-primary-100/80 dark:bg-white/10 dark:ring-white/10 transition-transform duration-300 hover:scale-105">
            <span className="sr-only">Subsy Home</span>
            <img
              src={theme === 'dark' ? '/subsy-logo-darktheme.png' : '/subsy-logo.png'}
              alt="Subsy logo"
              width={220}
              height={220}
              className="h-14 w-auto"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('data:')) {
                  target.src = theme === 'dark' 
                    ? '/subsy-logo-darktheme.png?t=' + Date.now()
                    : '/subsy-logo.png?t=' + Date.now();
                }
              }}
            />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">
            Create your Subsy account
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Start tracking your subscriptions today</p>
        </div>

        <Card className="animate-scale-in shadow-2xl">
          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="h-12 text-lg flex items-center justify-center gap-3"
              onClick={handleGoogleSignUp}
              disabled={oauthLoading}
            >
              {oauthLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.36 0 6.14 1.45 8.01 2.66l5.84-5.84C33.6 3.6 29.24 2 24 2 14.82 2 7.02 7.98 3.69 16.09l6.84 5.31C12.23 14.46 17.66 9.5 24 9.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M46.5 24c0-1.64-.15-3.22-.44-4.74H24v9.49h12.7c-.55 2.97-2.2 5.49-4.69 7.19l7.37 5.71C43.62 37.66 46.5 31.35 46.5 24z"
                    />
                    <path
                      fill="#4285F4"
                      d="M10.53 26.4A13.96 13.96 0 0 1 9.5 21c0-1.87.34-3.67.88-5.31L3.69 10.4A21.89 21.89 0 0 0 2 21c0 3.48.84 6.76 2.31 9.6l6.22-4.2z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 46c5.84 0 10.75-1.92 14.33-5.23l-7.37-5.71c-2.04 1.38-4.66 2.18-6.96 2.18-5.34 0-9.88-3.6-11.47-8.54l-6.22 4.2C9.36 40.55 15.96 46 24 46z"
                    />
                    <path fill="none" d="M2 2h44v44H2z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm font-medium animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
              />

              <Select
                label="Account Type"
                value={accountType}
                onChange={(event) => setAccountType(event.target.value as 'personal' | 'business')}
                options={[
                  { value: 'personal', label: 'Personal' },
                  { value: 'business', label: 'Business' },
                ]}
              />

              {accountType === 'business' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 border border-primary-100 dark:border-primary-900/40 rounded-xl bg-primary-50/60 dark:bg-primary-900/10 text-sm text-primary-700 dark:text-primary-200">
                    <p className="font-semibold mb-1">Business account benefits</p>
                    <ul className="list-disc list-inside space-y-1 text-primary-600 dark:text-primary-300">
                      <li>Advanced analytics with extended history</li>
                      <li>Team seats and export capabilities</li>
                      <li>Dedicated business profile management</li>
                    </ul>
                  </div>

                  <Input
                    label="Company Name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Acme Corporation"
                  />

                  <Input
                    label="Company Address"
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="123 Business Lane, Suite 100"
                  />

                  <Input
                    label="Tax ID"
                    type="text"
                    value={companyTaxId}
                    onChange={(e) => setCompanyTaxId(e.target.value)}
                    placeholder="12-3456789"
                  />

                  <Input
                    label="Company Phone"
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />

              <div className="space-y-3">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  helperText="Use a strong password to keep your account secure"
                  adornmentRight={
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.83 21.83 0 0 1 5.06-7.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.83 21.83 0 0 1-2.72 4.17M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  }
                />
                <PasswordRequirements />
              </div>

              <Button type="submit" fullWidth disabled={loading || oauthLoading} className="h-12 text-lg">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 animate-fade-in">
          Join thousands managing their subscriptions effortlessly
        </p>
      </div>
    </div>
  );
}

