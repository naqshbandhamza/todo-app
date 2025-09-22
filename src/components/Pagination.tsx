"use client";

export default function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void; }) {
  return (
    <div className="flex items-center justify-between mt-4 w-[94vw] mx-auto text-gray-600">
      <div>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border min-w-[100px] rounded mr-2 bg-[#4F39F6] text-white hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border min-w-[100px] rounded bg-[#4F39F6] text-white hover:bg-gray-600"
        >
          Next
        </button>
      </div>
      {/* <div className="text-sm text-gray-600">Page {page} of {totalPages}</div> */}
    </div>
  );
}
