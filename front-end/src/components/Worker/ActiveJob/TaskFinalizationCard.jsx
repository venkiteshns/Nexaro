import { CheckCircle, Flag } from 'lucide-react';

export default function TaskFinalizationCard({ update, onMarkComplete }) {
    if (update === 'completed' || update === 'payment') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex items-center gap-4">
                <CheckCircle size={24} className="text-[#0A6E5C] shrink-0" />
                <div>
                    <p className="font-bold text-[#0A6E5C]">Job Marked Complete!</p>
                    <p className="text-sm text-emerald-700 mt-0.5">
                        The poster has been notified. Await payment release.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-5
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-base font-extrabold text-gray-900 mb-1">Task Finalization</h2>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                    Ready to finish? This will notify the poster to release payment and provide a review.
                </p>
            </div>
            <button
                onClick={onMarkComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl
                           bg-linear-to-r from-[#0A6E5C] to-emerald-500 text-white
                           text-sm font-bold shadow-md hover:from-[#085e4e] hover:to-emerald-600
                           active:scale-[0.98] transition-all duration-150 shrink-0 cursor-pointer"
            >
                <Flag size={16} />
                Mark Job as Complete
            </button>
        </div>
    );
}
