import React from 'react'
import Header from '../../components/Landing/Header'
import Hero from '../../components/Landing/Hero'
import Status from '../../components/Landing/Status'
import Workflow from '../../components/Landing/Workflow'
import GetStarted from '../../components/Landing/GetStarted'
import Footer from '../../components/Landing/Footer'

const Landing = () => {
  return (
    <>
      <Header Landing = {true}/>
      <Hero/>
      <Status/>
      <Workflow/>
      <GetStarted/>
      <Footer/>
    </>
  )
}

export default Landing