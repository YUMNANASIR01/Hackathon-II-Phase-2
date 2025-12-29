import { Metadata } from 'next';
import { TaskList } from '@/components/tasks/TaskList';

export const metadata: Metadata = {
  title: 'My Tasks - Todo App',
  description: 'View and manage your tasks',
};

export default function TasksPage() {
  return <TaskList />;
}
