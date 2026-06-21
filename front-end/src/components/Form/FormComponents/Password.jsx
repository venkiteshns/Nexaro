import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useFormContext } from "react-hook-form";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Password = (props) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const login = props?.login;
  const forgot = props?.forgotPassword;

  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div
      className={`${login ? "" : "mt-5 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm"}`}
    >
      {/* Passwords */}
      <div
        className={` ${login ? "grid-cols-2 gap-5" : "grid grid-cols-1 md:grid-cols-2 gap-5 "} `}
      >
        <div className="relative">
          <label className="text-xs text-gray-700/80">
            Password <span className="text-red-500">*</span>
          </label>

          <input
            {...register("password", {
              required: "Please enter password",

              ...(login
                ? {}
                : {
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters needed",
                    },

                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,

                      message:
                        "Include at least one uppercase & lowercase letter, one number, one special character",
                    },
                  }),
            })}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete={login ? "current-password" : "new-password"}
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
        {login && (
          <div className="flex mt-4 items-center justify-end gap-4">
            <button
              onClick={() => {
                forgot(true);
              }}
              type="button"
              className="text-xs font-semibold text-[#0A6E5C]/80 hover:text-[#075848] transition"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {!login && (
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
              autoComplete="new-password"
              className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
            />
            <span
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
              className="absolute right-3 top-[35px] text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? (
                <Eye size={18} />
              ) : (
                <EyeClosed size={18} />
              )}
            </span>

            {errors.confirmPassword && (
              <span className="italic text-red-400/90 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Password;
