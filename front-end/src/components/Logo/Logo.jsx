import React from "react";
import logo from '../../assets/Nex_Logo.png'

const Logo = () => {
  return (
    <div className="flex gap-1 items-center">
      <img className="lh-logo" src={logo} alt="" />
      <span className="logo-name whitespace-nowrap"> NEXARO </span>
    </div>
  );
};

export default Logo;
