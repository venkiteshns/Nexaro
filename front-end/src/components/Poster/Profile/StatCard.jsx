const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 flex flex-col items-start gap-2 sm:gap-3 flex-1 min-w-[80px] sm:min-w-[120px] transition-all hover:shadow-md hover:-translate-y-0.5">
    <div
      className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span className="sm:hidden">
        {icon && <icon.type {...icon.props} size={14} />}
      </span>
      <span className="hidden sm:inline">{icon}</span>
    </div>
    <div>
      <p className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-none">
        {value}
      </p>
      <p className="text-[9px] sm:text-[11px] text-gray-400 font-medium mt-0.5 sm:mt-1 tracking-wide uppercase">
        {label}
      </p>
    </div>
  </div>
);

export default StatCard;
