import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useLazyValidateReferralCodeQuery } from "../../../store/services/referralApi";
import { Gift, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const ReferralInput = () => {
  const { register, setValue, watch } = useFormContext();
  const currentCode = watch("referralCode") || "";

  const [triggerValidate, { isFetching }] = useLazyValidateReferralCodeQuery();
  const [validationResult, setValidationResult] = useState({
    code: "",
    valid: false,
    message: "",
    referrerName: "",
  });

  const trimmed = currentCode.trim().toUpperCase();
  const validationState = {
    checked: Boolean(trimmed && validationResult.code === trimmed),
    valid: validationResult.valid,
    message: validationResult.message,
    referrerName: validationResult.referrerName,
  };

  useEffect(() => {
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await triggerValidate(trimmed).unwrap();
        if (res?.valid) {
          setValidationResult({
            code: trimmed,
            valid: true,
            referrerName: res.referrerName,
            message: `Invited by ${res.referrerName || "a Nexaro User"}! You'll get a ₹50 Welcome Bonus.`,
          });
        } else {
          setValidationResult({
            code: trimmed,
            valid: false,
            referrerName: "",
            message: res?.message || "Invalid or expired referral code",
          });
        }
      } catch (err) {
        setValidationResult({
          code: trimmed,
          valid: false,
          referrerName: "",
          message: err?.data?.message || "Invalid referral code",
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [trimmed, triggerValidate]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, "");
    setValue("referralCode", val, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-2.5 sm:mt-3">
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <label
          className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium text-gray-700 truncate"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          <Gift size={13} className="text-[#0A6E5C] shrink-0" />
          <span className="whitespace-nowrap">Referral Code</span>
          <span className="text-gray-400 font-normal text-[10px] sm:text-[11px] whitespace-nowrap">(Optional)</span>
        </label>
        <span className="text-[10px] sm:text-[11px] text-[#0A6E5C] font-semibold bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
          Get ₹50<span className="hidden sm:inline"> Welcome</span> Bonus
        </span>
      </div>

      <div className="relative">
        <input
          {...register("referralCode")}
          onChange={handleChange}
          type="text"
          maxLength={15}
          placeholder="e.g. NEX7A3B19"
          className="placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 w-full rounded-lg sm:rounded-xl border px-3 py-2 sm:px-4 sm:py-2.5 pr-9 sm:pr-10 outline-none transition-all duration-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700/40 text-xs sm:text-sm tracking-wider uppercase font-medium text-gray-800"
          style={{
            borderColor: validationState.checked
              ? validationState.valid
                ? "#10b981"
                : "#f43f5e"
              : "rgba(10,110,92,0.18)",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 1px 4px rgba(10,110,92,0.05)",
          }}
        />

        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          {isFetching ? (
            <Loader2 size={15} className="animate-spin text-gray-400" />
          ) : validationState.checked ? (
            validationState.valid ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <XCircle size={16} className="text-rose-500" />
            )
          ) : null}
        </div>
      </div>

      {validationState.checked && (
        <div className="mt-1.5 flex items-center gap-1.5">
          {validationState.valid ? (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ {validationState.message}
            </p>
          ) : (
            <p className="text-xs text-rose-500 font-medium">
              ✕ {validationState.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralInput;
