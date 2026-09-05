import { Briefcase } from 'lucide-react';

export default function BidEmptyState({ activeTab }) {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Briefcase size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700 mb-1">No bids found</p>
            <p className="text-xs text-gray-400">
                {activeTab === "all"
                    ? "You haven't placed any bids yet."
                    : `No ${activeTab} bids at the moment.`}
            </p>
        </div>
    );
}
