import React from "react";
import { useFormContext } from "react-hook-form";

const PersonalInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      {/* Name */}
      <div>
        <label className="text-xs text-gray-700/80">Name</label>

        <input
          {...register("name", {
            required: "Please enter your name",
          })}
          type="text"
          placeholder="Enter your name"
          className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
        />
        {errors.name && (
          <span className="italic text-red-400/90 text-xs">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        {/* Email */}
        <div>
          <label className="text-xs text-gray-700/80">
            Email
          </label>

          <input
            {...register("email", {
              required: "Please enter your Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid Email",
              },
            })}
            type="email"
            placeholder="Enter your email"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
          {errors.email && (
            <span className="italic text-red-400/90 text-xs">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs text-gray-700/80">
            Phone
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
            placeholder="Enter your phone number"
            className="placeholder:text-sm placeholder:text-gray-900/40 w-full rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-1 focus:ring-green-800"
          />
          {errors.phone && (
            <span className="italic text-red-400/90 text-xs">
              {errors.phone.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
