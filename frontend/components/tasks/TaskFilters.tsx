'use client';

import React from 'react';
import { Button } from '../shared';
import type { TaskStatus, TaskSort } from '@/lib/types';

interface TaskFiltersProps {
  status: TaskStatus;
  sort: TaskSort;
  onStatusChange: (status: TaskStatus) => void;
  onSortChange: (sort: TaskSort) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  sort,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Status Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((s) => (
          <Button
            key={s}
            variant={status === s ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusChange(s)}
            className="flex-1 sm:flex-none"
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-200">
          Sort:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as TaskSort)}
          className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="created">Created</option>
          <option value="title">Title</option>
          <option value="updated">Updated</option>
        </select>
      </div>
    </div>
  );
};
