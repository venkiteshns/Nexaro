import React from "react";
import PersonalInfo from "./PersonalInfo";
import { useFormContext } from "react-hook-form";
import Password from "./Password";

const LoginForm = ({ onFormSubmit }) => {
  const { handleSubmit } = useFormContext();

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
        <PersonalInfo worker={false} login={true} />
        <Password login={true} />
        <button type="submit" className="w-full mt-1 rounded-xl bg-[#0a6e5c] py-2 font-semibold text-white transition hover:opacity-90">
          Login to Nexaro
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
