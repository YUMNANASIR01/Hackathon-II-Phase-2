'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Card } from '../shared';
import { createTaskSchema, updateTaskSchema, validateForm } from '@/lib/validation';
import type { CreateTaskForm, UpdateTaskForm } from '@/lib/validation';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
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

    // Choose schema based on whether we're creating or updating
    const schema = task ? updateTaskSchema : createTaskSchema;
    const { data, errors: validationErrors } = validateForm<
      CreateTaskForm | UpdateTaskForm
    >(schema, formData);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!data) return;

    try {
      await onSubmit(data);
      if (!task) {
        // Redirect to tasks list after creating
        router.push('/tasks');
      }
    } catch (error) {
      // Error is handled by parent component
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          {task ? 'Edit Task' : 'Create New Task'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="title"
            type="text"
            name="title"
            label="Title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            disabled={isLoading}
            required
            maxLength={255}
          />

          <Textarea
            id="description"
            name="description"
            label="Description (Optional)"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            disabled={isLoading}
            maxLength={1000}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
