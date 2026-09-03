export default function BidStatCard({ icon, count, label, topColor, extra }) {
    return (
        <div
            className="flex-1 min-w-[120px] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
            style={{ borderTop: `3px solid ${topColor}` }}
        >
            <div style={{ color: topColor }}>{icon}</div>
            <div className="min-w-0">
                <p className="text-2xl font-extrabold text-gray-900 leading-none">
                    {String(count).padStart(2, "0")}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5 truncate">{label}</p>
                {extra && (
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: topColor }}>
                        {extra}
                    </p>
                )}
            </div>
        </div>
    );
}
