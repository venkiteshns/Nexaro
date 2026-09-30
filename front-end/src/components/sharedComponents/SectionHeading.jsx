export const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-4">
        <div className="w-0.5 h-3.5 sm:h-5 rounded-full bg-[#0A6E5C]" />
        <h3 className="text-[9.5px] sm:text-xs font-extrabold text-[#0A6E5C] uppercase tracking-widest">
            {children}
        </h3>
    </div>
);