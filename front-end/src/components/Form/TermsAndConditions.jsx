import React from "react";

const TermsAndConditions = () => {
  return (
    <div>
      {/* Terms */}
      <div className="flex items-center gap-3 pt-2 pb-2">
        <input type="checkbox" className="mt-1 w-4 h-4 accent-green-800" />

        <p className="text-xs text-gray-600 leading-relaxed">
          I agree to the{" "}
          <span className="text-[#0a6e5c] font-medium cursor-pointer">
            Terms & Conditions <span className="text-red-500">*</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
