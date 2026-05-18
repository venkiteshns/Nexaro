import React from "react";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import PosterSignupForm from "../../components/Form/PosterSignupForm";
import Logo from "../../components/Logo/Logo";
import Header from "../../components/Landing/Header";

const PosterSignup = () => {
  return (
    <div className="grid grid-cols-16">
      <Header landing={false} />
      <span className="hidden lg:block lg:col-span-7 mt-15">
        <PosterSignUpBanner />
      </span>
        <div className="lg:hidden col-span-16 justify-items-center mt-20"><Logo/>
        <h1 className="banner text-4xl mt-3 font-semibold text-center">
          Skills Meet <br /> Needs. 
          <span className="italic text-[#0A6E5C]"> Instantly.</span>
        </h1>
        </div>
      <span className="col-span-16 lg:col-span-9">
        <PosterSignupForm />
      </span>
    </div>
  );
};

export default PosterSignup;
