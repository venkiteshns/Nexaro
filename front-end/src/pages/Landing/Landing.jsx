import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Status from "../../components/Landing/Status";
import Workflow from "../../components/Landing/Workflow";
import GetStarted from "../../components/Landing/GetStarted";
import Footer from "../../components/Landing/Footer";

const Landing = () => {

  const getStartRef = useRef(null);
  const location = useLocation();

  const goGetStart = () => {
    getStartRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (location.state?.scrollToGetStarted) {
      setTimeout(() => {
        getStartRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);


  return (
    <>
      <Header landing={true} onRedirect={goGetStart} />
      <Hero />
      <Status />
      <Workflow />

      <div ref={getStartRef}>
        <GetStarted />
      </div>

      <Footer />
    </>
  );
};

export default Landing;