"use client";

import TaskItem from "./TaskItem";
import Dots from "./Dots";

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
};
export default function TaskList({ tasks, onToggled, loading }: { tasks: Task[]; onToggled?: () => void; loading?: boolean }) {
  if (loading) return <div className="flex justify-center"><Dots /></div>;
  if (tasks.length === 0) return <div className="p-6 text-center text-gray-600">No tasks to show.</div>;

  return (
    <div className="divide-y rounded border w-[94vw] mx-auto">
      {tasks.map((t) => (
        <TaskItem key={t.id} {...t} onToggled={onToggled} />
      ))}
    </div>
  );
}
