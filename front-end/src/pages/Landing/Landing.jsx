import React, { useRef } from "react";

import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import Status from "../../components/Landing/Status";
import Workflow from "../../components/Landing/Workflow";
import GetStarted from "../../components/Landing/GetStarted";
import Footer from "../../components/Landing/Footer";
import { useGetAllUsersQuery } from "../../store/services/data";

const Landing = () => {

  const getStartRef = useRef(null);
  const {data, isError, isLoading} = useGetAllUsersQuery()

  const goGetStart = () => {
    getStartRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  console.log("RTK START")
  console.log("err",isError);
  console.log("load",isLoading);
  console.log(data);
  
  console.log("RTK END")

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