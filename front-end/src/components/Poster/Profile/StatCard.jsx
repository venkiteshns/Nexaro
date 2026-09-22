const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-2.5 sm:p-3.5 flex flex-col items-start gap-1.5 sm:gap-2 flex-1 min-w-[75px] sm:min-w-[110px] transition-all hover:shadow-sm">
    <div
      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span className="sm:hidden">
        {icon && <icon.type {...icon.props} size={12} />}
      </span>
      <span className="hidden sm:inline">{icon && <icon.type {...icon.props} size={15} />}</span>
    </div>
    <div>
      <p className="text-base sm:text-lg font-extrabold text-gray-900 leading-none">
        {value}
      </p>
      <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 sm:mt-1 tracking-wide uppercase">
        {label}
      </p>
    </div>
  </div>
);

export default StatCard;
