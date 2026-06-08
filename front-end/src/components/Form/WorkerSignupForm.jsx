import React from "react";
import PersonalInfo from "./FormComponents/PersonalInfo";
import Password from "./FormComponents/Password";
import { useFormContext } from "react-hook-form";
import TermsAndConditions from "./FormComponents/TermsAndConditions";
import Location from "./FormComponents/Location";
import IdentityVerification from "./FormComponents/IdentityVerification";
import CustomSelector from "./CustomSelector";

const WorkerSignupForm = ({ onSubmitForm, isOtpError, otpError, isOtpSuccess}) => {
  const { handleSubmit } = useFormContext();
  return (
    <div className="bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <PersonalInfo worker={true} />
          <Location worker={true} />
          <CustomSelector section={"language"} />
          <CustomSelector section={"skill"} />
          <IdentityVerification />
          <Password />
          <TermsAndConditions />
          
          {/* isOtpError otpError isOtpSuccess */}
           {isOtpError && (
              <div className="text-center my-4">
                <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                  {otpError?.data?.message || otpError?.message}
                </span>
              </div>
            )}
            {
              isOtpSuccess &&
              <div className="text-center my-4">
                <span className="italic text-green-600/90 text-sm bg-green-500/10 py-1.5 px-10 rounded-xl">
                  OTP Send Succesfully
                </span>
              </div>
            }
          <button
            type="submit"
            className="w-full bg-[#0a6e5c] hover:bg-green-900/90 transition text-white font-semibold py-3.5 rounded-xl"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerSignupForm;
