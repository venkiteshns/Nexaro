import "./Landing.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const Header = (props) => {
  const landing = props.landing;
  return (
    <div className="header-c w-full">
      <div className="flex justify-between items-center px-7 py-3.5">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-2.5 items-center justify-end auth">
          <Link to="/user/login">
            <button className="text-sm px-5 py-1.5 rounded-xl font-semibold border border-green-700/20 text-green-800 bg-transparent hover:bg-green-50 transition-all duration-200">
              Login
            </button>
          </Link>
          {landing && (
            <button
              onClick={props.onRedirect}
              className="text-sm px-5 py-1.5 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #0a6e5c, #10b981)",
                boxShadow: "0 4px 14px rgba(10,110,92,0.28)",
              }}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
