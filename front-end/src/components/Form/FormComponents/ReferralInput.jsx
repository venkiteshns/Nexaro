import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useLazyValidateReferralCodeQuery } from "../../../store/services/referralApi";
import { Gift, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const ReferralInput = () => {
  const { register, setValue, watch } = useFormContext();
  const currentCode = watch("referralCode") || "";

  const [triggerValidate, { isFetching }] = useLazyValidateReferralCodeQuery();
  const [validationState, setValidationState] = useState({
    checked: false,
    valid: false,
    message: "",
    referrerName: "",
  });

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    const trimmed = currentCode.trim().toUpperCase();

    if (!trimmed) {
      setValidationState({
        checked: false,
        valid: false,
        message: "",
        referrerName: "",
      });
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await triggerValidate(trimmed).unwrap();
        if (res?.valid) {
          setValidationState({
            checked: true,
            valid: true,
            referrerName: res.referrerName,
            message: `Invited by ${res.referrerName || "a Nexaro User"}! You'll get a ₹50 Welcome Bonus.`,
          });
        } else {
          setValidationState({
            checked: true,
            valid: false,
            referrerName: "",
            message: res?.message || "Invalid or expired referral code",
          });
        }
      } catch (err) {
        setValidationState({
          checked: true,
          valid: false,
          referrerName: "",
          message: err?.data?.message || "Invalid referral code",
        });
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentCode, triggerValidate]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, "");
    setValue("referralCode", val, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <label
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "#374151", fontFamily: '"DM Sans", sans-serif' }}
        >
          <Gift size={14} className="text-[#0A6E5C]" />
          Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <span className="text-[11px] text-[#0A6E5C] font-medium">
          Get ₹50 Welcome Bonus
        </span>
      </div>

      <div className="relative">
        <input
          {...register("referralCode")}
          onChange={handleChange}
          type="text"
          maxLength={15}
          placeholder="e.g. NEX7A3B19"
          className="placeholder:text-sm placeholder:text-gray-400 w-full rounded-xl border px-4 py-2.5 pr-10 outline-none transition-all duration-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700/40 text-sm tracking-wider uppercase font-medium text-gray-800"
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

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          {isFetching ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : validationState.checked ? (
            validationState.valid ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <XCircle size={18} className="text-rose-500" />
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
