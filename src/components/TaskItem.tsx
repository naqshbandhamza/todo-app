"use client";

import React, { useState } from "react";

type Props = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  onToggled?: () => void;
};

export default function TaskItem({ id, title, done, createdAt, onToggled }: Props) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      onToggled?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b p-2 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          disabled={loading}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm
    ${done
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"}
    disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {done ? "✓ Done" : "Mark Done"}
        </button>

        <div className={`text-sm ${done ? "line-through text-gray-500" : "text-gray-700"}`}>
          {title}
        </div>
      </div>
      <div className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</div>
    </div>
  );
}

