// src/components/PaginationControls.tsx
interface PaginationControlsProps {
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  )
}
