import React, { useState } from "react";
import "./Admin.css";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import Logo from "../Logo/Logo";
import PersonalInfo from "../Form/PersonalInfo";
import Password from "../Form/Password";

const AdminLoginForm = () => {

    const handleLogin = (data) => {
        console.log("login :",data)
    }

  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm();

  return (
      <div className="min-h-[100vh] flex-1 flex items-center  justify-center px-6 py-12 ">

        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 lg:hidden flex items-center gap-3">
          <div>
            <Logo />
            <p className="text-xs text-[#6B7280]">Admin Control Center</p>
          </div>
        </div>

        {/* Login */}
        <div className="w-full max-w-md bg-white/80  border border-[#E5ECE8] rounded-[32px] p-8 sm:p-10 ">
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-semibold banner-text tracking-tight text-[#111827]">
                Welcome Back <span className="text-[#0a6e5c]">Admin</span>
              </h2>

              <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                Please enter your administrative credentials
              </p>
            </div>

            {/* FORM */}
            <FormProvider {...methods}>
              <form className="space-y-6" onSubmit={methods.handleSubmit(handleLogin)}>
                <PersonalInfo worker={false} login={true} />
                <Password login={true} />

                {/* Login Button */}
                <div className="flex justify-center" >
                <button
                  type="submit"
                  className=" w-60 mt- rounded-xl bg-[#0a6e5c] py-2 font-semibold text-white transition hover:opacity-90"
                >
                  Login to Admin Panel
                </button>
                </div>
              </form>
            </FormProvider>

            {/* Footer */}
            <div className="mt-7 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-[#7A8580]">
                <Lock className="w-4 h-4" />
                Authorized admin access only
              </div>
            </div>
          </div>
        </div>

      </div>
  );
};

export default AdminLoginForm;
