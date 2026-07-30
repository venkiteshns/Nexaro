import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationSections = ({totalPages, onPageChange, page}) => {

    
      if (totalPages <= 1) return null;
    
      const getPages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        pages.push(1);
    
        if (page > 3) pages.push("...");
    
        for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
          pages.push(p);
        }
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
      };
    
      return (
        <div className="flex items-center justify-center gap-2 mt-6 pb-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
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
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page
                  ? "bg-[#0A6E5C] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {p}
              </button>
            )
          )}
    
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      );
}

export default PaginationSections