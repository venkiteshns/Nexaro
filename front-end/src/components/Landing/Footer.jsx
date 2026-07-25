import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <div
      className="footer-c flex flex-col items-center justify-center gap-2 py-8"
      style={{ background: "#f5faf8" }}
    >
      <div className="mt-2">
        <Logo />
      </div>
      <div className="text-xs text-gray-400 text-center px-4 mt-1 max-w-xs leading-relaxed">
        <p>
          The editorial platform for professional marketplaces. Connecting
          verified talent with high-impact needs.
        </p>
      </div>
      <div
        className="w-16 h-px rounded-full my-2"
        style={{ background: "linear-gradient(90deg,#0a6e5c,#10b981)" }}
      />
      <div className="text-xs text-gray-400 pb-2 tracking-wide">
        <p>
          © {new Date().getFullYear()} NEXARO Editorial Premium. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;