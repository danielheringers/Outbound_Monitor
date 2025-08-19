"use client";

export default function RefreshPageButton() {
  return (
    <div className="text-xs text-gray-500">
      <button
        className="bg-blue-900 text-white p-2 rounded-full shadow-md hover:bg-blue-800"
        onClick={() => {
          window.location.reload();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v6h6M20 20v-6h-6M4 10a8.002 8.002 0 0114.899-2M20 14a8.002 8.002 0 01-14.899 2"
          />
        </svg>
      </button>
    </div>
  );
}
