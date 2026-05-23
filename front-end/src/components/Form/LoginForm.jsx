import React, { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import { useFormContext } from "react-hook-form";
import Password from "./Password";
import { useUserLoginMutation } from "../../store/services/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";

const LoginForm = () => {
  const { handleSubmit } = useFormContext();

  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);

  const [userLogin, { isLoading, isError, isSuccess, error, data }] =
    useUserLoginMutation();

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
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <PersonalInfo worker={false} login={true} />
        <Password login={true} />
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
    </div>
  );
};

export default LoginForm;
