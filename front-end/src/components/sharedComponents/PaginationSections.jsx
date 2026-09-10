import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationSections = ({
  totalPages,
  onPageChange,
  page,
  currentPage,
  alwaysShow = false,
  className = "mt-6 pb-2",
}) => {
  const activePage = page || currentPage || 1;
  const count = totalPages || 1;

  if (count <= 1 && !alwaysShow) return null;

  const getPages = () => {
    const pagesCount = Math.max(1, count);
    if (pagesCount <= 5) return Array.from({ length: pagesCount }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);

    if (activePage > 3) pages.push("...");

    for (let p = Math.max(2, activePage - 1); p <= Math.min(pagesCount - 1, activePage + 1); p++) {
      pages.push(p);
    }
    if (activePage < pagesCount - 2) pages.push("...");
    pages.push(pagesCount);
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(activePage - 1)}
        disabled={activePage <= 1}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
              p === activePage
                ? "bg-[#0A6E5C] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(activePage + 1)}
        disabled={activePage >= count}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default PaginationSections;