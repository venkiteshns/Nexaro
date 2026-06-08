import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import PersonalInfo from "./FormComponents/PersonalInfo";
import Password from "./FormComponents/Password";
import Location from "./FormComponents/Location";
import TermsAndConditions from "./FormComponents/TermsAndConditions";

const PosterSignupForm = ({ onSubmitForm, isVerified, otpStatus, formStatus }) => {

  let { isLoading, isSuccess, isError, error, data } = otpStatus;
  let { signUpLoading, isSignUpSuccess, isSignUpError, signUpError, signUpData } = formStatus;

  const methods = useForm();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your <span className="text-green-800">Poster</span> Account
          </h2>

          <p className="text-gray-500 mt-2">
            Join India's most trusted hyperlocal task marketplace.
          </p>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitForm)}>
            <PersonalInfo />
            <Location worker={false} />
            <Password login={false} />
            <TermsAndConditions />

            {isError && (
              <div className="text-center my-4">
                <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                  {error?.data?.message || error?.message}
                </span>
              </div>
            )}

            {isSignUpError && (
              <div className="text-center">
                <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                  {signUpError?.data?.message || signUpError?.message}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`w-full bg-[#0a6e5c] hover:bg-green-800/90 transition text-white font-semibold py-3.5 rounded-xl ${(isLoading || isVerified) ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isVerified ? "Submitting Registration..." : isLoading ? "Validating Data..." : "Create Account"}
            </button>

           
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PosterSignupForm;
