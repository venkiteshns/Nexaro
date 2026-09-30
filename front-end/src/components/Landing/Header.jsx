import "./Landing.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const Header = (props) => {
  const landing = props.landing;
  return (
    <header className="header-c w-full top-0 left-0 right-0">
      <div className="flex justify-between items-center px-3.5 sm:px-7 py-2 sm:py-3 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo />
        </Link>
        <div className="flex gap-1.5 sm:gap-2.5 items-center justify-end auth flex-shrink-0">
          <Link to="/user/login" className="flex items-center">
            <button className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 rounded-lg sm:rounded-xl font-semibold border border-green-700/20 text-green-800 bg-transparent hover:bg-green-50 transition-all duration-200 flex items-center justify-center">
              Login
            </button>
          </Link>
          {landing && (
            <button
              onClick={props.onRedirect}
              className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-px flex items-center justify-center"
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
    </header>
  );
};

export default Header;
