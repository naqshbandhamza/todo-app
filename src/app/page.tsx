"use client";
import { useEffect, useState, useRef } from "react";
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
  const [pageSize] = useState(5);
  const [items, setItems] = useState<Task[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState(""); // reactive input value

  // keep track of ongoing fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTasks = async () => {
    if (!session) {
      setItems([]);
      return;
    }

    // Cancel any in-flight request
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const url = `/api/tasks?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url, { signal: controller.signal });

      // Prevent stale responses from overwriting state
      if (controller.signal.aborted) return;

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const json = await res.json();

      // Check again before updating state (in case it was aborted mid-way)
      if (!controller.signal.aborted) {
        setItems(json.items);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Ignore silently
      } else if (err instanceof Error) {
        console.error("Fetch error:", err.message);
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      // Only clear loading if this is the active controller
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
    // cleanup: cancel fetch when unmounting or dependencies change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [status, q, page]);

  const created = async () => {
    setPage(1);
    fetchTasks();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setQ(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const refreshed = () => fetchTasks();

  return (
    <div className="min-h-[90vh] bg-gradient-to-br bg-[#F6F4FF] p-6">
      <div className="relative overflow-hidden bg-white shadow-lg rounded-3xl min-h-[85vh] p-6">
        {/* Search Bar */}
        {status === "authenticated" && (
          <div className="flex items-center gap-3 mb-6 w-[94%] mx-auto">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="🔍 Search your tasks..."
              className="flex-1 border border-gray-200 text-gray-600 rounded-full px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>
        )}


        {!session && (
          <div className="w-[90%] h-[70vh] mx-auto mt-10 rounded-3xl flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 shadow-inner">
            <p className="text-center text-gray-800 font-semibold text-2xl sm:text-3xl leading-relaxed max-w-lg">
              Sign in with <span className="text-indigo-600">Google</span> to
              manage your tasks with <span className="font-bold">Taskly</span>.
            </p>
          </div>
        )}


        {session && (
          <>
            <NewTaskForm onCreated={created} />
            <div className="mt-8">

              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Total tasks:{" "}
                  <span className="font-medium text-gray-700">{total}</span>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Page {page} / {totalPages}
                </div>
              </div>


              <TaskList tasks={items} onToggled={refreshed} loading={loading} />


              <div className="mt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

