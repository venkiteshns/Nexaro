import React, { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import PersonalInfo from "./PersonalInfo";
import OtpModal from '../OtpModal/OtpModal'
import { FormProvider, useForm } from "react-hook-form";
import { useForgotPasswordMutation, useUpdatePasswordMutation } from "../../store/services/api";
import Password from "./Password";

const ForgotPasswordModal = ({ isOpen, onClose, isUpdateSuccess }) => {
  if (!isOpen) return null;

  const [forgotPassword, { isLoading, isError, isSuccess, error, data }] =
    useForgotPasswordMutation();

  const [updatePassword, { isError: updateError, isSuccess: updateSuccess, isLoading: updateLoading, error: updateErrorData, data: updateData }] = useUpdatePasswordMutation();

  const [showOtp, setShowOtp] = useState(false)
  const [email, setEmail] = useState(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setShowOtp(true);
      // onClose();
    }
  }, [isSuccess])

  const methods = useForm();

  const activeBtn =
    "py-2 px-4 rounded-2xl bg-[#0A6E5C] text-sm font-semibold text-white  hover:bg-[#095847] ";
  const disabledBtn =
    "py-2 px-4 rounded-2xl bg-[#0A6E5C]/70 text-sm font-semibold text-white cursor-not-allowed";


  const handlePasswordResetOtp = async ({ email }) => {
    console.log("email ", email);
    setEmail(email)
    try {
      let res = await forgotPassword({ email, role:"admin" });
      console.log(" reset otp res ", res);
    } catch (error) {
      console.log("reset error", err);
    }
  };

  const updateNewPassword = async (data) => {
    console.log("update password : ", data);
    try {
      let res = await updatePassword({
        email: email,
        password: data.password
      })
      console.log(" update res ", res);
      if (res.data.success) {
        isUpdateSuccess(true)
        onClose();
      }
    } catch (error) {
      console.log(" error ", error);
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

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl leading-none font-black tracking-tight text-[#111827]">
            Reset Password
          </h2>

          <p className="mt-4 text-xs text-[#6B7280]">
            {isVerified ? "Enter your new password" : "Enter your registered admin email address to receive password reset instructions."}
          </p>
        </div>

        {/* Form */}
        <form
          className="mt-10 space-y-7"
          onSubmit={methods.handleSubmit(isVerified ? updateNewPassword : handlePasswordResetOtp)}
        >
          <div>
            <FormProvider {...methods}>
              <PersonalInfo worker={false} login={true} />
              {isVerified && <Password />}
            </FormProvider>
          </div>

          {isError && (
            <div className="text-center">
              <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                {error.data.message}
              </span>
            </div>
          )}
          {updateError && (
            <div className="text-center">
              <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                {updateError.data.message}
              </span>
            </div>
          )}

          {/* Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading || updateLoading}
              className={(isLoading || updateLoading) ? disabledBtn : activeBtn}
            >
              {isLoading ? "Sending OTP.." : isVerified ? "Update Password" : updateLoading ? "Updating Password" : "Send Reset Otp"}
            </button>
          </div>
        </form>
      </div>
      {/* { show, email, reSendOtp, isVerified } */}
      {showOtp && <OtpModal show={setShowOtp} email={email} reSendOtp={handlePasswordResetOtp} isVerified={setIsVerified} />}
    </div>
  );
};

export default ForgotPasswordModal;
