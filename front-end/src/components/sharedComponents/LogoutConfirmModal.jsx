import { useEffect } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

const LogoutConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    title = "Log Out?",
    message = "Are you sure you want to log out? You will need to sign in again to access your account.",
    confirmText = "Log Out",
    cancelText = "Cancel"
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => {
                if (!isLoading) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
        >
            <div
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Accent Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

                <div className="p-5 sm:p-6 flex flex-col items-center text-center">
                    {/* Icon Badge */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-3 shadow-xs">
                        <LogOut size={22} className="text-red-500 translate-x-0.5" />
                    </div>

                    {/* Title */}
                    <h2
                        id="logout-modal-title"
                        className="text-base sm:text-lg font-extrabold text-gray-900 mb-1.5"
                    >
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 max-w-[270px]">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Logging out...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut size={16} />
                                    <span>{confirmText}</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;
