"use client";
import TaskItem from "./TaskItem";

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
};

export default function TaskList({ tasks, onToggled, loading }: { tasks: Task[]; onToggled?: () => void; loading?: boolean }) {
  if (loading) return <div className="p-6 text-center text-gray-600">Loading tasks...</div>;
  if (tasks.length === 0) return <div className="p-6 text-center text-gray-600">No tasks to show.</div>;

  return (
    <div className="divide-y rounded border">
      {tasks.map((t) => (
        <TaskItem key={t.id} {...t} onToggled={onToggled} />
      ))}
    </div>
  );
}
