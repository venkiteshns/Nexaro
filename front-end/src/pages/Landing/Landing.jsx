import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Status from "../../components/Landing/Status";
import Workflow from "../../components/Landing/Workflow";
import GetStarted from "../../components/Landing/GetStarted";
import Footer from "../../components/Landing/Footer";
import Checkout from "../payments/Checkout";

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
  }, [location.state?.scrollToGetStarted]);


  return (
    <>
      <Header landing={true} onRedirect={goGetStart} />
      <Hero />
        <Status />
        <div className="flex justify-center items-center h-[100px] pt-[100px] bg-blue-100">
          <Checkout/>
        </div>       
      <Workflow />

      <div ref={getStartRef}>
        <GetStarted />
      </div>

      <Footer />
    </>
  );
};

export default Landing;