import { AlertTriangle } from "lucide-react";

export default function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
            </div>

            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">Something went wrong</p>
                <p className="text-sm text-gray-500 max-w-xs">
                    We couldn't process the bid acceptance. Please try again.
                </p>
            </div>

            <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
            >
                Try Again
            </button>
        </div>
    );
}
