import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useFormContext } from "react-hook-form";

const Password = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <label className="text-xs text-gray-700/80">
            Password <span className="text-red-500">*</span>
          </label>

          <input
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 8, message: "Minimum 8 characters needed" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message:
                  "Include at least one uppercase & lowercase letter, one number, one speacial character",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
          <span
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-3 top-[35px] text-gray-500 cursor-pointer"
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>
          {errors.password && (
            <span className="italic text-red-400/90 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="relative">
          <label className="text-xs text-gray-700/80">
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Password do not match",
            })}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
          <span
            onClick={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            className="absolute right-3 top-[35px] text-gray-500 cursor-pointer"
          >
            {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>

          {errors.confirmPassword && (
            <span className="italic text-red-400/90 text-xs">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Password;
