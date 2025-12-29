import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - Todo App',
  description: 'Create a new Todo App account',
};

export default function RegisterPage() {
  return <SignupForm />;
}
