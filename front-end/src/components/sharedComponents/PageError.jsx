import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PageError({
    onBack,
    title = "Failed to load",
    message = "We couldn't fetch the details. Please check your connection and try again.",
    buttonText = "Go Back",
}) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500" />
            </div>
            <div className="text-center">
                <p className="text-base font-extrabold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-400 max-w-xs">{message}</p>
            </div>
            {onBack && (
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] transition-all active:scale-[0.98]"
                >
                    <ArrowLeft size={15} />
                    {buttonText}
                </button>
            )}
        </div>
    );
}
