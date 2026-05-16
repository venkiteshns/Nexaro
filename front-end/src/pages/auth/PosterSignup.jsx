import React from "react";
import PosterSignUpBanner from "../../components/Poster/PosterSignUpBanner";
import PosterSignupForm from "../../components/Form/PosterSignupForm";
import Logo from "../../components/Logo/Logo";

const PosterSignup = () => {
  return (
    <div className="grid grid-cols-16">
      <span className="hidden md:block col-span-7">
        <PosterSignUpBanner />
      </span>
        <div className="md:hidden col-span-16 justify-items-center mt-10"><Logo/>
        <h1 className="banner text-4xl mt-3 font-semibold text-center">
          Skills Meet <br /> Needs. 
          <span className="italic text-[#0A6E5C]"> Instantly.</span>
        </h1>
        </div>
      <span className="col-span-16 md:col-span-9">
        <PosterSignupForm />
      </span>
    </div>
  );
};

export default PosterSignup;
