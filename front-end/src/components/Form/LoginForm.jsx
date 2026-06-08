import React, { useEffect, useState } from "react";
import PersonalInfo from "./FormComponents/PersonalInfo";
import { useFormContext } from "react-hook-form";
import Password from "./FormComponents/Password";
import {
  useUpdatePasswordMutation,
  useUserLoginMutation,
  useGoogleLoginMutation,
} from "../../store/services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";
import ForgotPasswordModal from "./FormComponents/ForgotPasswordModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { handleSubmit } = useFormContext();
  const { reset } = useFormContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const [userLogin, { isLoading, isError, isSuccess, error, data, reset: loginReset }] =
    useUserLoginMutation();

  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const [
    updatePassword,
    {
      isError: updateError,
      isSuccess: updateSuccess,
      isLoading: updateLoading,
      error: updateErrorData,
      data: updateData,
    },
  ] = useUpdatePasswordMutation();

  useEffect(() => {
    if (forgotPassword) {
      reset();
      loginReset();
    }
  }, [forgotPassword])

  const handleLogin = async (data) => {
    try {
      let res = await userLogin(data).unwrap();
      if (res.user.role == "admin") {
        setIsAdmin(true);
        throw new Error("Not matching with user datas");
      }
      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      );
      navigate(`/${res.user.role}/dashboard`);
    } catch (err) {
      console.log(" error: ", err);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleError("");
      const res = await googleLogin(tokenResponse.access_token).unwrap();

      if (res.user.role === "admin") {
        setGoogleError("Invalid user credentials");
        return;
      }

      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );
      navigate(`/${res.user.role}/dashboard`);
    } catch (err) {
      setGoogleError(err?.data?.message || "Google login failed. Please try again.");
    }
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setGoogleError("Google sign-in was cancelled or failed."),
  });

  return (
    <div>
      {isPasswordUpdated && (
        <div className="text-center mb-3">
          <span className="italic text-green-600/90 text-sm bg-green-500/10 py-1.5 px-10 rounded-xl">
            Password updated successfully
          </span>
        </div>
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <PersonalInfo worker={false} login={true} />
        <Password login={true} forgotPassword={setForgotPassword} />
        {isError && (
          <div className="text-center bg-red-500/10 rounded-xl py-2 px-4">
            <p className="italic text-red-600/90 text-xs">
              {error?.data?.message || "Unable to connect to server. Please try again later"}
            </p>
          </div>
        )}
        {isAdmin && (
          <div className="text-center bg-red-500/10 rounded-xl py-2 px-4">
            <p className="italic text-red-600/90 text-sm">
              Invalid User credentials
            </p>
          </div>
        )}
        <button
          type="submit"
          className="w-full mt-1 rounded-xl bg-[#0a6e5c] py-2 font-semibold text-white transition hover:opacity-90"
        >
          {isLoading ? "Validating Credentials.." : "Login to Nexaro"}
        </button>
      </form>

      {/* divider */}
      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      {/* google login btn */}
      <button
        onClick={() => signInWithGoogle()}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        {isGoogleLoading ? "Signing in..." : "Continue with Google"}
      </button>

      {/* google err */}
      {googleError && (
        <div className="text-center bg-red-500/10 rounded-xl py-2 px-4 mt-3">
          <p className="italic text-red-600/90 text-sm">{googleError}</p>
        </div>
      )}

      {forgotPassword && (
        <ForgotPasswordModal
          isOpen={true}
          onClose={() => {
            setForgotPassword(false);
          }}
          role={"user"}
          isUpdateSuccess={setIsPasswordUpdated}
        />
      )}
    </div>
  );
};

export default LoginForm;

