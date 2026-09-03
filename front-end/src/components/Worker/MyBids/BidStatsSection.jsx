import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import BidStatCard from './BidStatCard';

export default function BidStatsSection({ counts, winRate }) {
    return (
        <div className="flex gap-3 mb-5 flex-wrap">
            <BidStatCard
                icon={<Briefcase size={20} />}
                count={counts.all}
                label="TOTAL BIDS"
                topColor="#0A6E5C"
            />
            <BidStatCard
                icon={<CheckCircle size={20} />}
                count={counts.accepted}
                label="ACCEPTED"
                topColor="#16A34A"
                extra={counts.all > 0 ? `${winRate}% Win Rate` : null}
            />
            <BidStatCard
                icon={<Clock size={20} />}
                count={counts.pending}
                label="PENDING"
                topColor="#D97706"
            />
            <BidStatCard
                icon={<XCircle size={20} />}
                count={counts.rejected}
                label="REJECTED"
                topColor="#DC2626"
            />
        </div>
    );
}
