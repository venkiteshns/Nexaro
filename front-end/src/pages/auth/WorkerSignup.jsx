import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HeaderWorkerSignup from "../../components/Worker/HeaderWorkerSignup";
import Header from "../../components/Landing/Header";
import WorkerSignupForm from "../../components/Form/WorkerSignupForm";
import OtpModal from "../../components/OtpModal/OtpModal";
import {
  useSendOtpMutation,
  useWorkerSignUpMutation,
  useGoogleLoginMutation,
} from "../../store/services/authApi";
import { setCredentials } from "../../store/Slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { showWarning } from '../../utils/toast.js';
import { uploadFileToS3 } from "../../utils/s3Upload.js";

const WorkerSignup = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const refCodeFromUrl = (searchParams.get("ref") || "").trim().toUpperCase();

  const methods = useForm({
    defaultValues: {
      referralCode: refCodeFromUrl,
      email: location.state?.googleUser?.email || "",
      name: location.state?.googleUser?.name || "",
    },
  });

  const [googleUser, setGoogleUser] = useState(location.state?.googleUser || null);
  const [isGoogleVerified, setIsGoogleVerified] = useState(
    Boolean(location.state?.isGoogleVerified && location.state?.googleUser?.email)
  );
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    if (refCodeFromUrl) {
      methods.setValue("referralCode", refCodeFromUrl, { shouldValidate: true });
    }
  }, [refCodeFromUrl, methods]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState();
  const [, setIsVerified] = useState(false);

  const [
    sendOtp,
    { isSuccess: isOtpSuccess, isError: isOtpError, error: otpError },
  ] = useSendOtpMutation();

  const [workerSignUp] = useWorkerSignUpMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

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
        // New user: prefill email & name, bypass OTP
        setGoogleUser(res.googleUser);
        setIsGoogleVerified(true);
        if (res.googleUser.email) {
          methods.setValue("email", res.googleUser.email, { shouldValidate: true });
        }
        if (res.googleUser.name && !methods.getValues("name")) {
          methods.setValue("name", res.googleUser.name, { shouldValidate: true });
        }
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
    methods.setValue("email", "");
  };

  const handleSwitchToPoster = () => {
    navigate("/signup/poster", {
      state: {
        googleUser,
        isGoogleVerified,
      },
    });
  };

  const sendDataToBackend = useCallback(async (dataToSubmit) => {
    const data = dataToSubmit || formData;
    if (!data) return;
    const fd = new FormData();

    const textFields = [
      "name",
      "email",
      "phone",
      "bio",
      "country",
      "state",
      "district",
      "city",
      "workPlace",
      "id_type",
      "password",
      "locationLat",
      "locationlng",
      "workPlacelat",
      "workPlacelng",
      "referralCode",
      "isGoogleAuth",
    ];

    textFields.forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        fd.append(key, data[key]);
      }
    });

    if (data.skill) fd.append("skill", JSON.stringify(data.skill));
    if (data.language)
      fd.append("language", JSON.stringify(data.language));

    const uploadedDocs = {};
    const uploadPromises = [];

    if (data.id_front?.[0] instanceof File) {
      uploadPromises.push(
        uploadFileToS3(data.id_front[0], `user/${data.email}/verification`).then((res) => {
          uploadedDocs.idFront = res;
        })
      );
    }
    if (data.id_back?.[0] instanceof File) {
      uploadPromises.push(
        uploadFileToS3(data.id_back[0], `user/${data.email}/verification`).then((res) => {
          uploadedDocs.idBack = res;
        })
      );
    }
    if (data.selfie?.[0] instanceof File) {
      uploadPromises.push(
        uploadFileToS3(data.selfie[0], `user/${data.email}/verification`).then((res) => {
          uploadedDocs.selfie = res;
        })
      );
    }

    if (uploadPromises.length > 0) {
      try {
        await Promise.all(uploadPromises);
        fd.append("uploadedDocuments", JSON.stringify(uploadedDocs));
      } catch (uploadErr) {
        console.warn("Direct S3 upload error, will fallback to server stream:", uploadErr);
        // Fallback: append raw files if S3 upload throws
        const fileFields = ["id_front", "id_back", "selfie"];
        fileFields.forEach((key) => {
          const fileList = data[key];
          if (fileList && fileList[0] instanceof File) {
            fd.append(key, fileList[0]);
          }
        });
      }
    }

    try {
      const res = await workerSignUp(fd).unwrap();
      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      );
      navigate("/worker/dashboard");
    } catch (err) {
      showWarning(err.data?.message);
      setIsVerified(false);
    }
  }, [formData, workerSignUp, navigate, dispatch]);

  const handleOtpVerified = () => {
    setIsVerified(true);
    sendDataToBackend();
  };

  const resendOtp = async () => {
    await sendOtp({
      email: formData.email,
      phone: formData.phone,
    }).unwrap();
  };

  const handleFormSubmit = async (data) => {
    if (isGoogleVerified) {
      // Google verified: directly submit without OTP!
      await sendDataToBackend({ ...data, isGoogleAuth: true });
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

  return (
    <div>
      <Header landing={false} />
      <HeaderWorkerSignup />
      <FormProvider {...methods}>
        <WorkerSignupForm
          onSubmitForm={handleFormSubmit}
          isOtpError={isOtpError}
          otpError={otpError}
          isOtpSuccess={isOtpSuccess}
          isGoogleVerified={isGoogleVerified}
          onClearGoogle={handleClearGoogle}
          onGoogleSignUp={signInWithGoogle}
          isGoogleLoading={isGoogleLoading}
          googleError={googleError}
          onSwitchRole={handleSwitchToPoster}
        />
      </FormProvider>
      {showOtp && (
        <OtpModal
          show={setShowOtp}
          email={email}
          isVerified={handleOtpVerified}
          reSendOtp={resendOtp}
        />
      )}
    </div>
  );
};

export default WorkerSignup;
