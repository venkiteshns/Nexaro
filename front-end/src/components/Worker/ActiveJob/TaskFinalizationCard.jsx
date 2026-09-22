import { CheckCircle, Flag } from 'lucide-react';

export default function TaskFinalizationCard({ update, onMarkComplete }) {
    if (update === 'completed' || update === 'payment') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle size={20} className="text-[#0A6E5C] shrink-0" />
                <div>
                    <p className="font-bold text-xs sm:text-sm text-[#0A6E5C]">Job Marked Complete!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                        The poster has been notified. Await payment release.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs px-4 py-3.5
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
                <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5">Task Finalization</h2>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                    Ready to finish? This will notify the poster to release payment and provide a review.
                </p>
            </div>
            <button
                onClick={onMarkComplete}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg
                           bg-linear-to-r from-[#0A6E5C] to-emerald-500 text-white
                           text-xs font-bold shadow-2xs hover:from-[#085e4e] hover:to-emerald-600
                           active:scale-[0.98] transition-all duration-150 shrink-0 cursor-pointer"
            >
                <Flag size={13} />
                Mark Job as Complete
            </button>
        </div>
    );
}
