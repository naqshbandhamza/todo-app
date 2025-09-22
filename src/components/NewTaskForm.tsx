"use client";

import { useState } from "react";

export default function NewTaskForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) return setError("Title cannot be empty.");
    if (trimmed.length > 200) return setError("Title too long (max 200 chars).");

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to create");
      }
      setTitle("");
      onCreated?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unexpected error", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-start w-[94vw] mx-auto">
      <input
        className="flex-1 border rounded px-3 py-2 text-gray-600"
        placeholder="New task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <button className="px-4 py-2 bg-[#4F39F6] text-white rounded hover:bg-gray-600" disabled={loading}>
        {loading ? "Saving..." : "Add"}
      </button>
      {error && <div className="w-full text-sm text-red-600 mt-2">{error}</div>}
    </form>
  );
}
