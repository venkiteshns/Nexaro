import { useEffect, useState } from "react";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import PosterSignupForm from "../../components/Form/PosterSignupForm";
import Logo from "../../components/Logo/Logo";
import Header from "../../components/Landing/Header";
import OtpModal from "../../components/OtpModal/OtpModal";
import {
  usePosterSignUpMutation,
  useSendOtpMutation,
} from "../../store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";
import { useNavigate } from "react-router-dom";

const PosterSignup = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState();
  const [isVerified, setIsVerified] = useState(false);

  const [sendOtp, { isLoading, isSuccess, isError, error, data }] =
    useSendOtpMutation();

  const [
    posterSignUp,
    {
      isLoading: signUpLoading,
      isSuccess: isSignUpSuccess,
      isError: isSignUpError,
      error: signUpError,
      data: signUpData,
    },
  ] = usePosterSignUpMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resendOtp = async (email) => {
    try {
      await sendOtp({
        email: formData.email,
        phone: formData.phone,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormData = async (data) => {
    console.log("signup page", data);
    try {
      setEmail(data.email);
      setFormData(data);
      await sendOtp({
        email: data.email,
        phone: data.phone,
      }).unwrap();
      setShowOtp(true);
    } catch (error) {
      console.log(error);
    }
  };

  const sendDataToBackend = async () => {
    if (!isVerified) return;
    let res = await posterSignUp(formData).unwrap();
    console.log("signUpResponse Res ", res);
    dispatch(
      setCredentials({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      }),
    );
    navigate("/poster/dashboard");
  };

  useEffect(() => {
    sendDataToBackend();
  }, [isVerified]);

  return (
    <div className="grid grid-cols-16">
      <Header landing={false} />
      <span className="hidden lg:block lg:col-span-7 mt-15">
        <PosterSignUpBanner />
      </span>
      <div className="lg:hidden col-span-16 justify-items-center mt-20">
        <Logo />
        <h1 className="banner text-4xl mt-3 font-semibold text-center">
          Skills Meet <br /> Needs.
          <span className="italic text-[#0A6E5C]"> Instantly.</span>
        </h1>
      </div>
      <span className="col-span-16 lg:col-span-9 mt-15">
        <PosterSignupForm
          onSubmitForm={handleFormData}
          isVerified={isVerified}
          otpStatus={{ isLoading, isSuccess, isError, error, data }}
          formStatus={{
            signUpLoading,
            isSignUpSuccess,
            isSignUpError,
            signUpError,
            signUpData,
          }}
        />
      </span>
      {showOtp && (
        <OtpModal
          show={setShowOtp}
          email={email}
          reSendOtp={resendOtp}
          isVerified={setIsVerified}
        />
      )}
    </div>
  );
};

export default PosterSignup;
