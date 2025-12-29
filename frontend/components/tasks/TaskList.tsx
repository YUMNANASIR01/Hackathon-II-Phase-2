'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useTasks } from '@/lib/hooks';
import { Button, LoadingSpinner, Card } from '../shared';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';
import type { TaskStatus, TaskSort } from '@/lib/types';

export const TaskList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { tasks = [], isLoading, fetchTasks, deleteTask, toggleTask } = useTasks();
  const [status, setStatus] = useState<TaskStatus>('all');
  const [sort, setSort] = useState<TaskSort>('created');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch tasks when component mounts or filters change (and user is authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks({ status, sort });
    }
  }, [status, sort, fetchTasks, isAuthenticated]);

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
  };

  const handleSortChange = (newSort: TaskSort) => {
    setSort(newSort);
  };

  const handleToggle = (taskId: number) => async () => {
    await toggleTask(taskId);
  };

  const handleDelete = (taskId: number) => async () => {
    await deleteTask(taskId);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <LoadingSpinner message="Loading..." size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated (this will be handled above, but as a safety)
  if (!isAuthenticated) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <LoadingSpinner message="Redirecting to login..." size="lg" />
      </div>
    );
  }

  if (isLoading && (!tasks || tasks.length === 0)) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <LoadingSpinner message="Loading tasks..." size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-100">My Tasks</h1>
          <p className="text-gray-400 mt-2">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Link href="/tasks/new">
          <Button variant="primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Task
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <TaskFilters
          status={status}
          sort={sort}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle(task.id)}
              onDelete={handleDelete(task.id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          <Card className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>

            <h3 className="text-lg font-medium text-gray-200 mb-2">
              {status === 'completed'
                ? 'No completed tasks'
                : status === 'pending'
                ? 'No pending tasks'
                : 'No tasks yet'}
            </h3>

            <p className="text-gray-400 mb-6">
              {status === 'completed'
                ? 'All your tasks are pending. Start some work!'
                : status === 'pending'
                ? 'Great job! All tasks are completed.'
                : 'Create your first task to get started.'}
            </p>

            {status === 'all' && (
              <Link href="/tasks/new">
                <Button variant="primary" size="sm">
                  Create Task
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
