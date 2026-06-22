import "./Landing.css";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";

const Header = (props) => {
  const landing = props.landing;
  return (
    <div className="header-c bg-green-800/10 w-full">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/">
          {" "}
          <Logo />{" "}
        </Link>
        <div className="flex gap-2 items-center justify-end auth">
           <Link to="/user/login"><button className="text-white/90 text-sm px-4 py-1 bg-green-800/60 rounded-xl font-semibold">Login</button></Link>
          {landing && (
            <button
              onClick={props.onRedirect}
              className="bg-black/90 text-white text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition"
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
