'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { Button, Input, Card } from '../shared';
import { signInSchema, validateForm } from '@/lib/validation';
import type { SignInForm } from '@/lib/validation';

export const LoginForm: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const { data, errors: validationErrors } = validateForm<SignInForm>(
      signInSchema,
      formData
    );

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!data) return;

    try {
      await signIn(data.email, data.password);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 mb-8">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
            required
          />

          <Input
            id="password"
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </Card>
  );
};
