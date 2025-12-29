'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { ConfirmDialogProps } from '@/lib/types';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
    >
      {description && (
        <p className="text-gray-300 mb-6">
          {description}
        </p>
      )}

      <div className="flex gap-3 justify-end">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {isDangerous ? 'Delete' : 'Confirm'}
        </Button>
      </div>
    </Modal>
  );
};
