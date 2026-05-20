import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import HeaderWorkerSignup from "../../components/Worker/HeaderWorkerSignup";
import Header from "../../components/Landing/Header";
import WorkerSignupForm from "../../components/Form/WorkerSignupForm";

const WorkerSignup = () => {
  const methods = useForm();

  const handleFormSubmit = (data) => {
    console.log("WorkerSignUp", data);
  };

  return (
    <div>
      <Header landing={false} />
      <HeaderWorkerSignup />
      <FormProvider {...methods}>
        <WorkerSignupForm onSubmitForm={handleFormSubmit} />
      </FormProvider>
    </div>
  );
};

export default WorkerSignup;
