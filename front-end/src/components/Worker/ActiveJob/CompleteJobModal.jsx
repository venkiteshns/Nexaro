import { Flag, Loader2 } from 'lucide-react';

export default function CompleteJobModal({ onConfirm, onClose, isLoading }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-1 w-full bg-linear-to-r from-[#0A6E5C] to-emerald-400" />
                <div className="p-7 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                        <Flag size={28} className="text-[#0A6E5C]" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">Mark as Complete?</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        This will notify the poster that the job is done and trigger the payment release process.
                    </p>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150
                                   shadow-sm mb-3 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
                        {isLoading ? 'Completing…' : 'Yes, Mark Complete'}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1 cursor-pointer"
                    >
                        Not yet
                    </button>
                </div>
            </div>
        </div>
    );
}
