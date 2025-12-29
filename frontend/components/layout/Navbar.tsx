'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const Navbar: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900 shadow-lg">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/tasks"
          className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent hover:from-primary-300 hover:to-primary-500 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2h.01a1 1 0 100 2H6a2 2 0 100 4h6a2 2 0 100-4h-.01a1 1 0 100-2h.01a2 2 0 01-2-2 2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 102 2v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v11a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 011-1h1a1 1 0 110 2H7v1a3 3 0 01-3-3V5z" clipRule="evenodd" />
          </svg>
          Todo App
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : user ? (
            <>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  {user.name && (
                    <span className="text-sm font-medium text-gray-100">
                      {user.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {user.email}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                isLoading={isSigningOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
