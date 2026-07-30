import { useNavigate } from "react-router-dom";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import Logo from "../../components/Logo/Logo";
import LoginForm from "../../components/Form/LoginForm";
import { useForm, FormProvider } from "react-hook-form";

const UserLogin = () => {
  const navigate = useNavigate();
  const methods = useForm();

  const handleRegister = () => {
    navigate("/", { state: { scrollToGetStarted: true } });
  };

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2"
      style={{
        background:
          "linear-gradient(160deg, #f0fdf8 0%, #ffffff 50%, #ecfdf5 100%)",
      }}
    >
      {/* Left banner — desktop only */}
      <span className="hidden lg:block lg:col-span-1">
        <PosterSignUpBanner />
      </span>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-10 mt-10">
        <div
          className="w-full max-w-md rounded-3xl p-10"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(10,110,92,0.12)",
            boxShadow:
              "0 8px 40px rgba(10,110,92,0.10), 0 1px 4px rgba(0,0,0,0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="lg:hidden text-2xl font-bold tracking-wide text-[#0A6E5C] mb-3">
              <Logo />
            </h2>
            <div className="text-center mt-2">
              {/* Top accent line */}
              <div
                className="w-10 h-0.5 rounded-full mx-auto mb-4"
                style={{
                  background: "linear-gradient(90deg, #0a6e5c, #10b981)",
                }}
              />
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#0d1f1a", fontFamily: '"DM Serif Display", serif' }}
              >
                Welcome Back
              </h1>
              <p
                className="mt-1.5 text-xs tracking-wide"
                style={{ color: "#6b7280", fontFamily: '"DM Sans", sans-serif' }}
              >
                Login to continue to Nexaro
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <FormProvider {...methods}>
              <LoginForm />
            </FormProvider>
          </div>

          {/* Register link */}
          <p
            className="mt-8 text-center text-xs"
            style={{ color: "#9ca3af", fontFamily: '"DM Sans", sans-serif' }}
          >
            Don&apos;t have an account?{" "}
            <button
              onClick={handleRegister}
              className="font-semibold transition hover:underline"
              style={{ color: "#0a6e5c" }}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
