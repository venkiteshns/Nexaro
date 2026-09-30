import logo from '../../assets/Nex_Logo.png';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex gap-1.5 items-center ${className}`}>
      <img className="lh-logo w-6 sm:w-[30px] max-w-[30px] h-auto object-contain flex-shrink-0" src={logo} alt="NEXARO" />
      <span className="logo-name whitespace-nowrap text-[#0a6e5c] font-bold text-lg sm:text-[20px] tracking-tight"> NEXARO </span>
    </div>
  );
};

export default Logo;
