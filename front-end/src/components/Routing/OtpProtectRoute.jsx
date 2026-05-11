import { Navigate, Outlet } from 'react-router-dom';

const OtpProtectRoute = () => {
  // Check for OTP verification token in sessionStorage
  const otpToken = sessionStorage.getItem('otpToken');
  
  // You might also want to check if there's an email stored
  // const otpEmail = sessionStorage.getItem('otpEmail');

  // If there's no OTP token, redirect to signup
  if (!otpToken) {
    return <Navigate to="/signup/worker" replace />; // Redirecting to worker signup by default
  }

  return <Outlet />;
};

export default OtpProtectRoute;
