'use client';

import { useTasks } from '@/lib/hooks';
import { TaskForm } from '@/components/tasks/TaskForm';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/types';

export default function NewTaskPage() {
  const { createTask, isLoading } = useTasks();

  const handleSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    await createTask(data as CreateTaskInput);
  };

  return (
    <div className="container py-8">
      <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
