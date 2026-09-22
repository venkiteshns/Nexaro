export default function BidStatCard({ icon, count, label, topColor, extra }) {
    return (
        <div
            className="flex-1 min-w-[120px] bg-white border border-gray-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs"
            style={{ borderTop: `3px solid ${topColor}` }}
        >
            <div style={{ color: topColor }}>{icon}</div>
            <div className="min-w-0">
                <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-none">
                    {String(count).padStart(2, "0")}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{label}</p>
                {extra && (
                    <p className="text-[9px] font-semibold mt-0.5" style={{ color: topColor }}>
                        {extra}
                    </p>
                )}
            </div>
        </div>
    );
}
