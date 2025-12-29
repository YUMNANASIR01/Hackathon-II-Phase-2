import type { Metadata, Viewport } from 'next';
import { ToastProvider } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App - Task Management',
  description: 'A professional task management application with real-time synchronization',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
