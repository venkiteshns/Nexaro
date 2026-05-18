import React from "react";
import { useFormContext } from "react-hook-form";

const TermsAndConditions = () => {
  const {register, formState:{errors}} = useFormContext()
  return (
    <div>
      {/* Terms */}
      <div className="flex items-center gap-3 pt-2 pb-2">
        <input {...register('terms',{
          required: "Accept terms and conditions to proceed"
        })} type="checkbox" className="mt-1 w-4 h-4 accent-green-800" />

        <p className="text-xs text-gray-600 leading-relaxed">
          I agree to the{" "}
          <span className="text-[#0a6e5c] font-medium cursor-pointer">
            Terms & Conditions <span className="text-red-500">*</span>
          </span>
        </p> 
      </div>
      {errors.terms && <p className="ms-7 mb-5 italic text-red-400/90 text-xs">{errors.terms.message}</p>}
    </div>
  );
};

export default TermsAndConditions;
