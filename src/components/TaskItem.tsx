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
    <div className="flex items-center justify-between border-b py-3">
      <div className="flex items-center gap-3">
        <button onClick={toggle} disabled={loading} className="flex items-center">
          <input type="checkbox" checked={done} readOnly className="w-4 h-4" />
        </button>
        <div className={`text-sm ${done ? "line-through text-gray-500" : ""}`}>{title}</div>
      </div>
      <div className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</div>
    </div>
  );
}
