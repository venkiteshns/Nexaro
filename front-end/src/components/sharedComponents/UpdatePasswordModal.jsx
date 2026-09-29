import { X, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import Password from '../Form/FormComponents/Password';
import { useUpdateProfilePasswordMutation } from '../../store/services/sharedApi';
import { showError, showSuccess } from '../../utils/toast';

const UpdatePasswordModal = ({ onClose }) => {
    const methods = useForm();
    const [showOldPassword, setShowOldPassword] = useState(false);

    const [updateProfilePassword, {isLoading, isSuccess}] = useUpdateProfilePasswordMutation();

    const onSubmit = async (data) => {
        try {
            await updateProfilePassword(data).unwrap();
            showSuccess("Password updated successfully");
            onClose();
        } catch (error) {
            showError(error?.data?.message || "Failed to update password");
        }
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[420px] rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-2xl p-5 sm:p-7 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-gray-100 mb-3.5 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Update Password</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-emerald-50 hover:text-[#0A6E5C] cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-3.5">
                    <FormProvider {...methods}>
                        <div className="flex flex-col gap-1 text-left">
                            <label htmlFor="oldPassword" className="text-xs font-medium text-gray-700">
                                Old Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...methods.register("oldPassword", { required: "Old password is required" })}
                                    placeholder="••••••••••••"
                                    type={showOldPassword ? "text" : "password"}
                                    id="oldPassword"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#0A6E5C] focus:ring-2 focus:ring-[#0A6E5C]/15"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A6E5C] transition cursor-pointer"
                                >
                                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {methods.formState.errors?.oldPassword && (
                                <span className="italic text-red-500 text-[11px] mt-0.5">
                                    {methods.formState.errors?.oldPassword.message}
                                </span>
                            )}
                        </div>

                        <Password noBox={true} />
                    </FormProvider>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-[#0A6E5C] py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#085a4b] transition shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? "Updating..." : isSuccess ? "Password Updated" : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordModal