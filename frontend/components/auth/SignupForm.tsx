'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { Button, Input, Card } from '../shared';
import { signUpSchema, validateForm } from '@/lib/validation';
import type { SignUpForm } from '@/lib/validation';

export const SignupForm: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const { data, errors: validationErrors } = validateForm<SignUpForm>(
      signUpSchema,
      formData
    );

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!data) return;

    try {
      await signUp(data.email, data.password, data.name || undefined);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 mb-8">
          Sign up to start managing your tasks
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            type="text"
            name="name"
            label="Full Name (Optional)"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isLoading}
          />

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
            helpText="Must be at least 8 characters with 1 uppercase letter and 1 number"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            required
          />

          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
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
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
};
