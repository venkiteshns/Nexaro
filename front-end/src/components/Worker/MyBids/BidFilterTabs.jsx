export const TABS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
];

export default function BidFilterTabs({ activeTab, onTabChange, total }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-5">
            <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                            activeTab === tab.key
                                ? "bg-[#0A6E5C] text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && total > 0 && (
                            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-white/25 text-white">
                                {total}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
