import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HeaderWorkerSignup from "../../components/Worker/HeaderWorkerSignup";
import Header from "../../components/Landing/Header";
import WorkerSignupForm from "../../components/Form/WorkerSignupForm";
import OtpModal from "../../components/OtpModal/OtpModal";
import {
  useSendOtpMutation,
  useWorkerSignUpMutation,
} from "../../store/services/api";
import { setCredentials } from "../../store/Slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const WorkerSignup = () => {
  const methods = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState();
  const [isVerified, setIsVerified] = useState(false);

  const [
    sendOtp,
    {
      isLoading: isOtpLoading,
      isSuccess: isOtpSuccess,
      isError: isOtpError,
      error: otpError,
      data: otpData,
    },
  ] = useSendOtpMutation();

  const [
    workerSignUp,
    {
      isLoading: signUpLoading,
      isSuccess: isSignUpSuccess,
      isError: isSignUpError,
      error: signUpError,
      data: signUpData,
    },
  ] = useWorkerSignUpMutation();

  useEffect(() => {
    sendDataToBackend();
    console.log("isVerified ", isVerified);
  }, [isVerified]);

  const sendDataToBackend = async () => {
    if (!isVerified) return;
    let fd = new FormData()
    const textFields = [
      'name', 'email', 'phone', 'bio', 'country', 'state',
      'district', 'city', 'workPlace', 'id_type', 'password',
      'locationLat', 'locationlng', 'workPlacelat', 'workPlacelng',
    ];
    textFields.forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        fd.append(key, formData[key]);
      }
    });

    if (formData.skill) fd.append('skill', JSON.stringify(formData.skill));
    if (formData.language) fd.append('language', JSON.stringify(formData.language));

    const fileFields = ['id_front', 'id_back', 'selfie'];
    fileFields.forEach((key) => {
      const fileList = formData[key];
      if (fileList && fileList[0] instanceof File) {
        fd.append(key, fileList[0]);
      }
    });
    console.log("fd", fd);
    
    const res = await workerSignUp(fd).unwrap();
    console.log("signUpResponse Res ", res);
    dispatch(setCredentials({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken }));
    navigate("/worker/dashboard");
  };

  const resendOtp = async (email) => {
    console.log("resend", email, formData.phone, formData.email);
    const response = await sendOtp({
      email: formData.email,
      phone: formData.phone,
    }).unwrap();
    console.log(response);
    
  };

  const handleFormSubmit = async (data) => {
    try {
      let res = setEmail(data.email);
      setFormData(data);
      setShowOtp(true);
      const response = await sendOtp({
        email: data.email,
        phone: data.phone,
      }).unwrap();
      console.log(response)
    } catch (error) {
      console.log(error);
    }
    console.log("WorkerSignUp", data);
  };

  return (
    <div>
      <Header landing={false} />
      <HeaderWorkerSignup />
      <FormProvider {...methods}>
        <WorkerSignupForm onSubmitForm={handleFormSubmit} />
      </FormProvider>
      {showOtp && (
        <OtpModal
          show={setShowOtp}
          email={email}
          isVerified={setIsVerified}
          reSendOtp={resendOtp}
        />
      )}
    </div>
  );
};

export default WorkerSignup;
