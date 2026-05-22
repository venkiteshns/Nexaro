import React,{useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import HeaderWorkerSignup from "../../components/Worker/HeaderWorkerSignup";
import Header from "../../components/Landing/Header";
import WorkerSignupForm from "../../components/Form/WorkerSignupForm";
import OtpModal from "../../components/OtpModal/OtpModal";

const WorkerSignup = () => {
  const methods = useForm();

  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState()

  const handleOtp = (otp) => {
    console.log("otp", otp);
  };

  const handleFormSubmit = (data) => {
    setEmail(data.email);
    setShowOtp(true);
    setFormData(data);
    console.log("WorkerSignUp", data);
  };

  return (
    <div>
      <Header landing={false} />
      <HeaderWorkerSignup />
      <FormProvider {...methods}>
        <WorkerSignupForm onSubmitForm={handleFormSubmit} />
      </FormProvider>
      {showOtp && <OtpModal show={setShowOtp} email={email} handleOtp={handleOtp}/>}
    </div>
  );
};

export default WorkerSignup;
