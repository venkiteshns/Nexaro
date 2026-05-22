import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import Location from "./Location";
import TermsAndConditions from "./TermsAndConditions";

const PosterSignupForm = ({onSubmitForm, isVerified}) => {

  const methods = useForm();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">
        {/* Heading */}
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
            <Location worker={false}/>
            <Password />
            <TermsAndConditions />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#0a6e5c] hover:bg-green-800/90 transition text-white font-semibold py-3.5 rounded-xl"
            >
              {isVerified ? "Submitting Registration...":"Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-[1px] bg-gray-300" />

              <span className="text-sm text-gray-500 font-medium">OR</span>

              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>

            {/* Google Signup */}
            <button
              type="button"
              className="w-full border border-gray-300 hover:bg-gray-50 transition rounded-xl py-3.5 flex items-center justify-center gap-3 font-semibold text-gray-700"
            >
              <Mail className="w-5 h-5" />
              Continue with Google
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PosterSignupForm;
