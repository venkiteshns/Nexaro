import { Briefcase, IndianRupee, Star } from 'lucide-react';

/**
 * WorkerStatCards
 * Props: stats { jobsCompleted, totalEarned, rating }
 */
const StatItem = ({ icon, label, value, sub, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 md:px-5 md:py-4 ${className}`}>
        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                {icon}
            </div>
        </div>
        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg md:text-2xl font-extrabold text-gray-900 leading-none">
            {value}
            {sub && <span className="text-xs md:text-sm font-semibold text-gray-400 ml-1">{sub}</span>}
        </p>
    </div>
);

const WorkerStatCards = ({ stats }) => (
    /* Below 416 px → 2-col grid; 416px+ → flex-wrap (original behaviour) */
    <div className="grid grid-cols-2 min-[416px]:flex min-[416px]:flex-wrap gap-3 mb-5">
        {/* Slot 1 — always first */}
        <StatItem
            icon={<Briefcase size={13} className="text-[#0A6E5C] md:w-4 md:h-4" />}
            label="Jobs Completed"
            value={stats?.jobsCompleted ?? 34}
            className="order-1 min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
        {/* Slot 3 below 416px (full-width row 2); slot 2 on 416px+ */}
        <StatItem
            icon={<IndianRupee size={13} className="text-[#0A6E5C] md:w-4 md:h-4" />}
            label="Total Earned"
            value={`₹${stats?.totalEarned ?? '0'}`}
            sub="lifetime"
            className="order-3 col-span-2 min-[416px]:order-none min-[416px]:col-span-1 min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
        {/* Slot 2 below 416px (same row as Jobs Completed); slot 3 on 416px+ */}
        <StatItem
            icon={<Star size={13} className="text-[#0A6E5C] md:w-4 md:h-4" />}
            label="Rating"
            value={stats?.rating ?? '4.9'}
            sub="/ 5"
            className="order-2 min-[416px]:order-none min-[416px]:flex-1 min-[416px]:min-w-[120px]"
        />
    </div>
);

export default WorkerStatCards;
