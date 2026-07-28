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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-[540px] rounded-[32px] border border-[#DDE7E2] bg-white shadow-2xl p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F7F5] text-gray-500 transition hover:bg-[#E8F3EE] hover:text-[#0A6E5C]"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Password</h2>

                <div>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormProvider {...methods}>
                            <div className="flex flex-col gap-2 text-left">
                                <label htmlFor="oldPassword" className="text-sm font-medium text-gray-900">
                                    Old Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...methods.register("oldPassword", { required: "Old password is required" })}
                                        placeholder="********"
                                        type={showOldPassword ? "text" : "password"}
                                        id="oldPassword"
                                        className="w-full rounded-2xl border border-[#DDE7E2] bg-[#F9FBFA] px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#0A6E5C] focus:ring-4 focus:ring-[#0A6E5C]/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A6E5C] transition"
                                        // tabIndex={-1}
                                    >
                                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {methods.formState.errors?.oldPassword && (
                                    <span className="italic text-red-400/90 text-xs">
                                        {methods.formState.errors?.oldPassword.message}
                                    </span>
                                )}
                            </div>

                            <Password />
                        </FormProvider>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#0A6E5C] py-2 text-white hover:bg-[#095847] transition"
                        >
                            {isLoading ? "Updating..." : isSuccess ? "Password Updated" : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePasswordModal