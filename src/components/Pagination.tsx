"use client";
export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void; }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
      <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
    </div>
  );
}
