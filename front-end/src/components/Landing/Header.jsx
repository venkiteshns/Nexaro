import React from "react";
import './Landing.css'
import logo from '../../assets/Nex_Logo.png'

const Header = () => {
  return (
    <div className="header-c w-full">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex gap-1 items-center" >
            <img className="lh-logo" src={logo} alt=""/>
            <span className="logo-name whitespace-nowrap" > NEXARO </span>
        </div>
        <div className="flex gap-2 justify-end" >
            <button className="text-gray-900/80" >Login</button>
            <button className="bg-[#0A6E5C] font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition" >Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
