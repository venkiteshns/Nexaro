import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Logo from "../Logo/Logo";

const OTP_LENGTH = 6;

const OtpModal = ({ show, handleOtp, email }) => {
  const [time, setTime] = useState(10);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  //   useEffect Timer
  useEffect(() => {
    if (time <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  // Functions

  const handleResendOtp = () => {
    if (!canResend || resendCount >= 4) return;

    if(resendCount == 4) return
    // API call here
    setResendCount((prev) => prev + 1);
    setCanResend(false);
    setTime(10);

    console.log("OTP resent");
  };

  const handleClose = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    show(false);
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const updatedOtp = [...otp];

      if (updatedOtp[index]) {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const updatedOtp = [...otp];

    pastedData.split("").forEach((char, i) => {
      updatedOtp[i] = char;
    });

    setOtp(updatedOtp);
  };

  const finalOtp = otp.join("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-dashed border-green-800/70 bg-white/90 backdrop-blur-md shadow-2xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 flex flex-col items-center gap-6">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-600/80 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Logo />

          <p className="italic text-xs sm:text-sm text-gray-600 mt-2">
            Please enter the OTP received in{" "}
            <span className="text-green-800 text-xs">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div
          onPaste={handlePaste}
          className="flex items-center justify-center gap-2 sm:gap-3"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
              text-center text-lg sm:text-xl font-semibold
              rounded-xl border border-dashed border-green-800/70
              bg-gray-700/10 outline-none
              focus:ring-2 focus:ring-green-800/20
              focus:border-black transition-all"
            />
          ))}
        </div>

        {/* Resend button */}
        {resendCount >= 4 ? (
          <p className="text-xs text-red-600/70 text-center font-medium">
            For security reasons, resend OTP is limited
          </p>
        ) : (
          <button
            disabled={!canResend}
            onClick={handleResendOtp}
            className={`text-sm font-semibold transition
                ${
                canResend
                    ? "text-blue-700  cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                    >
            {canResend ? "Resend OTP" : `Resend OTP in ${time}s`}
          </button>
        )}
        {/* Verify */}
        <button
          disabled={finalOtp.length != 6}
          onClick={() => handleOtp(finalOtp)}
          className={`w-full rounded-xl py-3 font-semibold md:font-bold text-white transition
                ${
                  finalOtp.length === 6
                    ? "bg-green-900/90 hover:bg-green-800 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed opacity-70"
                }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
