'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setOauthLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setOauthLoading(false);
      setError(err.message || 'Google sign-in failed');
    }
  };

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
            <Image
              src="/subsy-full-logo-2.png"
              alt="Subsy logo"
              width={220}
              height={220}
              priority
              className="h-14 w-auto"
            />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2">
            Welcome back
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back! Sign in to continue</p>
        </div>

        <Card className="animate-scale-in shadow-2xl">
          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="h-12 text-lg flex items-center justify-center gap-3"
              onClick={handleGoogleSignIn}
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
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
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

              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" fullWidth disabled={loading || oauthLoading} className="h-12 text-lg">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 animate-fade-in">
          Track and manage all your subscriptions in one place
        </p>
      </div>
    </div>
  );
}

