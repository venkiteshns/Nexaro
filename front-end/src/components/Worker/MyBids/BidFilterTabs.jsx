const TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
];

export default function BidFilterTabs({ activeTab, onTabChange, total }) {
    return (
        <div className="bg-white border border-gray-200/80 rounded-xl px-3 py-2 mb-3.5 shadow-xs">
            <div className="flex gap-1.5 flex-wrap">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === tab.key
                                ? "bg-[#0A6E5C] text-white shadow-xs"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && total > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/25 text-white">
                                {total}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
