import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

const PaginationSections = ({totalPages, onPageChange, currentPage}) => {

    const handlePrevPage = () => {
        if (currentPage > 1) onPageChange((p) => p - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) onPageChange((p) => p + 1);
    };

  return (
    <div>
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
                Showing page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-medium text-gray-700 px-2">
                    {currentPage}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
  )
}

export default PaginationSections