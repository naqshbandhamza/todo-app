"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import Pagination from "@/components/Pagination";

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  userId: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [items, setItems] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchTasks = async () => {
    console.log("fetching")
    if (!session) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const url = `/api/tasks?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setItems(json.items);
      setTotalPages(json.totalPages);
      setTotal(json.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, q, page]);

  const created = async () => {
    setPage(1);
    fetchTasks();
  };

  const refreshed = () => fetchTasks();

  return (
    <div>
      <div className="relative overflow-auto bg-white shadow min-h-[90vh]">

        {status === "authenticated" && (
          <div className="flex items-center gap-3 mb-4">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks by title..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button onClick={fetchTasks} className="px-3 py-2 bg-slate-600 text-white rounded">Search</button>
          </div>
        )}

        {!session &&
          <div className="w-[90vw] h-[80vh] mx-auto mt-[4vh] rounded-xl flex items-center shadow">
            <p className="text-center text-black font-bold text-[3vw] mx-auto">Sign in with Google to manage your tasks with Taskly.</p>
          </div>
        }

        {session && (
          <>
            <NewTaskForm onCreated={created} />
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-600">Total: {total}</div>
                <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
              </div>
              <TaskList tasks={items} onToggled={refreshed} loading={loading} />
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
