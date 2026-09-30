import { useCallback, useState } from "react";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import PosterSignupForm from "../../components/Form/PosterSignupForm";
import Logo from "../../components/Logo/Logo";
import Header from "../../components/Landing/Header";
import { showWarning } from '../../utils/toast.js';
import OtpModal from "../../components/OtpModal/OtpModal";
import {
  usePosterSignUpMutation,
  useSendOtpMutation,
  useGoogleLoginMutation,
} from "../../store/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/UserSlice";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const PosterSignup = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const refCodeFromUrl = (searchParams.get("ref") || "").trim().toUpperCase();

  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [signupError, setSignupError] = useState("");

  const [googleUser, setGoogleUser] = useState(location.state?.googleUser || null);
  const [isGoogleVerified, setIsGoogleVerified] = useState(
    Boolean(location.state?.isGoogleVerified && location.state?.googleUser?.email)
  );
  const [googleError, setGoogleError] = useState("");

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

  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleError("");
      const res = await googleLogin(tokenResponse.access_token).unwrap();

      if (res.user?.role === "admin") {
        setGoogleError("Invalid user credentials");
        return;
      }

      if (res.exists === true || res.user) {
        // User account exists: log them in immediately!
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        const targetRoute = res.user.role === "worker" ? "/worker/dashboard" : "/poster/my-tasks";
        navigate(targetRoute);
        return;
      }

      if (res.exists === false) {
        // New user: prefill form with Google email & name, bypass OTP
        setGoogleUser(res.googleUser);
        setIsGoogleVerified(true);
      }
    } catch (err) {
      setGoogleError(err?.data?.message || "Google authentication failed. Please try again.");
    }
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setGoogleError("Google sign-in was cancelled or failed."),
  });

  const handleClearGoogle = () => {
    setGoogleUser(null);
    setIsGoogleVerified(false);
  };

  const handleSwitchToWorker = () => {
    navigate("/signup/worker", {
      state: {
        googleUser,
        isGoogleVerified,
      },
    });
  };

  const resendOtp = async () => {
    try {
      await sendOtp({
        email: formData.email,
        phone: formData.phone,
      }).unwrap();
    } catch {
      // ignore
    }
  };

  const handleFormData = async (data) => {
    if (isGoogleVerified) {
      // Google verified: directly sign up without OTP!
      try {
        setSignupError("");
        const res = await posterSignUp({ ...data, isGoogleAuth: true }).unwrap();
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        navigate("/poster/my-tasks");
      } catch (err) {
        const msg = err?.data?.message || "Signup failed. Please try again.";
        setSignupError(msg);
        showWarning(msg);
      }
      return;
    }

    try {
      setEmail(data.email);
      setFormData(data);
      await sendOtp({
        email: data.email,
        phone: data.phone,
      }).unwrap();
      setShowOtp(true);
    } catch {
      // ignore
    }
  };

  const sendDataToBackend = useCallback(
    async (overrideData) => {
      const dataToSubmit = overrideData || formData;
      if (!dataToSubmit) return;
      try {
        setSignupError("");
        let res = await posterSignUp(dataToSubmit).unwrap();
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        navigate("/poster/my-tasks");
      } catch (err) {
        const msg = err?.data?.message || "Signup failed. Please try again.";
        setSignupError(msg);
        showWarning(msg);
        setIsVerified(false);
      }
    },
    [navigate, dispatch, posterSignUp, formData],
  );

  const handleOtpVerified = () => {
    setIsVerified(true);
    sendDataToBackend();
  };

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
          initialReferralCode={refCodeFromUrl}
          initialEmail={googleUser?.email || ""}
          initialName={googleUser?.name || ""}
          isGoogleVerified={isGoogleVerified}
          onClearGoogle={handleClearGoogle}
          onGoogleSignUp={signInWithGoogle}
          isGoogleLoading={isGoogleLoading}
          googleError={googleError}
          onSwitchRole={handleSwitchToWorker}
          signupError={signupError}
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
          isVerified={handleOtpVerified}
        />
      )}
    </div>
  );
};

export default PosterSignup;
