'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/lib/hooks';
import { TaskForm } from '@/components/tasks/TaskForm';
import { LoadingSpinner } from '@/components/shared';
import type { UpdateTaskInput } from '@/lib/types';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);
  const { tasks, fetchTasks, updateTask, isLoading } = useTasks();
  const [task, setTask] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      // First try to get from existing tasks
      let foundTask = tasks.find((t) => t.id === taskId);

      if (!foundTask) {
        // If not found, fetch all tasks
        await fetchTasks();
        foundTask = tasks.find((t) => t.id === taskId);
      }

      if (!foundTask) {
        // If still not found, we might need to fetch it directly
        // For now, we'll just show the not found message
        setIsPageLoading(false);
        return;
      }

      setTask(foundTask);
      setIsPageLoading(false);
    };

    loadTask();
  }, [taskId, tasks, fetchTasks]);

  const handleSubmit = async (data: UpdateTaskInput) => {
    await updateTask(taskId, data);
    router.push('/tasks'); // Redirect back to tasks list after update
  };

  if (isPageLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <LoadingSpinner message="Loading task..." size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">
            Task not found
          </h1>
          <p className="text-gray-400">
            The task you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <TaskForm task={task} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
