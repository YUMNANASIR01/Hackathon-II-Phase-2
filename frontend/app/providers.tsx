'use client';

import React from 'react';
import { useToast } from '@/lib/hooks';
import { ToastContainer } from '@/components/shared';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
