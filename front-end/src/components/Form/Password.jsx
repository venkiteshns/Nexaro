import React from "react";
import { useFormContext } from "react-hook-form";

const Password = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const password = watch("password");
  return (
    <div>
      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs text-gray-700/80">Password</label>

          <input
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 8, message: "Minimum 8 characters needed" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message: "Include at least one uppercase & lowercase letter, one number, one speacial character",
              },
            })}
            type="password"
            placeholder="••••••••••••"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
          {errors.password && (
            <span className="italic text-red-400/90 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-700/80">Confirm Password</label>

          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Password do not match",
            })}
            type="password"
            placeholder="Confirm password"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
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
