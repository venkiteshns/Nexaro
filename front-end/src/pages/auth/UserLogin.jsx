import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import Header from "../../components/Landing/Header";
import Logo from "../../components/Logo/Logo";
import LoginForm from "../../components/Form/LoginForm";
import { useForm, FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";

const UserLogin = () => {

  const navigate = useNavigate();
  const methods = useForm();

  const handleRegister = () => {
    navigate("/", { state: { scrollToGetStarted: true } });
  };

  return (
    <div className="bg-green-200/20 min-h-screen grid grid-cols-1 lg:grid-cols-2 lg:bg-white">
      <span className="hidden lg:block lg:col-span-1 ">
        <PosterSignUpBanner />
      </span>

      {/* Right Section */}
      <div className="flex  items-center justify-center px-6 py-10 mt-10">
        <div className="w-full max-w-md bg-white border border-green-100 rounded-3xl shadow-2xl shadow-green-100 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="lg:hidden  text-2xl font-bold tracking-wide text-[#0A6E5C]">
              <Logo />
            </h2>
            {/* Heading */}
            <div className="text-center mt-2">
              <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-xs text-gray-500">Login to continue</p>
            </div>
          </div>


          {/* Form */}
          <div className="space-y-6">
            <FormProvider {...methods}>
              <LoginForm />
            </FormProvider>
          </div>

          {/* Register */}
          <p className="mt-10 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <button onClick={handleRegister} className="font-semibold text-[#0A6E5C] hover:underline">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
