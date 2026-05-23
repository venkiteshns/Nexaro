import React, { useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import { useFormContext } from "react-hook-form";
import Password from "./Password";
import {
  useUpdatePasswordMutation,
  useUserLoginMutation,
} from "../../store/services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginForm = () => {
  const { handleSubmit } = useFormContext();
  const { reset } = useFormContext();
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [userLogin, { isLoading, isError, isSuccess, error, data, reset:loginReset }] =
    useUserLoginMutation();

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
      console.log("Login User : ", data);
      console.log("User Login Res : ", res.user.role);
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
          <div className="text-center">
            <span className="italic text-red-600/90 text-sm bg-red-500/10 py-1.5 px-10 rounded-xl">
              {error.data.message}
            </span>
          </div>
        )}
        {isAdmin && (
          <div className="text-center bg-red-500/10 py-1.5 rounded-xl">
            <span className="italic text-red-600/90 text-sm">
              Credentials is not matching with user datas
            </span>
          </div>
        )}
        <button
          type="submit"
          className="w-full mt-1 rounded-xl bg-[#0a6e5c] py-2 font-semibold text-white transition hover:opacity-90"
        >
          {isLoading ? "Validating Credentials.." : "Login to Nexaro"}
        </button>
      </form>
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
