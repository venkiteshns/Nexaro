import React, { useState } from "react";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import Header from "../../components/Landing/Header";
import Logo from "../../components/Logo/Logo";
import LoginForm from "../../components/Form/LoginForm";
import { useForm, FormProvider } from "react-hook-form";
import OtpModal from "../../components/OtpModal/OtpModal";

const UserLogin = () => {

  const methods = useForm();

  const handleLogin = (data) => {
    console.log("Login User : ", data);
  };
 
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      <Header landing={false} />
      <span className="hidden lg:block lg:col-span-1 mt-15">
        <PosterSignUpBanner />
      </span>

      {/* Right Section */}
      <div className="flex  items-center justify-center px-6 py-10 mt-10 bg-white">
        <div className="w-full max-w-md bg-white border border-green-100 rounded-3xl shadow-2xl shadow-green-100 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-2xl font-bold tracking-wide text-[#0A6E5C]">
              <Logo />
            </h2>
          {/* Heading */}
          <div className="text-center mt-2">
            <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-500">Login to continue</p>
          </div>
          </div>


          {/* Form */}
          <div className="mt-10 space-y-6">
            <FormProvider {...methods}>
              <LoginForm onFormSubmit = {handleLogin} />
            </FormProvider>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200"></div>

              <span className="text-sm text-gray-400">or continue with</span>

              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Google Button */}
            <button className=" text-sm w-full rounded-xl border border-gray-200 bg-white py-4 font-medium text-gray-700 transition hover:bg-gray-50">
              Sign in with Google
            </button>
          </div>

          {/* Register */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button className="font-semibold text-[#0A6E5C] hover:underline">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
