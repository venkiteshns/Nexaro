import { ArrowLeft } from 'lucide-react';

export default function ActiveJobHeader({ onBack }) {
    return (
        <div className="sticky top-0 z-10 bg-[#F6FAF8]/95 backdrop-blur-sm border-b border-gray-200
                        px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A6E5C] transition-colors font-medium cursor-pointer"
            >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to My Bids</span>
                <span className="sm:hidden">Back</span>
            </button>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-emerald-50 border border-emerald-200 text-[#0A6E5C] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE JOB
            </span>
        </div>
    );
}
