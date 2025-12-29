'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import { Card, Button, ConfirmDialog } from '../shared';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);

  const handleToggle = async () => {
    setIsTogglingComplete(true);
    try {
      await onToggle();
    } finally {
      setIsTogglingComplete(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className="p-4 hover:shadow-xl transition-all">
        <div className="flex gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isTogglingComplete || isLoading}
            className="mt-1 flex-shrink-0"
            aria-label={task.completed ? 'Mark as pending' : 'Mark as complete'}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-600 hover:border-primary-500'
              }`}
            >
              {task.completed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium transition-all ${
                task.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-100'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm mt-1 line-clamp-2 ${
                  task.completed ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {task.description}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              {formatRelativeTime(task.createdAt)}
            </p>
          </div>

          {/* Actions */}
          {/* Actions */}
<div className="flex gap-2 flex-shrink-0">
  <Link href={`/tasks/${task.id}`}>
    <Button
      variant="secondary"
      size="sm"
      disabled={isLoading || isTogglingComplete}
      className="w-24 h-9 flex items-center justify-center"
    >
      Edit
    </Button>
  </Link>

  <Button
    variant="danger"
    size="sm"
    onClick={() => setShowDeleteConfirm(true)}
    disabled={isLoading || isDeleting}
    className="w-24 h-9 flex items-center justify-center"
  >
    Delete
  </Button>
</div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
