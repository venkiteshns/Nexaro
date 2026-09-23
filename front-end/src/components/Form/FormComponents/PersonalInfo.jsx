import { useFormContext } from "react-hook-form";
import ReferralInput from "./ReferralInput";
import { CheckCircle2 } from "lucide-react";

const PersonalInfo = (props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const worker = props?.worker;
  const login = props?.login;
  const isGoogleVerified = props?.isGoogleVerified;
  const onClearGoogle = props?.onClearGoogle;

  return (
    <div className={`${login ? "w-full" :"mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm"}`}>
      {!login && <div >
        <label className="block text-xs font-medium mb-1" style={{ color: "#374151", fontFamily: '"DM Sans", sans-serif' }}>
          Name <span className="text-red-400">*</span>
        </label>

        <input
          {...register("name", {
            required: "Please enter your name",
          })}
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          className="placeholder:text-sm placeholder:text-gray-400 w-full rounded-xl border px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700/40 text-sm"
          style={{ borderColor: "rgba(10,110,92,0.18)", background: "rgba(255,255,255,0.9)", boxShadow: "0 1px 4px rgba(10,110,92,0.05)" }}
        />
        {errors.name && (
          <span className="italic text-red-400/90 text-xs">
            {errors.name.message}
          </span>
        )}
      </div>
}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full" >
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium" style={{ color: "#374151", fontFamily: '"DM Sans", sans-serif' }}>
              Email <span className="text-red-400">*</span>
            </label>
            {isGoogleVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified via Google
              </span>
            )}
          </div>

          <input
            {...register("email", {
              required: "Please enter your Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid Email",
              },
            })}
            type="email"
            readOnly={isGoogleVerified}
            autoComplete="email"
            placeholder="Enter your email"
            className={`placeholder:text-sm placeholder:text-gray-400 w-full rounded-xl border px-4 py-2.5 outline-none transition-all duration-200 text-sm ${
              isGoogleVerified
                ? "bg-emerald-50/50 text-gray-700 cursor-not-allowed border-emerald-300/60"
                : "focus:ring-2 focus:ring-green-700/20 focus:border-green-700/40"
            }`}
            style={{
              borderColor: isGoogleVerified ? "rgba(16,185,129,0.4)" : "rgba(10,110,92,0.18)",
              background: isGoogleVerified ? "rgba(240,253,248,0.85)" : "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 4px rgba(10,110,92,0.05)",
            }}
          />
          {errors.email && (
            <span className="italic text-red-400/90 text-xs">
              {errors.email.message}
            </span>
          )}
          {isGoogleVerified && onClearGoogle && (
            <button
              type="button"
              onClick={onClearGoogle}
              className="text-[11px] font-medium text-[#0A6E5C] hover:underline mt-1 inline-block"
            >
              Use a different email
            </button>
          )}
        </div>

        {!login &&  <div>
          <label className="text-xs text-gray-700/80">
            Phone <span className="text-red-500">*</span>
          </label>

          <input
            {...register("phone", {
              required: "Please enter your phone number",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10 digit phone number",
              },
            })}
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            className="placeholder:text-sm placeholder:text-gray-400 w-full rounded-xl border px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700/40 text-sm"
          style={{ borderColor: "rgba(10,110,92,0.18)", background: "rgba(255,255,255,0.9)", boxShadow: "0 1px 4px rgba(10,110,92,0.05)" }}
          />
          {errors.phone && (
            <span className="italic text-red-400/90 text-xs">
              {errors.phone.message}
            </span>
          )}
        </div>
        }
      </div>

      {!login && <ReferralInput />}

      {worker && (
        <div>
          <label className="text-xs text-gray-700/80">Bio</label>
          <textarea
            placeholder="Write something..."
            {...register("bio", {
              pattern: {
                value: /^(?=.{2,}$)[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
                message:
                  "No special characters are allowded. Please enter atleast 2 / more letters.",
              },
            })}
            rows={5}
            className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-800
               outline-none
                focus:border-green-600
                focus:ring-1 focus:ring-green-800
                placeholder:text-gray-400
              "
          />
          {errors.bio && (
            <span className="italic text-red-400/90 text-xs">
              {errors.bio.message}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
