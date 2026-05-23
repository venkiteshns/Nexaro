import React, { useEffect, useState } from "react";
import "./Admin.css";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import Logo from "../Logo/Logo";
import PersonalInfo from "../Form/PersonalInfo";
import Password from "../Form/Password";
import { useDispatch } from "react-redux";
import { useAdminLoginMutation } from "../../store/services/api";
import { setAdminCredentials } from "../../store/Slices/AdminSlice";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../Form/ForgotPasswordModal";

const AdminLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adminLogin, { isLoading, isError, error, reset }] = useAdminLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const methods = useForm();

  useEffect(() => {
    if (forgotPassword) {
      methods.reset();
      reset()
    }
  }, [forgotPassword]);

  const handleLogin = async (data) => {
    try {
      const res = await adminLogin(data).unwrap();
      if (res.user.role != "admin") {
        setIsAdmin(false);
        return;
      }
      console.log(res.success);
      
      if (res.success) {
        dispatch(
          setAdminCredentials({
            admin: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        navigate(`/admin/dashboard`);
      }
    } catch (err) {
      console.log("Admin login error:", err);
    }
  };

  useEffect(() => {
    console.log("forgot ", forgotPassword);
  }, [forgotPassword]);

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
          {isPasswordUpdated && (
            <div className="text-center mb-3">
              <span className="italic text-green-600/90 text-sm bg-green-500/10 py-1.5 px-10 rounded-xl">
                Password updated successfully
              </span>
            </div>
          )}
          {/* FORM */}
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(handleLogin)}
            >
              <PersonalInfo worker={false} login={true} />
              <Password login={true} forgotPassword={setForgotPassword} />

              {/* Login Button */}
              {!isAdmin && (
                <div className="text-center">
                  <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                    Invalid admin credentials
                  </span>
                </div>
              )}
              {isError && (
                <div className="text-center">
                  <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
                    {error?.data?.message || "Invalid admin credentials"}
                  </span>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={` w-60 mt- rounded-xl  py-2 font-semibold text-white transition  
                    ${isLoading ? "bg-[#0a6e5c]/70 cursor-not-allowed" : "bg-[#0a6e5c] hover:opacity-90"}`}
                >
                  {isLoading ? "Processing " : "Login to Admin Panel"}
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
      {forgotPassword && (
        <ForgotPasswordModal
          isOpen={true}
          onClose={() => {
            setForgotPassword(false);
          }}
          isUpdateSuccess={setIsPasswordUpdated}
        />
      )}
    </div>
  );
};

export default AdminLoginForm;
