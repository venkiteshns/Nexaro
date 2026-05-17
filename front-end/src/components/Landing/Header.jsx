import React from "react";
import './Landing.css'
import Logo from "../Logo/Logo";

const Header = (props) => {
  const landing = props.landing;
  return (
    <div className="header-c w-full">
      <div className="flex justify-between items-center px-6 py-4">
        <Logo/>
        <div className="flex gap-2 justify-end auth" >
            <button className="text-gray-900/50 text-sm" >Login</button>
            {landing && <button className="bg-black/90 text-white text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition" >Get Started</button>}
        </div>
      </div>
    </div>
  );
};

export default Header;
