export const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
        <div className="w-0.5 h-4 sm:h-5 rounded-full bg-[#0A6E5C]" />
        <h3 className="text-[10px] sm:text-xs font-extrabold text-[#0A6E5C] uppercase tracking-widest">
            {children}
        </h3>
    </div>
);