import PersonalInfo from "./FormComponents/PersonalInfo";
import Password from "./FormComponents/Password";
import { useFormContext } from "react-hook-form";
import TermsAndConditions from "./FormComponents/TermsAndConditions";
import Location from "./FormComponents/Location";
import IdentityVerification from "./FormComponents/IdentityVerification";
import CustomSelector from "./CustomSelector";

const FIELD_ORDER = [
  "name",
  "email",
  "phone",
  "bio",
  "country",
  "state",
  "district",
  "city",
  "locationLat",
  "locationlng",
  "workPlace",
  "workPlacelat",
  "workPlacelng",
  "language",
  "skill",
  "id_type",
  "id_front",
  "id_back",
  "selfie",
  "password",
  "confirmPassword",
  "terms",
];

const WorkerSignupForm = ({
  onSubmitForm,
  isOtpError,
  otpError,
  isOtpSuccess,
  isGoogleVerified = false,
  onClearGoogle,
  onGoogleSignUp,
  isGoogleLoading = false,
  googleError = "",
  onSwitchRole,
}) => {
  const { handleSubmit } = useFormContext();

  const handleFormError = (errors) => {
    const firstErrorField =
      FIELD_ORDER.find((field) => errors[field]) || Object.keys(errors)[0];

    if (!firstErrorField) return;

    setTimeout(() => {
      // 1. Direct match by name
      let targetElement = document.querySelector(`[name="${firstErrorField}"]`);

      // 2. Custom selector or section match
      if (!targetElement) {
        targetElement =
          document.querySelector(`[data-field="${firstErrorField}"]`) ||
          document.getElementById(`field-${firstErrorField}`) ||
          document.getElementById(firstErrorField);
      }

      // 3. Location coordinates fallback
      if (
        !targetElement &&
        (firstErrorField === "locationLat" || firstErrorField === "locationlng")
      ) {
        targetElement =
          document.querySelector(`[name="city"]`) ||
          document.getElementById("location-section");
      }
      if (
        !targetElement &&
        (firstErrorField === "workPlacelat" || firstErrorField === "workPlacelng")
      ) {
        targetElement = document.querySelector(`[name="workPlace"]`);
      }

      // 4. Fallback: find any visible error text in the form
      if (!targetElement) {
        targetElement = document.querySelector(
          ".italic.text-red-400, .italic.text-red-500, .italic.text-red-600"
        );
      }

      if (targetElement) {
        const scrollTarget =
          targetElement.offsetParent === null && targetElement.parentElement
            ? targetElement.closest("label") || targetElement.parentElement
            : targetElement;

        scrollTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        if (
          typeof targetElement.focus === "function" &&
          !targetElement.classList.contains("hidden") &&
          targetElement.offsetParent !== null
        ) {
          targetElement.focus({ preventScroll: true });
        }
      }
    }, 50);
  };
  return (
    <div className="bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your <span className="text-[#0a6e5c]">Worker</span> Account
          </h2>
          <p className="text-gray-500 mt-2">
            Join the most prestigious network of skilled workers.
          </p>
        </div>

        {onGoogleSignUp && (
          <div className="mb-6">
            <button
              type="button"
              onClick={onGoogleSignUp}
              disabled={isGoogleLoading || isGoogleVerified}
              className={`w-full flex items-center justify-center gap-3 rounded-xl px-4 py-2.5 font-medium transition-all duration-200 border border-gray-200 bg-white shadow-sm text-sm text-gray-700 ${
                isGoogleVerified
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 cursor-default"
                  : "hover:bg-gray-50 hover:-translate-y-px cursor-pointer"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              {isGoogleLoading
                ? "Connecting to Google…"
                : isGoogleVerified
                ? "Email Verified via Google"
                : "Sign up with Google"}
            </button>

            {googleError && (
              <div className="text-center bg-red-500/10 rounded-xl py-2 px-4 mt-2">
                <p className="italic text-red-600/90 text-xs">{googleError}</p>
              </div>
            )}

            {isGoogleVerified && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                <span>✓ Google email verified. No OTP verification required. Please complete your worker profile details below.</span>
              </div>
            )}

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or continue with details below</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm, handleFormError)} noValidate>
          <PersonalInfo
            worker={true}
            isGoogleVerified={isGoogleVerified}
            onClearGoogle={onClearGoogle}
          />
          <Location worker={true} />
          <CustomSelector section={"language"} />
          <CustomSelector section={"skill"} />
          <IdentityVerification />
          <Password />
          <TermsAndConditions />

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
                  OTP Sent Successfully
                </span>
              </div>
            }
          <button
            type="submit"
            className="w-full bg-[#0a6e5c] hover:bg-green-900/90 transition text-white font-semibold py-3.5 rounded-xl cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {onSwitchRole && (
          <div className="mt-6 text-center text-xs text-gray-500">
            Need tasks done instead?{" "}
            <button
              type="button"
              onClick={onSwitchRole}
              className="font-semibold text-[#0a6e5c] hover:underline"
            >
              Sign up as a Poster
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerSignupForm;
